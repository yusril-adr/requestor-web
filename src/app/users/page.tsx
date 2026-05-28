import { Button } from "../_components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "../_components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../_components/ui/popover";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../_components/ui/combobox";
import { RoleKeyEnum } from "@/common/enums/role-key";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../_components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { ButtonGroup } from "../_components/ui/button-group";
import AppBreadcrumb from "../_components/app-breadcrumb";

export function meta() {
  return [
    {
      title: "Requestor - Users",
    },
  ];
}

export default function UserPage() {
  const breadcrumbItems = [
    {
      name: "Users",
    },
  ];

  const users = [
    {
      id: "5cd38571-52a8-4d02-9769-6c08ccd88d9c",
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      status: "active",
    },
    {
      id: "40d7da46-da4c-4770-a6ed-e9527dfab74e",
      name: "Operator",
      email: "operator@example.com",
      role: "operator",
      status: "active",
    },
    {
      id: "5378eaba-d0f8-4e8d-bff1-2984d35f675f",
      name: "Viewer 1",
      email: "viewer+1@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "c47e5180-3e24-4216-a710-fd40aef416a0",
      name: "Viewer 2",
      email: "viewer+2@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "74cb2127-a6ba-4f0f-a681-bed15a19e9b3",
      name: "Viewer 3",
      email: "viewer+3@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "0e8aa680-cd98-464a-96d1-3b0d2701c3b2",
      name: "Viewer 4",
      email: "viewer+4@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "92fc512e-e58b-4a1d-aec5-078e8432c256",
      name: "Viewer 5",
      email: "viewer+5@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "849bbe15-c745-4f4b-998d-61ddee339aa6",
      name: "Viewer 6",
      email: "viewer+6@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "12d1ce58-1566-4ec0-8260-dcc0132f704b",
      name: "Viewer 7",
      email: "viewer+7@example.com",
      role: "viewer",
      status: "active",
    },
    {
      id: "368d8c23-e707-4736-964c-c3f897e3ec5b",
      name: "Viewer 8",
      email: "viewer+8@example.com",
      role: "viewer",
      status: "active",
    },
  ];

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <h1 className="mt-4 mb-6 font-heading text-2xl">Users</h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                <Funnel />
                Filter
              </PopoverTrigger>
              <PopoverContent align="start">
                <form className="flex flex-col gap-4 md:gap-2">
                  <FieldGroup className="flex flex-col md:flex-row gap-4 md:gap-2">
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="role">Role</FieldLabel>
                      <Combobox items={Object.values(RoleKeyEnum)}>
                        <ComboboxInput placeholder="Select role" showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>

                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="role">Status</FieldLabel>
                      <Combobox items={Object.values(UserStatusEnum)}>
                        <ComboboxInput placeholder="Select role" showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  </FieldGroup>

                  <FieldGroup className="flex justify-end">
                    <Field orientation="horizontal">
                      <Button className="ms-auto" type="submit">
                        Apply
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </PopoverContent>
            </Popover>

            <form className="w-full">
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>

          <div className="flex flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user, i) => (
                  <TableRow key={user.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button size="icon-sm" variant="ghost">
                              <EllipsisVertical />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <Eye />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              <Trash />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col md:flex-row justify-end items-center gap-2">
              <span>1-10 of 100 items</span>

              <ButtonGroup>
                <Button variant="ghost" size="icon" disabled>
                  <ChevronLeft />
                </Button>

                <Button variant="ghost" disabled>
                  1
                </Button>
                <Button variant="ghost">2</Button>
                <Button variant="ghost">3</Button>
                <Button variant="ghost">4</Button>

                <Button variant="ghost" size="icon">
                  <ChevronRight />
                </Button>
              </ButtonGroup>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">
                    10 / page <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>5 / page</DropdownMenuItem>
                  <DropdownMenuItem>10 / page</DropdownMenuItem>
                  <DropdownMenuItem>20 / page</DropdownMenuItem>
                  <DropdownMenuItem>50 / page</DropdownMenuItem>
                  <DropdownMenuItem>100 / page</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
