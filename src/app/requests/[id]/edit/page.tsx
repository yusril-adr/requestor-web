import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import RequestEditForm from "@/app/requests/[id]/edit/form";
import { useGetRequestById } from "@/app/requests/_hooks/use-get-request-by-id";
import { useUpdateRequestById } from "@/app/requests/_hooks/use-update-request-by-id";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";

export function meta() {
  return [
    {
      title: "Requestor - Update request",
    },
  ];
}

export default function RequestEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const getDataQuery = useGetRequestById(params.id as string);
  const {
    mutate: updateRequestMutate,
    error: updateRequestError,
    isPending: updateRequestIsPending,
    isPaused: updateRequestIsPaused,
  } = useUpdateRequestById({
    onSuccess: () => {
      navigate("/requests");
    },
    onError: (error) => {
      if (error instanceof RequestorAPINotFoundError) {
        navigate("/requests");
      }
    },
  });

  useEffect(() => {
    if (
      getDataQuery.isError &&
      getDataQuery.error &&
      getDataQuery.error instanceof RequestorAPINotFoundError
    ) {
      navigate("/requests");
    }
  }, [getDataQuery.error, getDataQuery.isError, navigate]);

  const breadcrumbItems = [
    {
      name: "Requests",
      link: "/requests",
    },
    ...(!getDataQuery.isLoading
      ? [
          {
            name: getDataQuery.data?.data?.data?.title ?? "Detail",
            link: `/requests/${params.id}`,
          },
        ]
      : []),
    {
      name: "Edit",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <div className="flex items-center mt-4 mb-6 gap-x-2">
          <Link to={"/requests"}>
            <ArrowLeft />
          </Link>
          <h1 className="font-heading text-2xl">Edit Request</h1>
        </div>

        <RequestEditForm
          title={getDataQuery.data?.data?.data?.title}
          requestorName={getDataQuery.data?.data?.data?.requestor_name}
          assigneeName={getDataQuery.data?.data?.data?.assignee_name}
          status={getDataQuery.data?.data?.data?.status}
          priority={getDataQuery.data?.data?.data?.priority}
          isLoading={getDataQuery.isLoading}
          onSubmitPayload={(payload) =>
            updateRequestMutate({ id: params.id as string, payload })
          }
          mutationError={updateRequestError}
          isPending={updateRequestIsPending}
          isPaused={updateRequestIsPaused}
        />
      </div>
    </div>
  );
}
