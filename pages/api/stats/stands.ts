import clientPromise from "@/db"
import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {
      date,
      startDate: startDateFromQuery,
      endDate: endDateFromQuery,
      stand,
      productName,
    } = req.query
    const matchFilter = {}
    console.log({stand})
    if (stand) {
      matchFilter["stand"] = stand
    }
    if (date) {
      const startDate = new Date(date as string)
      const endDate = new Date(startDate)
      endDate.setUTCDate(startDate.getUTCDate() + 1)
      endDate.setUTCHours(0, 0, 0, 0)
      endDate.setUTCMilliseconds(endDate.getUTCMilliseconds() - 1)
      matchFilter["timeStamp"] = {
        $gte: startDate,
        $lte: endDate,
      }
    }
    if (startDateFromQuery && endDateFromQuery) {
      const startDate = new Date(startDateFromQuery as string)
      const endDate = new Date(endDateFromQuery as string)
      matchFilter["timeStamp"] = {
        $gte: startDate,
        $lte: endDate,
      }
    }
    const orders = await client
      .db()
      .collection("orders")
      .aggregate([
        {
          $match: matchFilter,
        },
      ])
      .toArray()
    let items = orders.map((order) => {
      for (const item of order.items) return item
    })

    const map: any = {}
    for (const item of items) {
      if (map[item.name]) {
        map[item.name] = map[item.name] + item.qty
      } else {
        map[item.name] = item.qty
      }
    }
    const ordered: any = {}
    Object.keys(map)
      .sort()
      .forEach((key) => (ordered[key] = map[key]))
    let products: any = []

    for (const item in ordered) {
      products.push({name: item, qty: ordered[item]})
    }
    if (productName) {
      const regex = new RegExp(productName as string, "i")
      products = products.filter((product: any) => regex.test(product.name))
    }
    res.send(products)
  } catch (error: any) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
