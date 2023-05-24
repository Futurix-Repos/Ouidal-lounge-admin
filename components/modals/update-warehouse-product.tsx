import {Fragment, useEffect, useMemo, useState} from "react"
import {Dialog, Transition} from "@headlessui/react"
import numeral from "numeral"
import {useAppSelector} from "@/store/hooks"

import {useFormik} from "formik"
import {NumericFormat} from "react-number-format"
import MutationState from "../MutationState"
import {useMutation} from "react-query"
import axios from "axios"
import {queryClient} from "@/pages/_app"
export default function UpdateWarehouseProduct({open, setOpen}: any) {
  const warehouseId = useAppSelector((state) => state.products.warehouse.warehouseId)
  const categoryId = useAppSelector((state) => state.products.warehouse.categoryId)
  const productName = useAppSelector((state) => state.products.warehouse.productName)
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/product/update-warehouse-product", data)
      return res.data
    },
    onSuccess() {
      queryClient.invalidateQueries(["stock-products", warehouseId, categoryId, productName])
      mutation.reset()
      setOpen(false)
    },
  })
  const product = useAppSelector((state) => state.products.warehouse.product)
  
  const formik = useFormik({
    initialValues: {
      name: product.name,
      buyingPrice: product.buyingPrice,
      coef: 1,
      sellingPerUnitPrice: product.sellingPerUnit.price,
      sellingPerUnitQty: product.sellingPerUnit.qty,
    },
    onSubmit: async (values) => null,
  })
  useEffect(() => {
      formik.setFieldValue('name', product.name)
  },[product])
  const margin = useMemo(() => {
    return (
      ((formik.values.buyingPrice * formik.values.coef - formik.values.buyingPrice) /
        formik.values.buyingPrice) *
      100
    )
  }, [formik.values.buyingPrice, formik.values.coef])

  const coef = useMemo(() => {
    return Number(product.sellingPrice) / Number(product.buyingPrice)
  }, [formik.values.buyingPrice, formik.values.coef])

  const handleNumberChange = (value: any, input: any) => {
    formik.setFieldValue(input, value.floatValue)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={setOpen}>
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
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    mutation.mutate({
                      productId: product.id,
                      name: formik.values.name,
                      buyingPrice: formik.values.buyingPrice,
                      margin,
                      sellingPrice: formik.values.buyingPrice * formik.values.coef,
                      sellingPerUnitPrice: formik.values.sellingPerUnitPrice,
                      sellingPerUnitQty: formik.values.sellingPerUnitQty,
                    })
                  }}
                >
                  <div className="mt-3 text-center sm:mt-5 space-y-4">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Modifier un produit
                    </Dialog.Title>
                    <div className="col-span-3 flex flex-col items-start">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className="block p-2  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-3 flex flex-col items-start">
                      <label
                        htmlFor="buyingPrice"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Prix d'achât
                      </label>
                      <NumericFormat
                        displayType={"input"}
                        value={formik.values.buyingPrice}
                        thousandSeparator={true}
                        onValueChange={(value) => {
                          formik.setFieldValue("buyingPrice", value.floatValue)
                        }}
                        allowNegative={false}
                        required
                        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-3 flex flex-col items-start">
                      <label
                        htmlFor="coef"
                        className="block  text-sm font-medium leading-6 text-gray-900"
                      >
                        Prix de vente
                      </label>
                      <div className="w-full  flex rounded-md shadow-sm">
                        <span className="inline-flex  items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                          Coef
                        </span>
                      
                  <NumericFormat
                    displayType="input"
                    id="coef"
                    thousandSeparator={true}
                    value={coef}
                    allowNegative={false}
                    onValueChange={(value) => {
                      handleNumberChange(value, 'coef')
                    }}
                    required
                    className="block p-2 h-10 w-[20%]  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                        <span className="inline-flex w-1/3 items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                          {numeral(formik.values.buyingPrice * formik.values.coef).format("0,0")}
                        </span>
                        <span className="inline-flex w-1/3 items-center border  border-gray-300 px-3 text-gray-500 sm:text-sm">
                         {numeral(margin).format("0.0")}
                         
                         
                        </span>
                      </div>
                    </div>

                    {
                      //@ts-ignore
                      product?.sellingPerUnit?.isTrue && (
                        <>
                          <div className="col-span-3  flex flex-col items-start">
                            <label
                              htmlFor="sellingPerUnitPrice"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Prix à la consommation
                            </label>
                            <div className=" w-full">
                              <NumericFormat
                                displayType={"input"}
                                value={formik.values.sellingPerUnitPrice}
                                thousandSeparator={true}
                                onValueChange={(value) => {
                                  formik.setFieldValue("sellingPerUnitPrice", value.floatValue)
                                }}
                                allowNegative={false}
                                className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="col-span-3  flex flex-col items-start">
                            <label
                              htmlFor="sellingPerUnitQty"
                              className="block  text-sm font-medium leading-6 text-gray-900"
                            >
                              Quantité consommation
                            </label>
                            <div className=" w-full">
                              <NumericFormat
                                displayType="input"
                                thousandSeparator={true}
                                allowNegative={false}
                                onValueChange={(value) => {
                                  handleNumberChange(value, 'sellingPerUnitQty')
                                }}
                                required

                                name="sellingPerUnitQty"
                                id="sellingPerUnitQty"
                                value={formik.values.sellingPerUnitQty}
                                className="block h-10 p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </>
                      )
                    }
                  </div>
                  <MutationState mutation={mutation} data={{}} close={() => setOpen(false)} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
