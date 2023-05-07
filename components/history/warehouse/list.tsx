import {Fragment, useState} from "react"

import {useQuery} from "react-query"
import {fetcher} from "@/helpers"

import {useAppDispatch, useAppSelector} from "@/store/hooks"
import Loading from "@/components/Loading"

export default function history() {
  const itemName = useAppSelector((state) => state.history.warehouse.productName)
  const warehouseId = useAppSelector((state) => state.history.warehouse.warehouseId)
  const categoryId = useAppSelector((state) => state.history.warehouse.categoryId)

  const type = useAppSelector((state) => state.history.warehouse.type)

  const date = useAppSelector((state) => state.history.warehouse.date)
  const {isLoading, data: histories} = useQuery<any>(
    ["stock-history", warehouseId, categoryId, itemName, type, date],
    () =>
      fetcher(
        `/api/history/warehouses?warehouseId=${warehouseId}&categoryId=${categoryId}&itemName=${itemName}&type=${type}&date=${date}`
      )
  )

  return (
    <>
      {isLoading ? <Loading /> : null}
      {!isLoading && histories?.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="-mx-4 mt-8 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Produit
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Activité
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Quantité
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Motif
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {histories.map((history) => (
                  <tr key={history._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {history.product.name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {history.type === "increment"
                        ? "Ajout"
                        : history.type === "decrement"
                        ? "Retrait"
                        : history.type === "return"
                        ? "Retour"
                        : "Transfert"}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {history.qty}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {history?.reason
                        ? history.reason
                        : history?.stand
                        ? `Transféré vers ${history.stand.name}`
                        : "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(history.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!isLoading && histories?.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <p className="text-gray-400">Aucun produit trouvé</p>
        </div>
      )}
    </>
  )
}
