"use client";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { TQueryValidator } from "../lib/QueryValidator";
import { Media, Product, ProductFile, User } from "@/payload-types";
import ProductListing from "./ProductListing";
interface ProductReelProps {
  id: string;
  user?: (string | null) | User;
  name: string;
  description?: string | null;
  price: number;
  categories: "ui_kits" | "icons";
  approvedForSale: "pending" | "approved" | "denied";
  priceId?: string | null;
  stripeId?: string | null;
  images: {
    image: string | Media;
    id?: string | null;
  }[];
  product_files: string | ProductFile;
  updatedAt: string;
  createdAt: string;
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;
  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );
  const products = queryResults?.pages.flatMap((page) => page.items);
  let productMappings: (Product | null)[] = [];

  if (products && products.length) {
    productMappings = products;
  } else if (isLoading) {
    productMappings = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:mx-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <h1 className="mt-2 text-sm text-muted-foreground">{subtitle}</h1>
          ) : null}
        </div>
        {href ? (
          <Link
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
            href={href}
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
        <div className="relative">
          <div className="mt-6 flex items-center w-full">
            <div className="w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-10 md:grid-cols-4 lg:gap-x-8">
              {productMappings.map((product, i) => (
                <ProductListing
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductReel;
