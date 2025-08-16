
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      company?: {
        id: string
        name: string
        country: string
        status: string
      }
      subscription?: {
        id: string
        status: string
        currentPeriodEnd?: Date
      }
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    company?: {
      id: string
      name: string
      country: string
      status: string
    }
    subscription?: {
      id: string
      status: string
      currentPeriodEnd?: Date
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    company?: {
      id: string
      name: string
      country: string
      status: string
    }
    subscription?: {
      id: string
      status: string
      currentPeriodEnd?: Date
    }
  }
}
