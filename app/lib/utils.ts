import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { route } from "@react-router/dev/routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function routeFrom(path: string, file: string, folder: string) {
  return route(path, `./routes/${folder}/${file}.tsx`);
}

export function routeGroupFrom(prefix: string, files: string[]) {
  return files.map((name) =>
    route(`${prefix}/${name}`, `./routes/${prefix}/${name}.tsx`)
  );
}