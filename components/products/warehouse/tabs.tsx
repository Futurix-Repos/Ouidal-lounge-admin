import { useQuery } from "react-query";
import { fetcher } from "@/helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import Loading from "@/components/Loading";
import {
  setWarehouseCategoryId,
  setWarehouseId,
  setWarehouseProductName,
} from "@/store/slices/products";

function SearchBar() {
  const dispatch = useAppDispatch();
  const productName = useAppSelector(
    (state) => state.products.warehouse.productName
  );
  return (
    <div className="w-1/3">
      <label className="text-">Recherche de produit</label>
      <input
        type="search"
        name="productName"
        id="productName"
        value={productName}
        onChange={(e) => dispatch(setWarehouseProductName(e.target.value))}
        className="block w-full h-12 border p-2 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Rechercher un produit"
      />
    </div>
  );
}

function WarehouseSelect({ warehouses }) {
  const warehouseId = useAppSelector(
    (state) => state.products.warehouse.warehouseId
  );
  const dispatch = useAppDispatch();

  return (
    <div className="w-1/3">
      <label className="">Entrepôts de stockage</label>
      <select
        id="warehouse"
        name="warehouse"
        value={warehouseId}
        onChange={(e) => dispatch(setWarehouseId(e.target.value))}
        className=" border p-2 block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">Tous les entrepôts</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function CategorySelect({ categories }) {
  const dispatch = useAppDispatch();
  const categoryId = useAppSelector(
    (state) => state.products.warehouse.categoryId
  );

  return (
    <div className="w-1/3">
      <label className="text-">Catégories de produit</label>
      <select
        id="category"
        name="category"
        value={categoryId}
        onChange={(e) => dispatch(setWarehouseCategoryId(e.target.value))}
        className=" p-2 border block w-full rounded-md h-12 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
export default function FilterTab() {
  const { data: categories, isLoading: categoriesIsLoading } = useQuery(
    "categories",
    () => fetcher("/api/categories")
  );

  const { data: warehouses, isLoading: warehouseIsLoading } = useQuery(
    "warehouses",
    () => fetcher("/api/warehouses")
  );
  if (warehouseIsLoading || categoriesIsLoading) return <Loading />;
  return (
    <div className="bg-gray-400 shadow-md rounded-sm w-full sticky top-0 flex items-center justify-center space-x-4 p-2">
      <SearchBar />
      <WarehouseSelect warehouses={warehouses} />
      <CategorySelect categories={categories} />
    </div>
  );
}
