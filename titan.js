const { Client, MessageEmbed } = require("discord.js");
const bot = new Client();
const prefix = ".";
const weather = require("weather-js");

function declOfNum(number, titles){
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]];
}

function clear (channel){
    channel.bulkDelete(99).then(messages => {
        if(messages.size === 99){
            clear(channel);
        }else{
            channel.send(`del. all done.`).then((msg) => {msg.delete({timeout: 7000})});
        }
    })
}

function clear_count (channel, count, count_all = 0){
    if (count > 100){
        count_all = count_all + 100;
        channel.bulkDelete(100).then(() => {clear(channel, count-100, count_all)});
    }else{
		channel.bulkDelete(count).then(messages => {
			count_all = count_all + messages.size;
			channel.send(`del. ${count_all} ${declOfNum(count_all, ['сообщение','сообщения','сообщений'])}.`).then((msg) => {msg.delete({timeout: 3000})});
    	});
    }
}

bot.on("message", async (message) => {
    if(message.author.bot || message.content.indexOf(prefix) !== 0 || message.channel.type == "dm") return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
	  
    if(command === "servers"){
        const embed = new MessageEmbed()
        	.setTitle(`onair ${bot.guilds.size}`);
		
		return message.channel.send(embed);
    } 
	
    if(command === "clear"){
        if(!args[0] || !message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("reboot.");
        clear_count(message.channel, parseInt(args[0])+1);
    }
	
    if(command === "clear_all"){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("reboot.");
        clear(message.channel);
    }
	
	if(command === "ping"){
		message.reply("pong!");
	}
	
	if(command === "userinfo"){
		const member = message.mentions.members.first();
		if(!member) return message.reply("reboot.");

		const embed = new MessageEmbed()
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setDescription(`reg.d.: ${member.user.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\nsid: ${member.user.id}`);
		
		return message.channel.send(embed);
	}
	
	if(command === "help"){
		message.reply("ican'thelpu!");
	}
	
	if(command === "info"){
		const embed = new MessageEmbed()
			.setDescription(`serv.id: ${message.guild.id}\nserv.reg.d.: ${(new Date(message.guild.createdAt.getTime() + 3*60*60*1000)).toISOString().replace(/T/, ' ').replace(/\..+/, '')} MSK\nty zziger#8040`)

		return message.channel.send(embed);
	}
	
	if(command === "time"){
		let query = args.join(" ");
		const embed = new MessageEmbed()
			.setTitle((new Date(new Date().getTime() + 3*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+' MSK')

		if(!query) return message.channel.send(embed);

		weather.find({search: query, degreeType: "C", lang: "ru-RU"}, function(err, result){
			let timezone, name;
			if(result.length < 1){
				const embed = new MessageEmbed()
					.setTitle((new Date(new Date().getTime() + 3*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+' MSK')

				return message.channel.send(embed);
			}else{
				timezone = result[0].location.timezone;
				name = result[0].location.name;	
			}

			if(!timezone.startsWith("-")) timezone = "+" + timezone;
			const embed = new MessageEmbed()
				.setTitle(name)
				.setDescription((new Date(new Date().getTime() + parseFloat(timezone.replace(/,/g, '.'))*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+` (UTC ${timezone})`)

			return message.channel.send(embed);
		});
	}
	
	if(command === "recall" && message.author.id == "292934598227263488"){ 
		bot.guilds.cache.get(args[0]).leave().then(() => {
		const embed = new MessageEmbed()
			.setTitle(`onair ${bot.guilds.cache.size}`);
			
		return message.channel.send(embed);
		});
	}
	
	if(command === "uhodi" && message.author.id == "292934598227263488"){
		bot.guilds.each(guild => {
			if(guild.id != "308591299353640960") guild.leave();
		});

		const embed = new MessageEmbed()
			.setTitle(`onair ${bot.guilds.cache.size}`);
			
        return message.channel.send(embed);
	}	

	if(command == "weather"){
		let query = args.join(" ");
		weather.find({search: query, degreeType: "C", lang: "ru-RU"}, function(err, result) {
			if(err) console.log(err);
			if(result.length < 1){
				const embed = MessageEmbed()
					.setDescription("Погода не найдена")

				return message.channel.send(embed);
			}

			let data = result[0];
			let embed = new MessageEmbed()
				.setTitle(data.location.name)
				.setDescription(`${data.current.skytext}, ${data.current.temperature} °C\nПо ощущениям ${data.current.feelslike} °C\nВетер: ${data.current.winddisplay}`)
				.setThumbnail(data.current.imageUrl);

			return message.channel.send(embed);
		});
	}

	if(command == "forecast"){
		let query = args.join(" ");
		weather.find({search: query, degreeType: "C", lang: "ru-RU"}, function(err, result) {
			if(err) console.log(err);
			if(result.length < 1){
				const embed = MessageEmbed()
					.setDescription("Погода не найдена")

				return message.channel.send(embed);
			}

			let data = result[0];
			let forecast = `${data.location.name}`;
			data.forecast.forEach((obj) => {
				forecast+=`\n\n**${obj.day.charAt(0).toUpperCase()}${obj.day.slice(1)} (${obj.date}):**\n${obj.low} °C — ${obj.high} °C\n${obj.skytextday}`
			});

			let embed = new MessageEmbed()
				.setTitle("Прогноз погоды")
				.setDescription(forecast);
			
			return message.channel.send(embed);
		});
	}
});

bot.login(process.env.HTOKEN);