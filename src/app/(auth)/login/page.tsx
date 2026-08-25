'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email ou senha incorretos.');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-10 w-10" />
              <h1 className="text-3xl font-bold">EduMatrix</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-4">ERP Educacional para Professores</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Simplifique sua rotina escolar com nossa plataforma completa.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <p>Gestão centralizada de turmas, alunos e notas.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <p>Criação e correção automatizada de atividades.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <p>Relatórios detalhados de desempenho.</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-sm text-blue-200">
            &copy; {new Date().getFullYear()} EduMatrix. Todos os direitos reservados.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Faça login para acessar sua conta.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                Acesso Rápido de Demonstração
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('professor@edumatrix.com');
                    setPassword('professor123');
                  }}
                  className="p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-gray-700 text-left transition-colors"
                >
                  <p className="font-medium text-blue-600 dark:text-blue-400">Professor</p>
                  <p className="text-muted-foreground text-[10px] truncate">professor@edumatrix.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@edumatrix.com');
                    setPassword('admin123');
                  }}
                  className="p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-gray-700 text-left transition-colors"
                >
                  <p className="font-medium text-blue-600 dark:text-blue-400">Administrador</p>
                  <p className="text-muted-foreground text-[10px] truncate">admin@edumatrix.com</p>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Registre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
