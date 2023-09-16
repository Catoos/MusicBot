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

   
   /* Shoutout to the absolute chad on Github that found a fix for the
    Discord API causing an autopause - fixes song not finishing */
    // const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
    //     const newUdp = Reflect.get(newNetworkState, 'udp');
    //     clearInterval(newUdp?.keepAliveInterval);
    //   }
    //   connection.on('stateChange', (oldState, newState) => {
    //     Reflect.get(oldState, 'networking')?.off('stateChange', networkStateChangeHandler);
    //     Reflect.get(newState, 'networking')?.on('stateChange', networkStateChangeHandler);
    //   });
    // await song_queue.text_channel.send(`NOW PLAYING **${song.title}**`);

// }

//Function to skip the song
// const skip_song = (message, server_queue) => {
//     if(!message.member.voice.channel) return message.channel.send('Cant do that from there silly');
//     if(!server_queue){
//         return message.channel.send('Dis bitch empty... YEET');
//     }
//     server_queue.connections.dispatcher.end(); //add a try catch block
// }

// //Function to stop the bot
// const stop_song = (message, server_queue) => {
//     if(!message.member.voice.channel) return message.channel.send('Cant do that from there silly');
//     server_queue.songs = [];
//     server_queue.connections.dispatcher.end();
// }
    }
}