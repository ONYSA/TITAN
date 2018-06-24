const Discord = require("discord.js");
const titanxyz = new Discord.Client();
const prefix = '.';
const os = require('os');

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function clear (channel) {
    channel.bulkDelete(99).then(messages => {
        if (messages.size === 99) {
            clear(channel);
        } else {
            channel.send(`del. all done.`).then((msg) => {msg.delete(7000);});
        }
    })
}

function clear_count (channel, count, count_all = 0) {
    if (count > 100) {
        count_all = count_all + 100;
        channel.bulkDelete(100).then(() => {clear(channel, count-100, count_all)});
    } else {
	channel.bulkDelete(count).then(messages => {
	count_all = count_all + messages.size;
	channel.send(`del. ${count_all} ${declOfNum(count_all, ['сообщение','сообщения','сообщений'])}.`).then((msg) => {msg.delete(3000);});
        });
    }
}

titanxyz.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
	  
    if (command === 'servers') {
        const embed = new Discord.RichEmbed()
            .setTitle(`onair ${titanxyz.guilds.size}`);
        message.channel.send({embed: embed});
    }
	
    if (command === 'clear') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('reboot.');
        if (!args[0]) return message.reply('reboot.');
        clear_count(message.channel, parseInt(args[0])+1);
    }
	
    if (command === 'clear_all') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('reboot.');
        clear(message.channel);
    }
	
	if (command === 'ping') {
		message.reply('pong!');
	}
	
	if (command === 'userinfo') {
		const member = message.mentions.members.first();
		if (!member) return message.reply('reboot.');
		const embed = new Discord.RichEmbed()
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setDescription(`reg.d.: ${member.user.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')}`);
		message.channel.send({embed});
	}
	
	if (command === 'help') {
		message.reply('ican\'thelpu!');
	}
	
	if (command === 'info') {
		message.channel.send({embed: new Discord.RichEmbed(). setDescription(`serv.id:${message.guild.id}\nserv.reg.d.:${(new Date(message.guild.createdAt.getTime() + 3*60*60*1000)).toISOString().replace(/T(.*?)/, '').replace(/\..+/, '')}\nty zziger#8040`)});
	}
	
	if (command === 'time') {
		message.channel.send({embed: new Discord.RichEmbed().setTitle((new Date(new Date().getTime() + 3*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+' MSK')});
	}
});

titanxyz.login(process.env.HTOKEN);
