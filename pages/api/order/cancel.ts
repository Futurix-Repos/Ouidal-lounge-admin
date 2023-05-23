import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../../db"
import {updateStock} from "@/helpers"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {reason, orderId} = req.body

    const session = await client.startSession()

    await session.withTransaction(async () => {
      try {
        const order = await client.db().collection("orders").findOne({
          id: orderId,
        })
        const barman = await client.db().collection("users").findOne({
          id: order?.barmanId,
        })

        if (!barman) {
          throw new Error("Barman lié à la commande non trouvé!")
        }
        await updateStock({items: order?.items, client, session, barman})

        await client
          .db()
          .collection("orders")
          .updateOne(
            {id: orderId},
            {
              $set: {
                status: "canceled",
                updatedAt: new Date(),
              },
            }
          )
      } catch (error) {
        throw error
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({msg: "Server Error"})
  }
}
