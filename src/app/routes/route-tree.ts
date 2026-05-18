import { appRoutes } from "./app-routes";

export type RouteTreeNode = {
  group: "public" | "authenticated";
  routes: typeof appRoutes;
};

export const routeTree: RouteTreeNode[] = [
  {
    group: "authenticated",
    routes: appRoutes,
  },
];
