import {ObjectId} from "mongodb";
import type {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const zones = await client
      .db()
      .collection("zones")
      .find({
        id: {
          $ne: "null",
        },
      })
      .toArray();
    res.send(zones);
  } catch (error) {
    console.log(error);
    res.status(500).send({msg: "Server Error"});
  }
}
