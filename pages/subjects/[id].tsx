'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSubjects } from '@/hooks/useSubjects';
import { ChapterCard } from '@/components/subjects/ChapterCard';
import { ChapterForm } from '@/components/subjects/ChapterForm';
import { Button } from '@/components/ui/button';
import { Priority, Mastery } from '@/types/subject';

export default function SubjectDetailPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { getSubject, addChapter, updateChapter, deleteChapter } = useSubjects();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  const subject = getSubject(id as string);

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <p className="text-2xl text-gray-600">Matière introuvable</p>
          <Button
            variant="primary"
            onClick={() => router.push('/subjects')}
            className="mt-4"
          >
            Retour aux matières
          </Button>
        </div>
      </div>
    );
  }

  const editingChapter = editingChapterId
    ? subject.chapters.find((c) => c.id === editingChapterId)
    : null;

  const handleAddChapter = (data: {
    title: string;
    description?: string;
    priority: Priority;
    mastery: Mastery;
    examDate?: Date;
  }) => {
    addChapter(
      subject.id,
      data.title,
      data.description,
      data.priority,
      data.examDate
    );
    setIsFormOpen(false);
  };

  const handleEditChapter = (data: {
    title: string;
    description?: string;
    priority: Priority;
    mastery: Mastery;
    examDate?: Date;
  }) => {
    if (editingChapterId) {
      updateChapter(subject.id, editingChapterId, data);
      setEditingChapterId(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
      deleteChapter(subject.id, chapterId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <Button
        variant="ghost"
        onClick={() => router.push('/subjects')}
        className="mb-4"
      >
        ← Retour
      </Button>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: subject.color }}
        >
          {subject.icon || '📚'}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {subject.name}
          </h1>
          <p className="text-gray-600">
            {subject.chapters.length} chapitre(s)
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsFormOpen(true)}>
          + Ajouter chapitre
        </Button>
      </div>

      {/* Liste des chapitres */}
      {subject.chapters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Aucun chapitre
          </h2>
          <p className="text-gray-600 mb-6">
            Ajoutez votre premier chapitre pour cette matière
          </p>
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            Créer un chapitre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subject.chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onEdit={() => {
                setEditingChapterId(chapter.id);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDeleteChapter(chapter.id)}
            />
          ))}
        </div>
      )}

      {/* Formulaire */}
      <ChapterForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingChapterId(null);
        }}
        onSubmit={editingChapter ? handleEditChapter : handleAddChapter}
        initialData={editingChapter || undefined}
      />
    </div>
  );
}
