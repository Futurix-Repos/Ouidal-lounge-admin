import Layout from "@/components/Layout"
import ProductNoStock from "@/components/product/no-stock"
import React from "react"

export default function ProductNoStockPage() {
  return (
    <Layout>
      <ProductNoStock />
    </Layout>
  )
}

ProductNoStockPage.auth = true
