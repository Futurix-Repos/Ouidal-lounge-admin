import Layout from "@/components/Layout"
import StatsGlobal from "@/components/stats/global"
import React from "react"

export default function StatsProductsPage() {
  return (
    <Layout>
      <StatsGlobal />
    </Layout>
  )
}

StatsProductsPage.auth = true
