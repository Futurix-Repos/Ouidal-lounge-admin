import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import {useAppSelector} from "@/store/hooks"
import {useMutation, useQuery} from "react-query"
import axios from "axios"
import MutationState from "../MutationState"
import {queryClient} from "@/pages/_app"
import {fetcher} from "@/helpers"
import {BeatLoader} from "react-spinners"
import Loading from "../Loading"
export default function UpdateStand({open, setOpen}: any) {
  const [standId, setStandId] = useState("")
  const [name, setName] = useState("")
  const mutation = useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      await axios.put(`/api/stand`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stands"])
    },
  })
  const {data: stands, isLoading: standsIsLoading} = useQuery(
    "stands",
    () => fetcher("/api/stands"),
    {
      onSuccess: (stands) => {
        if (!standId && stands.length) {
          setStandId(stands[0].id)
        }
      },
    }
  )
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        mutation.mutate({standId, name})
                      }}
                      className="mt-2 space-y-4"
                    >
                      <div className="col-span-3 flex flex-col items-start">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nouveau nom du point de vente
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block p-2  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      {!stands && standsIsLoading ? (
                        <div className="col-span-3 flex flex-col items-center justify-start">
                          <BeatLoader size={3} />
                        </div>
                      ) : (
                        <div className="col-span-3 flex flex-col items-start">
                          <label
                            htmlFor="standId"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Point de vente à modifier
                          </label>
                          <select
                            id="standId"
                            name="standId"
                            value={standId}
                            onChange={(e) => setStandId(e.target.value)}
                            className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            {stands.map((stand) => (
                              <option key={stand.id} value={stand.id}>
                                {stand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {mutation.isIdle && (
                        <div className="w-full flex items-center space-x-4">
                          <button
                            type="submit"
                            className="w-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Valider
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false)
                              mutation.reset()
                            }}
                            className="w-1/2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 "
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                      {mutation.isLoading && <Loading />}
                      {mutation.isSuccess && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false)
                            mutation.reset()
                          }}
                          className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500   "
                        >
                          Création réussie!
                        </button>
                      )}
                      {mutation.isError && (
                        <button
                          type="submit"
                          className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 "
                        >
                          {mutation.error.response.data?.msg} Réessayer!
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
