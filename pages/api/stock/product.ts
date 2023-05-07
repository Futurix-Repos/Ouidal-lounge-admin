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
      warehouseId, // warehouseId
      cookingPlace, // cookingPlace
      buyingPrice,
      sellingPrice,
      quantity, // stock
      margin,
      parStock, //minimal quantity to send to point of sale
      contenance, // contenance of the product in unit
      stands, // point of sales
      unit, // unité de mesure
      sellingPerUnit, //boolean
      sellingPerUnitPrice,
      sellingPerUnitQty,
    } = req.body

    const db = client.db()

    const product = await client.db().collection("sellinProducts").findOne({
      name: name.toLowerCase(),
    })

    if (product) {
      return res.status(400).send({
        msg: "Produit déjà existant!",
      })
    }
    const productId = new ObjectId()
    const stock = Number(quantity) - Number(parStock) * stands.length
    await db.collection("stockProducts").insertOne({
      _id: productId,
      id: productId.toString(),
      name: name.toLowerCase(),
      categoryId,
      warehouseId,
      cookingPlace,
      buyingPrice,
      sellingPrice,
      margin,
      stock,
      contenance: contenance ? contenance : 1,
      sellingPerUnit: {
        isTrue: sellingPerUnit,
        price: sellingPerUnitPrice,
        qty: sellingPerUnitQty,
        unit,
      },
      parStock,
      stands,
    })

    for (const standId of stands) {
      const _id = new ObjectId()
      await db.collection("sellingProducts").insertOne({
        _id,
        id: _id.toString(),
        standId,
        categoryId,
        productId: productId.toString(),
        name: name.toLowerCase(),
        cookingPlace,
        contenance: contenance ? contenance : 1,
        stock: contenance ? Number(parStock) * Number(contenance) : parStock, // Quantity to reduce after each sale
        price: sellingPrice,
        deStock: true, // Product to destock
        sellingPerUnit: {
          isTrue: sellingPerUnit,
          price: sellingPerUnitPrice,
          qty: sellingPerUnitQty,
          unit,
        },
        special: false,
      })
      if (sellingPerUnit) {
        const _id = new ObjectId()
        await db.collection("sellingProducts").insertOne({
          _id,
          id: _id.toString(),
          standId,
          categoryId,
          productId: productId.toString(),
          name: name.toLowerCase() + "-conso",
          contenance: contenance ? contenance : 1,
          cookingPlace,
          price: sellingPerUnitPrice,
          deStock: false,
          sellingPerUnit: {
            isTrue: sellingPerUnit,
            price: sellingPerUnitPrice,
            qty: sellingPerUnitQty,
            unit,
          },
          special: false,
        })
      }
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
