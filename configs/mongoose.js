const mongoose = require('mongoose');


mongoose.connect(`mongodb://localhost/node_auth`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connecting to mongo db'));

db.once('open', function(){
    console.log('Connected to MongoDB Database :: node_auth');
});

module.exports = db;