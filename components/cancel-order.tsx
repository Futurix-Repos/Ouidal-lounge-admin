import {Fragment, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import {CheckIcon} from "@heroicons/react/24/outline"
import {Field, Form, Formik} from "formik"
import {useMutation} from "react-query"
import axios from "axios"
import {BeatLoader} from "react-spinners"
import {queryClient} from "@/pages/_app"
import {useRouter} from "next/router"

export default function CancelOrder({open, setOpen, order}: any) {
  const {isLoading, isError, isIdle, mutate, reset} = useMutation({
    mutationFn: async (payload: any) => {
      const {data} = await axios.post("/api/order/cancel", payload)
      return data
    },
    onSuccess: () => {
      reset()
      setOpen(false)
      // router.reload()
    },
  })
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={setOpen}>
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
                <Formik
                  initialValues={{reason: ""}}
                  onSubmit={(values) => {
                    mutate({...values, items: order?.items, orderId: order?.id})
                  }}
                >
                  <Form className="">
                    <div className="my-2 text-center ">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Annuler la commande
                      </Dialog.Title>
                      <div className="mt-2 border flex space-y-2 flex-col justify-start items-start">
                        <Field
                          type="text"
                          name="reason"
                          required
                          className="h-8 w-full border rounded-md"
                          placeholder="Motif d'annulation"
                        />
                      </div>
                    </div>
                    {isIdle && (
                      <div className="flex items-center justify-start  space-x-2">
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false)
                          }}
                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                    {isLoading && (
                      <div className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <BeatLoader />
                      </div>
                    )}
                    {isError && (
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Erreur lors de l'annulation.
                      </button>
                    )}
                  </Form>
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
