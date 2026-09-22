export interface Academy {
  id: string;
  name: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
}

export interface Branch {
  id: string;
  academy_id: string;
  name: string;
  address?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface User {
  id: string;
  academy_id: string;
  branch_id: string;
  email: string;
  name: string;
  phone?: string;
  role: "owner" | "accounts" | "coach" | "player" | "parent";
  status: "active" | "inactive";
  created_at: string;
}

export interface Player {
  id: string;
  academy_id: string;
  branch_id: string;
  user_id?: string;
  parent_id?: string;
  player_code: string;
  full_name: string;
  date_of_birth: string;
  gender: "M" | "F" | "Other";
  phone: string;
  email?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  profile_photo_url?: string;
  cricket_category: string;
  batting_style?: string;
  bowling_style?: string;
  joining_date: string;
  batch_id?: string;
  status: "prospect" | "trial" | "registered" | "active" | "suspended" | "inactive" | "expired" | "left";
  medical_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  academy_id: string;
  branch_id: string;
  name: string;
  coach_id: string;
  age_group: string;
  level: string;
  days: string;
  time_start: string;
  time_end: string;
  capacity: number;
  monthly_fee: number;
  start_date: string;
  end_date?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Coach {
  id: string;
  academy_id: string;
  branch_id: string;
  user_id: string;
  name: string;
  phone: string;
  code: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface FeeObligation {
  id: string;
  player_id: string;
  batch_id?: string;
  amount: number;
  billing_period: string;
  due_date: string;
  status: "due" | "payment_declared" | "reconciled" | "mismatch" | "overdue" | "partially_paid" | "waived" | "cancelled" | "received_pending_match";
  created_at: string;
  updated_at: string;
}

export interface PaymentDeclaration {
  id: string;
  fee_obligation_id: string;
  declared_amount: number;
  payment_method: string;
  payment_date: string;
  reference_id?: string;
  notes?: string;
  declared_by: string;
  timestamp: string;
}

export interface AccountsConfirmation {
  id: string;
  fee_obligation_id: string;
  received_amount: number;
  received_date: string;
  received_by: string;
  reference_id?: string;
  timestamp: string;
  status: "confirmed" | "rejected" | "flagged";
}

export interface Reconciliation {
  id: string;
  fee_obligation_id: string;
  reconciled_amount: number;
  reconciled_at: string;
  reconciled_by: string;
}

export interface Goal {
  id: string;
  player_id: string;
  coach_id: string;
  title: string;
  description: string;
  category: string;
  target: string;
  due_date: string;
  status: "active" | "completed" | "archived";
  progress: number;
  created_at: string;
}

export interface Drill {
  id: string;
  academy_id: string;
  title: string;
  category: string;
  description: string;
  instructions: string;
  duration_minutes?: number;
  demonstration_media_id?: string;
  created_at: string;
}

export interface DrillAssignment {
  id: string;
  player_id: string;
  drill_id: string;
  assigned_by: string;
  due_date: string;
  status: "assigned" | "started" | "completed" | "reviewed" | "needs_improvement";
  completed_date?: string;
  notes?: string;
  created_at: string;
}

export interface Media {
  id: string;
  player_id: string;
  drill_assignment_id?: string;
  type: "video" | "image" | "document";
  storage_reference: string;
  metadata?: Record<string, any>;
  uploaded_at: string;
}

export interface CoachFeedback {
  id: string;
  player_id: string;
  drill_assignment_id?: string;
  media_id?: string;
  coach_id: string;
  feedback: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  academy_id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  previous_value?: string;
  new_value?: string;
  timestamp: string;
}

export interface RevenueMetrics {
  expected: number;
  reconciled: number;
  declared: number;
  received: number;
  unreconciled: number;
  overdue: number;
  mismatch: number;
  leakage_risk: number;
}

export interface LeakageAlert {
  id: string;
  academy_id: string;
  rule_name: string;
  entity_type: string;
  entity_id: string;
  severity: "high" | "medium" | "low";
  description: string;
  details: Record<string, any>;
  created_at: string;
  resolved_at?: string;
}
