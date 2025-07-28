import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Github } from "lucide-react";

interface PortfolioCardProps {
  item: {
    id: number | string;
    title: string;
    description: string;
    image: string;
    author: string;
  };
}

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <Card className="backdrop-blur-md border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl hover:-translate-y-1 hover:scale-[1.01] transform hover-target">
      <CardHeader className="p-0">
        <div className="rounded-t-xl overflow-hidden px-4 pt-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
      </CardHeader>

      <CardContent className="px-4 space-y-1">
        <p
          className="text-lg font-semibold text-white"
        >
          {item.title}
        </p>
        <p className="text-gray-400 text-sm">
          {item.description.length > 50
            ? item.description.slice(0, 50) + "..."
            : item.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-gray-400 px-4 pt-4">
        <div className="flex items-center gap-1">
          <Github className="w-4 h-4" />
          {item.author}
        </div>
      </CardFooter>
    </Card>
  );
};
