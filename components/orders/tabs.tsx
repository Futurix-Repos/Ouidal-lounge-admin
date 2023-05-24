import {useAppSelector, useAppDispatch} from "@/store/hooks"
import {setStatus} from "@/store/slices/orders"
import {useState, useEffect} from "react"
import {
  setDate as setDebouncedDate,
  setPaymentMethod,
  setStartDate as setDebouncedStartDate,
  setEndDate as setDebouncedEndDate,
} from "@/store/slices/orders"
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}
const statusList = [
  {id: "success", name: "Payée"},
  {id: "pending", name: "En attente"},
  {id: "canceled", name: "Annulée"},
]
function FilterTab() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchByDate, setSearchByDate] = useState(false)
  const dispatch = useAppDispatch()
  const [date, setDate] = useState("")
  const paymentMethod = useAppSelector((state) => state.orders.paymentMethod)
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setDebouncedEndDate(endDate))
    }, 300)

    return () => {
      clearTimeout(tid)
    }
  }, [endDate])
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setDebouncedStartDate(startDate))
    }, 300)

    return () => {
      clearTimeout(tid)
    }
  }, [startDate])
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setDebouncedDate(date))
    }, 1000)
    return () => {
      clearTimeout(tid)
    }
  }, [date])
  return (
    <div className="flex items-center justify-end space-x-4 w-full">
      <div className="sm:flex sm:items-center space-x-4 justify-start">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="searchByDate"
              name="searchByDate"
              checked={searchByDate}
              onChange={() => setSearchByDate(true)}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="searchByDate" className="font-medium text-gray-900">
              Date
            </label>{" "}
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="searchByInterval"
              name="searchByInterval"
              checked={!searchByDate}
              onChange={() => setSearchByDate(false)}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="searchByInterval" className="font-medium text-gray-900">
              Intervalle de temps
            </label>{" "}
          </div>
        </div>
        {/* <button
          className="p-2 border rounded bg-slate-200 hover:bg-slate-400"
          onClick={refreshDate}
        >
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        </button> */}
      </div>
      <div className="w-72">
        {searchByDate ? (
          <div>
            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
              Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="date"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                }}
                className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-bold">Début</label>
              <input
                type="date"
                name="startDate"
                className="block  h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                }}
              />
            </div>
            <div>
              <label className="text-sm font-bold">Fin</label>
              <input
                type="date"
                name="endDate"
                className="block  h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
          Moyen de paiement
        </label>
        <div className="mt-2">
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => {
              dispatch(setPaymentMethod(e.target.value))
            }}
            className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
            <option value="Carte bancaire">Carte bancaire</option>
          </select>
        </div>
      </div>
    </div>
  )
}
export default function OrderStatusTab() {
  const dispatch = useAppDispatch()
  const currentStatus = useAppSelector((state) => state.orders.status)
  return (
    <div className="space-y-4 mx-10">
      <div className="hidden sm:block">
        <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
          {statusList.map((status, tabIdx) => (
            <button
              key={status.name}
              onClick={() => dispatch(setStatus(status.id))}
              className={classNames(
                currentStatus === "success" &&
                  status.id === "success" &&
                  "bg-green-500 hover:bg-green-600 text-white",
                currentStatus === "pending" &&
                  status.id === "pending" &&
                  "bg-yellow-500 hover:bg-yellow-600 text-white",
                currentStatus === "canceled" &&
                  status.id === "canceled" &&
                  "bg-red-500 hover:bg-red-600 text-white",
                tabIdx === 0 ? "rounded-l-lg" : "",
                tabIdx === statusList.length - 1 ? "rounded-r-lg" : "",
                "group relative min-w-0 flex-1 overflow-hidden  py-4 px-4 text-center text-sm font-medium  focus:z-10"
              )}
            >
              <span>{status.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  currentStatus === status.id ? "bg-indigo-500" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </button>
          ))}
        </nav>
      </div>
      <FilterTab />
    </div>
  )
}
