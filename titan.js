const Discord = require("discord.js");
const titanxyz = new Discord.Client();
const prefix = '.';

function clear (channel) {
    channel.bulkDelete(98).then(messages => {
        if (messages.size === 98) {
            clear(channel);
        }
    })
}

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

titanxyz.on('ready', async () => {
    titanxyz.user.setPresence({ game: { name: `onysa.ru`, type: 3 } }).catch();
})

titanxyz.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

    if (command === 'clear') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('Ошибка');
        if (!args[0]) return message.reply('Ошибка');
        message.channel.bulkDelete(parseInt(args[0], 10)+1).then(messages => {
            message.channel.send(`Удалил ${messages.size} сообщений!`).then((msg) => {msg.delete(3000);});
        });
    }
});

titanxyz.login(process.env.HTOKEN);