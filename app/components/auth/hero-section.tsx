import { useMemo } from "react";
import { GradientBackground } from "../ui/gradient-bacgkround";

const quotes = [
    {
        text: "The future belongs to those who learn faster than everyone else.",
        author: "Eric Hoffer",
    },
    {
        text: "Code is like humor. When you have to explain it, it’s bad.",
        author: "Cory House",
    },
    {
        text: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson",
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
    },
    {
        text: "Simplicity is the soul of efficiency.",
        author: "Austin Freeman",
    },
    {
        text: "Kenapa ayam menyeberang jalan?",
        author: "Anonymous",
    }
];

export function AuthHeroSection() {
    const quote = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }, []);

    return (
        <GradientBackground className="hidden lg:flex items-center justify-center p-12 relative">
            <div className="max-w-md space-y-6 z-10">
                <h1 className="text-4xl font-bold leading-tight">
                    Learn, Discover & <br /> Automate in One Piece.
                </h1>
                <p className="text-lg text-white/80">
                    Create a chatbot GPT using Python — step-by-step guidance and
                    automation all in one platform.
                </p>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-sm">
                        Install the required libraries, load your model, and start
                        building intelligent apps easily.
                    </p>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 max-w-xs text-sm text-white/70 italic">
                “{quote.text}”
                <span className="block text-white/50 text-xs mt-1">– {quote.author}</span>
            </div>
        </GradientBackground>
    );
}
