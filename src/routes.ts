import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./app/_components/protected-layout.tsx", [
    layout("./app/_components/app-sidebar-layout.tsx", [
      index("./app/page.tsx"),
      route("/users", "./app/users/page.tsx"),
    ]),
  ]),

  layout("./app/_components/non-login-layout.tsx", [
    route("/login", "./app/login/page.tsx"),
  ]),
  route("*", "./app/errors/not-found/page.tsx"),
] satisfies RouteConfig;
