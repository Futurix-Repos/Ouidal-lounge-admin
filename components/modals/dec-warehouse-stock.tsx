import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import {NumericFormat} from "react-number-format"
import {useMutation} from "react-query"
import axios from "axios"
import {useAppSelector} from "@/store/hooks"

import {queryClient} from "@/pages/_app"
import MutationState from "../MutationState"
export default function DecrementStock({open, setOpen}) {
  const warehouseId = useAppSelector((state) => state.products.warehouse.warehouseId)
  const categoryId = useAppSelector((state) => state.products.warehouse.categoryId)
  const productName = useAppSelector((state) => state.products.warehouse.productName)
  const productId = useAppSelector((state) => state.products.warehouse.productId)
  const [qty, setQty] = useState(0)
  const [reason, setReason] = useState("")
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/product/decrement-stock", data)
      return res.data
    },
    onSuccess: () => {
      setOpen(false)
      mutation.reset()
      queryClient.invalidateQueries(["stock-products", warehouseId, categoryId, productName])
    },
  })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          setOpen(false)
          mutation.reset()
        }}
      >
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
                      if (!qty) {
                        alert("Veuillez insérer la quantité à retirer!")
                        return
                      } else if (!reason) {
                        alert("Veuillez insérer le motif de retrait!")
                        return
                      }
                      mutation.mutate({
                        qty,
                        productId,
                        reason,
                        warehouseId,
                        categoryId,
                        productName,
                      })
                    }}
                    className="mt-3 text-center sm:mt-5 space-y-4"
                  >
                    <div className="mt-2">
                      <label className="text-sm font-bold flex items-center justify-start text-black">
                        Veuillez insérer la quantité à retirer!
                      </label>
                      <NumericFormat
                        displayType={"input"}
                        value={qty}
                        thousandSeparator={true}
                        onValueChange={(value) => {
                          setQty(value.floatValue)
                        }}
                        allowNegative={false}
                        required
                        min={1}
                        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm font-bold flex items-center justify-start text-black">
                        Motif de retrait
                      </label>
                      <input
                        type="text"
                        name="reason"
                        id="reason"
                        className="p-2 mt-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Motif"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <MutationState
                        mutation={mutation}
                        data={{
                          qty,
                          productId,
                          reason,
                          warehouseId,
                          categoryId,
                          productName,
                        }}
                        close={() => setOpen(false)}
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
