
const { connect, connection } = require('mongoose');

const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thoughtDB';

connect(connectionString);

// // Use this to log mongo queries being executed!
// mongoose.set('debug', true);

module.exports = connection;