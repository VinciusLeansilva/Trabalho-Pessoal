import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NotFound() {
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

        {/* 404 */}
        <div className="text-8xl font-black text-blue-600/20">404</div>

        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>

        <Link
          href="/dashboard"
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium',
            'bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 transition-colors'
          )}
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
