//@ts-nocheck
import {MongoClient} from "mongodb"
;("use strict")

const uri = String("mongodb://admin:admin@127.0.0.1:27017/ouidah-lounge-beta?authSource=admin")
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  retryWrites: true,
}
let client: MongoClient, clientPromise: MongoClient

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }

  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
