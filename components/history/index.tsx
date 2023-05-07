import {BuildingStorefrontIcon, HomeModernIcon} from "@heroicons/react/20/solid"
import Link from "next/link"

export default function History() {
  return (
    <div className=" mt-20 grid grid-cols-6 max-w-lg mx-auto  gap-y-8 text-center">
      <Link
        href="/history/warehouses"
        className="col-span-full text-center rounded-md flex space-x-4 items-center justify-center  bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        <HomeModernIcon className="h-6 w-6" />
        <span>ENTREPÔT</span>
      </Link>
      <Link
        href="/history/stands"
        className="col-span-full text-center rounded-md flex space-x-4 items-center justify-center  bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        <BuildingStorefrontIcon className="h-6 w-6" />
        <span>POINTS DE VENTE</span>
      </Link>
    </div>
  )
}
