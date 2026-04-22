import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {UpstashRedisAdapter} from "@auth/upstash-redis-adapter"
import {Redis} from "@upstash/redis"

const redis = new Redis({
    // Utilisation des variables générées par Vercel
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
})

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: UpstashRedisAdapter(redis),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })
    ],
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({user}) {
            // Remplacez par votre email pour bloquer l'accès aux autres
            const allowedEmails = ["yelotag@gmail.com", "work2gs@gmail.com",
                "joetiger05@gmail.com", "info@beithanoar.org.il"];
            return allowedEmails.includes(user.email ?? "");
        },
    },
})