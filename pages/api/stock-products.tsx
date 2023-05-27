import clientPromise from "@/db"
import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const { warehouseId, categoryId, productName } = req.query;
    const products = await client
      .db()
      .collection("stockProducts")
      .find({
        warehouseId: {
          $regex: warehouseId ? warehouseId : ".*",
          $options: "i",
        },
        categoryId: {
          $regex: categoryId ? categoryId : ".*",
          $options: "i",
        },
        name: {
          $regex: productName ? productName : ".*",
          $options: "i",
        },
      })
      .toArray();

    res.send(products);
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
