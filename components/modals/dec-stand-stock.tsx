import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"

import {Mutation, useMutation} from "react-query"
import axios from "axios"
import {useAppSelector} from "@/store/hooks"
import {NumericFormat} from "react-number-format"
import {queryClient} from "@/pages/_app"
import MutationState from "../MutationState"
export default function DecrementStandStock({open, setOpen}) {
  const productId = useAppSelector((state) => state.products.stand.productId)
  const [reason, setReason] = useState("")
  const standId = useAppSelector((state) => state.products.stand.standId)
  const [qty, setQty] = useState(0)
  const [keep, setKeep] = useState(false)
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/stand/decrement-stock", data)
      return res.data
    },
    onSuccess: () => {
      setOpen(false)
      mutation.reset()
      queryClient.invalidateQueries(["selling-products"])
    },
  })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()

                      mutation.mutate({qty, productId, standId, reason, keep})
                    }}
                    className="mt-3 text-center sm:mt-5 space-y-4"
                  >
                    <div className="mt-2">
                      <label className="text-sm flex items-center justify-start w-full text-black font-bold">
                        Quantité à retirer
                      </label>
                      <NumericFormat
                        displayType={"input"}
                        value={qty}
                        thousandSeparator={true}
                        onValueChange={(value) => {
                          //@ts-ignore
                          setQty(value.floatValue)
                        }}
                        allowNegative={false}
                        required
                        min={1}
                        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm flex items-center justify-start w-full text-black font-bold">
                        Motif de retrait
                      </label>
                      <input
                        type="text"
                        name="reason"
                        className="mt-1 border p-2 h-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Motif"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="keep"
                          name="keep"
                          type="checkbox"
                          checked={keep}
                          onChange={(e) => setKeep(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="keep" className="font-medium text-gray-900">
                          Ramener à l'entrepôt général
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <MutationState
                        mutation={mutation}
                        data={{qty, productId, standId, reason, keep}}
                        close={() => {
                          setOpen(false)
                          mutation.reset()
                        }}
                      />
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
