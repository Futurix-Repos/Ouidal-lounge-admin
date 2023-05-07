// Nextjs handler
import {ObjectId} from "mongodb"
import clientPromise from "@/db"
import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {
      name, //productName
      categoryId, // categoryId
      cookingPlace, // cookingPlace
      buyingPrice,
      sellingPrice,
      margin,
      stands, // point of sales
    } = req.body
    console.log(req.body)
    if (!name || !categoryId || !cookingPlace || !buyingPrice || !sellingPrice || !stands) {
      return res.status(400).send({
        msg: "Bad request",
      })
    }

    const db = client.db()
    //Check if product already exists
    const product = await client.db().collection("sellingProducts").findOne({
      name: name.toLowerCase(),
    })

    if (product) {
      return res.status(400).send({
        msg: "Produit déjà existant!",
      })
    }

    for (const standId of stands) {
      const productId = new ObjectId()
      await db.collection("sellingProducts").insertOne({
        _id: productId,
        id: productId.toString(),
        standId,
        categoryId,
        name: name.toLowerCase(),
        price: sellingPrice,
        deStock: false,
        special: true,
        cookingPlace,
        buyingPrice,
        margin,
      })
    }

    res.send({
      msg: "Product added successfully",
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).send({
      msg: error.message,
    })
  }
}
