import { fetcher } from "@/helpers";
import { useQuery } from "react-query";
import FullTicket from "./ticket-items";
import { useState } from "react";
import clsx from "clsx";
import TicketsFilter from "@/components/modals/ticket-filter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTicketFilter } from "@/store/slices/tickets";
import { useFormik } from "formik";
import {
  setDate as _setDate,
  setEndDate as _setEndDate,
  setStand as _setStand,
  setStartDate as _setStartDate,
} from "@/store/slices/orders";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tickets() {
  const date = useAppSelector((state) => state.tickets.date);
  const startDate = useAppSelector((state) => state.tickets.startDate);
  const [ticketStartDate, setTicketStartDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const endDate = useAppSelector((state) => state.tickets.endDate);
  const stand = useAppSelector((state) => state.tickets.stand);
  const {
    data: tickets,
    isLoading,
    isFetching,
  } = useQuery(["tickets", date, startDate, endDate, stand], () =>
    fetcher(
      `/api/tickets?date=${date}&startDate=${startDate}&endDate=${endDate}&stand=${stand}`
    )
  );
  const dispatch = useAppDispatch();
  const [ticketId, setTicketId] = useState("");

  const [ticketItems, setTicketItems] = useState([]);
  const [ticketPayments, setTicketPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const formik = useFormik({
    initialValues: {
      stand: stand,
      date: date,
      startDate: startDate,
      endDate: endDate,
    },
    onSubmit: ({ stand, date, startDate, endDate }) => {
      if (date) {
        formik.setFieldValue("startDate", "");
        formik.setFieldValue("endDate", "");
      }

      if (startDate && endDate) {
        formik.setFieldValue("date", "");
      }

      dispatch(_setStand(stand));
      dispatch(_setDate(date));
      dispatch(_setStartDate(startDate));
      dispatch(_setEndDate(endDate));
      close();
    },
  });
  if (!isLoading && tickets.length == 0) {
    return (
      <div className="flex items-center justify-center h-screen ">
        Pas de tickets Z
      </div>
    );
  }

  return (
    <>
      <TicketsFilter />
      <button
        className={clsx(
          isFetching ? "bg-gray-200 animate-pulse" : "bg-amber-600",
          "border p-2 ml-8 rounded-md flex items-center space-x-2 justify-center text-white"
        )}
        onClick={() => dispatch(toggleTicketFilter())}
      >
        <MagnifyingGlassCircleIcon className={"h-5 w-5 stoke-white"} />
        <span>RECHERCHER</span>
      </button>
      <div className="flex">
        <div className="px-4 sm:px-6 lg:px-8 w-[50vw]">
          <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
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
                    Ouverture
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Clôture
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Détails</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets?.map((ticket, ticketIdx) => (
                  <tr key={ticket._id}>
                    <td className="flex items-center justify-start space-x-2 p-5 text-sm text-gray-500">
                      <svg
                        className={clsx(
                          "h-1.5 w-1.5 ",
                          ticketId === ticket._id
                            ? "fill-amber-600"
                            : "fill-gray-300"
                        )}
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                      >
                        <circle cx="3" cy="3" r="3" />
                      </svg>
                      <p>{ticket.total.toLocaleString("en-US")}</p>
                    </td>
                    <td
                      className={classNames(
                        ticketIdx === 0 ? "" : "border-t border-gray-200",
                        "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                      )}
                    >
                      {new Date(ticket.startDate).toLocaleString("en-US")}
                    </td>
                    <td
                      className={classNames(
                        ticketIdx === 0 ? "" : "border-t border-gray-200",
                        "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                      )}
                    >
                      {new Date(ticket.closeDate).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })}
                    </td>
                    <td
                      className={classNames(
                        ticketIdx === 0 ? "" : "border-t border-transparent",
                        "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setTicketId(ticket._id);
                          setTicketItems(ticket.items);
                          setTicketPayments(ticket.paymentMethods);
                          setTotal(ticket.total);
                          setTicketStartDate(
                            new Date(ticket.startDate).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )
                          );
                          setCloseDate(
                            new Date(ticket.closeDate).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )
                          );
                          setShowTicket(true);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        Détails
                      </button>
                      {ticketIdx !== 0 ? (
                        <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showTicket && (
          <FullTicket
            showTicket={showTicket}
            startDate={ticketStartDate}
            closeDate={closeDate}
            items={ticketItems}
            payments={ticketPayments}
            total={total}
            setShowTicket={setShowTicket}
          />
        )}
      </div>
    </>
  );
}
