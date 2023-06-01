import { useState } from "react";
import clsx from "clsx";

import { HomeIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArchiveBoxIcon,
  ArrowLeftOnRectangleIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  CogIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { signOut } from "next-auth/react";
import { LogoLayout } from "@/components/logo";

const navigation = [
  { name: "Equipe", href: "/members", icon: UserGroupIcon },
  { name: "Tables", href: "/tables", icon: RectangleStackIcon },
  { name: "Commandes", href: "/orders", icon: CircleStackIcon },
  {
    name: "Statistiques ventes",
    href: "/stats",
    icon: PresentationChartLineIcon,
  },
  {
    name: "Rapport de caisse",
    href: "/tickets",
    icon: PresentationChartLineIcon,
  },
  {
    name: "Inventaire des produits",
    icon: BuildingLibraryIcon,
    href: "/products",
  },
  {
    name: "Historique de l'inventaire",
    icon: ArchiveBoxIcon,
    href: "/history",
  },

  { name: "Créer un produit", href: "/product", icon: HomeIcon },
  { name: "Paramètres", href: "/settings", icon: CogIcon },
];

const NavElement = ({ nav }: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (nav.items) {
    return (
      <li key={nav.name} className="relative">
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          type="button"
          className={clsx(
            open ? "bg-slate-300" : "",
            "w-full border border-black relative flex flex-col rounded-md p-2 text-sm leading-6 font-semibold "
          )}
        >
          <div className="w-full flex items-center justify-between space-x-4 p-2">
            <div className="flex items-center space-x-2">
              <nav.icon
                className={clsx("h-6 w-6 shrink-0")}
                aria-hidden="true"
              />
              <p> {nav.name}</p>
            </div>
          </div>
          {open ? (
            <ul
              className={clsx(
                open ? "translate-y-0" : "translate-y-8 opacity-0",
                "mt-2 w-full transition transform duration-100 space-y-4 flex flex-col"
              )}
            >
              {nav?.items.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className={clsx(
                    router.pathname.endsWith(item.href)
                      ? "bg-amber-400 text-white hover:bg-amber-800"
                      : "bg-white text-gray-900 hover:bg-gray-100",
                    "border p-2"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </ul>
          ) : null}
        </button>
      </li>
    );
  }
  return (
    <li key={nav.name} className="relative">
      <Link
        href={nav.href}
        className={clsx(
          router.pathname.endsWith(nav.href) ? "bg-amber-700 text-white" : "",
          "w-full border relative flex flex-col rounded-md p-2 text-sm leading-6 font-semibold hover:text-white hover:bg-amber-700"
        )}
      >
        <div className="flex items-center justify-between space-x-4 p-2">
          <div className="flex items-center space-x-2">
            <nav.icon className={clsx("h-6 w-6 shrink-0")} aria-hidden="true" />
            <p> {nav.name}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
export default function Layout({ children }: any) {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[20rem] lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="border flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
            <div className="flex mt-1 rounded shadow items-center justify-center shrink-0 ">
              <LogoLayout />
            </div>
            <nav className=" flex-col px-6">
              <ul role="list" className="-mx-2 pt-2 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <NavElement key={item.name} nav={item} />
                ))}
              </ul>
            </nav>
            <button
              onClick={async () => {
                await signOut();
              }}
              className="group flex mx-4 gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white bg-amber-500 hover:bg-amber-700 hover:text-white"
            >
              <ArrowLeftOnRectangleIcon
                className="h-6 w-6 shrink-0  group-hover:text-white"
                aria-hidden="true"
              />
              Déconnexion
            </button>
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
