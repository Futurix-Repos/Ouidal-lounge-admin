import StandHistory from "@/components/history/stand"
import Layout from "@/components/Layout"
export default function StandHistoryPage() {
  return (
    <Layout>
      <StandHistory />
    </Layout>
  )
}

StandHistoryPage.auth = true