// Nextjs handler
import clientPromise from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const { productId, qty, standId, reason, keep } = req.body;
    const session = client.startSession();

    await session.withTransaction(async () => {
      try {
        const sellingProduct = await client
          .db()
          .collection("sellingProducts")
          .findOne({
            productId,
            standId,
            deStock: true,
          });
        const stockProduct = await client
          .db()
          .collection("stockProducts")
          .findOne({
            id: productId,
          });
        const standProduct = await client
          .db()
          .collection("sellingProducts")
          .findOne({
            productId,
          });
        if (sellingProduct?.stock < Number(qty) * sellingProduct?.contenance) {
          throw new Error("Stock insuffisant");
        }
        if (keep) {
          await client
            .db()
            .collection("stockProducts")
            .updateOne(
              {
                id: productId,
              },
              {
                $inc: {
                  stock: Number(qty),
                },
              },
              {
                session,
              }
            );
        }

        await client
          .db()
          .collection("sellingProducts")
          .updateOne(
            {
              productId,
              standId,
              deStock: true,
            },
            {
              $inc: {
                stock: -(Number(qty) * sellingProduct?.contenance),
              },
            },
            {
              session,
            }
          );
        await client
          .db()
          .collection("stockMovements")
          .insertOne({
            warehouseId: stockProduct?.warehouseId,
            productId,
            qty,
            standId: standProduct?.standId,
            categoryId: standProduct?.categoryId,
            type: "return",
            keep,
            reason,
            day: `${new Date().getDate()}`,
            month: `${new Date().getMonth()}`,
            year: `${new Date().getFullYear()}`,
            hour: `${new Date().getHours()}`,
            minute: `${new Date().getMinutes()}`,
            createdAt: new Date(),
          });
        await client
          .db()
          .collection("standMovements")
          .insertOne(
            {
              productId,
              qty,
              standId: standProduct?.standId,
              categoryId: standProduct?.categoryId,
              type: "decrement",
              keep,
              reason,
              day: `${new Date().getDate()}`,
              month: `${new Date().getMonth()}`,
              year: `${new Date().getFullYear()}`,
              hour: `${new Date().getHours()}`,
              minute: `${new Date().getMinutes()}`,
              createdAt: new Date(),
            },
            { session }
          );
      } catch (error: any) {
        throw error;
      }
    });
    res.send({
      msg: "ok",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      msg: error.message,
    });
  }
}
