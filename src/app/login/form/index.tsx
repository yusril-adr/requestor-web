import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Spinner } from "@/app/_components/ui/spinner";

import type { TRequestorApiErrorResponse } from "@/api/requestor/types/response";
import type { TLoginPayload } from "@/api/requestor/auth/login/types/login-payload";
import type { TLoginFormProps } from "@/app/login/_types/login-form-props";
import {
  LoginFormSchema,
  type TLoginFormSchema,
} from "./scheme";
import { applyValidationErrors } from "@/utils/validation-helper";
import RequestorAPIValidationError from "@/api/requestor/errors/validation-error";

export function LoginForm({
  onSubmitPayload,
  mutationError,
  isPending,
  isPaused,
}: TLoginFormProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { control, handleSubmit, setError } = useForm<TLoginFormSchema>({
    resolver: zodResolver(LoginFormSchema),
  });

  useEffect(() => {
    if (mutationError instanceof RequestorAPIValidationError) {
      applyValidationErrors(
        setError,
        mutationError.errors as TRequestorApiErrorResponse<null>[],
      );
    }
  }, [mutationError, setError]);

  const onSubmit: SubmitHandler<TLoginFormSchema> = (data) => {
    const payload: TLoginPayload = {
      email: data.email,
      password: data.password,
    };
    onSubmitPayload(payload);
  };

  const isFormDisabled = useMemo(
    () => isPending || isPaused,
    [isPending, isPaused],
  );

  return (
    <form
      className="w-full lg:w-1/2 h-screen flex justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
                <Field className="grid gap-2" data-invalid={fieldState.invalid}>
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
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isFormDisabled ? <Spinner /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
