const Discord = require("discord.js");
const titanxyz = new Discord.Client();
const prefix = '.';

function clear (channel) {
    channel.bulkDelete(98).then(messages => {
        if (messages.size === 98) {
            clear(channel);
        } else {
            channel.send(`Удалил все сообщения!`).then((msg) => {msg.delete(3000);});
        }
    })
}

function clear_count (channel, count, count_all = 0) {
    if (count > 100) {
        count_all = count_all + 100;
        channel.bulkDelete(100).then(() => {clear(channel, count-100, count_all)});
    } else {
        channel.bulkDelete(count).then(() => {            
            count_all = count_all + count;
            channel.send(`Удалил ${count_all} сообщений!`).then((msg) => {msg.delete(3000);});
        });
    }
}

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

titanxyz.on('ready', async () => {
    titanxyz.user.setPresence({ game: { name: `onysa.ru`, type: 0 } }).catch();
})

titanxyz.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

    if (command === 'servers') {
        const embed = new Discord.RichEmbed()
            .setDescription(`Servers ${titanxyz.guilds.size}`);
        message.channel.send({embed: embed});
    }
    
	if (command === 'ping') {
    message.reply('Pong!');
	}
	
    if (command === 'clear') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('Ошибка');
        if (!args[0]) return message.reply('Ошибка');
        clear_count(message.channel, parseInt(args[0])+1);
    }
    
    if (command === 'clear_all') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('Ошибка');
        clear(message.channel);
    }
});

titanxyz.login(process.env.HTOKEN);
