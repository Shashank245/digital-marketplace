import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { approuter } from "@/trpc";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: approuter,
    // @ts-expect-error context already passed from the middleware server
    createContext: () => ({})
  });
  
  export { handler as GET, handler as POST };