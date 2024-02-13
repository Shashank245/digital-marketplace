import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "./trpc";
import { z } from "zod";
import { getPayloadClient } from "@/get-payload";

export const paymenRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length !== 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      const payload = await getPayloadClient();
      const {docs: products} = await payload.find({
        collection: "products",
        where: {
            id: {
               in: productIds
            },
        },
      })
      
    }),
});
