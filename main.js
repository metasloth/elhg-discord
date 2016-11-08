const request = require('request')
const cheerio = require('cheerio')
const Discord = require('discord.js')
const secret = require('./secret.json')
const config = require('./config.json')

const client = new Discord.Client()

let botlog
let staleMemes = []
let weightedSubs = []

for (let i = 0; i < config.subreddits.length; ++i) {
  for (let j = 0; j < config.subreddits[i].weight; ++j) {
    weightedSubs.push(config.subreddits[i].url)
  }
}

function getMeme () {
  let url = weightedSubs[Math.floor(Math.random() * weightedSubs.length)]
  let promise = new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject()
        console.log(error)
      } else {
        let $ = cheerio.load(body)
        let meme = $("[data-rank='1']").attr('data-url')
        meme = null
        if (meme == null) {
          reject()
          botlog.sendMessage(`Url: ${url} had no posts`)
        } else {
          // Check for unique post
          for (let i = 2; staleMemes.indexOf(meme) > -1; i++) {
            meme = $("[data-rank='" + i + "']").attr('data-url')
          }
          staleMemes.push(meme)
          // Make sure imgur single image links are direct 
          if (meme.includes('imgur') && !meme.includes('.', meme.length - 5)
            && !meme.includes('/gallery/') && !meme.includes('/a/')) {
            request(meme, (error, response, body) => {
              // If the imgur request fails return the link as is
              if (error) {
                resolve(meme)
                console.log(error)
              }
              // Look for a gifv url, otherwise append .jpg to the link 
              else {
                let $ = cheerio.load(body)
                let gifv = $("[itemprop='embedURL']").attr('content')
                meme = (gifv != null) ? gifv : (meme + '.jpg')
                resolve(meme)
              }
            })
          } else {
            resolve(meme)
          }
        }
      }
    })
  })
  return promise
}

client.on('message', msg => {
  // Return a meme
  if (msg.content.toLowerCase() === '!meme') {
    msg.channel.startTyping()
    getMeme().then(response => {
      let text = config.replies[Math.floor(Math.random() * config.replies.length)]
      msg.channel.sendMessage(text + response)
      botlog.sendMessage(` Sent "${response}" to ${msg.author.username}`)
    }, error => {
      msg.channel.sendMessage("`Sorry, I couldn't get a meme for you ༼ つ ಥ_ಥ ༽つ`")
    })
    msg.channel.stopTyping()
  }
  // Delete airhorn commands 
  else if (config.deleteKeywords.indexOf(msg.content.toLowerCase()) > -1) {
    msg.delete()
    botlog.sendMessage(`Removed commmand "${msg.content}" from ${msg.author.username}`)
  }
})

client.on('ready', () => {
  client.user.setStatus('online', config.status)
  console.log(new Date() + ': bot_irl is ready to meme!')
  botlog = client.channels.find('id', secret.botLogChannel)
})

client.on('disconnect', () => {
  console.log(new Date() + ': Disconnected!')
})

client.on('error', error => {
  console.log(new Date() + error)
})

client.login(secret.token)
