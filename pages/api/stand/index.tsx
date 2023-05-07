// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "@/db"
import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise
      const {name} = req.body
      const _id = new ObjectId()

      const stand = await client.db().collection("stands").findOne({name: name.toLowerCase()})

      if (stand) {
        return res.status(400).send({msg: "Stand déjà existante!"})
      }

      await client.db().collection("stands").insertOne({
        _id,
        id: _id.toString(),
        name: name.toLowerCase(),
      })

      res.send({msg: "ok"})
    } catch (error: any) {
      console.error(error)
      res.status(500).send({msg: error.message})
    }
  }

  if (req.method === "PUT") {
    try {
      const client = await clientPromise
      const {standId, name} = req.body

      const stand = await client.db().collection("stands").findOne({name: name.toLowerCase()})

      if (stand) {
        return res.status(400).send({msg: "Stand déjà existante!"})
      }

      await client
        .db()
        .collection("stands")
        .updateOne(
          {
            id: standId,
          },
          {
            $set: {
              name: name.toLowerCase(),
            },
          }
        )

      res.send({msg: "ok"})
    } catch (error: any) {
      console.error(error)
      res.status(500).send({msg: error.message})
    }
  }
}
