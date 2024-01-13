import { publicProcedure, router } from './trpc'
export const approuter = router({
    anyApiRoute: publicProcedure.query(() => {
        return 'hello';
    })
})

export type AppRouter = typeof approuter;