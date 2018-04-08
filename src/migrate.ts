import { MongoClient } from 'mongodb';
import {environment} from './environment/environment';
import * as firebase from 'firebase';

// Connection URL
//export { test, migrate };

migrate();

function test() {
    const url = environment.mongodbCredentials.databaseURL;
    console.log(`mongodb url ${url}.`);
    const dbName = environment.mongodbCredentials.databaseName;

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        db.collection("models").find({}).toArray((err, docs) => {
            console.log(`found ${docs.length} documents. first one is ${JSON.stringify(docs[0])}.`);
        });
        client.close();
    });
}

function createMongodbContents = (db, data, client) => {
    collection.insertOne(data, (err, res)=> {
        if (err) console.log(`error inserting an object: ${err}.`);
        else console.log(`result of insertion of the object: ${JSON.stringify(res)}`);
        if (client)
            client.close();
    });
};

function migrate() {
    // first read in the database from firebase
    const fbApp = firebase.initializeApp(environment.firebaseCredentials);
    const defaultDatabase = fbApp.database();
    const db = defaultDatabase.ref('/');
    db.once('value').then((dbInst: any) => {
        const contents = dbInst.val();
        console.log(`this is the db: ${contents}.`);
        const mongodbURL = environment.mongodbCredentials.databaseURL;
        console.log(`mongodb url ${mongodbURL}.`);
        const mongoDbName = environment.mongodbCredentials.databaseName;

        // Use connect method to connect to the server
        MongoClient.connect(mongodbURL, function (err, client) {
            if (err) {
                console.log(`error [${err}].`);
                return;
            }
            console.log(`Connected successfully to mongodb server ${mongodbURL}: ${mongoDbName}.`);

            const db = client.db(mongoDbName);
            let root = db.collection('root');
            if (! root) {
                db.createCollection('root', (err, collection) => {
                    if (!err)
                        root = collection;
                    createMongodbContents(root, contents, client);
                });
            } else {
                createMongodbContents(root, contents, client);
            }
            });
    });
}

function getModelNames(callback):any {
   
}
function test() {
    // get the modelnames or modelnames_
}
