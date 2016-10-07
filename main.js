const request = require('request')
const cheerio = require('cheerio')
const Discord = require('discord.js')
const client = new Discord.Client()
const secret = require('./secret.json')
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
        let topPost = $("[data-rank='1']").attr('data-url')
        // Make sure imgur single image links are direct 
        if (topPost.includes('imgur') && !topPost.includes('.', topPost.length - 5)
          && !topPost.includes('/gallery/') && !topPost.includes('/a/')) {
          request(topPost, (error, response, body) => {
            // if the imgur request fails return the link as is
            if (error) {
              resolve(topPost)
              console.log(error)
            } else {
              // look for a gifv url, otherwise append .jpg to the link
              let $ = cheerio.load(body)
              let gifv = $("[itemprop='embedURL']").attr('content')
              topPost = (gifv != null) ? gifv : (topPost + '.jpg')
              resolve(topPost)
            }
          })
        } else {
          resolve(topPost)
        }
      }
    })
  })
  return promise
}

client.on('message', msg => {
  if (airhornCommands.indexOf(msg.content) > -1) {
    msg.delete(2000)
    console.log(new Date().toLocaleTimeString() + ` Caught Commmand: ${msg.content} from ${msg.author.username}`)
  } else if (msg.content == '!meme') {
    getMeme().then(response => {
      msg.reply("here's the spiciest meme of the hour fam: " + response)
      console.log(new Date().toLocaleTimeString() + ` Sent "${response}" to ${msg.author.username}`)
    }, error => {
      msg.reply("I can't get memes right now homie")
    })
  }
})

client.on('ready', () => {
  client.user.setStatus('online', 'to win')
  console.log("I'm ready to do bot stuff")
})

client.on('disconnected', () => console.log(new Date().toLocaleTimeString() + ' Disconnected!')
)

client.login(secret.token)
