import Layout from "@/components/Layout"

import StatsStands from "@/components/stats/stands"
import React from "react"

export default function StatsProductsPage() {
  return (
    <Layout>
      <StatsStands />
    </Layout>
  )
}

StatsProductsPage.auth = true
