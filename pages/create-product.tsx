// Nextjs page - Inventory
import React from "react"
import Layout from "@/components/Layout"
import CreateProduct from "@/components/CreateProduct"

export default function CreateProductPage() {
  return (
    <Layout>
      <CreateProduct />
    </Layout>
  )
}

CreateProductPage.auth = true
