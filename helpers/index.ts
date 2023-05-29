import axios from "axios";

export const fetcher = async (url: string) => {
  const res = await axios.post(url);
  return res.data;
};

const updateStockForBundleProduct = async ({
  ingredients,
  standId,
  session,
  client,
  quantity,
}) => {
  for (const ingredient of ingredients) {
    const product = await client.db().collection("sellingProducts").findOne({
      productId: ingredient.id,
      standId,
      deStock: true,
    });

    if (!product) {
      throw new Error(`${ingredient.name} n'existe pas dans l'entrepôt`);
    }
    const totalToRestock = ingredient.qty * quantity;

    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          id: product.id,
        },
        {
          $inc: {
            stock: totalToRestock,
          },
        },
        { session }
      );
  }
};

export const updateStock = async ({
  client,
  items,
  session,
}: {
  client: any;
  items: any[];
  session: any;
}) => {
  for (const item of items) {
    if (item.special) continue;

    const product = await client.db().collection("sellingProducts").findOne(
      {
        productId: item.productId,
        deStock: true,
      },
      { session }
    );

    if (!product) {
      throw new Error(`${item.name} n'existe pas dans l'entrepôt`);
    }

    if (product.bundle) {
      await updateStockForBundleProduct({
        ingredients: item.ingredients,
        standId: item.standId,
        session,
        client,
        quantity: item.qty,
      });
    } else {
      let totalToRestock = item.deStock
        ? item.qty * item.contenance
        : item.qty * item.sellingPerUnit.qty;

      await client
        .db()
        .collection("sellingProducts")
        .updateOne(
          {
            id: product.id,
          },
          {
            $inc: {
              stock: totalToRestock,
            },
          },
          { session }
        );
    }
  }
};

export const printTicket = async () => {
  await axios.post("");
};

export function translateStatusToFrench(status) {
  switch (status.toLowerCase()) {
    case "success":
      return "succès";
    case "canceled":
      return "annulé";
    case "pending":
      return "en attente";
    default:
      return "unknown";
  }
}