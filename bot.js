var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');
var moment = require('moment'); //The moment package, Lets you view the time

//if (bot.user.id === message.author.id) {return}

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var items = ["Golden Slime Co. Membership"];


var winningnumber;
//Casino Wheel Values(Change these for different effects)
var gamblecost = 10; //How much it costs for 1 spin.
var lowmin = 1; //Lowest Roll on a loss
var lowmax = gamblecost / 2; //Highest Roll on a loss
var highmin = gamblecost; //Lowest Roll on a Win
var highmax = gamblecost * 2; //Highest Roll on a win
var max = 100 //Percent Chances
var min = 0
var rates = {
	itemdrop:10, //TODO: Trading system.
	high:40 //Win Rate
};
var itemdroptable = {
	slime:"Slime Lock Box",
	simpleorb:"Simple Orb of Alchemy",
	advancedorb:"Advanced Orb of Alchemy",
	hallowitem:"Hallow Item of your Choice",
	pet:"One Pet Food of Choice",
};

var redeem = ["Slime Lock Box","Simple Orb of Alchemy","Advanced Orb of Alchemy","Hallow Item of your Choice","One Pet Food of Choice"];

var itemrates = { //Percent chance for item drops right now.
	slime:20,
	simpleorb:40,
	advancedorb:60,
	hallowitem:80,
};

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

bot.on('message', message => {
	var itemgets = [];
	
	let sender = message.author;
	let msg = message.content.toUpperCase();
	let prefix = '!'
	
	let parts = message.content.split("");
	let num = parts[5];
	
	let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
	
	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
	
	if (userData[sender.id + message.guild.id].tokens === undefined) userData[sender.id + message.guild.id].tokens = 50;
    if (userData[sender.id + message.guild.id].inventory === undefined) userData[sender.id + message.guild.id].inventory = items;
	if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = 'Not Collected';
	if (userData.pot === undefined) userData.pot = 50;

//Draws a winning ticket, will be a two times daily event.(ADMIN COMMAND)
if(msg === prefix + 'DRAW' && sender.id + message.guild.id === "198866287470837760504453118835032066"){
	//Drawing Number
	var number1 =Math.floor(Math.random() * (+5 - +0)) + +0;
		var number2 =Math.floor(Math.random() * (+9 - +0)) + +0;
		var number3 =Math.floor(Math.random() * (+9 - +0)) + +0;
	
		var one = number1 * 100;
		var two = number2 * 10;
		var three = number3;
	
	var lotterynumber = one + two + three;
	
	if(lotterynumber < 100 && lotterynumber > 10){
		lotterynumber * 10;
	}
	if(lotterynumber < 10){
		lotterynumber * 100;
	}
	
	message.channel.send('And the winning lottery ticket is... #' + lotterynumber +"!!!")
	message.channel.send("If you have this lottery ticket... do !claim to claim your prize")
	winningnumber = lotterynumber;
}

//Destroys an item.(ADMIN COMMAND)TODO:Actually program this

//Claim a winning ticket
if(msg === prefix + 'CLAIM'){
	var found = userData[sender.id + message.guild.id].inventory.includes("Lottery Ticket: #"+winningnumber)
	if(found === true){
		var position = userData[sender.id + message.guild.id].inventory.indexOf("Lottery Ticket: #"+winningnumber)
		userData[sender.id + message.guild.id].inventory.splice(position)
		message.channel.send("Congratulations on winning the lottery! Here is your prize of " + pot + " tokens")
		userData[sender.id + message.guild.id].tokens += userData[bot.id + message.guild.id].pot;
		userData.pot = 50;
	} else if (found === false){
		message.channel.send("You do not have this lottery ticket")
	}
}
if(msg === prefix + 'ME' && sender.id + message.guild.id === "198866287470837760504453118835032066"){
  	userData[sender.id + message.guild.id].tokens += 50;
}	
if(msg === prefix + 'REDEEM'){
	console.log("Checking Redeem");
	for(i = 0; i < userData[sender.id + message.guild.id].inventory.length; i++){
		console.log("Checking Inventory");
		var item = userData[sender.id + message.guild.id].inventory[i];
		var found = redeem.includes(item)
			if(found === true){
				console.log("Item Found");
				userData[sender.id + message.guild.id].inventory.splice(i, 1);
				message.channel.send(message.author + " Congratulations on your redemption of " + item + " private message Imposto to claim your prize")
				console.log(userData[sender.id + message.guild.id].inventory)
			} else if (found === false){
				console.log(message.author + " That item is not in your inventory")
		}
	
	}
	
}
	
//Splits command up so you can do multiple uses
if(parts[0] === prefix){
	let command = message.content.substring(message.content.indexOf("!"), message.content.length);
	command = command.toUpperCase();
	let num = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
	
	console.log(num);
	console.log(command);

	
	if(command === prefix + "PING" + " " + num){
		var times = parseInt(num);
		for(i = 0; i < times; i++){
			message.channel.send("Pong");
		}		
	}
	if(command === prefix + "TICKET" + " " + num){
		var times = parseInt(num);

	if(userData[sender.id + message.guild.id].tokens >= gamblecost * num){
		var tickets = [];
		for(i = 0; i < num; i++){
		userData[sender.id + message.guild.id].tokens -= gamblecost;
		userData.pot += gamblecost;
		var number1 =Math.floor(Math.random() * (+5 - +0)) + +0;
		var number2 =Math.floor(Math.random() * (+9 - +0)) + +0;
		var number3 =Math.floor(Math.random() * (+9 - +0)) + +0;
	
		var one = number1 * 100;
		var two = number2 * 10;
		var three = number3;
	
	var lotterynumber = one + two + three;
	
	if(lotterynumber < 100 && lotterynumber > 10){
		lotterynumber * 10;
	}
	if(lotterynumber < 10){
		lotterynumber * 100;
	}
	
	userData[sender.id + message.guild.id].inventory.push("Lottery Ticket: #"+lotterynumber);
	tickets.push(lotterynumber);
	
	} 	
	message.channel.send(message.author + " You have purchased lottery ticket: #" +tickets );	
			
} else if(userData[sender.id + message.guild.id].tokens < gamblecost * num) {
	message.channel.send(message.author + " You don't have enough tokens to buy that many lottery ticket(s).")			
}	
	}
if(command === prefix + "SPIN" + " " + num){
		console.log(rates.itemdrop);
		if(userData[sender.id + message.guild.id].tokens >= gamblecost * num){
			var old = userData[sender.id + message.guild.id].tokens;
			for(i = 0; i < num; i++){
				
	 
				userData[sender.id + message.guild.id].tokens = userData[sender.id + message.guild.id].tokens - gamblecost;
				var chance =Math.floor(Math.random() * (+max - +min)) + +min;
				console.log(chance);
			if (chance <= rates.high && chance > rates.itemdrop){
		
				var random =Math.floor(Math.random() * (+highmax - +highmin)) + +highmin;
				userData[sender.id + message.guild.id].tokens = userData[sender.id + message.guild.id].tokens + random;
		
			} else if (chance >= rates.high){
				
				var random =Math.floor(Math.random() * (+lowmax - +lowmin)) + +lowmin;
				userData[sender.id + message.guild.id].tokens = userData[sender.id + message.guild.id].tokens + random;	
			} else if (chance <= rates.itemdrop){
				var itemdrop =Math.floor(Math.random() * (+max - +min)) + +min;
				console.log("Item Dropped")
				if(itemdrop <= itemrates.slime){
						
						userData[sender.id + message.guild.id].inventory.push(itemdroptable.slime);
						itemgets.push(itemdroptable.slime);
					} else if (itemdrop > itemrates.slime && itemdrop <= itemrates.simpleorb){
					userData[sender.id + message.guild.id].inventory.push(itemdroptable.simpleorb);
						itemgets.push(itemdroptable.simpleorb);
					} else if (itemdrop > itemrates.simpleorb && itemdrop <= itemrates.advancedorb){
						userData[sender.id + message.guild.id].inventory.push(itemdroptable.advancedorb);
						itemgets.push(itemdroptable.advancedorb);
					} else if (itemdrop > itemrates.advancedorb&& itemdrop <= itemrates.hallowitem){
						userData[sender.id + message.guild.id].inventory.push(itemdroptable.hallowitem);
						itemgets.push(itemdroptable.hallowitem);
					} else if (itemdrop > itemrates.hallowitem){
						userData[sender.id + message.guild.id].inventory.push(itemdroptable.pet);
						itemgets.push(itemdroptable.pet);
					}
			}
	}
	const embed = new Discord.RichEmbed()
  .setTitle("Casino Wheel")
  .setAuthor(message.author.username)
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0xF1C40F)
  .setDescription("You spun " + num + " times for " + gamblecost * num + " tokens.")
  .setFooter("Have Fun!")
  //.setImage("http://i.imgur.com/yVpymuV.png")
  //.setThumbnail("https://imgur.com/EJQmL0g")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  //.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
 if(old < userData[sender.id + message.guild.id].tokens){
	 var total = userData[sender.id + message.guild.id].tokens - old;
	  embed.addField("You made a total of " + total + " tokens",
    userData[sender.id + message.guild.id].tokens + " tokens left.")
 } else if (old > userData[sender.id + message.guild.id].tokens) { 
	 var total = old - userData[sender.id + message.guild.id].tokens;
		embed.addField("You lost " + total + " tokens",
    userData[sender.id + message.guild.id].tokens + " tokens left.")
	
  }
  if(itemgets.length > 0){
	embed.addField("You got an item!", itemgets)
   }	 
	
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  //.addField("Inline Field", "They can also be inline.", true)
  /*
   * Blank field, useful to create some space.
   */
  //.addBlankField(true)
  //.addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
 
  message.channel.send({embed});
			}  else if (userData[sender.id + message.guild.id].tokens < gamblecost) {
			message.channel.send(message.author + " You don't have enough tokens to spin.")
		}
	}
}	


//Your Inventory

if(msg === prefix + 'BANK' || msg === prefix + 'ACCOUNT' || msg === prefix + 'INVENTORY'){
	const embed = new Discord.RichEmbed()
  //.setTitle("Your Account")
  .setAuthor(message.author.username +"'s Account")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0xF1C40F)
  //.setDescription("Welcome to your account, " + message.author.username)
  .setFooter("Have Fun!")
  //.setImage("http://i.imgur.com/yVpymuV.png")
  //.setThumbnail("https://imgur.com/EJQmL0g")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  //.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Account Balance",
    userData[sender.id + message.guild.id].tokens + " tokens")
	.addField("Inventory", userData[sender.id + message.guild.id].inventory)
	
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  //.addField("Inline Field", "They can also be inline.", true)
  /*
   * Blank field, useful to create some space.
   */
  //.addBlankField(true)
  //.addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
 
  message.channel.send({embed});
	}

if(msg === prefix + 'DAILY'){
	if(userData[sender.id + message.guild.id].lastDaily != moment().format('L')) { 	//Checks if the lastdaily object is the same as date
	   userData[sender.id + message.guild.id].lastDaily = moment().format('L') //Swithces lastdaily with current
	   userData[sender.id + message.guild.id].tokens += 20; //Adds in the money
	   message.channel.send(message.author +" Daily Claimed for 20 tokens");
	} else {
		message.channel.send(message.author +" You have already claimed your daily  You can collect your next reward " + moment().endOf('day').fromNow() +'.');
	}
}

if(msg === prefix + 'LOTTERY' || msg === prefix + 'POT'){
	 message.channel.send(message.author +" The current pot is " + userData.pot + " tokens");
}

if(userData[sender.id + message.guild.id].tokens <= 0){
	userData[sender.id + message.guild.id].tokens = 0;
}
//Update your token count
fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
	if(err) console.error(err);
})
})

bot.on('ready', () => {

	console.log('The Casino is Live...')
})

bot.login(process.env.BOT_TOKEN)

