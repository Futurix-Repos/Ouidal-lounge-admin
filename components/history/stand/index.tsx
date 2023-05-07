import FilterTab from "./tabs"
import Products from "./list"
import Link from "next/link"
import {ArrowLeftIcon} from "@heroicons/react/20/solid"
export default function StandHistory() {
  return (
    <>
      <Link
        href="/history"
        className="inline-flex ml-12 mb-12 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Retour à la selection
      </Link>
      <div className="border-b border-gray-200 flex items-center justify-center pb-12">
        <h3 className=" font-semibold leading-6 text-gray-900 text-xl uppercase">
          Historique des approvisionnements dans les points de ventes
        </h3>
      </div>
      <FilterTab />
      <Products />
    </>
  )
}
