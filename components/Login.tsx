import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";

import React from "react";
import { signIn } from "next-auth/react";
import { useMutation } from "react-query";
import { BarLoader } from "react-spinners";
import Logo from "@/components/logo";

export default function LoginComponent() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await signIn("credentials", data);
      if (response?.ok) {
        return response;
      } else {
        throw new Error("Informations invalides!");
      }
    },
    onSuccess: () => {
      return router.push("/");
    },
  });
  return (
    <>
      <div className="flex bg-slate-100 min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center justify-center">
          <Logo w={52} h={52} />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async ({ password, username }) => {
                loginMutation.mutate({ password, username, redirect: false });
              }}
            >
              {() => {
                return (
                  <Form className="space-y-6" action="#" method="POST">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Utilisateur
                      </label>
                      <div className="mt-1">
                        <Field
                          id="username"
                          name="username"
                          type="username"
                          autoComplete="username"
                          required
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mot de passe
                      </label>
                      <div className="mt-1">
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      {loginMutation.isError && (
                        <div className="flex flex-col items-start justify-center space-y-2">
                          <p className="text-red-500">
                            Informations non valides
                          </p>
                          <button className="flex w-full justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Réessayer
                          </button>
                        </div>
                      )}
                      {loginMutation.isLoading || loginMutation.isSuccess ? (
                        <div className="flex w-full justify-center items-center">
                          <BarLoader width={100} height={4} color="blue" />
                        </div>
                      ) : null}
                      {loginMutation.isIdle && (
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md border border-transparent bg-amber-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Connexion
                        </button>
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
