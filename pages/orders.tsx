import Layout from "@/components/Layout"
import Orders from "@/components/orders"

export default function OrdersPage() {
  return (
    <Layout>
      <Orders />
    </Layout>
  )
}

OrdersPage.auth = true