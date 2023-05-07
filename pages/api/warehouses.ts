import clientPromise from "@/db"
import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const warehouses = await client.db().collection("warehouses").find().toArray()

    res.send(warehouses)
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
