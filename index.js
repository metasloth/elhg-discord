"use strict";

const Discord = require("discord.js");
const client = new Discord.Client();

const airhornCommands = [
	"!airhorn",
	"!anotha",
	"!anothaone",
	"!johncena",
	"!cena",
	"!ethan",
	"!eb",
	"!ethanbradberry",
	"!h3h3",
	"!stan",
	"!stanislav",
	"!birthday",
	"!bday",
	"!wowthatscool",
	"!wtc"
];

client.on("message", (message) => {
	if (airhornCommands.indexOf(message.content) > -1){
		setTimeout(function(){
			message.delete();
		}, 2000);
		console.log(Date() + " Caught Commmand: " + message.content);
	}
});

client.on("ready", () => {
	console.log("I'm looking out for airhorn commands!");
});

const secret = require("./secret.json");
client.login(secret.token);



