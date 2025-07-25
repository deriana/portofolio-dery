import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { TextLink } from "../ui/text-link";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address*</Label>
          <Input type="email" id="email" placeholder="ex. email@domain.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password*</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              required
              className="pr-10"
            />
            {isMounted && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          By clicking "Submit", you agree to our{" "}
          <a className="underline" href="#">
            Terms of Service
          </a>{" "}
          and acknowledging the{" "}
          <a className="underline" href="#">
            Global Privacy Statement
          </a>
          .
        </p>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>

      <div className="text-sm text-center">
        Don't have an account?
        <TextLink to="/auth/register">Register</TextLink>
      </div>
    </>
  );
}
