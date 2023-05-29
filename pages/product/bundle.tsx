import Layout from "@/components/Layout";
import ProductBundle from "@/components/product/bundle";
import React from "react";

export default function ProductBundlePage() {
  return (
    <Layout>
      <ProductBundle />
    </Layout>
  );
}

ProductBundlePage.auth = true;
