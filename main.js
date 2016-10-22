const request = require('request')
const cheerio = require('cheerio')
const Discord = require('discord.js')
const client = new Discord.Client()
const secret = require('./secret.json')

let botlog
let staleMemes = []
const airhornCommands = [
  '!airhorn',
  '!anotha',
  '!anothaone',
  '!johncena',
  '!cena',
  '!ethan',
  '!eb',
  '!ethanbradberry',
  '!h3h3',
  '!stan',
  '!stanislav',
  '!birthday',
  '!bday',
  '!wowthatscool',
  '!wtc'
]

function getMeme () {
  let promise = new Promise((resolve, reject) => {
    request('https://www.reddit.com/r/me_irl/top/?sort=top&t=hour', (error, response, body) => {
      if (error) {
        reject()
        console.log(error)
      } else {
        let $ = cheerio.load(body)
        let meme = $("[data-rank='1']").attr('data-url')
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
            } else {
              // Look for a gifv url, otherwise append .jpg to the link
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
    })
  })
  return promise
}

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!meme') {
    getMeme().then(response => {
      msg.reply("here's the spiciest meme of the hour fam: " + response)
      botlog.sendMessage(` Sent "${response}" to ${msg.author.username}`)
    }, error => {
      msg.reply("I can't get memes right now homie")
    })
  } else if (airhornCommands.indexOf(msg.content.toLowerCase()) > -1) {
    msg.delete(2000)
    botlog.sendMessage(`Removed commmand "${msg.content}" from ${msg.author.username}`)
  }
})

client.on('ready', () => {
  client.user.setStatus('online', 'games on linux kappa')
  console.log(new Date() + ': bot_irl is ready to meme!')
  botlog = client.channels.find('id', secret.botLogChannel)
})

client.on('disconnect', () => {
  console.log(new Date() + ': Disconnected!')
})

client.on('error', (error) => {
  console.log(new Date() + error)
})

client.login(secret.token)
