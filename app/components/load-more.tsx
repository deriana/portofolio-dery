import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-8">
      <Button onClick={onClick} variant="outline" className="rounded-2xl">
        Load More
      </Button>
    </div>
  );
}
