import {Field} from "formik"

export default function SelectInput(props: any) {
  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <Field
        as="select"
        {...props}
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {props.options.map((option: any) => (
          <option key={option} value={option} className="capitalize">
            {option}
          </option>
        ))}
      </Field>
    </div>
  )
}
