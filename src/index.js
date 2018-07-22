const {startStreaming, streamEvents} = require('./client');

const url = 'mongodb://localhost:27017/local?replSet=rs0';
const stream = startStreaming(url);
streamEvents.on('insert', (doc) => console.log('***********', doc));
// stream.on('data', function (doc) {
//     console.log(doc);
// });