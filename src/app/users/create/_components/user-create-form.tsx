import { useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
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
  UserCreateFormSchema,
  type TUserCreateFormSchema,
} from "@/app/users/create/_schema/user-create-form";
import { RoleKeyEnum } from "@/common/enums/role-key";
import type { TRequestorApiErrorResponse } from "@/api/requestor/types/response";
import type { TUserCreatePayload } from "@/api/requestor/users/types/user-create-payload";
import RequestorAPIValidationError from "@/api/requestor/errors/validation-error";
import { applyValidationErrors } from "@/utils/validation-helper";
import { useCreateUser } from "@/app/users/_hooks/use-create-user";

export default function UserCreateForm() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { control, handleSubmit, setError } = useForm<TUserCreateFormSchema>({
    resolver: zodResolver(UserCreateFormSchema),
    defaultValues: {
      role: RoleKeyEnum.VIEWER,
    },
  });

  const {
    mutate: createUserMutate,
    isPending: createUserIsPending,
    isPaused: createUserIsPaused,
  } = useCreateUser({
    onSuccess: () => {
      navigate("/users");
    },
    onError: (error) => {
      if (error instanceof RequestorAPIValidationError) {
        return applyValidationErrors(
          setError,
          error.errors as TRequestorApiErrorResponse<TUserCreatePayload>[],
        );
      }

      return;
    },
  });

  const onSubmit: SubmitHandler<TUserCreateFormSchema> = (data) => {
    const payload: TUserCreatePayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    createUserMutate(payload);
  };

  const isFormDisabled = useMemo(
    () => createUserIsPending || createUserIsPaused,
    [createUserIsPending, createUserIsPaused],
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
