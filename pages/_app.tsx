import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Toast, useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const { toasts, removeToast } = useToast();
  const router = useRouter();

  const navigation = [
    { name: 'Accueil', path: '/', icon: '🏠' },
    { name: 'Matières', path: '/subjects', icon: '📚' },
    { name: 'Planning', path: '/planning', icon: '📅' },
    { name: 'Pomodoro', path: '/pomodoro', icon: '⏱️' },
    { name: 'Classe', path: '/class-mode', icon: '🎓' },
    { name: 'Stats', path: '/stats', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Component {...pageProps} />

      {/* Navigation Bottom (iPad-friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            {navigation.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Padding pour navigation bottom */}
      <div className="h-20" />
    </div>
  );
}
