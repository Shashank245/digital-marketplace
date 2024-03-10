"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Users_1 = require("./app/collection/Users");
var dotenv_1 = __importDefault(require("dotenv"));
var Products_1 = require("./app/collection/Products/Products");
var media_1 = require("./app/collection/Media/media");
var ProductFiles_1 = require("./app/collection/Products/ProductFiles");
var Orders_1 = require("./app/collection/Orders/Orders");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [Users_1.Users, Products_1.Products, media_1.Media, ProductFiles_1.ProductFiles, Orders_1.Orders],
    routes: {
        admin: '/sell'
    },
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: '- Digital Hippo',
            favicon: '/favicon.ico',
            ogImage: '/thumbnail.jpg'
        }
    },
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGOOSE_URL
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts')
    }
});
