import Layout from "@/components/Layout"
import Settings from "@/components/settings"

export default function SettingsPage() {
  return (
    <Layout>
      <h2 className="w-full border text-center mt-2 text-2xl font-bold tracking-tight text-gray-900 ">
        MODIFICATION D'ENTREPÔT, DE POINT DE VENTE ET CATEGORIE DE PRODUIT
      </h2>
      <p className="mt-6 text-center text-lg leading-8 text-gray-600">
        Selectionner une option pour continuer.
      </p>
      <Settings />
    </Layout>
  )
}

SettingsPage.auth = true
