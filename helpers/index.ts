import axios from "axios";
const printServeurUrl = "http://localhost:8000";
export const fetcher = async (url: string) => {
  const res = await axios.post(url);
  return res.data;
};

//function to extract the year date and month from a date string

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
    if (item.special) continue
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
};

export const printTicket = async (data) => {

  await axios.post(`${printServeurUrl}/print-zTicket`, data);
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