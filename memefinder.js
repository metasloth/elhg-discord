const cheerio = require('cheerio')
const request = require('request')
const sqlite3 = require('sqlite3').verbose()
const config = require('./config.json')

const db = new sqlite3.Database('./data/activity.db')

// Reads from configuration file and calls storeMemes() appropriately
function updateMemes () {
  for (let i = 0; i < config.subreddits.length; i++) {
    storeMemes(config.subreddits[i].url, config.subreddits[i].cacheLimit)
  }
}

// Fetches and stores memes
function storeMemes (url, count) {
  request(url, (error, response, body) => {
    if (error) {
      console.log('Error requesting ' + url, error)
    } else {
      let $ = cheerio.load(body)
      for (let i = 1; i <= count; i++) {

        // Grab the image link
        let meme = $("[data-rank='" + i + "']").attr('data-url')
        if (meme == null) {break}

        // Make sure imgur links are direct
        if (meme.includes('imgur') && !meme.includes('.', meme.length - 5)
          && !meme.includes('/gallery/') && !meme.includes('/a/')) {
          request(meme, (error, response, body) => {
            // If the imgur request fails return the link as is
            if (error) {
              console.log(error)
            }
            // Look for a gifv url, otherwise append .jpg to the link 
            else {
              let $ = cheerio.load(body)
              let gifv = $("[itemprop='embedURL']").attr('content')
              meme = (gifv != null) ? gifv : (meme + '.jpg')
            }
          })
        }

        // Push the meme to sqlite
        db.serialize(() => {
          db.run(`INSERT INTO MemeStore VALUES ("${new Date()}", "${meme}", "${url}")`)
        })
      }
    }
  })
}

// TESTING
updateMemes()
