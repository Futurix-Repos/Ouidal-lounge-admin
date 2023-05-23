import {Fragment} from "react"
import {Dialog, Transition} from "@headlessui/react"

import {useMutation, useQuery} from "react-query"
import axios from "axios"
import MutationState from "../MutationState"
import {queryClient} from "@/pages/_app"
import {useFormik} from "formik"
import {fetcher} from "@/helpers"
export default function AddMember({open, setOpen}: any) {
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await axios.post("/api/member", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"])
      mutation.reset()
      setOpen(false)
    },
  })
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "",
      stand: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values)
    },
  })
  const {data: stands} = useQuery("stands", () => fetcher("/api/stands"), {
    onSuccess: (stands) => {
      formik.setFieldValue("stand", stands?.[0]?.id)
    },
  })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form
                  onSubmit={formik.handleSubmit}
                  className="border-b border-gray-900/10 pb-12 space-y-4"
                >
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nom d&apos;utilisateur
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          required
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          className="block p-2 w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Mot de passe
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Rôle
                      </label>
                      <div className="mt-2">
                        <select
                          id="role"
                          name="role"
                          value={formik.values.role}
                          onChange={formik.handleChange}
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="manager">Manager</option>
                          <option value="serveur">Serveur</option>
                          <option value="barman">Barman</option>
                        </select>
                      </div>
                    </div>

                    {formik.values.role === "barman" && (
                      <div className="sm:col-span-full">
                        <label
                          htmlFor="stand"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Veuillez attribuer un point de vente
                        </label>
                        <div className="mt-1">
                          <select
                            id="stand"
                            name="stand"
                            value={formik.values.stand}
                            onChange={formik.handleChange}
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            {stands?.map((stand) => (
                              <option key={stand.id} value={stand.id}>{stand.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  <MutationState mutation={mutation} data={{}} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
