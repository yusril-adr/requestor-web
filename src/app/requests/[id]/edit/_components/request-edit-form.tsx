import { useEffect, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

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
  RequestEditFormSchema,
  type TRequestEditFormSchema,
} from "@/app/requests/[id]/edit/_schema/request-edit-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRequestById,
  updateRequestById,
} from "@/api/requestor/requests/[id]";
import CONFIG from "@/common/constants/config";
import type {
  TRequestorApiErrorResponse,
  TRequestorApiResponse,
} from "@/api/requestor/types/response";
import type { TRequestUpdatePayload } from "@/api/requestor/requests/[id]/types/request-update-payload";
import { useAuth } from "@/app/_hooks/use-auth";
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";

export default function RequestEditForm() {
  const params = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(), params.id],
    queryFn: () => getRequestById(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (getDataQuery.isError && axios.isAxiosError(getDataQuery.error)) {
      const statusCode = getDataQuery.error.response?.status;

      const defaultErrorResponse = getDataQuery.error.response
        ?.data as TRequestorApiResponse<null>;

      switch (statusCode) {
        case 401:
          toast.error(defaultErrorResponse.message as string);
          logout();
          break;
        case 404:
          toast.error("Request not found");
          navigate("/requests");
          break;
        default:
          toast.error(defaultErrorResponse.message as string);
          break;
      }
    }
  }, [getDataQuery]);

  const defaultValues = useMemo(() => {
    return {
      title: getDataQuery.data?.data?.data?.title || "",
      requestorName: getDataQuery.data?.data?.data?.requestor_name || "",
      assigneeName: getDataQuery.data?.data?.data?.assignee_name || "",
      status:
        (getDataQuery.data?.data?.data?.status as
          | RequestStatusEnum
          | undefined) || RequestStatusEnum.SUSPENDED,
      priority:
        (getDataQuery.data?.data?.data?.priority as
          | RequestPriorityEnum
          | undefined) || RequestPriorityEnum.LOW,
    };
  }, [getDataQuery]);

  const { control, handleSubmit, setError } = useForm<TRequestEditFormSchema>({
    resolver: zodResolver(RequestEditFormSchema),
    values: defaultValues,
  });

  const mappedErrorKeys: {
    key: keyof TRequestEditFormSchema;
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
  const updateMutation = useMutation({
    mutationFn: updateRequestById,
    onMutate: () => {
      toast.loading("Updating request...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Request updated.");
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
              TRequestorApiErrorResponse<TRequestUpdatePayload>
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

  const onSubmit: SubmitHandler<TRequestEditFormSchema> = (data) => {
    const payload: TRequestUpdatePayload = {
      title: data.title,
      requestor_name: data.requestorName,
      assignee_name: data.assigneeName || null,
      status: data.status,
      priority: data.priority,
    };
    console.log(payload);

    updateMutation.mutate({ id: params.id as string, payload });
  };

  const isFormDisabled = useMemo(
    () =>
      updateMutation.isPending ||
      updateMutation.isPaused ||
      getDataQuery.isLoading ||
      getDataQuery.isPaused,
    [updateMutation, getDataQuery],
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

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Combobox
                    id="status"
                    items={Object.values(RequestStatusEnum)}
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
