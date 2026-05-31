export type TAuditLogResponse = {
  id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  created_at: string;
  updated_at: string;
};
