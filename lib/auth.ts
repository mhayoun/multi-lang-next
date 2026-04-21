import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [Google],
  callbacks: {
    // Optional: Restrict login to ONLY your email
    async signIn({ user }) {
      const allowedEmails = ["yelotag@gmail.com"];
      return allowedEmails.includes(user.email ?? "");
    },
  },
})