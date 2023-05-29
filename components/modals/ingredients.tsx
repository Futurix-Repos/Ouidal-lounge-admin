import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "react-query";
import { fetcher } from "@/helpers";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  incIngredientQty,
  decIngredientQty,
  removeIngredient,
  addIngredient as addIngredientToStore,
  closeSelection,
  resetIngredients,
} from "@/store/slices/ingredients";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

function SelectedIngredients() {
  const dispatch = useAppDispatch();
  const incIngredient = (ingredient: any) => {
    dispatch(incIngredientQty(ingredient));
  };
  const decIngredient = (ingredient: any) => {
    dispatch(decIngredientQty(ingredient));
  };
  const deleteIngredient = (ingredient: any) => {
    dispatch(removeIngredient(ingredient));
  };
  const ingredients = useAppSelector((state) => state.ingredients.items);
  if (ingredients.length === 0)
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-center text-gray-500 text-2xl font-semibold">
          Aucun ingrédient sélectionné
        </p>
      </div>
    );

  return (
    <ul className="list-disc space-y-4 divide-y divide-gray-300">
      {ingredients.map((ingredient: any) => (
        <li
          key={ingredient.id}
          className="flex space-x-4 items-center justify-center py-2"
        >
          <span className="w-40 text-start text-sm">{ingredient.name}</span>
          <span className="w-40 text-start text-sm">
            {ingredient.qty} {ingredient.unit}
            {ingredient.qty > 1 && ingredient.unit.length > 2 ? "s" : ""}
          </span>

          <button onClick={() => incIngredient(ingredient.id)}>
            <PlusCircleIcon className="w-5 h-5 text-amber-700 hover:text-amber-800" />
          </button>
          <button onClick={() => decIngredient(ingredient.id)}>
            <MinusCircleIcon className="w-5 h-5 text-red-700 hover:text-amber-800" />
          </button>
          <button onClick={() => deleteIngredient(ingredient.id)}>
            <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-800" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function IngredientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, searchTerm]);
  const dispatch = useAppDispatch();
  const addIngredient = (ingredient: any) => {
    dispatch(addIngredientToStore(ingredient));
  };
  const { data: ingredients, isLoading } = useQuery({
    queryKey: ["selling-products", debouncedSearchTerm],
    queryFn: () =>
      fetcher(`/api/ingredients?searchTerm=${debouncedSearchTerm}`),
  });

  return (
    <div className="">
      <div className={"m-4"}>
        <input
          type={"search"}
          className={"border rounded-md p-2 w-full"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={"Rechercher un ingrédient"}
        />
      </div>
      {isLoading ? (
        <div className={"flex items-center justify-center h-48 "}>
          Chargement...
        </div>
      ) : (
        <ul
          role="list"
          className=" p-2 h-full overflow-auto mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {ingredients?.map((ingredient) => (
            <li
              onClick={() => addIngredient(ingredient)}
              key={ingredient.name}
              className="col-span-1 shadow-sm rounded-md border p-3 flex items-center
                       justify-center uppercase text-sm  text-ellipsis overflow-hidden
                       hover:bg-gray-400 cursor-pointer hover:text-white"
            >
              {ingredient.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Ingredients() {
  const open = useAppSelector((state) => state.ingredients.open);
  const dispatch = useAppDispatch();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => dispatch(closeSelection())}
      >
        <Transition.Child
          as={Fragment}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Liste des ingrédients
                    </Dialog.Title>
                    <div className="mt-2 flex items-center space-x-4 h-[60vh]">
                      <div className="h-full border w-2/3">
                        <IngredientList />
                      </div>
                      <div className="border w-1/3 p-2 h-full">
                        <SelectedIngredients />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 w-1/2   flex items-center justify-center space-x-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    onClick={() => {
                      dispatch(closeSelection());
                      dispatch(resetIngredients());
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => dispatch(closeSelection())}
                  >
                    Valider
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
