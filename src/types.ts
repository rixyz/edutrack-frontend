export type ApiResponse<T> = {
  errors: string[] | string;
  status: string;
  message: string;
  data: T;
};

// User Types

export type UserRole = "Student" | "Teacher" | "Admin";

export type UserDetail = {
  phone: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name: UserRole;
  profile_picture: string;
};

export type TeacherDetail = {
  id: number;
  user: UserDetail;
  subjects: Subject[];
};

export type StudentDetail = {
  id: number;
  user: UserDetail;
  semester: number;
  batch: string;
};

// Academic

export type Submission = {
  id: number;
  assignment: number;
  submission_file: string;
  created_at: string;
  score: number;
  feedback: string;
  student_name: string;
  student_id: number;
};

export type Assignment = {
  id: number;
  title: string;
  description: string;
  subject: number;
  subject_data: Subject;
  due_date: Date;
  max_score: number;
  created_at: string;
  submission: Submission[];
};

export type Subject = {
  id: number;
  name: string;
  code: string;
  semester: number;
};

export type AssignmentFormData = {
  title: string;
  description: string;
  subject: number;
  due_date: Date;
  max_score: number;
};

export type Lesson = {
  id: number;
  title: string;
  content: string;
  order: number;
  duration_minutes: number;
};

export type Course = {
  id: number;
  subject: number;
  subject_data: Subject;
  type: string;
  title: string;
  description: string;
  lessons: number;
  duration_minutes: number;
  duration: string;
  teacher: TeacherDetail
  lesson_list: Lesson[];
  created_at: string;
  updated_at: string;
};

export type CourseFormData = {
  title: string;
  type: string;
  description: string;
  subject: number;
  duration_minutes: number;
};

// Message
export type MessageList = {
  user: UserDetail;
  last_message: string;
  last_message_time: string;
};

export interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  created_at: string;
}

// Evaluations

export type ConfidenceFactor = {
  level: "High" | "Low" | "Medium";
  reason: string;
};

export type ConfidenceLevel = {
  level: "High" | "Low" | "Medium";
  factors: ConfidenceFactor[];
};

type AttendanceImpact = {
  rate: number;
  impact: "Positive" | "Neutral" | "Negative";
  description: string;
};

type TopicPerformance = {
  average: number;
  trend: string;
  submissions: number;
};

type WeaknessItem = {
  topic: string;
  score: number;
  trend: string;
};

export type ImprovementRecommendation = {
  area: string;
  recommendation: string;
  impact: "High" | "Medium" | "Low";
};

type ImprovementPotential = {
  potential_improvement: number;
  factors: {
    completion_impact: number;
    current_performance_impact: number;
  };
  recommendations: ImprovementRecommendation[];
};

type PredictedScoreRange = {
  predicted_score: number;
  range: {
    lower: number;
    upper: number;
  };
  factors_considered: {
    current_average: number;
    completion_impact: number;
    attendance_impact: number;
  };
};

export type SubjectPrediction = {
  subject_id: number;
  subject_name: string;
  current_average: number;
  attendance_impact: AttendanceImpact;
  assignment_completion: number;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  topic_wise_performance: Record<string, TopicPerformance | {}>;
  strengths: string[];
  weaknesses: WeaknessItem[];
  improvement_potential: ImprovementPotential;
  predicted_score_range: PredictedScoreRange;
  confidence_level: ConfidenceLevel;
};

type PerformanceMetrics = {
  attendance_rate: number;
  assignment_completion_rate: number;
  average_assignment_score: number;
};

type StudentWithPrediction = {
  id: number;
  name: string;
  email: string;
  semester: number;
  batch: string;
  performance_metrics: PerformanceMetrics;
  predictions: SubjectPrediction;
};

export type SubjectPerformanceData = {
  [subject: string]: StudentWithPrediction[];
};

export type StudentPredictions = {
  [subject: string]: SubjectPrediction;
};

export type SubjectResult = {
  SUBJECT_CODE: string;
  SUBJECT_NAME: string;
  CREDIT_HOUR: number;
  GPA: number;
};

export type SemesterResults = {
  [subjectCode: string]: SubjectResult;
};

export type StudentResults = {
  [semester: number]: SemesterResults;
};
