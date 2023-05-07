import Link from "next/link"

export default function RedirectList() {
  return (
    <div className="mt-24 grid grid-cols-6 max-w-lg mx-auto  gap-y-8">
      <Link
        href="/stats/global"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        STATISTIQUES DE VENTE GLOBALE
      </Link>
      <Link
        href="/stats/stands"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        STATISTIQUES DE VENTE PAR POINT DE VENTE
      </Link>
    </div>
  )
}
