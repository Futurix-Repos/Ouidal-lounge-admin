import {useState, useEffect, useRef} from "react"
import {fetcher} from "@/helpers"
import {ArrowLeftIcon, ArrowPathIcon} from "@heroicons/react/20/solid"
import Link from "next/link"
import {useQuery} from "react-query"
import {useAppDispatch, useAppSelector} from "@/store/hooks"
import {
  setGlobalDate,
  setGlobalIntervalEnd,
  setGlobalIntervalStart,
  setGlobalProductName,
} from "@/store/slices/stats"
import {useReactToPrint} from "react-to-print"
export default function StatsProducts() {
  const componentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
    documentTitle:
      "Statistique de vente des produits" +
      " " +
      new Date().toLocaleDateString(),
    bodyClass: "p-4",
  });
  const [searchByDate, setSearchByDate] = useState(false);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const productName = useAppSelector((state) => state.stats.global.productName);
  const dispatch = useAppDispatch();
  const refreshDate = () => {
    setDate("");
    setStartDate("");
    setEndDate("");
    setName("");
  };

  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setGlobalProductName(name));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [name]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setGlobalIntervalEnd(endDate));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [startDate]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setGlobalIntervalStart(startDate));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [startDate]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setGlobalDate(date));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [date]);
  const { data: products, isLoading } = useQuery(
    ["stats-products", date, startDate, endDate, productName],
    () =>
      fetcher(
        `/api/stats/products?date=${date}&startDate=${startDate}&endDate=${endDate}&productName=${productName}`
      )
  );
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Link
        href="/stats"
        className="inline-flex mb-12 items-center gap-x-2 rounded-md bg-amber-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Retour à la selection
      </Link>
      <div className="sm:flex sm:items-center space-x-4 justify-start">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="searchByDate"
              name="searchByDate"
              checked={searchByDate}
              onChange={() => setSearchByDate(true)}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="searchByDate" className="font-medium text-gray-900">
              Rechercher par date
            </label>{" "}
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="searchByInterval"
              name="searchByInterval"
              checked={!searchByDate}
              onChange={() => setSearchByDate(false)}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label
              htmlFor="searchByInterval"
              className="font-medium text-gray-900"
            >
              Rechercher par intervalle de temps
            </label>{" "}
          </div>
        </div>
        <div className="relative flex items-start">
          <input
            type="search"
            name="name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="block w-full h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Nom de produit"
          />
        </div>
        <button
          className="p-2 border rounded bg-slate-200 hover:bg-slate-400"
          onClick={refreshDate}
        >
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4">
        {searchByDate && (
          <div>
            <label className="text-sm font-bold">Date </label>
            <input
              type="date"
              name="date"
              id="date"
              className="block w-1/3 h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
        )}

        {!searchByDate && (
          <div className="flex w-full items-center space-x-4">
            <div>
              <label className="text-sm font-bold">Début</label>
              <input
                type="date"
                name="startDate"
                className="block  h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-sm font-bold">Fin</label>
              <input
                type="date"
                name="endDate"
                className="block  h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => handlePrint()}
          className="border rounded p-2 mt-2 hover:bg-amber-500-200 bg-amber-700 text-white"
        >
          Imprimer
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {products?.length > 0 ? (
              <table
                ref={componentToPrint}
                className="min-w-full divide-y divide-gray-300"
              >
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Nom du produit
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantité vendue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products?.map((product) => (
                    <tr key={product.name} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {product.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-bold text-md">Pas de produits trouvés!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
