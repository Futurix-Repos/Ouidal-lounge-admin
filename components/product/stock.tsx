// Creation of a product linked to the stock
import React from "react"
import {useFormik} from "formik"
import numeral from "numeral"
import {NumericFormat} from "react-number-format"
import {useMutation, useQuery} from "react-query"
import axios from "axios"
import {BeatLoader} from "react-spinners"
import {fetcher} from "@/helpers"
import Link from "next/link"
import {ArrowLeftIcon} from "@heroicons/react/20/solid"

export default function ProductStock() {
  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      warehouseId: "",
      unit: "unité",
      buyingPrice: 0,
      coef: 1,
      stands: [],
      contenance: 0,
      parStock: "",
      sellingPerUnit: false,
      sellingPerUnitPrice: "",
      sellingPerUnitQty: "",
      quantity: "",
      cookingPlace: "bar",
    },
    onSubmit: (values) => {
      if (values.stands.length === 0) {
        alert("Veuillez selectionner au moins un point de vente.")
        return
      }
      if (!values.buyingPrice) {
        alert("Veuillez insérer un prix!")
        return
      }
      const sellingPrice = values.buyingPrice * values.coef
      const margin = sellingPrice - values.buyingPrice
      const marginPercent = (margin / values.buyingPrice) * 100
      const payload = {
        ...values,
        sellingPrice,
        margin: marginPercent,
      }
      mutation.mutate(payload)
    },
  })
  const {data: categories, isLoading: categoriesIsLoading} = useQuery(
    "categories",
    () => fetcher("/api/categories"),
    {
      onSuccess: (categories) => {
        if (categories && !formik.values.categoryId) {
          formik.setFieldValue("categoryId", categories?.[0].id)
        }
      },
    }
  )
  const {data: warehouses, isLoading: warehousesIsLoading} = useQuery(
    "warehouses",
    () => fetcher("/api/warehouses"),
    {
      onSuccess: (warehouses) => {
        if (warehouses && !formik.values.warehouseId) {
          formik.setFieldValue("warehouseId", warehouses?.[0]?.id)
        }
      },
    }
  )
  const {data: stands, isLoading: standsIsLoading} = useQuery(
    "stands",
    () => fetcher("/api/stands"),
    {
      onSuccess: (pos) => {
        if (pos && !formik.values.stands.length) {
          formik.setFieldValue("stands", [pos?.[0].id])
        }
      },
    }
  )
  const mutation = useMutation<any, any, any>(
    "createProduct",
    async (payload: any) => {
      const res = await axios.post("/api/stock/product", payload)
      return res.data
    },
    {
      onSuccess: () => {
        formik.resetForm()
        mutation.reset()
      },
    }
  )

  const handleNumberChange = (value: any, input: any) => {
    formik.setFieldValue(input, value.floatValue)
  }
  return (
    <>
      <Link
        href="/product"
        className="inline-flex ml-12 mb-12 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Retour à la selection
      </Link>
      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
        <div>
          <div className="mt-3 text-center ">
            <h1 className="text-base font-semibold leading-6 text-gray-900 uppercase">
              Enrégistrement d'un nouveau produit type
            </h1>
            <div className="mt-2 grid grid-cols-6 gap-4">
              <section className="shadow-md rounded-sm col-span-full grid grid-cols-6 gap-y-4 gap-x-4 border p-4">
                <h2 className="col-span-full mb-6  uppercase text-lg font-semibold flex items-center justify-start">
                  Description du produit
                </h2>
                {/* Name */}
                <div className="col-span-3 flex flex-col items-start">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="block p-2  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {/* categoryId */}
                {!categories && categoriesIsLoading ? (
                  <div className="col-span-3 flex flex-col items-start">
                    <BeatLoader size={4} />
                  </div>
                ) : (
                  <div className="col-span-3 flex flex-col items-start">
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Catégorie
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      onChange={formik.handleChange}
                      className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {categories?.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* warehouseId */}

                {!warehouses && warehousesIsLoading ? (
                  <div className="col-span-3 flex flex-col items-center justify-start">
                    <BeatLoader size={4} />
                  </div>
                ) : (
                  <div className="col-span-3 flex flex-col items-start">
                    <label
                      htmlFor="warehouseId"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Entrepôt
                    </label>
                    <select
                      id="warehouseId"
                      name="warehouseId"
                      defaultValue="Bar"
                      onChange={formik.handleChange}
                      className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* cookingPlace */}
                <div className="col-span-3 flex flex-col items-start">
                  <label
                    htmlFor="cookingPlace"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Lieu de préparation
                  </label>
                  <select
                    id="cookingPlace"
                    name="cookingPlace"
                    value={formik.values.cookingPlace}
                    onChange={formik.handleChange}
                    className="block p-2 h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>bar</option>
                    <option>cuisine</option>
                    <option>autre</option>
                  </select>
                </div>
              </section>
              <section className="shadow-md rounded-sm col-span-full grid grid-cols-6 gap-y-4 gap-x-4 border p-4">
                <h2 className="col-span-full mb-6">
                  <span className="uppercase font-semibold flex items-center justify-start">
                    Informations de prix
                  </span>
                </h2>
                {/* Buying Price */}
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
                      handleNumberChange(value, "buyingPrice")
                    }}
                    allowNegative={false}
                    required
                    className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Selling Price */}
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
                    <input
                      type="number"
                      name="coef"
                      id="coef"
                      min="1"
                      value={formik.values.coef}
                      onChange={formik.handleChange}
                      className="block  p-2 h-10 w-[20%]  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <span className="inline-flex w-1/3 items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                      {numeral((formik.values.buyingPrice * formik.values.coef).toFixed(2)).format(
                        "0,0"
                      )}
                    </span>
                    <span className="inline-flex w-1/3 items-center border  border-gray-300 px-3 text-gray-500 sm:text-sm">
                      {numeral(
                        (
                          ((formik.values.buyingPrice * formik.values.coef -
                            formik.values.buyingPrice) /
                            formik.values.buyingPrice) *
                          100
                        ).toFixed()
                      ).format("0,0")}
                      %
                    </span>
                  </div>
                </div>
              </section>
              <section className="shadow-md rounded-sm col-span-full grid grid-cols-6 gap-y-4 gap-x-4 border p-4">
                <h2 className="col-span-full mb-6">
                  <span className="uppercase font-bold flex items-center justify-start">
                    Informations de stock
                  </span>
                </h2>
                {/* Quantity */}
                <div className="col-span-3 flex flex-col items-start">
                  <label
                    htmlFor="quantity"
                    className="block  text-sm font-medium leading-6 text-gray-900"
                  >
                    Quantité initiale
                  </label>
                  <div className="w-full">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      required
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      className="block h-10 p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* Par Stock */}
                <div className="col-span-3 flex flex-col items-start">
                  <label
                    htmlFor="parStock"
                    className="block  text-sm font-medium leading-6 text-gray-900"
                  >
                    Par Stock
                  </label>
                  <div className="w-full ">
                    <input
                      type="number"
                      name="parStock"
                      id="parStock"
                      required
                      value={formik.values.parStock}
                      onChange={formik.handleChange}
                      className="block h-10 p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </section>
              {/* sellingPerUnit */}
              <div className="col-span-full relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="sellingPerUnit"
                    name="sellingPerUnit"
                    type="checkbox"
                    checked={formik.values.sellingPerUnit}
                    onChange={formik.handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="comments" className="font-medium text-gray-900">
                    Vente à la consommation
                  </label>
                </div>
              </div>
              {formik.values.sellingPerUnit && (
                <section className="shadow-md rounded-sm col-span-full grid grid-cols-6 gap-y-4 gap-x-4 border p-4">
                  <h2 className="col-span-full mb-6">
                    <span className="uppercase font-bold flex items-center justify-start">
                      Informations de vente à la consommation
                    </span>
                  </h2>
                  {/* Contenance and unit*/}
                  <div className="col-span-3 flex flex-col items-start">
                    <label
                      htmlFor="contenance"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contenance
                    </label>
                    <div className="relative w-full rounded-md shadow-sm">
                      <NumericFormat
                        displayType={"input"}
                        value={formik.values.contenance}
                        thousandSeparator={true}
                        onValueChange={(value) => {
                          handleNumberChange(value, "contenance")
                        }}
                        allowNegative={false}
                        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select
                          id="unit"
                          name="unit"
                          value={formik.values.unit}
                          onChange={formik.handleChange}
                          className="h-full p-2 rounded-md border-0 bg-transparent text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        >
                          <option></option>
                          <option>cl</option>
                          <option>g</option>
                          <option>l</option>
                          <option>portion</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* sellingPerUnitPrice */}
                  {
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
                            handleNumberChange(value, "sellingPerUnitPrice")
                          }}
                          allowNegative={false}
                          className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  }
                  {/* sellingPerUnitQty */}
                  {
                    <div className="col-span-3  flex flex-col items-start">
                      <label
                        htmlFor="sellingPerUnitQty"
                        className="block  text-sm font-medium leading-6 text-gray-900"
                      >
                        Quantité consommation
                      </label>
                      <div className=" w-full">
                        <input
                          type="number"
                          name="sellingPerUnitQty"
                          id="sellingPerUnitQty"
                          value={formik.values.sellingPerUnitQty}
                          required={formik.values.sellingPerUnit}
                          onChange={formik.handleChange}
                          className="block h-10 p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  }
                </section>
              )}

              {/* Stands */}
              {standsIsLoading && !stands ? (
                <div className="col-span-3 ">
                  <BeatLoader />
                </div>
              ) : (
                <div className="border rounded-sm shadow-md col-span-3 flex flex-col items-start p-4">
                  <label className="uppercase font-bold mb-6 leading-6 text-gray-900">
                    Stands de vente
                  </label>
                  <div className="border w-full divide-y divide-gray-200 border-b border-t border-gray-200">
                    {stands.map((stand, standIdx) => (
                      <div key={standIdx} className="relative flex items-start justify-between p-2">
                        <div className=" text-sm leading-6">
                          <label
                            htmlFor={`stand-${stand.id}`}
                            className="select-none font-medium text-gray-900"
                          >
                            {stand.name}
                          </label>
                        </div>
                        <div className="ml-3 flex h-6 items-center">
                          <input
                            id={`stand-${stand.id}`}
                            name={`stand-${stand.id}`}
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values.stands.includes(stand.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const standIsAlreadyAdded = formik.values.stands.find(
                                  (s) => s === stand.id
                                )
                                if (standIsAlreadyAdded) return
                                formik.setFieldValue("stands", [...formik.values.stands, stand.id])
                              } else {
                                formik.setFieldValue(
                                  "stands",
                                  formik.values.stands.filter((s) => s !== stand.id)
                                )
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {mutation.isIdle && (
            <button
              type="submit"
              className="w-1/2 mt-6 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enrégistrer
            </button>
          )}
          {mutation.isLoading && (
            <div className="w-1/2 animate-pulse mt-6 flex items-center justify-center space-x-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  ">
              <span>Enrégistrement en cours</span>
            </div>
          )}
          {mutation.isError && (
            <div className="w-full flex items-end space-x-4">
              <button
                type="submit"
                className="w-1/2 mt-6 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cliquer pour réessayer
              </button>
              <p className="p-2">Une erreur est survenue {mutation.error?.response?.data?.msg}</p>
            </div>
          )}
        </div>
      </form>
    </>
  )
}
