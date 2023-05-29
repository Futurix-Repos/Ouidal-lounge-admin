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
    const { id, special } = req.query;
    if (!id) {
      return res.status(400).send({ msg: "Missing ID" });
    }

    if (special) {
      await client.db().collection("sellingProducts").deleteOne({ id });
    } else {
      const session = client.startSession();

      await session.withTransaction(async () => {
        try {
          await client.db().collection("stockProducts").deleteOne(
            {
              id,
            },
            { session }
          );

          await client.db().collection("sellingProducts").deleteMany(
            {
              productId: id,
            },
            { session }
          );
        } catch (error) {
          throw error;
        }
      });
    }

    res.send({ msg: "ok" });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ msg: error.message });
  }
}
