import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "@/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {name, zoneId} = req.body
    try {
      const client = await clientPromise
      const _id = new ObjectId()

      const table = await client.db().collection("tables").findOne({
        name,
        zoneId,
      })
      if (table) {
        return res.status(400).send({msg: "Table already exists"})
      }

      const response = await client.db().collection("tables").insertOne({
        _id,
        id: _id.toString(),
        zoneId,
        name,
      })
      res.send(response)
    } catch (error) {
      console.log(error)
      res.status(500).send({msg: "Server Error"})
    }
  }

  if (req.method === "DELETE") {
    try {
      const {id} = req.query

      const client = await clientPromise
      const result = await client.db().collection("tables").deleteOne({id})
      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(500).send({msg: "Server Error"})
    }
  }
}
