import { type RouteConfig } from "@react-router/dev/routes";
import {authRoutes} from "./routes/auth";
import {mainRoutes} from "./routes/main";

export default [
  ...mainRoutes,
  ...authRoutes,
] satisfies RouteConfig;
