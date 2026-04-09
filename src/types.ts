export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  content: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CourseWithSections extends Course {
  sections: SectionWithLessons[];
}

export interface SectionWithLessons extends Section {
  lessons: Lesson[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  last_accessed: string;
  code_submission: string | null;
  test_results: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition_type: 'lessons_completed' | 'courses_completed' | 'streak_days';
  condition_value: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  created_at: string;
  updated_at: string;
  badge?: Badge;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
  updated_at: string;
  achievement?: Achievement;
}

export interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
  };
}
