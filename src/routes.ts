import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./app/_components/layout/protected-layout.tsx", [
    layout("./app/_components/layout/app-sidebar-layout.tsx", [
      index("./app/page.tsx"),

      route("/users", "./app/users/page.tsx"),
      route("/users/create", "./app/users/create/page.tsx"),
      route("/users/:id", "./app/users/[id]/page.tsx"),
      route("/users/:id/edit", "./app/users/[id]/edit/page.tsx"),
    ]),
  ]),

  layout("./app/_components/layout/non-login-layout.tsx", [
    route("/login", "./app/login/page.tsx"),
  ]),
  route("*", "./app/errors/not-found/page.tsx"),
] satisfies RouteConfig;
