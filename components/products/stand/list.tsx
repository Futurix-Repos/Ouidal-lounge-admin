import { useState } from "react";
import { Menu } from "@headlessui/react";

import { useQuery } from "react-query";
import { fetcher } from "@/helpers";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Loading from "@/components/Loading";
import { MinusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

import { setStandProductId } from "@/store/slices/products";
import DeleteSpecialProduct from "@/components/modals/del-special-product";
import IncrementStandStock from "@/components/modals/inc-stand-stock";
import DecrementStandStock from "@/components/modals/dec-stand-stock";

import clsx from "clsx";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import UpdateBundleProduct from "@/components/modals/update-bundle-product";

export default function Products() {
  const [openIncrement, setOpenIncrement] = useState(false);
  const [openDecrement, setOpenDecrement] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdateBundle, setOpenUpdateBundle] = useState(false);
  const [bundleProduct, setBundleProduct] = useState<any>({});
  const [product, setProduct] = useState<any>({});
  const dispatch = useAppDispatch();
  const productName = useAppSelector(
    (state) => state.products.stand.productName
  );
  const standId = useAppSelector((state) => state.products.stand.standId);
  const categoryId = useAppSelector((state) => state.products.stand.categoryId);

  const { isLoading, data: products } = useQuery<any>(
    ["selling-products", standId, categoryId, productName],
    () =>
      fetcher(
        `/api/selling-products?standId=${standId}&categoryId=${categoryId}&name=${productName}`
      )
  );

  return (
    <>
      <UpdateBundleProduct
        product={bundleProduct}
        open={openUpdateBundle}
        setOpen={setOpenUpdateBundle}
      />
      <IncrementStandStock open={openIncrement} setOpen={setOpenIncrement} />
      <DecrementStandStock open={openDecrement} setOpen={setOpenDecrement} />
      <DeleteSpecialProduct
        open={openDelete}
        setOpen={setOpenDelete}
        product={product}
      />
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <ul
          role="list"
          className="grid p-4 mt-8 grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {products?.map((product) => (
            <li
              key={product.id}
              className={clsx(
                "overflow-hidden rounded-xl border border-gray-200",
                product.special && "bg-yellow-50"
              )}
            >
              <div
                className={clsx(
                  product.bundle ? " bg-amber-300 text-white" : "text-gray-900",
                  "flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
                )}
              >
                <div className="text-sm font-medium leading-6  first-letter:uppercase">
                  {product.name}
                </div>

                <Menu as="div" className="relative ml-auto flex space-x-4">
                  {product.bundle && (
                    <button
                      onClick={() => {
                        setBundleProduct(product);
                        setOpenUpdateBundle(true);
                      }}
                    >
                      <PencilSquareIcon
                        className="h-5 w-5 text-white "
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  {!product.bundle && (
                    <button
                      onClick={() => {
                        dispatch(setStandProductId(product.productId));
                        setOpenIncrement(true);
                      }}
                    >
                      <PlusIcon
                        className="h-5 w-5 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  {!product.bundle && (
                    <button
                      onClick={() => {
                        dispatch(setStandProductId(product.productId));
                        setOpenDecrement(true);
                      }}
                    >
                      <MinusCircleIcon
                        className="h-5 w-5 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  {product.special && (
                    <button
                      onClick={() => {
                        setOpenDelete(true);
                        setProduct(product);
                      }}
                    >
                      <TrashIcon
                        className="h-5 w-5 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </Menu>
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                {!product.special && !product.bundle ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Stock</dt>
                    <dd className="text-gray-700">
                      {(product.stock / product.contenance).toFixed(2)}
                    </dd>
                  </div>
                ) : null}

                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Prix de vente</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {Number(product.price).toLocaleString()} FCFA
                    </div>
                  </dd>
                </div>
                {product.bundle && (
                  <>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">
                        Ingrédient{product.ingredients.length > 1 ? "s" : ""}
                      </dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {product.ingredients.length}
                        </div>
                      </dd>
                    </div>
                    <ul
                      className={
                        "list-disc pl-8 h-32 overflow-auto text-gray-500"
                      }
                    >
                      {product.ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                          {ingredient.name} : {ingredient.qty} {ingredient.unit}
                          {ingredient.unit.length > 2 && ingredient.qty > 1
                            ? "s"
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {product?.sellingPerUnit?.isTrue && (
                  <>
                    {" "}
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Contenance</dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {product.contenance}
                        </div>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Quantité conso</dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {product.sellingPerUnit.qty}{" "}
                          {product.sellingPerUnit.unit}
                          {product.sellingPerUnit.qty >= 1 &&
                          product.sellingPerUnit?.unit?.length > 2
                            ? "s"
                            : ""}
                        </div>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Prix conso</dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {product.sellingPerUnit.price.toLocaleString()} FCFA
                        </div>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </li>
          ))}
        </ul>
      )}
      {!isLoading && products?.length === 0 && (
        <div className="flex w-full items-center justify-center h-[30vh]">
          <p className="text-gray-400">Aucun produit trouvé</p>
        </div>
      )}
    </>
  );
}
