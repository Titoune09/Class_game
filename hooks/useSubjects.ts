import { usePersistentState } from './usePersistentState';
import { Subject, Chapter, Priority, Mastery } from '@/types/subject';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { generateId } from '@/lib/utils/validation';

/**
 * Hook pour gérer les matières et chapitres
 */
export function useSubjects() {
  const [subjects, setSubjects] = usePersistentState<Subject[]>(
    STORAGE_KEYS.SUBJECTS,
    []
  );

  // Récupérer toutes les matières
  const getSubjects = () => subjects;

  // Récupérer une matière par ID
  const getSubject = (id: string): Subject | undefined => {
    return subjects.find((s) => s.id === id);
  };

  // Créer une matière
  const createSubject = (
    name: string,
    color: string,
    icon?: string
  ): Subject => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      color,
      icon,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSubjects([...subjects, newSubject]);
    return newSubject;
  };

  // Mettre à jour une matière
  const updateSubject = (
    id: string,
    updates: Partial<Omit<Subject, 'id' | 'chapters' | 'createdAt'>>
  ) => {
    setSubjects(
      subjects.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
      )
    );
  };

  // Supprimer une matière
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  // Ajouter un chapitre
  const addChapter = (
    subjectId: string,
    title: string,
    description?: string,
    priority: Priority = 'medium',
    examDate?: Date
  ): Chapter | null => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return null;

    const newChapter: Chapter = {
      id: generateId(),
      subjectId,
      title,
      description,
      priority,
      mastery: 0,
      examDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSubjects(
      subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              chapters: [...s.chapters, newChapter],
              updatedAt: new Date(),
            }
          : s
      )
    );

    return newChapter;
  };

  // Mettre à jour un chapitre
  const updateChapter = (
    subjectId: string,
    chapterId: string,
    updates: Partial<Omit<Chapter, 'id' | 'subjectId' | 'createdAt'>>
  ) => {
    setSubjects(
      subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map((c) =>
                c.id === chapterId
                  ? { ...c, ...updates, updatedAt: new Date() }
                  : c
              ),
              updatedAt: new Date(),
            }
          : s
      )
    );
  };

  // Supprimer un chapitre
  const deleteChapter = (subjectId: string, chapterId: string) => {
    setSubjects(
      subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.filter((c) => c.id !== chapterId),
              updatedAt: new Date(),
            }
          : s
      )
    );
  };

  // Récupérer un chapitre
  const getChapter = (
    subjectId: string,
    chapterId: string
  ): Chapter | undefined => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.chapters.find((c) => c.id === chapterId);
  };

  // Compter les chapitres avec mastery = 5
  const countMasteredChapters = (): number => {
    return subjects.reduce(
      (count, subject) =>
        count + subject.chapters.filter((c) => c.mastery === 5).length,
      0
    );
  };

  return {
    subjects,
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    updateChapter,
    deleteChapter,
    getChapter,
    countMasteredChapters,
  };
}
