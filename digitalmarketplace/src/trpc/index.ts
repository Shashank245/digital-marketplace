import { QueryValidator } from "../lib/QueryValidator";
import {authRouter} from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";

export const approuter = router({
  auth: authRouter,
  payment: paymentRouter,
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
        categoryDynamic: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { query, cursor, categoryDynamic } = input;
      const { sort, limit, ...queryOpts } = query;

      const payload = await getPayloadClient();

      const parsedQueryOptions: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = categoryDynamic !== undefined
        ? await payload.find({
            collection: "products",
            where: {
              approvedForSale: {
                equals: "approved",
              },
              categories: {
                equals: categoryDynamic,
              },
              ...parsedQueryOptions,
            },
            sort,
            depth: 1,
            limit,
            page,
          })
        : await payload.find({
            collection: "products",
            where: {
              approvedForSale: {
                equals: "approved",
              },
              ...parsedQueryOptions,
            },
            sort,
            depth: 1,
            limit,
            page,
          });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof approuter;
