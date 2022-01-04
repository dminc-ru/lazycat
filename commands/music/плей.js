const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, createAudioResource, getNextResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { createReadStream} = require('fs');

module.exports.run = async (client, interaction) => {
    try {
        var user = await client.users.fetch(interaction.member.user.id);
        var guild = await client.guilds.fetch(interaction.guildId);
        var member = await guild.members.fetch(interaction.member.user.id);
    } catch (error) {
        return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
    }
    const voiceChannel =  interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'Вы не подключены к голосовому каналу.'});
    if (!member.permissions.has('CONNECT', 'SPEAK')) 
        return interaction.reply({content: 'У вас нет прав.' });
    const server_queue = client.queue.get(message.guild.id);
        
    let song = {};
        
    if (ytdl.validateURL(args[0])) {
        const song_info = await ytdl.getInfo(args[0]);
        song = { 
            title: song_info.videoDetails.title, 
            url: song_info.videoDetails.video_url 
        }
    } else {
        const video_finder = async (query) =>{
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
            
        const video = await video_finder(args.join(' '));
        if (video){
            song = { title: video.title, url: video.url }
        } else {
            interaction.reply({content: `Произошла ошибка при поиске.`})
        }
    }
        
    if (!server_queue){
            
        const queue_constructor = {
            voice_channel: voiceChannel,
            text_channel: interaction.channel,
            connection: null,
            songs: []
        }
            
        client.queue.set(message.guild.id, queue_constructor);
        queue_constructor.songs.push(song);
            
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: guild.voiceAdapterCreator
            });
            queue_constructor.connection = connection;
            video_player(guild, queue_constructor.songs[0]);
        } catch (err) {
            client.queue.delete(message.guild.id);
            interaction.reply({content: `Ошибка при подключении.`})
            throw err;
        }
    } else {
        server_queue.songs.push(song);
        return interaction.reply({content: `«${song.title}» в очереди`})
    }
}

const video_player = async (guild, song) => {
    const song_queue = client.queue.get(guild.id);
    
    if(!song) {
        connection.destroy();
        client.queue.delete(guild.id);
        return;
    }
    
    const audioPlayer = createAudioPlayer();
    song_queue.connection.subscribe(audioPlayer);
    
    const stream = ytdl(song.url, { filter: 'audioonly' });
    audioPlayer.play(createAudioResource(stream, {seek: 0, volume: 1}))
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    song_queue.text_channel.send({content: `Сейчас играет: **${song.title}**` })
}

module.exports.data = {
    name: "плей",
    permissions: ["tester"],
    type: "interaction"
}