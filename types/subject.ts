export interface Subject {
  id: string;
  name: string;
  color: string;
  icon?: string;
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}

export type Priority = 'low' | 'medium' | 'high';
export type Mastery = 0 | 1 | 2 | 3 | 4 | 5;

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  priority: Priority;
  mastery: Mastery;
  examDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
