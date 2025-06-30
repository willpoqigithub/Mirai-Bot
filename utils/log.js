const chalk = require("chalk");
function randomColor() {
  var _0x12f4e2 = '';
  for (var _0x50695d = 0; _0x50695d < 3; _0x50695d++) {
    var _0x4a1ebb = Math.floor(Math.random() * 256).toString(16);
    _0x12f4e2 += _0x4a1ebb.length == 1 ? '0' + _0x4a1ebb : _0x4a1ebb;
  }
  return '#' + _0x12f4e2;
}
;
module.exports = (_0x44107f, _0x509531) => {
  switch (_0x509531) {
    case "warn":
      console.log(chalk.bold.hex("#ff0000").bold("» Log « ") + _0x44107f);
      break;
    case "error":
      console.log(chalk.bold.hex("#ff0000").bold("» Log « ") + _0x44107f);
      break;
    default:
      console.log(chalk.bold.hex(randomColor()).bold(_0x509531 + " » ") + _0x44107f);
      break;
  }
};
module.exports.loader = (_0x4705f2, _0x10a189) => {
  switch (_0x10a189) {
    case "warn":
      console.log(chalk.bold.hex(randomColor()).bold(" MIRAI ERROR•—»✨ ") + chalk.bold.hex("#8B8878").bold(_0x4705f2) + chalk.bold.hex("FF00DD")(''));
      break;
    case "error":
      console.log(chalk.bold.hex(randomColor()).bold(" MIRAI ERROR•—»✨ ") + _0x4705f2 + chalk.bold.hex("5EFF00")(''));
      break;
    default:
      console.log(chalk.bold.hex(randomColor()).bold("MIRAI•—»✨ ") + chalk.bold.hex(randomColor()).bold(_0x4705f2) + chalk.bold.hex("FFF0000")(''));
      break;
  }
};
