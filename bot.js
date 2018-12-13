var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');
var moment = require('moment'); //The moment package, Lets you view the time

//if (bot.user.id === message.author.id) {return}

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var items = ["C.U.B.E Club Membership"];


/*Update CheckList
Luck Stat and Luck Potion - Completed
Redemption Shop and Item Drop Rework -
More organized inventory - Scrapped
Daily Reward Buff - 
Zen Potion - Compelted
*/

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
	itemdrop:10, //Item Drop Rate
	high:40 //Win Rate
};
var itemdroptable = ["Slime Lock Box","Luck Potion","Zen Potion","Golden Slime Prize Box"];

var redeem = ["Slime Lock Box"];

var usable = ["Luck Potion","Zen Potion","Golden Slime Prize Box"];

//Golden Slime Prize Box
var goldenpool = ["Hallow Sensor Unit"];

	
var luckPotion = {
	lowend: -5,
	highend: 5
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
	var used = [];
	var other = [];
	
	let sender = message.author;
	let msg = message.content.toUpperCase();
	let prefix = '>'
	
	let parts = message.content.split("");
	let num = parts[5];
	
	let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
	
	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
	
	if (userData[sender.id + message.guild.id].tokens === undefined) userData[sender.id + message.guild.id].tokens = 50;
    if (userData[sender.id + message.guild.id].inventory === undefined) userData[sender.id + message.guild.id].inventory = items;
	if (userData[sender.id + message.guild.id].luck === undefined) userData[sender.id + message.guild.id].luck = 0;
	if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = 'Not Collected';
	if (userData.pot === undefined) userData.pot = 50;
	
	//Applying Luck Stat, Requirements(Should affect item drop rates, and the best possible wins)
	//Luck should affect all possible drops on the casino wheel, it can get really bad...
	
	if(userData[sender.id + message.guild.id].luck < 0){
		lowmin = userData[sender.id + message.guild.id].luck - 5;
		lowmax = userData[sender.id + message.guild.id].luck;
	}
	if(userData[sender.id + message.guild.id].luck === 0){
		lowmin = 1; //Lowest Roll on a loss
		lowmax = gamblecost / 2; //Highest Roll on a loss
		highmin = gamblecost; //Lowest Roll on a Win
		highmax = gamblecost * 2; //Highest Roll on a win
		rates.itemdrop = 10;
		rates.high = 40;
	}
	if(userData[sender.id + message.guild.id].luck > 0){
		highmin = gamblecost + userData[sender.id + message.guild.id].luck;
		highmax = (gamblecost * 2) + userData[sender.id + message.guild.id].luck * 2;
	}

	rates.itemdrop = 10 + userData[sender.id + message.guild.id].luck;
	rates.high = 40 + userData[sender.id + message.guild.id].luck;
	
	if(rates.itemdrop < 0){ //Balancing Item Drop Rates
		rates.itemdrop = 2;
	}
	if(rates.itemdrop >= rates.high){
		rates.itemdrop = rates.high - 1;
	}
if(msg === prefix + 'TEST'  && sender.id + message.guild.id === "198866287470837760504453118835032066"){
	console.log(userData[sender.id + message.guild.id].luck + "luck")
	console.log(lowmin + "low min")
	console.log(lowmax + "low max")
	console.log(highmin + "high min")
	console.log(highmax + "high max")
	console.log(rates.itemdrop + "item drop rate")
	console.log(rates.high + "win rate")

}
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
if(msg === prefix + "CLEANYES"){
	userData[sender.id + message.guild.id].inventory = items;
}
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
	var redemption = [];
	var other = [];
	for(i = 0; i < userData[sender.id + message.guild.id].inventory.length; i++){
		console.log("Checking Inventory");
		var item = userData[sender.id + message.guild.id].inventory[i];
		var found = redeem.includes(item)
			if(found === true){
				console.log("Item Found");
				redemption.push(item);
				console.log(userData[sender.id + message.guild.id].inventory)
			} else if (found === false){
				other.push(item);
				console.log(message.author + " Different Item...")
		}
	
	}
	
	userData[sender.id + message.guild.id].inventory = other;
	if(redemption.length != 0){
	   const embed = new Discord.RichEmbed()
  //.setTitle("Your Account")
  .setAuthor(message.author.username +"'s Redemption, Contact Imposto to claim your items in-game!")
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
  .addField("Redemption", redemption)
	
	
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
	} else if (redemption.length === 0){
	 message.channel.send(message.author + " You don't have any items to redeem");
	}	   	
}
	
//Splits command up so you can do multiple uses
if(parts[0] === prefix){
	let command = message.content.substring(message.content.indexOf(">"), message.content.length);
	command = command.toUpperCase();
	let num = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
	let who = message.content.substring(message.content.indexOf(".") + 1, message.content.length);
	let item = message.content.substring(message.content.indexOf(".") + 1, message.content.length);
	let amount = message.content.substring(message.content.indexOf(" ") + 1, message.content.indexOf(" ")+2);
	
	console.log(command + " command");
	console.log(num + " num");	
		
		
	//Applying Luck Stat to Percent Chance...
	
	
		
		
	who = who.toUpperCase();
	amount = amount.toUpperCase();
	
	console.log(who + " who");
	console.log(amount + " amount");
	
	
	//Using Usables
	if(command === prefix + "USE" + "." + who){
		console.log("Checking Usable");
		if(usable.includes(item) === true && userData[sender.id + message.guild.id].inventory.includes(item) === true) {
			
			if(item === "Luck Potion"){
				var change = Math.floor(Math.random() * (+luckPotion.highend - +luckPotion.lowend)) + +luckPotion.lowend
				userData[sender.id + message.guild.id].luck += change;
				console.log(userData[sender.id + message.guild.id].luck);
				for(i = 0; i < userData[sender.id + message.guild.id].inventory.length; i++){
					if(userData[sender.id + message.guild.id].inventory[i] === "Luck Potion"){
					 	used.push(userData[sender.id + message.guild.id].inventory[i]);
					} else {
						other.push(userData[sender.id + message.guild.id].inventory[i])
					}
				}
				userData[sender.id + message.guild.id].inventory.splice("Luck Potion");
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					userData[sender.id + message.guild.id].inventory.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					userData[sender.id + message.guild.id].inventory.push(used[i]);
				}
				
				
				
				
				message.channel.send(message.author + " You drunk a Luck Potion... you start to feel weird.")
			}
			if(item === "Zen Potion"){
				userData[sender.id + message.guild.id].luck = 0;
				
				for(i = 0; i < userData[sender.id + message.guild.id].inventory.length; i++){
					if(userData[sender.id + message.guild.id].inventory[i] === "Zen Potion"){
					 	used.push(userData[sender.id + message.guild.id].inventory[i]);
					} else {
						other.push(userData[sender.id + message.guild.id].inventory[i])
					}
				}
				userData[sender.id + message.guild.id].inventory.splice("Luck Potion");
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					userData[sender.id + message.guild.id].inventory.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					userData[sender.id + message.guild.id].inventory.push(used[i]);
				}
				message.channel.send(message.author + " You drunk a Zen Potion... you feel balanced.")
			}
			if(item === "Golden Slime Prize Box"){
				var drop = Math.floor(Math.random() * (+goldenpool.length - +0)) + +0
				var drops = [];
				
				for(i = 0; i < userData[sender.id + message.guild.id].inventory.length; i++){
					if(userData[sender.id + message.guild.id].inventory[i] === "Golden Slime Prize Box"){
					 	used.push(userData[sender.id + message.guild.id].inventory[i]);
					} else {
						other.push(userData[sender.id + message.guild.id].inventory[i])
					}
				}
				userData[sender.id + message.guild.id].inventory.splice("Golden Slime Prize Box");
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					userData[sender.id + message.guild.id].inventory.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					userData[sender.id + message.guild.id].inventory.push(used[i]);
				}
				
				for(i = 0; i < goldenpool.length; i++){
					if(drop === i){
						userData[sender.id + message.guild.id].inventory.push(goldenpool[i]);
						drops.push(goldenpool[i]);
					}		
				}
				const embed = new Discord.RichEmbed()
				  .setTitle("Golden Slime Prize Box Unboxing")
				  .setAuthor(message.author.username)
				  /*
				   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
				   */
				  .setColor(0xF1C40F)
				  .setDescription("You have unboxed a Golden Slime Prize Box!")
				  embed.addField("You have unboxed...", drops)
				  .setFooter("Have Fun!")
				  //.setImage("http://i.imgur.com/yVpymuV.png")
				  //.setThumbnail("https://imgur.com/EJQmL0g")
				  /*
				   * Takes a Date object, defaults to current date.
				   */
				  .setTimestamp()
				  
				   message.channel.send({embed});
  
  
			}
		} else if(usable.includes(item) === false){
			message.channel.send(message.author + " You do not have that Usable, check your spelling.")
		}
	}
	if(command === prefix + "ADDPOOL" + "." + who && sender.id + message.guild.id === "198866287470837760504453118835032066"){
		if(goldenpool.includes(item)){
			message.channel.send("That item is already in the prize pool");
		} else {
			goldenpool.push(item)
			redeem.push(item)
			message.channel.send("Item Successfully Added");
		}
	}
	if(command === prefix + "REMOVEPOOL" + "." + who && sender.id + message.guild.id === "198866287470837760504453118835032066"){
		if(goldenpool.includes(item) && redeem.includes(item)){
			//Removes the item from the drop table.
			for(i = 0; i < goldenpool.length; i++){
					if(goldenpool[i] === item){
					 	used.push(goldenpool[i]);
					} else {
						other.push(goldenpool[i])
					}
				}
				goldenpool.splice(item);
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					goldenpool.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					goldenpool.push(used[i]);
				}
			for(i = 0; i < redeem.length; i++){
					if(redeem[i] === item){
						if(!item === "Luck Potion" && !item === "Zen Potion"){
					 	used.push(redeem[i])
						}
					} else {
						other.push(redeem[i])
					}
				}
				redeem.splice(item);
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					redeem.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					redeem.push(used[i]);
				}
			message.channel.send("Item Successfully Removed");
		}	
	}
	if(command === prefix + "ADD" + "." + who && sender.id + message.guild.id === "198866287470837760504453118835032066"){
		if(itemdroptable.includes(item)){
			message.channel.send("That item is already in the drop table");
		} else {
			itemdroptable.push(item)
			redeem.push(item)
			message.channel.send("Item Successfully Added");
		}
	}	
	if(command === prefix + "REMOVE" + "." + who && sender.id + message.guild.id === "198866287470837760504453118835032066"){
		if(itemdroptable.includes(item) && redeem.includes(item)){
			//Removes the item from the drop table.
			for(i = 0; i < itemdroptable.length; i++){
					if(itemdroptable[i] === item){
					 	used.push(itemdroptable[i]);
					} else {
						other.push(itemdroptable[i])
					}
				}
				itemdroptable.splice(item);
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					itemdroptable.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					itemdroptable.push(used[i]);
				}
			for(i = 0; i < redeem.length; i++){
					if(redeem[i] === item){
						if(!item === "Luck Potion" && !item === "Zen Potion"){
						   used.push(redeem[i]);
						}		 	
					} else {
						other.push(redeem[i])
					}
				}
				redeem.splice(item);
				
				var position = used.indexOf(used.length);
				used.splice(position);
				
				for(i = 0; i < other.length; i++){
					redeem.push(other[i]);
				}
				for(i = 0; i < used.length; i++){
					redeem.push(used[i]);
				}
			message.channel.send("Item Successfully Removed");
		}	
	}
	if(command === prefix + "TABLE"){
		message.channel.send(itemdroptable);
	}
	if(command === prefix + "POOL"){
		message.channel.send(goldenpool);
	}
	if(command === prefix + "GIVE" + " " + amount + "." + who && sender.id + message.guild.id === "198866287470837760504453118835032066"){
		console.log("Giving " + amount + " Tokens");
		if(message.content.includes("!")){
			let id = message.content.substring(message.content.indexOf("!") + 1, message.content.length - 1);
		} else {
			let id = message.content.substring(message.content.indexOf("@") + 1, message.content.length - 1);
		}
		var count = parseInt(amount);
		console.log(id);
		console.log(sender.id + message.guild.id);
		userData[id + message.guild.id].tokens += count;
		message.channel.send("Tokens successfully given");
		console.log("Success");
	}
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
				var yourdrop =Math.floor(Math.random() * (+itemdroptable.length - +0)) + +0;
				for(f = 0; f < itemdroptable.length; f++){
					if(f === yourdrop){
						itemgets.push(itemdroptable[f]);
						userData[sender.id + message.guild.id].inventory.push(itemdroptable[f]);			
					}
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
			
		} else if (userData[sender.id + message.guild.id].tokens < gamblecost) {
			message.channel.send(message.author + " You don't have enough tokens to spin.")
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
	   userData[sender.id + message.guild.id].lastDaily = moment().format('L') //Switches last daily with current
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
}})

bot.on('ready', () => {

	console.log('The Casino is Live...')
})

bot.login(process.env.BOT_TOKEN)
