import Layout from "@/components/Layout"
import ProductStock from "@/components/product/stock"
import React from "react"

export default function ProductStockPage() {
  return (
    <Layout>
      <ProductStock />
    </Layout>
  )
}

ProductStockPage.auth = true
