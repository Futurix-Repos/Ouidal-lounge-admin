import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../../db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {id, tableId} = req.query
    if (id) {
      const pipeline = [
        {
          $match: {
            id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "id",
            as: "client",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "barmanId",
            foreignField: "id",
            as: "employee",
          },
        },

        {
          $lookup: {from: "zones", localField: "zoneId", foreignField: "id", as: "zone"},
        },
        {
          $lookup: {from: "tables", localField: "tableId", foreignField: "id", as: "table"},
        },
      ]
      let order = await client
        .db()
        .collection("orders")
        .aggregate(pipeline)
        .project({
          _id: 0,
          zoneId: 0,
          tableId: 0,
          clientId: 0,
          barmanId: 0,
        })
        .sort({updatedAt: -1})
        .toArray()
      order = order.map((order) => ({
        ...order,
        client: order.client[0],
        employee: order.employee[0],
        zone: order.zone[0],
        table: order.table[0],
      }))

      res.send(order[0])
    } else {
      res.send({})
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({msg: "Server Error"})
  }
}
