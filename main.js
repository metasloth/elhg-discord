const request = require('request')
const cheerio = require('cheerio')
const Discord = require('discord.js')
const client = new Discord.Client()

/* Airhorn command cleanup */

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

client.on('message', msg => {
  if (airhornCommands.indexOf(msg.content) > -1) {
    msg.delete(2000)
    console.log(new Date().toLocaleTimeString() + ` Caught Commmand: ${msg.content} from ${msg.author.username}`)
  }
})

/* Meme of the hour */

const url = 'https://www.reddit.com/r/me_irl/top/?sort=top&t=hour'

function getMeme (callback) {
  request(url, function (error, response, body) {
    if (!error) {
      let $ = cheerio.load(body)
      let topPost = $("[data-rank='1']").attr('data-url')
      // Make sure imgur single image links are direct 
      if (topPost.search('imgur') > -1
        && !topPost.substring(topPost.length - 5, topPost.length).includes('.')
        && topPost.search('/gallery/' == -1)
        && topPost.search('/a/') == -1) {
        request(topPost, function (error, response, body) {
          if (!error) {
            // look for a gifv url, otherwise append .jpg to the link
            let $ = cheerio.load(body)
            let gifv = $("[itemprop='embedURL']").attr('content')
            topPost = (gifv != null) ? gifv : (topPost + '.jpg')
            callback("here's the spiciest meme of the hour fam: " + topPost)
          } else {
            // when the imgur request fails use the link as is
            callback("here's the spiciest meme of the hour fam: " + topPost)
            console.log(error)
          }
        })
      } else {
        callback("here's the spiciest meme of the hour fam: " + topPost)
      }
    } else {
      callback("I can't get memes right now, homie.")
      console.log(error)
    }
  })
}

client.on('message', msg => {
  if (msg.content == '!meme') {
    getMeme(link => {
      msg.reply(link)
      console.log(new Date().toLocaleTimeString() + ` Replied to ${msg.author.username}, "${link}"`)
    })
  }
})

/* Client status and login */

client.on('ready', () => {
  client.user.setStatus('online', "Half-Life 3")
  console.log("I'm ready to do bot stuff")
})

const secret = require('./secret.json')
client.login(secret.token)
