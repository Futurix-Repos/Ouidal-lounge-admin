import Link from "next/link"
import {useState} from "react"
import AddWarehouse from "../modals/add-warehouse"
import UpdateWarehouse from "../modals/update-warehouse"
import {ArrowLeftIcon} from "@heroicons/react/20/solid"

export default function SettingsWarehouse() {
  const [openAddWarehouse, setOpenAddWarehouse] = useState(false)
  const [openUpdateWarehouse, setOpenUpdateWarehouse] = useState(false)
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
        <AddWarehouse open={openAddWarehouse} setOpen={setOpenAddWarehouse} />
        <UpdateWarehouse open={openUpdateWarehouse} setOpen={setOpenUpdateWarehouse} />

        <button
          type="button"
          onClick={() => setOpenAddWarehouse(true)}
          className="col-span-full rounded-md bg-indigo-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          AJOUTER UN ENTREPÔT
        </button>
        <button
          type="button"
          onClick={() => setOpenUpdateWarehouse(true)}
          className="col-span-full rounded-md bg-indigo-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          RENOMMER UN ENTREPÔT
        </button>
      </div>
    </>
  )
}
