import Layout from "@/components/Layout"
import SettingsWarehouse from "@/components/settings/warehouse"
import React from "react"

export default function SettingsWarehousePage() {
  return (
    <Layout>
      <SettingsWarehouse />
    </Layout>
  )
}

SettingsWarehousePage.auth = true
