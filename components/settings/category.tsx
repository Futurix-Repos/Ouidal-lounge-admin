import Link from "next/link"
import {useState} from "react"
import AddCategory from "../modals/add-category"
import UpdateCategory from "../modals/update-category"
import {ArrowLeftIcon} from "@heroicons/react/20/solid"

export default function SettingsCategory() {
  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false)
  return (
    <>
      <Link
        href="/settings"
        className="inline-flex ml-12 mb-12 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Retour à la selection
      </Link>
      <div className="grid grid-cols-6 max-w-lg mx-auto  gap-y-8">
        <AddCategory open={openAddCategory} setOpen={setOpenAddCategory} />
        <UpdateCategory open={openUpdateCategory} setOpen={setOpenUpdateCategory} />

        <button
          type="button"
          onClick={() => setOpenAddCategory(true)}
          className="col-span-full rounded-md bg-indigo-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          AJOUTER UNE CATEGORIE DE PRODUIT
        </button>
        <button
          type="button"
          onClick={() => setOpenUpdateCategory(true)}
          className="col-span-full rounded-md bg-indigo-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          RENOMMER UNE CATEGORIE DE PRODUIT
        </button>
      </div>
    </>
  )
}
