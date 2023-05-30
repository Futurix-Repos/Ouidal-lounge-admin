import Link from "next/link"

export default function CreationChoice() {
  return (
    <div className="mt-24 grid grid-cols-6 max-w-lg mx-auto  gap-y-8">
      <Link
        href="/product/stock"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        PRODUIT TYPE
      </Link>
      <Link
        href="/product/no-stock"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        PRODUIT PARTICULIER
      </Link>
      <Link
        href="/product/bundle"
        className="col-span-full text-center rounded-md bg-slate-600 p-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        BUNDLE DE PRODUITS
      </Link>
    </div>
  );
}
