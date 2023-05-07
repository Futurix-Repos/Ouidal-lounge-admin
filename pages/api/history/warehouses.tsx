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
    const {warehouseId, type, itemName, categoryId, date} = req.query
    let pipeline: any = []
    const matchFilter = {
      warehouseId,
      categoryId,
      type,
    }

    if (date) {
      const startDate = new Date(date as string)
      const endDate = new Date(startDate)
      endDate.setUTCDate(startDate.getUTCDate() + 1)
      endDate.setUTCHours(0, 0, 0, 0)
      endDate.setUTCMilliseconds(endDate.getUTCMilliseconds() - 1)
      matchFilter["createdAt"] = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    if (type === "transfert") {
      pipeline = [
        {
          $match: matchFilter,
        },
        {
          $lookup: {
            from: "stockProducts",
            localField: "productId",
            foreignField: "id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "warehouses",
            localField: "warehouseId",
            foreignField: "id",
            as: "warehouse",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "stands",
            localField: "standId",
            foreignField: "id",
            as: "stand",
          },
        },
        {
          $unwind: {
            path: "$stand",
          },
        },
        {
          $unwind: {
            path: "$category",
          },
        },
        {
          $unwind: {
            path: "$warehouse",
          },
        },
        {
          $unwind: {
            path: "$product",
          },
        },
      ]
    } else {
      pipeline = [
        {
          $match: matchFilter,
        },
        {
          $lookup: {
            from: "stockProducts",
            localField: "productId",
            foreignField: "id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "warehouses",
            localField: "warehouseId",
            foreignField: "id",
            as: "warehouse",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "id",
            as: "category",
          },
        },

        {
          $unwind: {
            path: "$category",
          },
        },
        {
          $unwind: {
            path: "$warehouse",
          },
        },
        {
          $unwind: {
            path: "$product",
          },
        },
      ]
    }

    let history = await client.db().collection("stockMovements").aggregate(pipeline).toArray()

    //Filter out products that matches the itemName with regex
    if (itemName) {
      const regex = new RegExp(itemName as string, "i")
      history = history.filter((item) => regex.test(item.product.name))
    }

    console.log(history)
    console.log(type)
    res.send(history)
  } catch (error: any) {
    console.error(error)
    res.status(500).send({msg: error.message})
  }
}
