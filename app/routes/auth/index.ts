import { routeGroupFrom } from "../../lib/utils";

export const authRoutes = routeGroupFrom("auth", [
  "login",
  "register",
]);
