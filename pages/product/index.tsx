import Layout from "@/components/Layout"
import CreationChoice from "@/components/product"
import React from "react"

export default function ProductCreationPage() {
  return (
    <Layout>
      <h2 className="w-full border text-center mt-2 text-2xl font-bold tracking-tight text-gray-900 ">
        CREATION DE PRODUIT
      </h2>
      <p className="mt-6 text-center text-lg leading-8 text-gray-600">
        Selectionner le type de produit que vous souhaitez créer.
      </p>
      <CreationChoice />
    </Layout>
  )
}
