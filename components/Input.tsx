// InputText component

import React from "react"

import {Fragment, useState} from "react"
import {Listbox, Transition} from "@headlessui/react"
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid"
import {NumericFormat} from "react-number-format"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}
export function InputText({label, name, id, placeholder, value, setValue, isRequired}: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={name}
          id={id}
          value={value}
          required={isRequired}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
export function SelectInput({
  name,
  options,
  value,
  setValue,
}: {
  name: string
  options: {name: string; value: string}[]
  value: string
  setValue: any
}) {
  return (
    <Listbox value={value} onChange={setValue}>
      {({open}) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {name}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{value}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.name}
                    className={({active}) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option.value}
                  >
                    {({selected, active}) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export function InputNumber({label, value, name, handleChange, required}) {
  return (
    <div className="col-span-3 flex flex-col items-start">
      <label htmlFor="buyingPrice" className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <NumericFormat
        displayType={"input"}
        value={value}
        thousandSeparator={true}
        onValueChange={(value) => {
          handleChange(value, name)
        }}
        allowNegative={false}
        required={required}
        className="p-2 block  h-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  )
}
