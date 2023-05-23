import React from "react"
import Tickets from "@/components/tickets"
import Layout from "@/components/Layout"

export default function TicketsPage() {
  return (
    <Layout>
      <Tickets />
    </Layout>
  )
}

TicketsPage.auth = true
