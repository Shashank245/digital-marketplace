"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodError, z } from "zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");
  const { mutate, isLoading } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password ");
        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error("Something went wrong. please try again.");
    },

    onSuccess: () => {
      toast.success(`Signed In Successfully..!!`);
      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isSeller) {
        router.push(`/sell}`);
        return;
      }
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const signIn = ({ email, password }: TAuthCredentialsValidator) => {
    mutate({ email, password });
  };

  const continueAsCustomer = () => {
    router.push(`/`, undefined);
  };

  const continueAsSeller = () => {
    router.push(`?as=seller`);
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your {isSeller ? `seller` : `customer`} account
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              Don&apos;t have an account?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(signIn)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="Enter your email"
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Enter your Password"
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button>Sign in</Button>
              </div>
            </form>
            <div className="relative">
              <div aria-hidden className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            {isSeller ? (
              <Button
                variant="secondary"
                onClick={continueAsCustomer}
                disabled={isLoading}
              >
                Continue as Customer
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={continueAsSeller}
                disabled={isLoading}
              >
                Continue as Seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
