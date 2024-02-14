import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "./trpc";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";

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
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter((prod) => Boolean(prod.price));

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      lineItems.push({
        price: "price_1OjWabSAFZQpdzjbKtTbPxmW",
        quantity: 1,
        adjustable_quantity: { enabled: false },
      });

      filteredProducts.forEach((prod) => {
        lineItems.push({
          price: prod.priceId!,
          quantity: 1,
        });
      });

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thankyou?orderid=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items: lineItems,
        });
        return { url: stripeSession.url };
      } catch (err) {
        return {url: null}
      }
    }),
});
