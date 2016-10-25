# elhg-discord
A discord bot for memes and command cleanup, built using [discord.js](https://github.com/hydrabolt/discord.js)

### Setup
* Create a discord application [here](https://discordapp.com/developers/applications/me).
* Clone the repository `git clone https://github.com/metasloth/elhg-discord`
* In the repository install the node dependancies with `npm install`
* Create a file named `secret.json`, which should look something like this:
```javascript
{
  "token" : "BOT_TOKEN",
  "botLogChannel" : "BOT_LOG_CHANNEL_ID"
}
```
* Replace BOT_TOKEN with the "secret" value of your discord app and 
BOT_LOG_CHANNEL_ID with the id of a text channel for the bot to log its activity.

### Adding to Servers
Edit the url `https://discordapp.com/oauth2/authorize?client_id=BOT_ID&scope=bot&permissions=0`, 
replacing BOT_ID with the client id of your discord app. There you can add the bot
to any servers where you have the *Manage Server* permission.

### Running the Bot
To start the bot, use `node main.js` or `npm run start`