import clientPromise from "@/db"
import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {startDate, endDate} = req.query
    const client = await clientPromise
    const tickets = await client.db().collection("tickets").find().toArray()
    res.send(tickets)
  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
}
