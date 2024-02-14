import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../../configs";
import { CollectionConfig } from "payload/types";
import { Product } from "@/payload-types";
import { stripe } from "../../../lib/stripe";
const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id };
};
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation == "create") {
          const data = args.data as Product;
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };
          return updated;
        } else if (args.operation == "update") {
          const data = args.data as Product
          const updatedProuct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!
          })

          const updated: Product = {
             ...data,
             stripeId: updatedProuct.id,
             priceId: updatedProuct.default_price as string,
          };
          return updated;
        }
      },
    ],
  },
  access: {},
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "price",
      label: "Price in USD",
      required: true,
      type: "number",
      min: 0,
      max: 1000,
    },
    {
      name: "categories",
      label: "Category",
      required: true,
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      required: true,
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
      },
      type: "select",
      options: [
        {
          label: "Pending Verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "priceId",
      type: "text",
      admin: { hidden: true },
      access: {
        create: () => false,
        update: () => false,
        read: () => false,
      },
    },
    {
      name: "stripeId",
      type: "text",
      admin: { hidden: true },
      access: {
        create: () => false,
        update: () => false,
        read: () => false,
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product Images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "product_files",
      label: "Product File(s)",
      required: true,
      type: "relationship",
      relationTo: "product_files",
      hasMany: false,
    },
  ],
};
