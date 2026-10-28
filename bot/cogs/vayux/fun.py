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

import discord
from utils.emoji import ZROCKET
from discord.ext import commands


class _fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    """Fun commands"""
  
    def help_custom(self):
		      emoji = ZROCKET
		      label = "Fun Commands"
		      description = "Show you Commands of Fun"
		      return emoji, label, description

    @commands.group()
    async def __Fun__(self, ctx: commands.Context):
        """`/imagine` , `ship` , `mydog` , `chat` , `translate` , `howgay` , `lesbian` , `cute` , `intelligence`, `chutiya` , `horny` , `tharki` , `gif` , `iplookup` , `weather` , `hug` , `kiss` , `pat` , `cuddle` , `slap` , `tickle` , `spank` ,  `8ball` , `truth` , `dare` , `nitro`"""