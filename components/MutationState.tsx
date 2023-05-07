import {UseMutationResult} from "react-query"
import {BeatLoader} from "react-spinners"

export default function MutationState({
  mutation,
  data,
  formik,
  close,
}: {
  mutation: UseMutationResult<any, any, any, any>
  data: any
  formik?: boolean
  close?: () => void
}) {
  return (
    <div>
      {mutation.isLoading ? (
        <div>
          <BeatLoader size={3} />
        </div>
      ) : mutation.isError ? (
        <button type="submit" className="border w-full text-xs p-2 bg-red-500 text-white">
          {mutation.error.response.data?.msg}
        </button>
      ) : mutation.isSuccess ? (
        <button onClick={() => mutation.reset()}>Réussie</button>
      ) : null}
      {mutation.isIdle && (
        <div className="w-full p-2 flex items-center space-x-3 border">
          <button
            type="submit"
            className="rounded-md h-10 w-1/2 bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Valider
          </button>
          <button
            type="button"
            className="rounded-md h-10  w-1/2 bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() => {
              mutation.reset()
              close && close()
            }}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
