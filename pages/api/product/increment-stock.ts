import clientPromise from "@/db"
import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next"

//increment stock
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {productId, qty, warehouseId, categoryId} = req.body
    console.log({body: req.body})
    await client
      .db()
      .collection("stockProducts")
      .updateOne(
        {id: productId},
        {
          $inc: {stock: Number(qty)},
        }
      )
    await client
      .db()
      .collection("stockMovements")
      .insertOne({
        productId,
        qty,
        warehouseId,
        categoryId,
        type: "increment",
        day: `${new Date().getDate()}`,
        month: `${new Date().getMonth()}`,
        year: `${new Date().getFullYear()}`,
        hour: `${new Date().getHours()}`,
        minute: `${new Date().getMinutes()}`,
        createdAt: new Date(),
      })

    res.send({msg: "ok"})
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
