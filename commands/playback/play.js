const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription( 'I swear I am not a music bot')
    .addStringOption(option =>
        option.setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)),

    async execute( interaction ){
        const songInput = interaction.options.getString('input');

            let song = {};
          

            if(ytdl.validateURL(songInput[0])){
                console.log(songInput);
                const song_info = await ytdl.getInfo(songInput[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }
                const video = await videoFinder(songInput);
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                    channel.send('Im blind af frfr');
                }

            }

    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    })

    const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1<<25 });
    let resource = createAudioResource(stream);
    const player = createAudioPlayer({
        behaviors: {
             noSubscriber: NoSubscriberBehavior.Pause,
        },
    })
    interaction.reply(`NOW PLAYING **${song.title}**`);
    connection.subscribe(player);

    player.play(resource, {seek: 0, volume: 0.5});

    }
}