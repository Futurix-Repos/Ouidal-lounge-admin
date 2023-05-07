import WarehouseHistory from "@/components/history/warehouse"
import Layout from "@/components/Layout"
export default function WarehouseHistoryPage() {
  return (
    <Layout>
      <WarehouseHistory />
    </Layout>
  )
}

WarehouseHistoryPage.auth = true