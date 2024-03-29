import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./app/collection/Users";
import dotenv from "dotenv";
import { Products } from "./app/collection/Products/Products";
import { Media } from "./app/collection/Media/media";
import { ProductFiles } from "./app/collection/Products/ProductFiles";
import { Orders } from "./app/collection/Orders/Orders";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFiles, Orders],
  routes: {
    admin: '/sell'
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
        titleSuffix: '- Digital Hippo',
        favicon: '/favicon.ico',
        ogImage: '/thumbnail.jpg'
    }
  },
  rateLimit: { 
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGOOSE_URL!
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  }
});