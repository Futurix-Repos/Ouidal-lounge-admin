import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //@ts-ignore
  const {
    status,
    date,
    paymentMethod,
    startDate: startDateFromQuery,
    endDate: endDateFromQuery,
  } = req.query

  const matchFilter = {
    status,
  }
  if (paymentMethod) {
    matchFilter["paymentMethod"] = paymentMethod
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
  const client = await clientPromise
  let orders = await client
    .db()
    .collection("orders")
    .aggregate([
      {
        $match: matchFilter,
      },
    ])
    .toArray()
  res.send(orders)
}
