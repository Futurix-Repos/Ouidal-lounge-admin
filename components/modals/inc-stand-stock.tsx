import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import {CheckIcon} from "@heroicons/react/24/outline"
import {useMutation} from "react-query"
import axios from "axios"
import {useAppSelector} from "@/store/hooks"

import {queryClient} from "@/pages/_app"
import MutationState from "../MutationState"
export default function IncrementStandStock({open, setOpen}) {
  const productId = useAppSelector((state) => state.products.stand.productId)
  const standId = useAppSelector((state) => state.products.stand.standId)
  
  const categoryId = useAppSelector((state) => state.products.stand.categoryId)
  const productName = useAppSelector((state) => state.products.stand.productName)
  const [qty, setQty] = useState(0)
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/stand/increment-stock", data)
      return res.data
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(["selling-products", standId, productName, categoryId])
      setOpen(false)
      mutation.reset()
      //Invalidate all queries with the key selling-products without caring about the params
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

                      mutation.mutate({qty, productId, standId})
                    }}
                    className="mt-3 text-center sm:mt-5"
                  >
                    <div className="mt-2">
                      <label className="text-sm font-bold w-full flex items-center justify-start text-black">
                        Quantité à ajouter
                      </label>
                      <input
                        type="number"
                        name="qty"
                        id="qty"
                        className="mt-1 h-10 border p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Quantité"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      />
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <MutationState
                        mutation={mutation}
                        data={{
                          productId,
                          standId,
                          qty,
                        }}
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
