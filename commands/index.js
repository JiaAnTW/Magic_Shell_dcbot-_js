const { join, leave, setTriggerPosibility, random } = require('./io.js');
const { help } = require('./help.js');

module.exports.commands = {
    /*'?阿致回來': join,
    '?阿致嘴閉閉': leave,
    '?阿致活躍度': setTriggerPosibility,*/
    '!chi能幹嘛': help,
    '!chi抽籤': random,
};
