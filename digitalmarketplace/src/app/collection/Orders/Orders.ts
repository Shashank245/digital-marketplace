import { User } from "@/payload-types";
import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = async ({ req: {user} }) => {
  if (user?.role === "admin") return true;
  if (!user) return false;

 return{ user: {
    equals: user?.id
 }}
}
export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your orders",
    description: "A Summary of all your orders on DigitalHippo",
    hidden: true,
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      required: true,
      access: {
        read: ({ req }) => req.user.role === "admin",
        update: () => false,
        create: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true,
    },
  ],
};
