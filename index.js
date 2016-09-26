"use strict";

const request = require("request");
const cheerio = require("cheerio");
const Discord = require("discord.js");
const client = new Discord.Client();



//////// Airhorn command cleanup ////////

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

client.on("message", (msg) => {
	if (airhornCommands.indexOf(msg.content) > -1){
		msg.delete(2000);
		console.log(Date() + " Caught Commmand: " + msg.content);
	}
});



//////// Meme of the hour ////////

const url = "https://www.reddit.com/r/me_irl/top/?sort=top&t=hour";

function getMeme(callback){
	request(url, function(error, response, body){
		if(!error){
			var $ = cheerio.load(body); 
			var topPost = $("[data-rank='1']").attr("data-url");
			callback("here's the spiciest meme of the hour fam: " + topPost);
		} else {
			console.log(error);
			callback("I can't get memes right now, homie");
		}
	});
}

client.on("message", (msg) => {
	if (msg.content == "!meme"){
		getMeme(function(reply){
			msg.reply(reply);
		});
	}
});



//////// Client status and login ////////

client.on("ready", () => {
	client.user.setStatus("online", "a game called life");
	console.log("I'm looking out for airhorn commands!");
});

const secret = require("./secret.json");
client.login(secret.token);