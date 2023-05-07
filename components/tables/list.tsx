import {EnvelopeIcon, PhoneIcon, TrashIcon} from "@heroicons/react/20/solid"
import {useState} from "react"
import clsx from "clsx"
import {useMutation, useQuery} from "react-query"
import {fetcher} from "@/helpers"
import {useAppSelector} from "@/store/hooks"
import Loading from "@/components/Loading"
import AddTable from "../modals/add-table"
import axios from "axios"
import {queryClient} from "@/pages/_app"
import {BeatLoader} from "react-spinners"

function Table({table}: any) {
  const zoneId = useAppSelector((state) => state.zones.zoneId)
  const mutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/table?id=${table.id}`)
    },
    onSuccess() {
      queryClient.invalidateQueries(["tables", zoneId])
      mutation.reset()
    },
  })
  return (
    <li
      className={clsx(
        "relative hover:bg-slate-500 transition transform duration-500  items-center justify-center border border-black shadow-md col-span-1 flex rounded-md  h-48"
      )}
    >
      <div className="flex w-full items-center justify-center truncate rounded-r-md border-t border-r border-b border-gray-200">
        <div className=" px-4 py-2 text-sm">
          <p className="font-medium text-gray-900 hover:text-gray-600">{table.name}</p>
        </div>

        {mutation.isIdle && (
          <button onClick={() => mutation.mutate()} className="absolute top-2 right-4">
            <TrashIcon className="w-5 h-5 text-red-500" />
          </button>
        )}
        {mutation.isLoading && (
          <div className="absolute top-2 right-4">
            <BeatLoader />
          </div>
        )}
      </div>
    </li>
  )
}
export default function Tables() {
  const [openAddTable, setOpenAddTable] = useState(false)
  const zoneId = useAppSelector((state) => state.zones.zoneId)
  const {isLoading, data: tables} = useQuery<any>(["tables", zoneId], () =>
    fetcher(`/api/tables?zoneId=${zoneId}`)
  )

  if (isLoading) return <Loading />
  if (!zoneId) return <div></div>

  return (
    <div>
      <AddTable open={openAddTable} setOpen={setOpenAddTable} />
      <div className="space-y-4 p-4 border-2 mt-2 mx-2 shadow-md rounded-md bg-slate-50">
        <button
          type="button"
          onClick={() => setOpenAddTable(true)}
          className="rounded-md bg-indigo-600 p-3 mt-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ajouter une table
        </button>
        {!tables?.length && <div className="text-center">Aucune table</div>}
        <ul
          role="list"
          className=" max-h-96 overflow-y-auto p-3 grid grid-cols-6 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tables.map((table) => (
            <Table key={table.id} table={table} />
          ))}
        </ul>
      </div>
    </div>
  )
}
