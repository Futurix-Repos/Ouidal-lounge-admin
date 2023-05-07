import {Dialog, Transition} from "@headlessui/react";
import axios from "axios";
import {Form, Formik} from "formik";
import React, {Fragment} from "react";
import {useMutation} from "react-query";
import {queryClient} from "../../../pages/_app";

import Input from "../utils/Input";

export default function CreateZone({open, setOpen}: any) {
  const mutation = useMutation(
    (zone) => {
      return axios.post(`http://localhost:7000/zones`, zone);
    },
    {
      onMutate: async (zone: any) => {
        queryClient.setQueryData("zones", (old: any) => {
          return old.concat({...zone, tables: [], id: "2434"});
        });
        setOpen(false);
      },
    }
  );
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[500]" onClose={() => setOpen(false)}>
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
                  initialValues={{name: "Zone X"}}
                  onSubmit={(values) => {
                    //@ts-ignore
                    mutation.mutate({name: values.name});
                  }}
                >
                  <Form>
                    <Input type="text" label="Nom de la zone" name="name" id="name" />
                    <div className="w-full flex justify-start items-center">
                      <button
                        type="submit"
                        className="mt-2 w-24 rounded-md p-2 border bg-slate-400 hover:bg-slate-200"
                      >
                        Valider
                      </button>
                    </div>
                  </Form>
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
