import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

import { Switch } from "@headlessui/react";
import {
  setPaymentMethod,
  setStatus as _setStatus,
  setDate as _setDate,
  setStartDate as _setStartDate,
  setEndDate as _setEndDate,
  setStand as _setStand,
  toggleOrderFilter,
} from "@/store/slices/orders";
import clsx from "clsx";
import { useQuery } from "react-query";
import { fetcher } from "@/helpers";
import { useFormik } from "formik";

export default function OrdersFilter() {
  const [enabled, setEnabled] = useState(false);
  const dispatch = useAppDispatch();

  const open = useAppSelector((state) => state.orders.open);
  console.log({ open });
  const close = () => {
    dispatch(toggleOrderFilter());
  };
  const options = [
    { id: "Chèque", name: "Chèque" },
    { id: "Carte bancaire", name: "Carte bancaire" },
    { id: "Espèces", name: "Espèces" },
  ];
  const { stand, status, paymentMethod, endDate, startDate, date } =
    useAppSelector((state) => state.orders);
  const { data: stands, isLoading: standIsLoading } = useQuery("stands", () =>
    fetcher("/api/stands")
  );
  const formik = useFormik({
    initialValues: {
      payment: paymentMethod,
      status: status,
      stand: stand,
      date: date,
      startDate: startDate,
      endDate: endDate,
    },
    onSubmit: ({ payment, status, stand, date, startDate, endDate }) => {
      if (date) {
        formik.setFieldValue("startDate", "");
        formik.setFieldValue("endDate", "");
      }

      if (startDate && endDate) {
        formik.setFieldValue("date", "");
      }

      dispatch(setPaymentMethod(payment));
      dispatch(_setStatus(status));
      dispatch(_setStand(stand));
      dispatch(_setDate(date));
      dispatch(_setStartDate(startDate));
      dispatch(_setEndDate(endDate));
      close();
    },
  });

  useEffect(() => {
    if (enabled) {
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
    } else {
      formik.setFieldValue("date", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.date,
    formik.values.startDate,
    formik.values.endDate,
    enabled,
  ]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          console.log("close");
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
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        FILTRES DE RECHERCHE
                      </Dialog.Title>
                      <div className="mt-2 flex flex-col space-y-8 ">
                        <div
                          className={
                            "flex items-center justify-center space-x-2"
                          }
                        >
                          <div className="w-1/2 flex flex-col items-start">
                            <label className={"text-sm"}>Paiement</label>
                            <select
                              name={"payment"}
                              value={formik.values.payment}
                              onChange={formik.handleChange}
                              className={clsx(
                                formik.touched.payment &&
                                  formik.errors.payment &&
                                  "border-red-500",
                                "w-full p-2 border rounded-md"
                              )}
                            >
                              <option value={""}>---</option>
                              {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-1/2 flex flex-col items-start   ">
                            <label className={"text-sm"}>Statut</label>
                            <select
                              name={"status"}
                              value={formik.values.status}
                              className={clsx(
                                formik.touched.status &&
                                  formik.errors.status &&
                                  "border-red-500",
                                "w-full p-2 border rounded-md"
                              )}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>---</option>
                              <option value="pending">En attente</option>
                              <option value="success">Payée</option>
                              <option value="canceled">Annulée</option>
                            </select>
                          </div>
                        </div>
                        <div className={"flex flex-col items-start"}>
                          <label className={"text-sm"}>Point de vente</label>
                          <select
                            name={"stand"}
                            value={formik.values.stand}
                            onChange={formik.handleChange}
                            className={clsx(
                              formik.touched.stand &&
                                formik.errors.stand &&
                                "border-red-500",
                              "w-1/2 p-2 border rounded-md"
                            )}
                          >
                            <option value={""}>---</option>
                            {stands?.map((stand) => (
                              <option key={stand.id} value={stand.name}>
                                {stand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mx-1">
                          <div className="flex items-center">
                            <button
                              type={"button"}
                              onClick={() => setEnabled(!enabled)}
                              className={clsx(
                                enabled ? "bg-indigo-600" : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={clsx(
                                  enabled ? "translate-x-5" : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </button>
                            <span className="ml-3 text-sm">
                              {enabled ? (
                                <span className="text-gray-500">
                                  Rechercher par date
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  Rechercher par intervalle de temps
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        {enabled && (
                          <div
                            className={
                              "flex flex-col items-start justify-center"
                            }
                          >
                            <label className={"text-sm appearance-none"}>
                              Date
                            </label>
                            <input
                              type="date"
                              name={"date"}
                              value={formik.values.date}
                              onChange={formik.handleChange}
                              className={clsx(
                                "border p-2 w-1/2 rounded-md",
                                formik.touched.date &&
                                  formik.errors.date &&
                                  "border-red-500"
                              )}
                            />
                          </div>
                        )}
                        {!enabled && (
                          <div className={"flex space-x-2 justify-between"}>
                            <div className={"flex flex-col items-start w-1/2"}>
                              <label className={"text-sm"}>DEBUT</label>
                              <input
                                type="date"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                name={"startDate"}
                                className={clsx(
                                  "border p-2 w-full rounded-md",
                                  formik.touched.startDate &&
                                    formik.errors.startDate &&
                                    "border-red-500"
                                )}
                              />
                            </div>
                            <div className={"flex flex-col items-start w-1/2"}>
                              <label className={"text-sm "}>FIN</label>
                              <input
                                type="date"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                name={"endDate"}
                                className={clsx(
                                  "border p-2 w-full rounded-md",
                                  formik.touched.endDate &&
                                    formik.errors.startDate &&
                                    "border-red-500"
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex items-center justify-center">
                    <button
                      type={"reset"}
                      className={
                        "border bg-red-500 text-white p-2 w-1/2 rounded-md text-sm hover:bg-red-600"
                      }
                      onClick={() => {
                        close();
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Rechercher
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
