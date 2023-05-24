import clientPromise from "@/db"
import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise
      const {username, password, role, stand} = req.body
      const _id = new ObjectId()
      console.log(req.body)
      const user = await client.db().collection("users").findOne({username: username.toLowerCase()})
      if (user) {
        return res.status(400).send({msg: "Utilisateur déjà existant!"})
      }
      const standInfos = await client.db().collection("stands").findOne({id: stand})

      await client.db().collection("users").insertOne({
        _id,
        id: _id.toString(),
        username: username.toLowerCase(),
        password: password.toLowerCase(),
        role: role.toLowerCase(),
        standId: stand.toLowerCase(),
        stand: standInfos?.name.toLowerCase(),
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
      const {username, password, role, stand, memberId} = req.body

      if (!memberId) {
        return res.status(400).send({msg: "Id de l'utilisateur manquant!"})
      }

      const standInfos = await client.db().collection("stands").findOne({id: stand})
      const member = await client.db().collection("users").findOne({id: memberId})

      if (!member) {
        return res.status(400).send({msg: "Utilisateur inexistant!"})
      }

      await client
        .db()
        .collection("users")
        .updateOne(
          {
            id: memberId,
          },
          {
            $set: {
              username: username ? username.toLowerCase() : member.username,
              password: password ? password.toLowerCase() : member.password,
              role: role ? role.toLowerCase() : member.role,
              standId: stand ? stand.toLowerCase() : member.standId,
              stand: role === "barman" ? standInfos?.name.toLowerCase() : "",
            },
          }
        )

      res.send({msg: "ok"})
    } catch (error: any) {
      console.error(error)
      res.status(500).send({msg: error.message})
    }
  }

  if (req.method === "DELETE") {
    const id = req.query.id
    try {
      const client = await clientPromise
      await client.db().collection("users").deleteOne({id})
      res.send({msg: "ok"})
    } catch (error: any) {
      console.log(error)
      res.status(500).send({msg: error.message})
    }
  }
}
