import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/_components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../_hooks/use-auth";
import { Skeleton } from "../ui/skeleton";

export function AvatarSidebar() {
  const { auth, authQuery, logout } = useAuth();
  const { isMobile } = useSidebar();

  const isLoading = authQuery?.isLoading;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              render={<div />}
            >
              {isLoading && <Skeleton className="h-8 w-8 rounded-full" />}

              {!isLoading && (
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?background=random&name=${auth?.name || "-"}`}
                    alt={auth?.name || "-"}
                  />
                  <AvatarFallback className="rounded-lg">NA</AvatarFallback>
                </Avatar>
              )}

              <div className="grid flex-1 text-left text-sm leading-tight">
                {isLoading && (
                  <>
                    <Skeleton className="h-4 w-32.5 mb-1" />
                    <Skeleton className="h-2 w-32.5" />
                  </>
                )}

                {!isLoading && (
                  <>
                    <span className="truncate font-heading font-medium">
                      {auth?.name || "-"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {auth?.email || "-"}
                    </span>
                  </>
                )}
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
