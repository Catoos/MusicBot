const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { SlashCommandBuilder } = require('Discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

//const queue = new Map();

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

        const voice_channel =  interaction.member.voice.channel;
        if(!voice_channel) return interaction.reply("Get yo ass in a channel");
        // const permissions = voice_channel.permissions.has(PermissionsBitField.Flags.SEND_MESSAGES);
        // if(!permissions.has('CONNECT')) return message.channel.send('Dont tell me what to do bitch');

        // const server_queue = queue.get(interaction.guildId);
        

            // if(!interaction.options.length) return message.channel.send('TF you want me to do with that?');
            let song = {};
            // const input = interaction.options.getString('input');
            const input ="MF DOOM";
            

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

            // if(!server_queue){
            //     const queue_constructor = {
            //         voice_channel: voice_channel,
            //         connection: null,
            //         songs: []
            //     }
                
            //     queue.set(interaction.guildId, queue_constructor);
            //     queue_constructor.songs.push(song);
    
            //     try{
            //         queue_constructor.connection = connection;
            //         video_player(interaction.guildId, queue_constructor.songs[0]);
            //     } catch (err) {
            //         queue.delete(interaction.guildId);
            //         interaction.reply('Aw Shit I fucked up');
            //         throw err;
            //     }
            // } else {
            //     server_queue.songs.push(song);
            //     return message.channel.send(`**${song.title}** added to the queue!`);
            // }
        

        // else if(cmd ==='skip') skip_song(message, server_queue);
        // else if(cmd === 'stop') stop_song(message, server_queue);

// const video_player = async(guild, song) => {
//     const song_queue = queue.get(guild.id);

//     if(!song){
//         //song_queue.voice_channel.leave();
//         queue.delete(guild.id);
//         return;
//     }

    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    })

    const url ="https://www.youtube.com/watch?v=NXi9scTzyxM&ab_channel=KendrickLamar-Topic"
    const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1<<25 });
    let resource = createAudioResource(stream);
    const player = createAudioPlayer({
        behaviors: {
             noSubscriber: NoSubscriberBehavior.Pause,
        },
    })
    connection.subscribe(player);
    // song_queue.connection.subscribe(stream, {seek: 0, volume: 0.5 })
    // .on('finish', () => {
    //     song_queue.songs.shift();
    //     video_player(guild, song_queue.songs[0]);
    // });
    player.play(resource, {seek: 0, volume: 0.5});

   
   /* Shoutout to the absolute chad on Github that found a fix for the
    Discord API causing an autopause - fixes song not finishing */
    const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }
      connection.on('stateChange', (oldState, newState) => {
        Reflect.get(oldState, 'networking')?.off('stateChange', networkStateChangeHandler);
        Reflect.get(newState, 'networking')?.on('stateChange', networkStateChangeHandler);
      });
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