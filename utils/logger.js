const morgan = require('morgan');
const colors = require("./colors")

// Custom method color map (mimicking Morgan’s defaults)
const methodColor = {
  GET: colors.green,
  POST: colors.yellow,
  PUT: colors.green,
  DELETE: colors.red,
  PATCH: colors.magenta,
  OPTIONS: colors.grey,
  HEAD: colors.grey
};

// Token for colored method
morgan.token('colored-method', (req) => {
  const color = methodColor[req.method] || colors.reset;
  return `${color}${req.method}${colors.grey}`; // revert back to grey after method
});

// Custom status with color (optional enhancement)
morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return `${colors.red}${status}${colors.grey}`;
  if (status >= 400) return `${colors.yellow}${status}${colors.grey}`;
  if (status >= 300) return `${colors.cyan}${status}${colors.grey}`;
  return `\x1b[32m${status}${colors.grey}`;
});

// Entire line wrapped in grey, except colored tokens
const logger =  morgan((tokens, req, res) => {
  return colors.grey + [
    `[${new Date().toISOString()}]`,
    tokens['colored-method'](req, res),
    tokens.url(req, res),
    tokens['colored-status'](req, res),
    '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ') + colors.reset;
})

module.exports = logger