import { useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardFooter } from "@/app/_components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
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
  RequestCreateFormSchema,
  type TRequestCreateFormSchema,
} from "@/app/requests/create/_schema/request-create-form";

import { createRequest } from "@/api/requestor/requests";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import CONFIG from "@/common/constants/config";
import type {
  TRequestorApiErrorResponse,
  TRequestorApiResponse,
} from "@/api/requestor/types/response";
import type { TRequestCreatePayload } from "@/api/requestor/requests/types/request-create-payload";
import { useAuth } from "@/app/_hooks/use-auth";

export default function RequestCreateForm() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { control, handleSubmit, setError } = useForm<TRequestCreateFormSchema>(
    {
      resolver: zodResolver(RequestCreateFormSchema),
      defaultValues: {
        priority: RequestPriorityEnum.LOW,
      },
    },
  );

  const mappedErrorKeys: {
    key: keyof TRequestCreateFormSchema;
    mapped: string;
  }[] = [
    {
      key: "title",
      mapped: "title",
    },
    {
      key: "requestorName",
      mapped: "requestor_name",
    },
    {
      key: "priority",
      mapped: "priority",
    },
    {
      key: "assigneeName",
      mapped: "assignee_name",
    },
  ];

  const queryClient = useQueryClient();
  const createRequestMutation = useMutation({
    mutationFn: createRequest,
    onMutate: () => {
      toast.loading("Creating request...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Request created");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL()],
      });
      navigate("/requests");
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
              TRequestorApiErrorResponse<TRequestCreatePayload>
            >;

            if (Array.isArray(validationErrorResponse.message)) {
              return validationErrorResponse.message.forEach((errorMessage) => {
                const mappedKey = mappedErrorKeys.find(
                  (mappedErrorKey) =>
                    mappedErrorKey.mapped === errorMessage.property,
                );

                if (!mappedKey) {
                  toast.error(errorMessage.messages[0]);
                  return;
                }
                setError(mappedKey.key, {
                  message: errorMessage.messages[0],
                });
              });
            } else {
              toast.error(defaultErrorResponse.message as string);
            }
            break;

          case 401:
            toast.error(defaultErrorResponse.message as string);
            logout();
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

  const onSubmit: SubmitHandler<TRequestCreateFormSchema> = (data) => {
    const payload: TRequestCreatePayload = {
      title: data.title,
      requestor_name: data.requestorName,
      priority: data.priority,
      assignee_name: data.assigneeName,
    };

    createRequestMutation.mutate(payload);
  };

  const isFormDisabled = useMemo(
    () => createRequestMutation.isPending || createRequestMutation.isPaused,
    [createRequestMutation],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <FieldGroup className="grid md:grid-cols-2">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" placeholder="Input title" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="requestorName"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="requestor-name">
                    Requestor Name
                  </FieldLabel>
                  <Input
                    id="requestor-name"
                    type="text"
                    placeholder="Input requestor name"
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="assigneeName"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grid" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="assignee-name">Assignee Name</FieldLabel>
                  <Input
                    id="assignee-name"
                    type="text"
                    placeholder="Input assignee name"
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="priority">Priority</FieldLabel>
                  <Combobox
                    id="priority"
                    items={Object.values(RequestPriorityEnum)}
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <ComboboxInput placeholder="Select priority" showClear />
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
                render={<Link to={"/requests"} />}
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
