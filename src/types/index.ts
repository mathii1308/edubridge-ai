export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  email_verified?: boolean;
  account_status?: string;
  created_at?: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  education_level: string;
  institution: string;
  preferred_language: 'English' | 'Tamil';
  learning_level: 'Beginner' | 'Intermediate' | 'Advanced';
  state: string;
  course: string;
  academic_score: number;
  income_range: number;
}

export interface Citation {
  title: string;
  source_name: string;
  source_url: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  language?: string;
  subject?: string;
  topic?: string;
  citations?: Citation[];
  needs_tutor?: boolean;
  learning_gap?: string;
  timestamp: string;
}

export interface Tutor {
  id: number;
  user_id: number;
  name: string;
  bio: string;
  experience: number;
  rating: number;
  teaching_mode: string;
  verified: boolean;
  subjects: string[];
  topics: string[];
  languages: string[];
  match_score?: number;
  match_reasons?: string[];
  availabilities?: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'reserved' | 'booked' | 'unavailable';
}

export interface Booking {
  id: number;
  student_id: number;
  teacher_id: number;
  teacher_name?: string;
  student_name?: string;
  subject_name: string;
  topic_name: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  student_requirement?: string;
  status: 'requested' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  created_at: string;
}

export interface BookingMessage {
  id: number;
  booking_id: number;
  sender_id: number;
  sender_name?: string;
  sender_role: 'student' | 'teacher';
  message: string;
  created_at: string;
  read: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  explanation: string;
}

export interface Quiz {
  id: number;
  subject: string;
  topic: string;
  difficulty: string;
  questions?: QuizQuestion[];
  question_count?: number;
}

export interface Scholarship {
  id: number;
  name: string;
  provider: string;
  description: string;
  official_url: string;
  source_url: string;
  application_start?: string;
  application_deadline: string;
  academic_year: string;
  education_level: string;
  courses: string[];
  states: string[];
  min_percentage: number;
  max_income: number;
  benefits: string;
  documents_required: string[];
  status: string;
  last_verified_at: string;
  is_eligible?: boolean;
  match_percentage?: number;
  eligibility_reasons?: string[];
  saved?: boolean;
}

export interface NotificationItem {
  id: number;
  type: 'booking' | 'scholarship' | 'progress' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
