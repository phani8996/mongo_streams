'use strict'

const {MongoClient} = require('mongodb');
const Emitter = require('eventemitter3');
const Stream = require('./stream');

const MONGO_URL = 'mongodb://localhost:27017/local';
const eventEmitter = new Emitter();
const operations = {
    'c': 'create',
    'i': 'insert',
    'u': 'update',
    'd': 'delete'
};

let client, stream;

async function connect(url, options = {}) {
    return await MongoClient.connect(url, options)
}

async function startStreaming(url = MONGO_URL, options = {}, dbName = 'local', collectionName = 'oplog.rs') {
    client = await connect(url, options);
    stream = await Stream({client, dbName, collectionName});
    stream.on('data', onData);
    stream.on('error', onError);
    stream.on('end', onEnd);
    return stream;
}

function onData(doc) {
    const op = doc.op;
    if(op && operations[op]){
        eventEmitter.emit(operations[op], doc);
    }else{
        console.log('Got an invalid operation: ', op, doc);
    }
}

function onError(error) {
    console.log('oplog error %j', error);
    eventEmitter.emit('error', error);
}

function onEnd() {
    console.log('Streaming ended');
    eventEmitter.emit('end');
}

function stop() {
    if(stream){
        stream.destroy();
    }
}

module.exports = {
    'startStreaming': startStreaming,
    'streamEvents': eventEmitter
};