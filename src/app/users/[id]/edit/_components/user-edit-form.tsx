import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/app/_components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/app/_components/ui/combobox";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";

import {
  UserEditFormSchema,
  type TUserEditFormSchema,
} from "@/app/users/[id]/edit/_schema/user-edit-form";
import { RoleKeyEnum } from "@/common/enums/role-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUserById } from "@/api/requestor/users/[id]";
import CONFIG from "@/common/constants/config";
import type { TRequestorApiErrorResponse } from "@/api/requestor/types/response";
import type { TUserUpdatePayload } from "@/api/requestor/users/[id]/types/user-update-payload";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";
import RequestorAPIValidationError from "@/api/requestor/errors/validation-error";
import { applyValidationErrors } from "@/utils/validation-helper";

export default function UserEditForm() {
  const params = useParams();
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const getUserDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL(), params.id],
    queryFn: () => getUserById(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (
      getUserDataQuery.isError &&
      getUserDataQuery.error &&
      getUserDataQuery.error instanceof RequestorAPINotFoundError
    ) {
      navigate("users");
    }
  }, [getUserDataQuery]);

  const defaultValues = useMemo(() => {
    return {
      name: getUserDataQuery.data?.data?.data?.name || "",
      email: getUserDataQuery.data?.data?.data?.email || "",
      role:
        (getUserDataQuery.data?.data?.data?.role as RoleKeyEnum | undefined) ||
        RoleKeyEnum.VIEWER,
      status:
        (getUserDataQuery.data?.data?.data?.status as
          | UserStatusEnum
          | undefined) || UserStatusEnum.SUSPENDED,
    };
  }, [getUserDataQuery]);

  const { control, handleSubmit, setError } = useForm<TUserEditFormSchema>({
    resolver: zodResolver(UserEditFormSchema),
    values: defaultValues,
  });

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: updateUserById,
    onMutate: () => {
      toast.loading("Updating user...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("User updated.");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL()],
      });
      navigate("/users");
    },
    onError: (error) => {
      if (error instanceof RequestorAPIValidationError) {
        return applyValidationErrors(
          setError,
          error.errors as TRequestorApiErrorResponse<TUserUpdatePayload>[],
        );
      }

      if (error instanceof RequestorAPINotFoundError) {
        navigate("/users");
        return;
      }

      return;
    },
  });

  const onSubmit: SubmitHandler<TUserEditFormSchema> = (data) => {
    const payload: TUserUpdatePayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      status: data.status,
    };

    updateUserMutation.mutate({ id: params.id as string, payload });
  };

  const isFormDisabled = useMemo(
    () =>
      updateUserMutation.isPending ||
      updateUserMutation.isPaused ||
      getUserDataQuery.isLoading ||
      getUserDataQuery.isPaused,
    [updateUserMutation, getUserDataQuery],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <FieldGroup className="grid md:grid-cols-2">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" placeholder="Input name" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Input email"
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type={isShowPassword ? "text" : "password"}
                      placeholder="Enter password"
                      autoComplete="off"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        className="btn btn-ghost btn-square btn-sm"
                        type="button"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        {isShowPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Combobox
                    id="role"
                    items={Object.values(RoleKeyEnum)}
                    onValueChange={field.onChange}
                    {...field}
                  >
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Combobox
                    id="status"
                    items={Object.values(UserStatusEnum)}
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <ComboboxInput placeholder="Select status" showClear />
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="border-t-1 pt-4">
          <FieldGroup>
            <Field orientation="horizontal">
              <Button
                className="ms-auto"
                variant="outline"
                type="reset"
                render={<Link to={"/users"} />}
                disabled={isFormDisabled}
                nativeButton={false}
              >
                Cancel
                {isFormDisabled && <Spinner />}
              </Button>

              <Button type="submit" disabled={isFormDisabled}>
                Save
                {isFormDisabled && <Spinner />}
              </Button>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </form>
  );
}
