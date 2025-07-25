import { index, route } from "@react-router/dev/routes";

export const mainRoutes = [
  index("./routes/main/about.tsx"),
  route("skills", "./routes/main/skills.tsx"),
];
