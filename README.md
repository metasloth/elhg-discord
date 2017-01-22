# elhg-discord
A Discord bot for memes and command cleanup, built using [discord.js](https://github.com/hydrabolt/discord.js).

### Setup
* Create a Discord application [here](https://discordapp.com/developers/applications/me).
* In the repository create a file named `secret.json`, which should look something like this:
```javascript
{ "token" : "BOT_TOKEN", "botLogChannel" : "BOT_LOG_CHANNEL_ID" }
```
* Replace BOT_TOKEN with the "secret" value of your discord app and 
BOT_LOG_CHANNEL_ID with the id of a text channel for the bot to log its activity.
* Install the node depencies with `npm install`
* Verify sqlite3 is installed on your system

### Adding to Servers
Edit the following url, replacing BOT_ID with the client id of your discord app:
```
https://discordapp.com/oauth2/authorize?client_id=BOT_ID&scope=bot&permissions=0
```

### Running the bot
The script `startbot.sh` will create the needed directories and log files, as well as start the bot using forever.