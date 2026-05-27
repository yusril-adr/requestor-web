import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

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

import login from "@/api/requestor/auth/login/function";
import type {
  TRequestorApiResponse,
  TRequestorApiErrorResponse,
} from "@/api/requestor/_types/response";
import type { TLoginPayload } from "@/api/requestor/auth/login/_types/payload";
import { LoginSchema, type TLoginSchema } from "@/app/login/_schema/login";
import AccessToken from "@/libs/local-storage/access-token";
import CONFIG from "@/common/constants/config";

export function LoginForm() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { control, handleSubmit, setError } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      toast.loading("Logging in...");
    },
    onSuccess: async (response) => {
      const responseData = response.data.data;

      AccessToken.set(responseData.access_token);

      toast.dismiss();
      toast.success("Login Success");

      queryClient.invalidateQueries({
        queryKey: CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ALL(),
      });

      navigate("/");
    },
    onError: (error) => {
      toast.dismiss();

      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        const defaultErrorResponse = error.response
          ?.data as TRequestorApiResponse<null>;

        switch (statusCode) {
          case 400:
            const validationErrorResponse = error.response
              ?.data as TRequestorApiResponse<
              null,
              TRequestorApiErrorResponse<TLoginPayload>
            >;

            if (Array.isArray(validationErrorResponse.message)) {
              return validationErrorResponse.message.forEach((errorMessage) => {
                setError(errorMessage.property, {
                  message: errorMessage.messages[0],
                });
              });
            } else {
              toast.error(defaultErrorResponse.message as string);
            }
            break;
          default:
            toast.error(defaultErrorResponse.message as string);
            break;
        }

        return;
      }

      return;
    },
  });

  const onSubmit: SubmitHandler<TLoginSchema> = (data) => {
    const payload: TLoginPayload = {
      email: data.email,
      password: data.password,
    };
    mutation.mutate(payload);
  };

  const isFormDisabled = useMemo(
    () => mutation.isPending || mutation.isPaused,
    [mutation],
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
                      id="inline-end-input"
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
