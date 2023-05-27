import clientPromise from "@/db";

import type {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  NextApiRequest,
  NextApiResponse,
} from "next";

//increment stock
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const { standId, type, itemName, categoryId, date } = req.query;
    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);
    endDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCMilliseconds(endDate.getUTCMilliseconds() - 1);
    let pipeline: any = [];
    console.log({ endDate: new Date(endDate), startDate });
    if (date) {
      pipeline = [
        {
          $match: {
            standId,
            categoryId,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
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
            from: "stands",
            localField: "standId",
            foreignField: "id",
            as: "stand",
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
            path: "$stand",
          },
        },
        {
          $unwind: {
            path: "$product",
          },
        },
      ];
    } else {
      pipeline = [
        {
          $match: {
            standId,
            categoryId,
          },
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
            from: "stands",
            localField: "standId",
            foreignField: "id",
            as: "stand",
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
            path: "$stand",
          },
        },
        {
          $unwind: {
            path: "$product",
          },
        },
      ];
    }

    let history = await client
      .db()
      .collection("standMovements")
      .aggregate(pipeline)
      .toArray();

    //Filter out products that matches the itemName with regex
    if (itemName) {
      const regex = new RegExp(itemName as string, "i");
      history = history.filter((item) => regex.test(item.product.name));
    }
    if (type) {
      history = history.filter((item) => item.type === type);
    }
    //Filter out products that matches the date

    res.send(history);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ msg: error.message });
  }
}
