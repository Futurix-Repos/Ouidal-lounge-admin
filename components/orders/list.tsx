import { useQuery } from "react-query";
import { fetcher } from "@/helpers";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import clsx from "clsx";
import Loading from "@/components/Loading";
import Items from "./items";
import CancelOrder from "../modals/cancel-order";
import OrdersFilter from "@/components/modals/orders-filter";
import { toggleOrderFilter } from "@/store/slices/orders";

export default function OrdersList() {
  const [currentOrder, setCurrentOrder] = useState({
    table: "",
    zone: "",
    items: [],
    id: "",
  });
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openItems, setOpenItems] = useState(false);
  const startDate = useAppSelector((state) => state.orders.startDate);
  const endDate = useAppSelector((state) => state.orders.endDate);
  const date = useAppSelector((state) => state.orders.date);
  const paymentMethod = useAppSelector((state) => state.orders.paymentMethod);
  const status = useAppSelector((state) => state.orders.status);
  const stand = useAppSelector((state) => state.orders.stand);

  const { isLoading, data: orders } = useQuery<any>(
    ["orders", status, date, paymentMethod, startDate, endDate, stand],
    () =>
      fetcher(
        `/api/orders?status=${status}&date=${date}&paymentMethod=${paymentMethod}&startDate=${startDate}&endDate=${endDate}&stand=${stand}`
      ),
    {
      refetchInterval: 1000,
    }
  );
  const total = orders?.reduce((a, b) => a + b.amount, 0);
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  if (orders?.length === 0) {
    return (
      <>
        <div className="h-72 flex items-center justify-center">
          <h1 className="text-center text-xl font-semibold">
            Aucune commande trouvée
          </h1>
        </div>
      </>
    );
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <CancelOrder
        order={orderToCancel}
        open={openCancelOrder}
        setOpen={setOpenCancelOrder}
      />

      <div className="p-6 inline-flex w-72 items-center rounded-md bg-white  text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
        TOTAL: {total.toLocaleString()} FCFA
      </div>

      <div className="space-x-2 w-full inline-flex">
        <div
          className={clsx(
            "transition duration-200 -mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg inline-block",
            openItems ? "w-2/3" : "w-full"
          )}
        >
          <table className="w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Identifiant
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Montant
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Stand
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Réduction
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Monnaie
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {!open ? "Moyen de paiement" : "Paiement"}
                </th>
                {!openItems && (
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                )}
                {!openItems && (
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Produits
                  </th>
                )}
                {!openItems && (
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Select</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, orderIdx) => (
                <tr key={order.id}>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-transparent",
                      "relative py-4 pl-4 pr-3 text-sm sm:pl-6 flex items-center cursor-pointer hover:bg-gray-50 space-x-2"
                    )}
                  >
                    <svg
                      className={clsx(
                        "h-1.5 w-1.5 ",
                        order.id === currentOrder.id
                          ? "fill-green-600"
                          : "fill-gray-300"
                      )}
                      viewBox="0 0 6 6"
                      aria-hidden="true"
                    >
                      <circle cx="3" cy="3" r="3" />
                    </svg>
                    <div className="font-medium text-gray-900">{order.id}</div>

                    {orderIdx !== 0 ? (
                      <div className="absolute -top-px left-6 right-0 h-px bg-gray-200" />
                    ) : null}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {order.status}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {order.amount ? order.amount.toLocaleString() : "N/A"}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {order.stand ? order.stand : "N/A"}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {order.discount ? order.discount.toLocaleString() : "N/A"}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {order.change ? order.change.toLocaleString() : "N/A"}
                  </td>
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-gray-200",
                      "px-3 py-3.5 text-sm text-gray-500"
                    )}
                  >
                    <div>
                      {order.paymentMethod ? order.paymentMethod : "N/A"}
                    </div>
                  </td>
                  {!openItems && (
                    <td
                      className={clsx(
                        orderIdx === 0 ? "" : "border-t border-gray-200",
                        "px-3 py-3.5 text-sm text-gray-500"
                      )}
                    >
                      <div>{order.updatedAt}</div>
                    </td>
                  )}
                  {!openItems && (
                    <td
                      className={clsx(
                        orderIdx === 0 ? "" : "border-t border-gray-200",
                        "px-3 py-3.5 text-sm text-gray-500"
                      )}
                    >
                      <button
                        onClick={() => {
                          setOpenItems(true);
                          setCurrentOrder(order);
                        }}
                        className="w-full text-center inline-flex justify-center items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        Voir
                      </button>
                    </td>
                  )}
                  <td
                    className={clsx(
                      orderIdx === 0 ? "" : "border-t border-transparent",
                      "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    )}
                  >
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => {
                          setOrderToCancel(order);
                          setOpenCancelOrder(true);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        Annuler
                      </button>
                    )}
                    {orderIdx !== 0 ? (
                      <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Items
          order={currentOrder}
          setOrder={setCurrentOrder}
          open={openItems}
          setOpen={setOpenItems}
        />
      </div>
    </div>
  );
}
