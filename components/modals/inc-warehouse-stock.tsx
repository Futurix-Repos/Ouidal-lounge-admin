import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import {NumericFormat} from "react-number-format"
import {useMutation} from "react-query"
import axios from "axios"
import {useAppSelector} from "@/store/hooks"
import {useRouter} from "next/router"
import {queryClient} from "@/pages/_app"
import MutationState from "../MutationState"
export default function IncrementWarehouseStock({open, setOpen}) {
  const warehouseId = useAppSelector((state) => state.products.warehouse.warehouseId)
  const categoryId = useAppSelector((state) => state.products.warehouse.categoryId)
  const productId = useAppSelector((state) => state.products.warehouse.productId)

  const productName = useAppSelector((state) => state.products.warehouse.productName)
  const [qty, setQty] = useState(0)
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/product/increment-stock", data)
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
                      if (!qty) return alert("Veuillez insérer la quantité à ajoutée!")
                      mutation.mutate({
                        qty,
                        productId,
                        warehouseId,
                        categoryId,
                      })
                    }}
                    className="mt-3 text-center sm:mt-5"
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Veuillez insérer la quantité à ajoutée!
                    </Dialog.Title>
                    <div className="mt-2">
                      <NumericFormat
                        displayType={"input"}
                        value={qty}
                        thousandSeparator={true}
                        onValueChange={(value) => {
                          // @ts-ignore
                          setQty(value.floatValue)
                        }}
                        allowNegative={false}
                        required
                        min={1}
                        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <MutationState
                        mutation={mutation}
                        data={{
                          qty,
                          productId,
                          warehouseId,
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
