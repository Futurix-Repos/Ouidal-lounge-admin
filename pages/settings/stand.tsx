import Layout from "@/components/Layout"
import SettingsStand from "@/components/settings/stand"
import React from "react"

export default function SettingsStandPage() {
  return (
    <Layout>
      <SettingsStand />
    </Layout>
  )
}

SettingsStandPage.auth = true
