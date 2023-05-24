// Add line-clamp

import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"

export default function OrderItems({open, order, setOrder, setOpen}: any) {
  return (
    <div
      className={clsx(
        open ? "opacity-100 w-1/3 " : "opacity-0",
          "transition z-50 transform bg-white duration-500  border border-black  h-[40rem]  mt-10 "
      )}
    >
      <button
        className="p-2 border m-2 hover:bg-indigo-800 bg-indigo-600 text-white rounded-md flex space-x-4 items-center justify-center"
        onClick={() => {
          setOpen(false)
          setOrder((prev: any) => ({
            items: [],
            table: "",
            zone: "",
          }))
        }}
      >
        <ArrowUturnLeftIcon className="text-white w-5 h-5" />
        <p>Retour</p>
      </button>
      <div>
        {!order?.table ? (
          <h2 className="text-left ml-2 text-lg font-light">Commande directe</h2>
        ) : (
          <h2 className="text-left ml-2 text-lg font-light">
            <b>{order?.zone}</b> - {order?.table}
          </h2>
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-left ml-2 text-lg font-semibold">Liste des articles</h2>
      </div>
      <ul
        role="list"
        className="bg-white max-h-[30rem] overflow-y-auto divide-y-1 divide-gray-200 p-2 "
      >
        {order?.items.map((item: any) => (
          <li key={item.name} className="border relative bg-white py-5 px-4   hover:bg-gray-50">
            <div className="flex justify-between space-x-3">
              <div className="min-w-0 flex-1">
                <div className="block focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                </div>
              </div>
              <span className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                {item.qty} x {item.price.toLocaleString()} FCFA
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
