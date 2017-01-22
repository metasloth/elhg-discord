const ytdl = require('ytdl-core')
const Discord = require('discord.js')
const secret = require('./secret.json')
const config = require('./config.json')
const fs = require('fs')

const client = new Discord.Client()

let botlog

client.on('message', msg => {
  // Testing out music
  if (msg.content.toLowerCase() == '!music') {
    if (msg.member.voiceChannel) {
      const stream = ytdl('https://www.youtube.com/watch?v=Et4Ns2ADrmw', {filter: 'audioonly'})
      const streamOptions = { seek: 0, volume: 0.5, passes: 2 }
      msg.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playStream(stream, streamOptions)
        dispatcher.on('error', err => console.log(err))
        //dispatcher.on('debug', info => console.log(info))
        dispatcher.on('start', () => console.log('Stream starting'))
        dispatcher.on('end', () => connection.channel.leave())
      })
        .catch(console.error)
    } else {
      msg.reply("you have to be in a voice channel to listen to music")
      console.log('User who called bot was not in voice channel')
    }
  }
  else if (msg.content.toLowerCase() === '!airhorn') {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playFile('./audio/jc_spam.wav')

        dispatcher.on('error', err => console.log(err))
        dispatcher.on('debug', info => console.log(info))
        dispatcher.on('start', () => console.log('stream starting'))
        dispatcher.on('end', () => connection.channel.leave())
      })
    }
  }
  // temp dev command to kick the bot after a stream glitch
  else if (msg.content == '!d') {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.leave()
      msg.delete()
    }
  }
})

client.on('ready', () => {
  client.user.setGame(config.game)
  console.log(new Date() + ': bot_irl is ready to play some tunes!')
  botlog = client.channels.find('id', secret.botLogChannel)
})

client.on('error', error => console.log(new Date() + error))
client.login(secret.token)
