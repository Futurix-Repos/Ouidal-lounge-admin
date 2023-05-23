import {useState} from "react"
import {Menu} from "@headlessui/react"
import {useQuery} from "react-query"
import {fetcher} from "@/helpers"
import {useAppDispatch, useAppSelector} from "@/store/hooks"
import Loading from "@/components/Loading"
import {MinusCircleIcon, PencilIcon, PlusIcon} from "@heroicons/react/24/outline"

import IncrementStock from "@/components/modals/inc-warehouse-stock"
import DecrementStock from "@/components/modals/dec-warehouse-stock"
import {setWarehouseProduct, setWarehouseProductId} from "@/store/slices/products"
import UpdateWarehouseProduct from "@/components/modals/update-warehouse-product"

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export default function Products() {
    const [openIncrement, setOpenIncrement] = useState(false)
    const [openDecrement, setOpenDecrement] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const dispatch = useAppDispatch()
    const productName = useAppSelector((state) => state.products.warehouse.productName)
    const warehouseId = useAppSelector((state) => state.products.warehouse.warehouseId)
    const categoryId = useAppSelector((state) => state.products.warehouse.categoryId)

    const {isLoading, data: products} = useQuery<any>(
        ["stock-products", warehouseId, categoryId, productName],
        () =>
            fetcher(
                `/api/stock-products?warehouseId=${warehouseId}&categoryId=${categoryId}&productName=${productName}`
            )
    )

    return (
        <>
            <IncrementStock open={openIncrement} setOpen={setOpenIncrement}/>
            <DecrementStock open={openDecrement} setOpen={setOpenDecrement}/>
            <UpdateWarehouseProduct open={openUpdate} setOpen={setOpenUpdate}/>


            {isLoading ? (
                <Loading/>
            ) : (
                <ul role="list" className="grid mt-8 grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 p-4">
                    {products?.map((product) => (
                        <li key={product.id} className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                <div className="text-sm font-medium leading-6 text-gray-900 first-letter:uppercase">{product.name}</div>

                                <Menu as="div" className="relative ml-auto flex space-x-4">
                                    <button
                                        onClick={() => {
                                            dispatch(setWarehouseProductId(product.id))
                                            setOpenIncrement(true)
                                        }}
                                    >
                                        <PlusIcon
                                            className="h-5 w-5 text-gray-400 hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        onClick={() => {
                                            dispatch(setWarehouseProductId(product.id))
                                            setOpenDecrement(true)
                                        }}
                                    >
                                        <MinusCircleIcon
                                            className="h-5 w-5 text-gray-400 hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        onClick={() => {
                                            dispatch(setWarehouseProduct(product))
                                            setOpenUpdate(true)
                                        }}
                                    >
                                        <PencilIcon
                                            className="h-5 w-5 text-gray-400 hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </Menu>
                            </div>
                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Stock</dt>
                                    <dd className="text-gray-700">{product.stock}</dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Prix d&apos;achât</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="font-medium text-gray-900">
                                            {product.buyingPrice.toLocaleString()} FCFA
                                        </div>
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Prix de vente</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="font-medium text-gray-900">
                                            {product.sellingPrice.toLocaleString()} FCFA
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>
            )}
            {!isLoading && products?.length === 0 && (
                <div className="flex w-full items-center justify-center">
                    <p className="text-gray-400">Aucun produit trouvé</p>
                </div>
            )}
        </>
    )
}
