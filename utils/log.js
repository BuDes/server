const colors = require('./colors');

const log = {
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(colors.yellow, ...args, colors.reset),
  error: (...args) => console.error(colors.red, ...args, colors.reset),
  debug: (...args) => console.log(colors.cyan, ...args, colors.reset)
};

module.exports = log