interface GradientBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
    return (
        <div className={`bg-gradient-to-br from-[#4976A4] via-[#709fcf] to-[#a8c7e8] text-white ${className}`}>
            {children}
        </div>
    );
}
