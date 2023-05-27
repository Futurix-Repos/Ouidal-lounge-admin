import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../db";
import { updateStock } from "@/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const { reason, orderId } = req.body;

    const session = await client.startSession();

    await session.withTransaction(async () => {
      try {
        const order = await client.db().collection("orders").findOne({
          id: orderId,
        });

        await updateStock({ items: order?.items, client, session });

        await client
          .db()
          .collection("orders")
          .updateOne(
            { id: orderId },
            {
              $set: {
                status: "canceled",
                reason,
                updatedAt: new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
              },
            }
          );
      } catch (error) {
        throw error;
      }
    });

    res.send({ msg: "Order Canceled" });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
}
