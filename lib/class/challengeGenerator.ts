import { MicroChallenge } from '@/types/classMode';
import { generateId } from '@/lib/utils/validation';

/**
 * Générateur de micro-défis pour le mode classe
 */

const CHALLENGES: Omit<MicroChallenge, 'id' | 'completed'>[] = [
  {
    description: 'Noter 3 exemples donnés par le prof',
    points: 15,
  },
  {
    description: 'Repérer 1 définition clé et la noter',
    points: 15,
  },
  {
    description: 'Rédiger 1 question à poser à la fin',
    points: 15,
  },
  {
    description: 'Faire un schéma du concept principal',
    points: 20,
  },
  {
    description: 'Noter 5 mots-clés importants',
    points: 10,
  },
  {
    description: 'Résumer le cours en 3 points à la fin',
    points: 15,
  },
  {
    description: 'Identifier un lien avec un cours précédent',
    points: 20,
  },
  {
    description: 'Noter une application pratique du concept',
    points: 15,
  },
  {
    description: 'Reformuler une idée complexe avec vos mots',
    points: 20,
  },
  {
    description: 'Poser 1 question de clarification',
    points: 15,
  },
];

export function generateRandomChallenge(): MicroChallenge {
  const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
  const challenge = CHALLENGES[randomIndex];
  
  return {
    id: generateId(),
    ...challenge,
    completed: false,
  };
}

export function getChallengeByDescription(description: string): MicroChallenge | null {
  const challenge = CHALLENGES.find(c => c.description === description);
  if (!challenge) return null;
  
  return {
    id: generateId(),
    ...challenge,
    completed: false,
  };
}

export function getAllChallenges(): MicroChallenge[] {
  return CHALLENGES.map(c => ({
    id: generateId(),
    ...c,
    completed: false,
  }));
}
