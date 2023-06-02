import clientPromise from "@/db"

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
  secret: "secret",
  session: {
    strategy: "jwt",
    //set max age to 1hour
    maxAge: 60 * 60,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {label: "username", type: "username", placeholder: "you@example.com"},
        password: {label: "Password", type: "password"},
      },
      //@ts-ignore
      authorize: async (credentials) => {
        try{
 const client = await clientPromise
       
        const user = await client.db().collection("users").findOne({
          username: credentials?.username,
          password: credentials?.password,
        })

        if (!user) {
          return null
        }

        return {
          id: user.id,
          username: user,
          name: user.id,
        }
        }catch(error){
          console.log(error)
        }
        
       
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
}
//@ts-ignore
export default NextAuth(authOptions)
