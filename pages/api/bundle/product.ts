// Nextjs handler
import { ObjectId } from "mongodb";
import clientPromise from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const {
        name, //productName
        categoryId, // categoryId
        cookingPlace, // cookingPlace
        buyingPrice,
        sellingPrice,
        margin,
        stands, // point of sales
        ingredients,
      } = req.body;

      if (
        !name ||
        !categoryId ||
        !cookingPlace ||
        !buyingPrice ||
        !sellingPrice ||
        !stands ||
        !ingredients
      ) {
        return res.status(400).send({
          msg: "Bad request",
        });
      }

      const db = client.db();
      //Check if product already exists
      const product = await client.db().collection("sellingProducts").findOne({
        name: name.toLowerCase(),
      });

      if (product) {
        return res.status(400).send({
          msg: "Produit déjà existant!",
        });
      }

      for (const standId of stands) {
        const productId = new ObjectId();
        await db.collection("sellingProducts").insertOne({
          _id: productId,
          id: productId.toString(),
          standId,
          categoryId,
          name: name.toLowerCase(),
          price: Number(sellingPrice),
          deStock: false,
          special: false,
          bundle: true,
          cookingPlace,
          buyingPrice,
          margin,
          ingredients,
        });
      }

      res.send({
        msg: "Product added successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).send({
        msg: error.message,
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const { ingredients, name, price, productId } = req.body;
      console.log(req.body);
      const payload = {
        ...(ingredients && { ingredients }),
        ...(name && { name }),
        ...(price && { price }),
      };
      const client = await clientPromise;
      await client.db().collection("sellingProducts").updateOne(
        {
          id: productId,
        },
        {
          $set: payload,
        }
      );

      res.send({ msg: "Updated!" });
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ msg: "Serveur Error" });
    }
  }
}
