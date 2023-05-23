import {useMutation} from "react-query"

function TicketItems({items, startDate, closeDate}: any) {
  const mutation = useMutation({
    mutationFn: async (ticket: any) => {
    },
  })
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">TicketZ</h1>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-bold ">Ouverture </span>
            <time>{startDate}</time>
          </p>
          <p className="mt-2 text-sm text-gray-700">
            <span>Fermerture </span>
            <time>{closeDate}</time>
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Imprimer
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className="w-full sm:w-1/2" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
          </colgroup>
          <thead className="border-b border-gray-300 text-gray-900">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Produit
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Quantité
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Prix
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  <div className="mt-1 truncate text-gray-500">{item.quantity}</div>
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  {item.price.toLocaleString("fr-FR")}
                </td>
                <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                  {(item.price * item.quantity).toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function TicketPayments({payments, total}: any) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className="w-full sm:w-1/2" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
          </colgroup>
          <thead className="border-b border-gray-300 text-gray-900">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Moyen de paiement
              </th>
              <th
                scope="col"
                colSpan={3}
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(payments).map((payment) => (
              <tr key={payment} className="border-b border-gray-200">
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">{payment}</div>
                </td>
                <td
                  colSpan={3}
                  className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell"
                >
                  {payments[payment].toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
              >
                Total
              </th>
              <th
                scope="row"
                className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
              >
                Total
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                {total.toLocaleString("fr-Fr")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default function FullTicket({startDate, closeDate, items, payments, total}: any) {
  return (
    <div className="flex flex-col space-y-4">
      <TicketItems items={items} startDate={startDate} closeDate={closeDate} />
      <TicketPayments payments={payments} total={total} />
    </div>
  )
}
