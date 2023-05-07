import Layout from "@/components/Layout"
import History from "@/components/history"
import React from "react"

export default function HistoryPage() {
  return (
    <Layout>
      <h2 className="w-full border text-center mt-2 text-2xl font-bold tracking-tight text-gray-900 ">
        HISTORIQUE DES INVENTAIRES ( APPROVISIONNEMENT/ TRANSFERT / RETRAIT)
      </h2>
      <p className="mt-6 text-center text-lg leading-8 text-gray-600">
        Selectionner la zone que vous souhaitez consulter.
      </p>
      <History />
    </Layout>
  )
}

HistoryPage.auth = true
