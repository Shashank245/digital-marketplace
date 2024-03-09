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
        price: "price_1OjWabSAFZQpdzjbKtTbPxmW", // Use the correct price ID here
        quantity: 1,
        adjustable_quantity: { enabled: false },
      });

      filteredProducts.forEach((product) => {
        lineItems.push({
          price: product.priceId!, // Make sure priceId is the correct property
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
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderid=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "subscription",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items: [
            {
              price: "price_1OjWabSAFZQpdzjbKtTbPxmW",
              quantity: 1,
            },
          ],
        });
        return { url: stripeSession.url };
      } catch (err) {
        console.error("Error creating Stripe session:", err);
        return { url: null };
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;
      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });
      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const [order] = orders;

      return { isPaid: order._isPaid};
    }),
});
