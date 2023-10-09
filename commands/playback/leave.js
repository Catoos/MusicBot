const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription( `I'll leave the channel`),

    async execute(interaction) {
		await interaction.reply('See ya!');
        const connection = getVoiceConnection(interaction.guild.id);
        connection.destroy();
 
 
    }
}
