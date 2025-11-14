'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useGoals } from '@/hooks/useGoals';
import { useSubjects } from '@/hooks/useSubjects';
import { TaskCard } from '@/components/tasks/TaskCard';
import { GoalCard } from '@/components/tasks/GoalCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Task, TaskPriority, Goal, TimeFrame } from '@/types/task';
import { generateId } from '@/lib/utils/validation';

export default function TasksPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const {
    tasks,
    getTasksDueToday,
    getTasksDueThisWeek,
    getOverdueTasks,
    createTask,
    deleteTask,
    completeTask,
    setTaskStatus,
  } = useTasks();

  const {
    goals,
    getGoalsByTimeFrame,
    createGoal,
    deleteGoal,
  } = useGoals();

  const { subjects } = useSubjects();

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

  // Filtrer les tâches
  let filteredTasks = tasks;
  if (taskFilter === 'today') {
    filteredTasks = getTasksDueToday();
  } else if (taskFilter === 'week') {
    filteredTasks = getTasksDueThisWeek();
  } else if (taskFilter === 'overdue') {
    filteredTasks = getOverdueTasks();
  }

  // Grouper les tâches par statut
  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  // Grouper les objectifs par timeframe
  const shortTermGoals = getGoalsByTimeFrame('short');
  const mediumTermGoals = getGoalsByTimeFrame('medium');
  const longTermGoals = getGoalsByTimeFrame('long');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tâches & Objectifs 📋
        </h1>
        <p className="text-gray-600">Gérez vos tâches et suivez vos objectifs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'tasks' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tâches ({tasks.length})
        </Button>
        <Button
          variant={activeTab === 'goals' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Objectifs ({goals.length})
        </Button>
      </div>

      {/* VUE TÂCHES */}
      {activeTab === 'tasks' && (
        <>
          {/* Filtres & Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={taskFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTaskFilter('all')}
              >
                Toutes ({tasks.length})
              </Button>
              <Button
                variant={taskFilter === 'today' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTaskFilter('today')}
              >
                Aujourd'hui ({getTasksDueToday().length})
              </Button>
              <Button
                variant={taskFilter === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTaskFilter('week')}
              >
                Cette semaine ({getTasksDueThisWeek().length})
              </Button>
              <Button
                variant={taskFilter === 'overdue' ? 'danger' : 'outline'}
                size="sm"
                onClick={() => setTaskFilter('overdue')}
              >
                En retard ({getOverdueTasks().length})
              </Button>
            </div>
            <Button variant="primary" onClick={() => setIsTaskFormOpen(true)}>
              + Nouvelle tâche
            </Button>
          </div>

          {/* Colonnes Kanban */}
          <div className="grid grid-cols-3 gap-6">
            {/* À faire */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                À faire ({todoTasks.length})
              </h3>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => completeTask(task.id)}
                    onStatusChange={(status) => setTaskStatus(task.id, status)}
                    onDelete={() => {
                      if (confirm('Supprimer cette tâche ?')) {
                        deleteTask(task.id);
                      }
                    }}
                  />
                ))}
                {todoTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>Aucune tâche</p>
                  </div>
                )}
              </div>
            </div>

            {/* En cours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                En cours ({inProgressTasks.length})
              </h3>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => completeTask(task.id)}
                    onStatusChange={(status) => setTaskStatus(task.id, status)}
                    onDelete={() => {
                      if (confirm('Supprimer cette tâche ?')) {
                        deleteTask(task.id);
                      }
                    }}
                  />
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>Aucune tâche</p>
                  </div>
                )}
              </div>
            </div>

            {/* Terminées */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Terminées ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.slice(0, 10).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => {
                      if (confirm('Supprimer cette tâche ?')) {
                        deleteTask(task.id);
                      }
                    }}
                  />
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>Aucune tâche</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* VUE OBJECTIFS */}
      {activeTab === 'goals' && (
        <>
          <div className="flex justify-end mb-6">
            <Button variant="primary" onClick={() => setIsGoalFormOpen(true)}>
              + Nouvel objectif
            </Button>
          </div>

          {/* Objectifs par timeframe */}
          <div className="space-y-8">
            {/* Court terme */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🎯 Court terme (0-2 semaines) - {shortTermGoals.length}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shortTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    taskCount={goal.linkedTaskIds.length}
                    onDelete={() => {
                      if (confirm('Supprimer cet objectif ?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                  />
                ))}
                {shortTermGoals.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <p>Aucun objectif court terme</p>
                  </div>
                )}
              </div>
            </div>

            {/* Moyen terme */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🚀 Moyen terme (2-8 semaines) - {mediumTermGoals.length}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    taskCount={goal.linkedTaskIds.length}
                    onDelete={() => {
                      if (confirm('Supprimer cet objectif ?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                  />
                ))}
                {mediumTermGoals.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <p>Aucun objectif moyen terme</p>
                  </div>
                )}
              </div>
            </div>

            {/* Long terme */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🏆 Long terme (2+ mois) - {longTermGoals.length}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {longTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    taskCount={goal.linkedTaskIds.length}
                    onDelete={() => {
                      if (confirm('Supprimer cet objectif ?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                  />
                ))}
                {longTermGoals.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <p>Aucun objectif long terme</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulaire Tâche (simplifié pour exemple) */}
      <QuickTaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onCreate={createTask}
        subjects={subjects}
      />

      {/* Formulaire Objectif (simplifié pour exemple) */}
      <QuickGoalForm
        isOpen={isGoalFormOpen}
        onClose={() => setIsGoalFormOpen(false)}
        onCreate={createGoal}
      />
    </div>
  );
}

// Formulaire rapide tâche
function QuickTaskForm({ isOpen, onClose, onCreate, subjects }: any) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title, priority, {
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setTitle('');
      setPriority('medium');
      setDueDate('');
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Nouvelle tâche">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Réviser le chapitre 3"
            required
          />
          <Select
            label="Priorité"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: 'low', label: 'Basse' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'high', label: 'Haute' },
              { value: 'urgent', label: 'Urgente' },
            ]}
          />
          <Input
            label="Date limite (optionnel)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Créer
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

// Formulaire rapide objectif
function QuickGoalForm({ isOpen, onClose, onCreate }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('short');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && targetDate) {
      onCreate(title, description, timeFrame, new Date(targetDate), color);
      setTitle('');
      setDescription('');
      setTimeFrame('short');
      setTargetDate('');
      setColor('#3B82F6');
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Nouvel objectif">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Réussir mon examen de maths"
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détaillez votre objectif..."
            rows={3}
          />
          <Select
            label="Échéance"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            options={[
              { value: 'short', label: 'Court terme (0-2 semaines)' },
              { value: 'medium', label: 'Moyen terme (2-8 semaines)' },
              { value: 'long', label: 'Long terme (2+ mois)' },
            ]}
          />
          <Input
            label="Date cible"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
          <Input
            label="Couleur"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Créer
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
