import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./app/page.tsx"),

  layout("./app/_components/layout/protected-layout.tsx", [
    layout("./app/_components/layout/app-sidebar-layout.tsx", [
      route("/dashboard", "./app/dashboard/page.tsx"),

      route("/users", "./app/users/page.tsx"),
      route("/users/create", "./app/users/create/page.tsx"),
      route("/users/:id", "./app/users/[id]/page.tsx"),
      route("/users/:id/edit", "./app/users/[id]/edit/page.tsx"),

      route("/requests", "./app/requests/page.tsx"),
      route("/requests/create", "./app/requests/create/page.tsx"),
      route("/requests/:id", "./app/requests/[id]/page.tsx"),
      route("/requests/:id/edit", "./app/requests/[id]/edit/page.tsx"),

      route("/audit-logs", "./app/audit-logs/page.tsx"),
    ]),
  ]),

  layout("./app/_components/layout/non-login-layout.tsx", [
    route("/login", "./app/login/page.tsx"),
  ]),

  route("*", "./app/errors/not-found/page.tsx"),
] satisfies RouteConfig;
