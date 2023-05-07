import clientPromise from "@/db"
import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      productId,
      name,
      buyingPrice,
      sellingPrice,
      sellingPerUnitQty,
      sellingPerUnitPrice,
      margin,
    } = req.body
    console.log(req.body)
    const client = await clientPromise
    const stockProduct = await client.db().collection("stockProducts").findOne({id: productId})

    const standProduct = await client
      .db()
      .collection("sellingProducts")
      .findOne({productId, deStock: true})
    if (!standProduct || !stockProduct) {
      return res.status(404).send({msg: "not found"})
    }
    await client
      .db()
      .collection("stockProducts")
      .updateOne(
        {id: productId},
        {
          $set: {
            name,
            buyingPrice,
            sellingPrice,
            margin,
            sellingPerUnit: {
              ...stockProduct.sellingPerUnit,
              price: sellingPerUnitPrice,
              qty: sellingPerUnitQty,
            },
          },
        }
      )

    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          productId,
          deStock: true,
        },
        {
          $set: {
            name,
            price: sellingPrice,
            sellingPerUnit: {
              ...standProduct.sellingPerUnit,
              price: sellingPerUnitPrice,
              qty: sellingPerUnitQty,
            },
          },
        }
      )

    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          productId,
          deStock: false,
        },
        {
          $set: {
            name: name + "-conso",
            price: sellingPerUnitPrice,
            sellingPerUnit: {
              price: sellingPerUnitPrice,
              qty: sellingPerUnitQty,
            },
          },
        }
      )

    res.send({msg: "ok"})
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
