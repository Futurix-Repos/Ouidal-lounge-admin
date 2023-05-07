import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "@/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {id} = req.query

    const client = await clientPromise
    const zone = await client.db().collection("zones").findOne({id})
    res.send(zone)
  }
  if (req.method === "POST") {
    try {
      const client = await clientPromise
      const _id = new ObjectId()

      const exist = await client.db().collection("zones").findOne({name: req.body.name})
      if (exist) {
        return res.status(400).send({msg: "Zone déjà existante !"})
      }

      const zone = await client.db().collection("zones").insertOne({
        _id,
        id: _id.toString(),
        name: req.body.name,
      })

      res.send(zone)
    } catch (error) {
      console.log(error)
      res.status(500).send({msg: "Server Error"})
    }
  }

  if (req.method === "DELETE") {
    try {
      const {id} = req.query

      const client = await clientPromise
      const session = client.startSession()
      await session.withTransaction(
        async () => {
          try {
            await client.db().collection("zones").deleteOne({id}, {session})
            await client.db().collection("tables").deleteMany({zoneId: id})
          } catch (error: any) {
            console.log({error})
            throw new error()
          }
        },
        {
          readPreference: "primary",
          readConcern: {level: "local"},
          writeConcern: {w: "majority"},
        }
      )
      res.send({msg: "Table deleted successfully"})
    } catch (error) {
      console.log(error)
      res.status(500).send({msg: "Server Error"})
    }
  }
}
