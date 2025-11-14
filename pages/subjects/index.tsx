'use client';

import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { SubjectForm } from '@/components/subjects/SubjectForm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export default function SubjectsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { subjects, createSubject } = useSubjects();
  const router = useRouter();

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

  const handleCreateSubject = (name: string, color: string, icon?: string) => {
    createSubject(name, color, icon);
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Matières 📚
          </h1>
          <p className="text-gray-600">{subjects.length} matière(s)</p>
        </div>
        <Button variant="primary" onClick={() => setIsFormOpen(true)}>
          + Ajouter
        </Button>
      </div>

      {/* Liste des matières */}
      {subjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Aucune matière
          </h2>
          <p className="text-gray-600 mb-6">
            Créez votre première matière pour commencer
          </p>
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            Créer une matière
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => router.push(`/subjects/${subject.id}`)}
            />
          ))}
        </div>
      )}

      {/* Formulaire */}
      <SubjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
}
