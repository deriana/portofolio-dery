import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { TextLink } from "../ui/text-link";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name*</Label>
          <Input type="text" id="name" placeholder="Your name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address*</Label>
          <Input
            type="email"
            id="email"
            placeholder="ex. email@domain.com"
            required
          />
        </div>

        {/* Password */}
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
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password*</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              placeholder="Re-enter password"
              required
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Agree to Terms */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agree"
            checked={agree}
            onCheckedChange={(checked) => setAgree(!!checked)}
          />
          <Label htmlFor="agree" className="text-sm leading-snug">
            I agree to the{" "}
            <a className="underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>
            .
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={!agree}>
          Register
        </Button>
      </form>

      <div className="text-sm text-center">
        Already have an account?{" "}
        <TextLink to="/auth/login">Login</TextLink>
      </div>
    </>
  );
}
