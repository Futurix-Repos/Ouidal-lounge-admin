import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "react-query";
import { fetcher } from "@/helpers";
import axios from "axios";
import { queryClient } from "@/pages/_app";

export default function UpdateBundleProduct({ open, setOpen, product }) {
  const { data: ingredients } = useQuery({
    queryKey: ["selling-products"],
    queryFn: () => fetcher(`/api/ingredients`),
  });

  const mutation = useMutation({
    mutationKey: ["update-bundle-product"],
    mutationFn: (values: any) => axios.put(`/api/bundle/product`, values),
    onSuccess: () => {
      queryClient.invalidateQueries(["selling-products"]);
    },
  });
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Modifier le produit
                    </Dialog.Title>
                    <Formik
                      initialValues={{
                        name: product.name,
                        price: product.price,
                        ingredients: product.ingredients,
                      }}
                      onSubmit={(values) => {
                        mutation.mutate({
                          ...values,
                          productId: product.id,
                        });
                      }}
                      onReset={() => {
                        setOpen(false);
                        mutation.reset();
                      }}
                    >
                      {({ values }) => (
                        <Form className="mt-2">
                          <div className="space-y-4 text-gray-900">
                            <div
                              className={
                                "flex flex-col items-start justify-center"
                              }
                            >
                              <label className={"text-sm"}>
                                NOM DU PRODUIT
                              </label>
                              <Field
                                name={"name"}
                                type="text"
                                className="border p-2 border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div
                              className={
                                "flex flex-col items-start justify-center"
                              }
                            >
                              <label className={"text-sm"}>PRIX DE VENTE</label>
                              <Field
                                name={"price"}
                                type="text"
                                className="border p-2 border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div
                              className={
                                "flex flex-col items-start justify-center"
                              }
                            >
                              <label>INGREDIENTS</label>

                              <FieldArray
                                name={"ingredients"}
                                render={(arrayHelpers) => (
                                  <>
                                    <select
                                      onChange={(e) => {
                                        if (!e.target.value) return;
                                        const _ingredient = ingredients.find(
                                          (ingredient) =>
                                            ingredient.name === e.target.value
                                        );
                                        if (
                                          !values.ingredients.find(
                                            (ingredient) =>
                                              ingredient.id === _ingredient.id
                                          )
                                        ) {
                                          arrayHelpers.push({
                                            name: _ingredient.name,
                                            qty: 1,
                                            unit: _ingredient.sellingPerUnit
                                              .unit,
                                            id: _ingredient.id,
                                          });
                                        }
                                      }}
                                      className={
                                        "w-full border border-gray-300 p-2 my-2"
                                      }
                                    >
                                      <option value={""}></option>
                                      {ingredients?.map((ingredient) => (
                                        <option
                                          key={ingredient.id}
                                          value={ingredient.name}
                                        >
                                          {ingredient.name}
                                        </option>
                                      ))}
                                    </select>
                                    <div
                                      className={
                                        "h-48 border overflow-auto w-full"
                                      }
                                    >
                                      {values.ingredients.map(
                                        (ingredient, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className={
                                                "flex items-center justify-between p-3 border space-x-8"
                                              }
                                            >
                                              <div
                                                className={
                                                  "flex items-center justify-center space-x-3"
                                                }
                                              >
                                                <span
                                                  className={
                                                    "first-letter:uppercase"
                                                  }
                                                >
                                                  {ingredient.name}
                                                </span>
                                                <span>{ingredient.qty}</span>
                                              </div>
                                              <div className={"space-x-3"}>
                                                <button
                                                  type={"button"}
                                                  className={
                                                    "border rounded-md px-4 py-2"
                                                  }
                                                  onClick={() => {
                                                    const product =
                                                      values.ingredients.find(
                                                        (_ingredient) =>
                                                          _ingredient.id ===
                                                          ingredient.id
                                                      );

                                                    product.qty++;
                                                    arrayHelpers.replace(
                                                      index,
                                                      product
                                                    );
                                                  }}
                                                >
                                                  +
                                                </button>
                                                <button
                                                  type={"button"}
                                                  className={
                                                    "border rounded-md px-4 py-2"
                                                  }
                                                  onClick={() => {
                                                    const product =
                                                      values.ingredients.find(
                                                        (_ingredient) =>
                                                          _ingredient.id ===
                                                          ingredient.id
                                                      );
                                                    if (product.qty)
                                                      product.qty--;
                                                    arrayHelpers.replace(
                                                      index,
                                                      product
                                                    );
                                                  }}
                                                >
                                                  -
                                                </button>
                                                <button
                                                  type={"button"}
                                                  className={
                                                    "rounded-md px-4 py-2 border"
                                                  }
                                                  onClick={() => {
                                                    arrayHelpers.remove(index);
                                                  }}
                                                >
                                                  <TrashIcon
                                                    className={"w-5 h-5"}
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            {mutation.isIdle && (
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Valider
                              </button>
                            )}
                            {mutation.isLoading && (
                              <div
                                className={
                                  "w-full flex items-center justify-center"
                                }
                              >
                                <div
                                  className={
                                    "rounded-full p-2 border border-t-blue-500 w-6 h-6 animate-spin"
                                  }
                                />
                              </div>
                            )}
                            {mutation.isSuccess && (
                              <button
                                onClick={() => {
                                  setOpen(false);
                                  mutation.reset();
                                }}
                                type="reset"
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Modification effectuée!
                              </button>
                            )}
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
