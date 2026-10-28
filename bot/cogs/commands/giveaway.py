# ╔══════════════════════════════════════════════════════════════════╗
# ║                                                                  ║
# ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
# ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
# ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
# ║                                                                  ║
# ║            © 2026 VayuX Devs — All Rights Reserved              ║
# ║                                                                  ║
# ║   discord  ──  https://discord.gg/vayuxdev                      ║
# ║   youtube  ──  https://youtube.com/@VayuXDevs                   ║
# ║   github   ──  https://github.com/vayuxdevs                        ║
# ║                                                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

from discord.ext import commands, tasks
import datetime, pytz, time as t
from discord.ui import Button, Select, View
import aiosqlite, random, typing
import sqlite3
import asyncio
import discord, logging
from utils.emoji import ARROWRED, TADAA, TICK
from discord.utils import get
from utils.Tools import *
import os
import aiohttp
from utils.cv2 import CV2

db_folder = 'db'
db_file = 'giveaways.db'
db_path = os.path.join(db_folder, db_file)
os.makedirs(db_folder, exist_ok=True)
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS Giveaway (
                    guild_id INTEGER,
                    host_id INTEGER,
                    start_time TIMESTAMP,
                    ends_at TIMESTAMP,
                    prize TEXT,
                    winners INTEGER,
                    message_id INTEGER,
                    channel_id INTEGER,
                    PRIMARY KEY (guild_id, message_id)
                )''')

connection.commit()
connection.close()

def convert(time):
    pos = ["s","m","h","d"]
    time_dict = {"s" : 1, "m" : 60, "h" : 3600 , "d" : 86400 , "f" : 259200}
    unit = time[-1]
    if unit not in pos:
        return
    try:
        val = int(time[:-1])
    except ValueError:
        return
    return val * time_dict[unit]

def WinnerConverter(winner):
    try:
        int(winner)
    except ValueError:
        try:
           return int(winner[:-1])
        except:
            return -4
    return winner

class Giveaway(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.connection = None
        self.cursor = None

    async def cog_load(self) -> None:
        try:
            self.connection = await aiosqlite.connect(db_path)
            self.cursor = await self.connection.cursor()
            await self.cursor.execute('''CREATE TABLE IF NOT EXISTS Giveaway (
                    guild_id INTEGER,
                    host_id INTEGER,
                    start_time TIMESTAMP,
                    ends_at TIMESTAMP,
                    prize TEXT,
                    winners INTEGER,
                    message_id INTEGER,
                    channel_id INTEGER,
                    PRIMARY KEY (guild_id, message_id)
                )''')
            await self.connection.commit()
            await self.check_for_ended_giveaways() 
            self.GiveawayEnd.start()
        except Exception as e:
            logging.error(f"Failed to load giveaway cog: {e}")

    async def cog_unload(self) -> None:
        try:
            if self.GiveawayEnd.is_running():
                self.GiveawayEnd.cancel()
            if self.connection:
                await self.connection.close()
        except Exception:
            pass

    async def ensure_connection(self):
        try:
            if self.connection is None:
                self.connection = await aiosqlite.connect(db_path)
                self.cursor = await self.connection.cursor()
            return True
        except Exception as e:
            logging.error(f"Failed to reconnect to giveaway db: {e}")
            return False

    async def check_for_ended_giveaways(self):
        try:
            if not await self.ensure_connection():
                return
            await self.cursor.execute("SELECT ends_at, guild_id, message_id, host_id, winners, prize, channel_id FROM Giveaway WHERE ends_at <= ?", (datetime.datetime.now().timestamp(),))
            ended_giveaways = await self.cursor.fetchall()
            for giveaway in ended_giveaways:
                await self.end_giveaway(giveaway)
        except Exception as e:
            logging.error(f"Error checking ended giveaways: {e}")

    async def end_giveaway(self, giveaway):
        try:
            if not await self.ensure_connection():
                return
            current_time = datetime.datetime.now().timestamp()
            guild = self.bot.get_guild(int(giveaway[1]))
            if guild is None:
                await self.cursor.execute("DELETE FROM Giveaway WHERE message_id = ? AND guild_id = ?", (giveaway[2], giveaway[1]))
                await self.connection.commit()
                return

            channel = self.bot.get_channel(int(giveaway[6]))
            if channel is not None:
                try:
                    retries = 3
                    for attempt in range(retries):
                        try:
                            message = await channel.fetch_message(int(giveaway[2]))
                            break
                        except discord.NotFound:
                            await self.cursor.execute("DELETE FROM Giveaway WHERE message_id = ? AND guild_id = ?", (giveaway[2], giveaway[1]))
                            await self.connection.commit()
                            return
                        except aiohttp.ClientResponseError as e:
                            if e.status == 503:
                                if attempt < retries - 1:
                                    await asyncio.sleep(2 ** attempt)
                                    continue
                                else:
                                    raise
                            else:
                                raise
                        except Exception:
                            if attempt < retries - 1:
                                await asyncio.sleep(1)
                                continue
                            return

                    try:
                        users = [i.id async for i in message.reactions[0].users()]
                    except Exception:
                        users = []
                    if self.bot.user.id in users:
                        users.remove(self.bot.user.id)

                    if len(users) < 1:
                        try:
                            await message.reply(f"No one won the **{giveaway[5]}** giveaway, due to Not enough participants.")
                        except Exception:
                            pass
                        await self.cursor.execute("DELETE FROM Giveaway WHERE message_id = ? AND guild_id = ?", (message.id, message.guild.id))
                        await self.connection.commit()
                        return

                    winners_count = min(len(users), int(giveaway[4]))
                    winner = ', '.join(f'<@!{i}>' for i in random.sample(users, k=winners_count))

                    desc = f"Ended at <t:{int(current_time)}:R>\nHosted by <@{int(giveaway[3])}>\nWinner(s): {winner}"
                    view = CV2(f"{giveaway[5]}", desc)

                    try:
                        await message.edit(content=f"{TADAA} **GIVEAWAY ENDED** {TADAA}", view=view)
                        await message.reply(f"{TADAA} Congrats {winner}, you won **{giveaway[5]}!**, Hosted by <@{int(giveaway[3])}>")
                    except Exception:
                        pass
                    await self.cursor.execute("DELETE FROM Giveaway WHERE message_id = ? AND guild_id = ?", (message.id, message.guild.id))
                    await self.connection.commit()

                except (discord.HTTPException, aiohttp.ClientResponseError) as e:
                    logging.error(f"Error ending giveaway: {e}")

        except IndexError:
            logging.error(f"Giveaway data is corrupted or missing: {giveaway}")
            try:
                if self.cursor:
                    await self.cursor.execute("DELETE FROM Giveaway WHERE message_id = ? AND guild_id = ?", (giveaway[2], giveaway[1]))
                    await self.connection.commit()
            except Exception:
                pass
        except Exception as e:
            logging.error(f"Unexpected error in end_giveaway: {e}")

    @tasks.loop(seconds=5)
    async def GiveawayEnd(self):
        try:
            if not await self.ensure_connection():
                return
            await self.cursor.execute("SELECT ends_at, guild_id, message_id, host_id, winners, prize, channel_id FROM Giveaway WHERE ends_at <= ?", (datetime.datetime.now().timestamp(),))
            ends_raw = await self.cursor.fetchall()
            for giveaway in ends_raw:
                await self.end_giveaway(giveaway)
        except Exception as e:
            logging.error(f"Error in GiveawayEnd task: {e}")
            try:
                if self.connection:
                    await self.connection.close()
                self.connection = None
                self.cursor = None
            except Exception:
                pass

    @GiveawayEnd.before_loop
    async def before_giveaway_end(self):
        await self.bot.wait_until_ready()


    @commands.hybrid_command(description="Starts a new giveaway.")
    @blacklist_check()
    @ignore_check()
    @commands.cooldown(1, 5, commands.BucketType.user)
    @commands.has_guild_permissions(manage_guild=True)
    async def gstart(self, ctx,
                      time,
                      winners: int,
                      *,
                      prize: str):

        if not await self.ensure_connection():
            return await ctx.send("Database error. Please try again later.", ephemeral=True)

        await self.cursor.execute("SELECT message_id, channel_id FROM Giveaway WHERE guild_id = ?", (ctx.guild.id,))
        re = await self.cursor.fetchall()

        if winners >=  15:
            message = await ctx.send(view=CV2("⚠️ Access Denied", "Cannot exceed more than 15 winners."))
            await asyncio.sleep(5)
            await message.delete()
            return

        g_list = [i[0] for i in re]
        if len(g_list) >= 5:
            message = await ctx.send(view=CV2("⚠️ Access Denied", "You can only host upto 5 giveaways in this Guild."))
            await asyncio.sleep(5)
            await message.delete()
            return

        converted = self.convert(time)
        if converted / 60 >= 50400:
            message = await ctx.send(view=CV2("⚠️ Access Denied", "Time cannot exceed 31 days!"))
            await asyncio.sleep(5)
            await message.delete()
            return

        if converted == -1:
            message = await ctx.send(view=CV2("❌ Error", "Invalid time format"))
            await asyncio.sleep(5)
            await message.delete()
            return
        if converted is None:
            message = await ctx.send(view=CV2("❌ Error", "Invalid time format"))
            await asyncio.sleep(5)
            await message.delete()
            return

        end_time = datetime.datetime.now() + datetime.timedelta(seconds=converted)
        unix_time = int(end_time.timestamp())
        role = discord.utils.get(ctx.guild.roles, name="@everyone")
        embed = discord.Embed(title="🎉 **GIVEAWAY** 🎉", description=f"**Prize:** {prize}\n**Winners:** {winners}\n**Ends:** <t:{unix_time}:R> (<t:{unix_time}:f>)\n**Hosted by:** {ctx.author.mention}", color=0x2f3136)
        try:
            embed.set_thumbnail(url=ctx.guild.icon.url if ctx.guild.icon else None)
        except Exception:
            pass
        view = discord.ui.View()
        btn = discord.ui.Button(label="🎉 Enter Giveaway", style=discord.ButtonStyle.primary, custom_id="giveaway_enter")
        view.add_item(btn)
        msg = await ctx.send(embed=embed, view=view)
        await self.cursor.execute("INSERT OR REPLACE INTO Giveaway (guild_id, host_id, start_time, ends_at, prize, winners, message_id, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (ctx.guild.id, ctx.author.id, datetime.datetime.now().timestamp(), unix_time, prize, winners, msg.id, ctx.channel.id))
        await self.connection.commit()


async def setup(bot):
    await bot.add_cog(Giveaway(bot))
