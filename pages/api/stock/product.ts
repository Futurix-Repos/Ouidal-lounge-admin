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

    const product = await client.db().collection("sellingProducts").findOne({
      name: name.toLowerCase(),
    })

    if (product) {
      return res.status(400).send({
        msg: "Produit déjà existant!",
      })
    }
    const session = await client.startSession()

    await session.withTransaction(async () => {
      try {
        const productId = new ObjectId()
        const stock = Number(quantity) - Number(parStock) * stands.length
        await client
          .db()
          .collection("stockProducts")
          .insertOne(
            {
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
            },
            {session}
          )

        for (const standId of stands) {
          const _id = new ObjectId()
          await client
            .db()
            .collection("sellingProducts")
            .insertOne({
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
              special: false, // Attribute for product who are not connected to the stock
            })
          if (sellingPerUnit) {
            const _id = new ObjectId()
            await client
              .db()
              .collection("sellingProducts")
              .insertOne({
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

          // Add the added products to the history
          await client
            .db()
            .collection("standMovements")
            .insertOne(
              {
                productId: productId.toString(),
                qty: Number(parStock),
                standId,
                categoryId,
                type: "reception",
                day: `${new Date().getDate()}`,
                month: `${new Date().getMonth()}`,
                year: `${new Date().getFullYear()}`,
                hour: `${new Date().getHours()}`,
                minute: `${new Date().getMinutes()}`,
                createdAt: new Date(),
              },
              {session}
            )
        }

        // Add the added products to the history
        await client
          .db()
          .collection("stockMovements")
          .insertOne(
            {
              productId: productId.toString(),
              qty: stock,
              warehouseId,
              categoryId,
              type: "increment",
              day: `${new Date().getDate()}`,
              month: `${new Date().getMonth()}`,
              year: `${new Date().getFullYear()}`,
              hour: `${new Date().getHours()}`,
              minute: `${new Date().getMinutes()}`,
              createdAt: new Date(),
            },
            {session}
          )
      } catch (error: any) {
        throw error
      }
    })

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
