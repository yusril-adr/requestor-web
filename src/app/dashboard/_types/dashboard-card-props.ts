import type { useGetAuditLogPagination } from "@/app/audit-logs/_hooks/use-get-audit-log-pagination";
import type { useGetRequestPagination } from "@/app/requests/_hooks/use-get-request-pagination";
import type { useGetUserPagination } from "@/app/users/_hooks/use-get-user-pagination";

export type TTotalRequestCardProps = {
  query: ReturnType<typeof useGetRequestPagination>;
};

export type TTotalUserCardProps = {
  query: ReturnType<typeof useGetUserPagination>;
};

export type TTotalAuditLogCardProps = {
  query: ReturnType<typeof useGetAuditLogPagination>;
};

export type TRecentlyRequestCardProps = {
  query: ReturnType<typeof useGetRequestPagination>;
};

export type TRecentlyAuditLogCardProps = {
  query: ReturnType<typeof useGetAuditLogPagination>;
};
