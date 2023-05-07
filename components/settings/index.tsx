import Link from "next/link"
import {useState} from "react"

export default function Settings() {
  return (
    <div className=" mt-20 grid grid-cols-6 max-w-lg mx-auto  gap-y-8 text-center">
      <Link
        href="/settings/warehouse"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        ENTREPÔT
      </Link>
      <Link
        href="/settings/stand"
        className="col-span-full rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        POINT DE VENTE
      </Link>
      <Link
        href={"/settings/category"}
        className="col-span-full rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        CATEGORIE DE PRODUIT
      </Link>
    </div>
  )
}
