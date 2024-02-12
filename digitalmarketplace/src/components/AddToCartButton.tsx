"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";

const AddToCartButton = () => {
  const { addItem } = useCart();

  const [isSuccess, setIsSuccess] = useState<Boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button onClick={() => {
        setIsSuccess(true)
    }} size="lg" className="w-full">
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};
export default AddToCartButton;
