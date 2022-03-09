import {MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';
import config from '../config.js'
dotenv.config()

const client = new MongoClient(process.env.connectionString);

export const initializeDbConnection = async () =>{
    await client.connect();
}

export default client.db(config.dbName)