import clientPromise from "@/db"
import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const categories = await client.db().collection("categories").find().toArray()
    res.send(categories)
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
