import {useQuery} from "react-query"
import {useEffect, useState} from "react"
import {fetcher} from "@/helpers"
import {useAppDispatch, useAppSelector} from "@/store/hooks"

import Loading from "@/components/Loading"
import {
  setStandId,
  setStandProductName,
  setStandCategoryId,
  setStandType,
  setStandDate,
} from "@/store/slices/history"

function SearchBar() {
  const dispatch = useAppDispatch()
  const productName = useAppSelector((state) => state.history.stand.productName)
  return (
    <div className="w-1/3">
      <label className="text-">Recherche de produit</label>
      <input
        type="search"
        name="productName"
        id="productName"
        value={productName}
        onChange={(e) => dispatch(setStandProductName(e.target.value))}
        className="block w-full h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Rechercher un produit"
      />
    </div>
  )
}

function StandSelect() {
  const dispatch = useAppDispatch()
  const standId = useAppSelector((state) => state.history.stand.standId)
  const {data: stands, isLoading} = useQuery("stands", () => fetcher("/api/stands"), {
    onSuccess(stands) {
      if (!standId && stands) {
        dispatch(setStandId(stands[0]?.id))
      }
    },
  })

  if (isLoading) return <Loading />

  return (
    <div className="w-1/3">
      <label className="">Points de vente</label>
      <select
        id="stand"
        name="stand"
        value={standId}
        onChange={(e) => dispatch(setStandId(e.target.value))}
        className=" border p-2 block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {stands.map((stand) => (
          <option key={stand.id} value={stand.id}>
            {stand.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function CategorySelect() {
  const dispatch = useAppDispatch()
  const categoryId = useAppSelector((state) => state.history.stand.categoryId)

  const {data: categories, isLoading} = useQuery("categories", () => fetcher("/api/categories"), {
    onSuccess(categories) {
      if (categories && !categoryId) dispatch(setStandCategoryId(categories[0]?.id))
    },
  })

  if (isLoading) return <Loading />

  return (
    <div className="w-1/3">
      <label className="text-">Catégories de produit</label>
      <select
        id="category"
        name="category"
        value={categoryId}
        onChange={(e) => dispatch(setStandCategoryId(e.target.value))}
        className=" p-2 border block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function TypeSelect() {
  const dispatch = useAppDispatch()
  const type = useAppSelector((state) => state.history.stand.type)

  return (
    <div className="w-1/3">
      <label className="text-">Réception/ Retour</label>
      <select
        id="type"
        name="type"
        value={type}
        onChange={(e) => dispatch(setStandType(e.target.value))}
        className=" p-2 border block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="reception">Réception</option>
        <option value="decrement">Retour</option>
      </select>
    </div>
  )
}

function DateFilter() {
  const [date, setDate] = useState("")

  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setStandDate(date))
    }, 1000)

    return () => {
      clearTimeout(tid)
    }
  }, [date])
  const dispatch = useAppDispatch()
  ///const date = useAppSelector((state) => state.history.stand.date)
  return (
    <div>
      <label className="text-sm">Date de réception</label>
      <input
        type="date"
        name="date"
        id="date"
        className="block w-full h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={date}
        onChange={(e) => {
          setDate(e.target.value)
        }}
      />
    </div>
  )
}
export default function FilterTab() {
  return (
    <div className="bg-gray-400 shadow-md rounded-sm w-full sticky top-0 flex items-center justify-center space-x-4 p-2">
      <SearchBar />
      <StandSelect />
      <CategorySelect />
      <TypeSelect />
      <DateFilter />
    </div>
  )
}
