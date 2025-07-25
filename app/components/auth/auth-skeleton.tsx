import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}
