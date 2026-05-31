export type TRequestResponse = {
  id: string;
  title: string;
  requestor_name: string;
  status: string;
  priority: string;
  assignee_name?: string | null;
  created_at: string;
  updated_at: string;
};
