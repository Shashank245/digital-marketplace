import { CollectionConfig } from "payload/types";
import { PRODUCT_CATEGORIES } from "@/configs";
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
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
        admin: {hidden: true},
        access: {
        create: () => false,
        update: () => false,
        read: () => false
      },
    },
    {
        name: "stripeId",
        type: "text",
        admin: {hidden: true},
        access: {
        create: () => false,
        update: () => false,
        read: () => false
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
            plural: "Images"
        },
        fields : [
            {
                name: "image",
                type: "upload",
                relationTo: "media",
                required: true
            }
        ]
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
