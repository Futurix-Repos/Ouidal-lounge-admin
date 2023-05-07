import React from "react"
import Layout from "@/components/Layout"
import AreaOverview from "@/components/tables"

export default function TablesPage() {
  return (
    <Layout>
      <AreaOverview />
    </Layout>
  )
}

TablesPage.auth = true
