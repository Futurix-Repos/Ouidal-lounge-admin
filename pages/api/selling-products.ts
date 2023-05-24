import clientPromise from "@/db"
import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {categoryId, name, standId} = req.query
    let products = await client
      .db()
      .collection("sellingProducts")
      .find({
        categoryId: {
          $regex: categoryId ? categoryId : ".*",
          $options: "i",
        },
        name: {
          $regex: name ? name : ".*",
          $options: "i",
        },
        standId: {
          $regex: standId ? standId : ".*",
          $options: "i",
        },
        $or: [{deStock: true}, {special: true}],
      })
      .toArray()
      console.log(req.query)
    const map = new Map()
    products.forEach((product) => {
      if (!map.has(product.name)) {
        map.set(product.name, product)
      } else {
        map.set(product.name, {...product, name: product.name + " Conso"})
      }
    })

    products = Array.from(map.values())
    res.send(products)
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
