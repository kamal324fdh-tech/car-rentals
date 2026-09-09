const serverless = require('serverless-http');
const app = require('../../server'); // Path to your Express server file

module.exports.handler = serverless(app);