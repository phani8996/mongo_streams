'use strict'

const Timestamp = require('mongodb').Timestamp;


module.exports = async({client, dbName, collectionName}) => {
    // console.log(client, collectionName);
    if(!collectionName){
        collectionName = 'oplog.rs';
    }
    const dt = new Date(2018, 7, 1);
    const timestamp = new Timestamp(0, dt.getTime()/ 1000);
    const db = client.db(dbName);
    const coll = db.collection(collectionName);
    const query = {
        ts: {$gte: timestamp}
    };
    const options ={
        tailable: true,
        awaitData: true,
        oplogReplay: true,
        noCursorTimeout: true,
        numberOfRetries: 10
    };
    return (await coll.find(query, options)).stream()
};
