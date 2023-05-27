import clientPromise from "@/db"
import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      startDate: startDateFromQuery,
      endDate: endDateFromQuery,
      date,
      stand,
    } = req.query;

    const client = await clientPromise;
    const matchFilter = {};
    if (stand) {
      matchFilter["stand"] = stand;
    }
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 1);
      endDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCMilliseconds(endDate.getUTCMilliseconds() - 1);
      matchFilter["timeStamp"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (startDateFromQuery && endDateFromQuery) {
      const startDate = new Date(startDateFromQuery as string);
      const endDate = new Date(endDateFromQuery as string);
      matchFilter["timeStamp"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    const pipeline = [
      {
        $match: matchFilter,
      },
      {
        $sort: {
          timeStamp: -1,
        },
      },
    ];
    const tickets = await client
      .db()
      .collection("tickets")
      .aggregate(pipeline)
      .toArray();
    res.send(tickets);
  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
}
