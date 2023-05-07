import Layout from "@/components/Layout"
import SettingsCategory from "@/components/settings/category"
import React from "react"

export default function SettingsCategoryPage() {
  return (
    <Layout>
      <SettingsCategory />
    </Layout>
  )
}

SettingsCategoryPage.auth = true
