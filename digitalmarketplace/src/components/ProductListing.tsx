"use client";

import { Product } from "@/payload-types";
import { Fragment, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/configs";
import ImageSlider from "./ImageSlider";
interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setVisisble] = useState<Boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisisble(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);

  if (!product && !isVisible) return <ProductPlaceholder />;

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product?.categories
  )?.label;

  const validURLs = product?.images.map(({ image }) => {
      typeof image === "string" ? image : image.url;
  }).filter(Boolean) as unknown as string[];

  if (product && isVisible) {
    return (
      <Fragment>
        <Link
          className={cn("invisible cursor-pointer h-full w-full group/main", {
            "visible animate-in fade-in-10": isVisible,
          })}
          href={`/product/${product.id}`}
        />
        <div className="flex flex-col w-full">
          {<ImageSlider urls={validURLs} />}
        </div>
        <div className="mt-4 text-sm font-medium text-gray-700">
          {product.name}
        </div>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-sm text-gray-500">
          {formatPrice(product.price)}
        </p>
      </Fragment>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg " />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg " />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg " />
    </div>
  );
};
export default ProductListing;
