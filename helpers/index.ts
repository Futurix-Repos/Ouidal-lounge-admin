import axios from "axios"
export const fetcher = async (url: string) => {
  const res = await axios.post(url)
  return res.data
}
export const monthParser = (month: string) => {
  switch (month) {
    case "01":
      return "janvier"
    case "02":
      return "février"
    case "03":
      return "mars"
    case "04":
      return "avril"
    case "05":
      return "mai"
    case "06":
      return "juin"
    case "07":
      return "juillet"
    case "08":
      return "août"
    case "09":
      return "septembre"
    case "10":
      return "octobre"
    case "11":
      return "novembre"
    case "12":
      return "décembre"
    default:
      return month
  }
}

//function to extract the year date and month from a date string

export const dateParser = (date: string) => {
  const splited = date.split("-")
  const year = splited[0]
  const month = splited[1]
  const day = splited[2]

  return {
    year,
    month,
    day,
  }
}
export const updateStock = async ({
  client,
  items,
  barman,
  session,
}: {
  client: any
  items: any[]
  barman: any
  session: any
}) => {
  for (const item of items) {
    if (item.special) continue

    const product = await client.db().collection("sellingProducts").findOne(
      {
        standId: barman.standId,
        productId: item.productId,
      },
      {session}
    )

    if (!product) {
      throw new Error(`${item.name} n'existe pas dans l'entrepôt`)
    }

    let totalToRestock = item.deStock
      ? item.qty * item.contenance
      : item.qty * item.sellingPerUnit.qty

    if (totalToRestock > product.stock) {
      throw new Error(`${item.name} stock insuffisant`)
    }

    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          standId: barman.standId,
          productId: item.productId,
        },
        {
          $inc: {
            stock: totalToRestock,
          },
        },
        {session}
      )
  }
}

export const printTicket = async () => {
  await axios.post("")
}
