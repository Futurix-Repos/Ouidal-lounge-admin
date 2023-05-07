import Layout from "@/components/Layout"
import StatsProducts from "@/components/stats/global"
import RedirectList from "@/components/stats/redirect"
import React from "react"

export default function StatsProductsPage() {
  return (
    <Layout>
      <h2 className="w-full border text-center mt-2 text-2xl font-bold tracking-tight text-gray-900 ">
        STATISTIQUES DES VENTES DE PRODUITS
      </h2>
      <p className="mt-6 text-center text-lg leading-8 text-gray-600">
        Selectionner la zone que vous souhaitez consulter.
      </p>
      <RedirectList />
    </Layout>
  )
}

StatsProductsPage.auth = true
