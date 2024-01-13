import authRouter from './auth-router';
import { publicProcedure, router } from './trpc'
export const approuter = router({
    auth: authRouter,
})

export type AppRouter = typeof approuter;