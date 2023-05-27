import { useQuery } from "react-query";
import { useState } from "react";
import { fetcher } from "@/helpers";
import Loading from "../Loading";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setZoneId } from "@/store/slices/zones";
import AddZone from "../modals/add-zone";
import DeleteZone from "../modals/delete-zone";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectZone() {
  const [openAddZone, setOpenAddZone] = useState(false);
  const [openDeleteZone, setOpenDeleteZone] = useState(false);
  const { isLoading, data: zones } = useQuery(
    "zones",
    () => fetcher("/api/zones"),
    {
      onSuccess(zones) {
        if (zones && !zoneId) {
          dispatch(setZoneId(zones?.[0]?.id));
        }
      },
    }
  );
  const dispatch = useAppDispatch();
  const zoneId = useAppSelector((state) => state.zones.zoneId);
  return (
    <div>
      <AddZone open={openAddZone} setOpen={setOpenAddZone} />
      {zones && zones?.length > 0 ? (
        <DeleteZone open={openDeleteZone} setOpen={setOpenDeleteZone} />
      ) : null}
      <div className="space-x-4 m-2">
        <button
          type="button"
          onClick={() => setOpenAddZone(true)}
          className="rounded-md bg-indigo-600 p-3 mt-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ajouter une zone
        </button>
        {zones && zones.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpenDeleteZone(true)}
            className="rounded-md bg-red-600 p-3 mt-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Supprimer une zone
          </button>
        ) : null}
      </div>

      <div className="hidden sm:block">
        {isLoading ? (
          <Loading />
        ) : (
          <nav
            className=" mx-2 whitespace-nowrap overflow-x-auto border bg-slate-200  space-x-4 p-2"
            aria-label="zones"
          >
            {zones.map((zone) => (
              <button
                key={zone.name}
                onClick={() => dispatch(setZoneId(zone.id))}
                className={classNames(
                  zone.id === zoneId
                    ? "bg-green-400 text-white hover:bg-green-600"
                    : "text-white bg-slate-700 hover:bg-slate-400",
                  "rounded-md whitespace-nowrap  px-3 py-2 h-16 w-36 text-sm font-medium  hover:text-white overflow-hidden text-ellipsis"
                )}
              >
                {zone.name}
              </button>
            ))}
          </nav>
        )}

        {zones && zones.length === 0 ? (
          <div>
            <p className="text-center text-xl font-semibold text-gray-500">
              Aucune zone
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
