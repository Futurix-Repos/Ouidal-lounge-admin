// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "@/db"
import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise
      const {name, standId} = req.body
      const _id = new ObjectId()

      const category = await client
        .db()
        .collection("categories")
        .findOne({name: name.toLowerCase(), standId})

      if (category) {
        return res.status(400).send({msg: "Catégorie déjà existante!"})
      }

      await client.db().collection("categories").insertOne({
        _id,
        id: _id.toString(),
        name: name.toLowerCase(),
        standId,
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
      const {categoryId, name} = req.body
      const _id = new ObjectId()

      const category = await client
        .db()
        .collection("categories")
        .findOne({name: name.toLowerCase()})

      if (category) {
        return res.status(400).send({msg: "Catégorie déjà existante!"})
      }

      await client
        .db()
        .collection("categories")
        .updateOne(
          {
            id: categoryId,
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
