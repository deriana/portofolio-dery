import { Button } from "@/components/ui/button";

interface SocialButtonProps {
    show?: boolean;
}

export function SocialButton({ show = true }: SocialButtonProps) {
    if (!show) return null;

    return (
        <div className="grid gap-2">
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="Google"
                />
                Continue with Google
            </Button>
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
                    <path d="M16.365 1.43c0 1.138-.955 2.66-1.855 3.532-.934.9-2.213 1.592-3.318 1.523-.079-1.127.448-2.48 1.357-3.405.93-.946 2.449-1.66 3.816-1.65zm5.546 16.116c-.095 3.45-2.74 7.697-6.061 7.752-1.336.022-1.785-.863-3.324-.863s-2.049.84-3.333.884c-2.682.092-5.633-4.92-5.715-8.896-.053-2.285.743-4.658 2.129-6.125 1.394-1.476 3.093-2.065 4.3-2.065 1.287 0 2.101.883 3.34.883 1.2 0 1.845-.883 3.344-.883 1.066 0 2.19.572 3.013 1.566-2.656 1.489-2.233 5.36.292 6.647z" />
                </svg>
                Continue with Apple
            </Button>
        </div>
    );
}
