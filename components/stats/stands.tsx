import {useState, useEffect} from "react"
import {fetcher} from "@/helpers"
import {ArrowLeftIcon, ArrowPathIcon} from "@heroicons/react/20/solid"
import Link from "next/link"
import {useQuery} from "react-query"
import {useAppDispatch, useAppSelector} from "@/store/hooks"
import {
  setPerStandDate,
  setPerStandIntervalEnd,
  setPerStandIntervalStart,
  setPerStandProductName,
  setPerStandStandId,
} from "@/store/slices/stats"

export default function StatsStands() {
  const [name, setName] = useState("");
  const [searchByDate, setSearchByDate] = useState(false);
  const [date, setDate] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const stand = useAppSelector((state) => state.stats.perStand.standId);
  const productName = useAppSelector(
    (state) => state.stats.perStand.productName
  );

  const dispatch = useAppDispatch();
  const refreshDate = () => {
    setDate("");
    setStartDate("");
    setEndDate("");
    setName("");
  };
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setPerStandProductName(name));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [name]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setPerStandIntervalEnd(endDate));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [startDate]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setPerStandIntervalStart(startDate));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [startDate]);
  useEffect(() => {
    let tid = setTimeout(() => {
      dispatch(setPerStandDate(date));
    }, 1000);

    return () => {
      clearTimeout(tid);
    };
  }, [date]);
  const { data: products } = useQuery(
    ["stats-products", date, startDate, endDate, stand, productName],
    () =>
      fetcher(
        `/api/stats/stands?date=${date}&startDate=${startDate}&endDate=${endDate}&stand=${stand}&productName=${productName}`
      )
  );
  const { data: stands, isLoading: standsIsLoading } = useQuery("stands", () =>
    fetcher("/api/stands")
  );
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Link
        href="/stats"
        className="inline-flex mb-12 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
        <button
          className="p-2 border rounded bg-slate-200 hover:bg-slate-400"
          onClick={refreshDate}
        >
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 w-full flex space-x-12 p-2 border items-center">
        <div className="relative w-1/3 flex flex-col items-start">
          <label
            htmlFor="searchByDate"
            className="font-medium text-sm text-gray-900"
          >
            Nom de produit
          </label>
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
        <div className="w-1/3">
          <label htmlFor="stand" className="font-medium text-sm text-gray-900">
            Points de vente
          </label>
          <select
            id="stand"
            name="stand"
            value={stand}
            onChange={(e) => dispatch(setPerStandStandId(e.target.value))}
            className=" border p-2 block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">Tous les points de vente</option>
            {stands?.map((stand) => (
              <option key={stand.id} value={stand.id}>
                {stand.name}
              </option>
            ))}
          </select>
        </div>
        {searchByDate && (
          <div className="w-1/3">
            <label className="text-sm font-bold">Date </label>
            <input
              type="date"
              name="date"
              id="date"
              className="block w-full h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
        )}

        {!searchByDate && (
          <div className="flex w-1/3 items-center space-x-4">
            <div className="w-1/2">
              <label className="text-sm font-bold">Début</label>
              <input
                type="date"
                name="startDate"
                className="block w-full  h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </div>
            <div className="w-1/2">
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
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {products?.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-300">
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
