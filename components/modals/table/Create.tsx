import {Dialog, Transition} from "@headlessui/react"
import axios from "axios"
import {Form, Formik} from "formik"
import React, {Fragment} from "react"
import {useMutation} from "react-query"
import {useAppSelector} from "../../../store/hooks"

import Input from "../utils/Input"

export default function CreateTable({open, setOpen}: any) {
  const zoneId = useAppSelector((state) => state.zone.current)
  const mutation = useMutation<any, any, any>(
    (table: any) => {
      return axios.post(`/api/table`, table)
    },
    {
      onSuccess: () => {
        mutation.reset()
        setOpen(false)
      },
    }
  )
  const onClose = () => {
    setOpen(false)
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[500]" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <Formik
                  initialValues={{name: "Table X"}}
                  onSubmit={(values) => {
                    mutation.mutate({name: values.name, zoneId})
                    setOpen(false)
                  }}
                >
                  <Form>
                    <Input type="text" label="Nom de la table" name="name" id="name" />
                    <div className="w-full flex justify-start items-center">
                      {mutation.isIdle && (
                        <button
                          type="submit"
                          className="mt-2 w-24 rounded-md p-2 border bg-slate-400 hover:bg-slate-200"
                        >
                          Valider
                        </button>
                      )}
                      {mutation.isLoading && (
                        <button
                          type="button"
                          className="mt-2 w-24 rounded-md p-2 border bg-slate-400 hover:bg-slate-200"
                        >
                          Chargement...
                        </button>
                      )}
                      {mutation.isError && (
                        <button
                          type="submit"
                          className="mt-2 w-24 rounded-md p-2 border bg-red-400 hover:bg-slate-200"
                        >
                          {mutation.error?.response?.data?.msg} Réessayer
                        </button>
                      )}
                    </div>
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
