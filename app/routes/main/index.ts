import { index, route } from "@react-router/dev/routes";

export const mainRoutes = [
  index("./routes/main/about.tsx"),
  route("skills", "./routes/main/skills.tsx"),
  route("portfolio", "./routes/main/portfolio.tsx"),
  route("contact", "./routes/main/contact.tsx")
];
