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
from utils.emoji import ZPEOPLE

from discord.ext import commands

class inviteTracker(commands.Cog):

    def __init__(self, bot):

        self.bot = bot

    """Invite Tracker"""

    def help_custom(self):

              emoji = ZPEOPLE

              label = "Invite Tracker"

              description = "Show you Commands of Invite Tracker"

              return emoji, label, description

    @commands.group()

    async def __InviteTracker__(self, ctx: commands.Context):

        """`>invites`, `>addinvites`, `>inviteleaderboard`, `>invitelogging`"""