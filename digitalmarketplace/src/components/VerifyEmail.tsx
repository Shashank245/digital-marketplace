"use client";
import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  });
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text-muted-foreground text-sm">
          This token is not valid... Please try again later.
        </p>
      </div>
    );
  }

  if (data?.success) {
    <div className="flex h-full flex-col items-center justify-center space-y-1">
      <div className="relative mb-4 h-60 w-60 text-muted-foreground">
        <Image src="/hippo-email-sent.png" fill alt="The email was sent" />
      </div>
      <h3 className="font-semibold text-2xl"> You're all set </h3>
      <p className="text-muted-foreground text-center mt-1">
        Thank you for verifying the email
      </p>
      <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
        Sign in
      </Link>
    </div>;
  }

  if (isLoading) {
    <div className="flex h-full flex-col items-center gap-2">
      <Loader2 />
      <h3 className="font-semibold text-2xl">Verifying... </h3>
      <p className="text-muted-foreground text-center mt-1">
        This won't take long.
      </p>
    </div>;
  }
};
export default VerifyEmail;
