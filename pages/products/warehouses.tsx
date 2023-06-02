import {useQuery} from "react-query"
import Link from "next/link"

import Layout from "@/components/Layout"
import WarehouseProducts from "@/components/products/warehouse"

export default function Warehouses() {
  return (
    <Layout>
      <WarehouseProducts />
    </Layout>
  )
}

//Warehouses.auth = true
