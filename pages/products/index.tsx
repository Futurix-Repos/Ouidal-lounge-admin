import Layout from "@/components/Layout"
import Products from "@/components/products"
import React from "react"

export default function ProductsPage() {
  return (
    <Layout>
      <h2 className="w-full border text-center mt-2 text-2xl font-bold tracking-tight text-gray-900 ">
        INVENTAIRE DES PRODUITS
      </h2>
      <p className="mt-6 text-center text-lg leading-8 text-gray-600">
        Selectionner la zone de l'inventaire que vous souhaitez consulter.
      </p>
      <Products />
    </Layout>
  )
}

ProductsPage.auth = true
