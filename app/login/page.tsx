import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// import loginBG from "../../../public/images/loginBG1.png"
import loginBG from "../../public/images/loginBg.jpg";
// import logoFull from "../../../public/images/logoFull.svg"
import logoFull from "../../public/images/logoFull.svg";
import { UserAuthForm } from "./login-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function Login() {
  return (
    <>
      <div className="container relative min-h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 px-4">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[374px]">
            <div className="flex lg:gap-6 gap-3 flex-col">
              <div className="">
                <Image
                  loading="lazy"
                  src={logoFull}
                  width="200"
                  height="60"
                  className="duration-500"
                  alt="Logo"
                />
              </div>
              <div>
                <div className="flex flex-col space-y-2 text-left lg:pb-6 pb-3">
                  <h1 className="lg:text-2xl text-lg font-semibold tracking-tight text-card-foreground">
                    Sign In to your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Sign in to access your account, upload document and reports.
                  </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-foreground lg:pt-6 pt-3">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="underline underline-offset-4 hover:text-primaryColor"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-0 text-white dark:border-r lg:flex">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              loading="lazy"
              src={loginBG}
              width="2000"
              height="2000"
              className="duration-500 absolute inset-0 h-full w-full object-cover"
              alt="login bg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
