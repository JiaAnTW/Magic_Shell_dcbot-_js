module.exports.help = async function help(message) {
    try {
        const msg = `?阿致回來: 讓精神活躍的阿致陪大家聊天\n?阿致嘴閉閉: 把精神活躍的阿致趕走\n?阿致活躍度: 設定阿致的活躍度(1 ~ 0.0001 or 0)`;
        message.reply(msg);
    } catch (e) {}
};
