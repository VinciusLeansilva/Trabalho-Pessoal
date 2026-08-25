'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">EM</span>
          </div>
          <span className="text-xl font-bold">EduMatrix</span>
        </div>

        {/* Error icon */}
        <div className="text-6xl">⚠️</div>

        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="text-muted-foreground text-sm">
          {error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium',
              'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 transition-colors'
            )}
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium',
              'border border-input bg-background hover:bg-accent px-4 py-2 transition-colors'
            )}
          >
            Ir ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
