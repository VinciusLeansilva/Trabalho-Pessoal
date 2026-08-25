"use client";
import React, { useState } from 'react';
import { ArrowLeft, Book, CheckSquare, Clock, GraduationCap, Calendar as CalendarIcon, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const gradeData = [
  { name: 'Bim 1', nota: 7.5 },
  { name: 'Bim 2', nota: 8.2 },
  { name: 'Bim 3', nota: 7.8 },
  { name: 'Bim 4', nota: 8.5 },
];

export default function StudentDetailPage({ params: _params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('notas');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Perfil do Aluno</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl shrink-0">
          AS
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Ana Silva</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Book size={16} /> Matrícula: 2026001</span>
            <span className="flex items-center gap-1.5"><GraduationCap size={16} /> Turma: 1º Ano A</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Status: Ativo</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={18} /> Boletim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Média Geral</p>
          <p className="text-3xl font-bold text-green-600 mt-1">8.5</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Frequência</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">95%</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Ativ. Entregues</p>
          <p className="text-3xl font-bold mt-1">12</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Ativ. Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">1</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b bg-gray-50/50">
          <nav className="flex space-x-8 px-6">
            {['notas', 'frequencia', 'atividades', 'historico'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab === 'frequencia' ? 'Frequência' : tab === 'historico' ? 'Histórico' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'notas' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Evolução de Notas</h3>
                <div className="h-72 w-full bg-white p-4 border rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gradeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="nota" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8, fill: '#2563eb' }} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Boletim Detalhado</h3>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3.5 font-medium text-gray-500">Avaliação</th>
                        <th className="px-6 py-3.5 font-medium text-gray-500">Data</th>
                        <th className="px-6 py-3.5 font-medium text-gray-500">Nota</th>
                        <th className="px-6 py-3.5 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { nome: 'Prova 1', data: '15/03/2026', nota: 7.5, status: 'Aprovado' },
                        { nome: 'Trabalho de Pesquisa', data: '22/04/2026', nota: 9.0, status: 'Aprovado' },
                        { nome: 'Prova 2', data: '10/05/2026', nota: 8.2, status: 'Aprovado' },
                      ].map((av, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{av.nome}</td>
                          <td className="px-6 py-4 text-gray-500">{av.data}</td>
                          <td className="px-6 py-4 font-bold text-green-600 text-base">{av.nota.toFixed(1)}</td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                              {av.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'frequencia' && (
            <div>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> <span className="text-sm font-medium text-gray-700">Presente (P)</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm"></div> <span className="text-sm font-medium text-gray-700">Falta (F)</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded-sm"></div> <span className="text-sm font-medium text-gray-700">Falta Justificada (J)</span></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 border rounded-xl bg-gray-50 text-center"><p className="text-sm text-gray-500 font-medium">Total Aulas</p><p className="text-2xl font-bold mt-1">120</p></div>
                <div className="p-4 border rounded-xl bg-green-50 text-center"><p className="text-sm text-gray-500 font-medium">Presenças</p><p className="text-2xl font-bold text-green-700 mt-1">114</p></div>
                <div className="p-4 border rounded-xl bg-red-50 text-center"><p className="text-sm text-gray-500 font-medium">Faltas</p><p className="text-2xl font-bold text-red-700 mt-1">4</p></div>
                <div className="p-4 border rounded-xl bg-yellow-50 text-center"><p className="text-sm text-gray-500 font-medium">Justificadas</p><p className="text-2xl font-bold text-yellow-700 mt-1">2</p></div>
              </div>

              <div className="p-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center flex flex-col items-center justify-center text-gray-500">
                <CalendarIcon size={48} className="mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-900 mb-1">Calendário Mensal</h4>
                <p className="max-w-md">O calendário detalhado de frequências estará disponível em breve com a próxima atualização do sistema.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'atividades' && (
            <div className="space-y-4">
              {[
                { nome: 'Lista de Exercícios 1', data: 'Entregue em 14/03/2026', status: 'Avaliado', cor: 'bg-green-100 text-green-700' },
                { nome: 'Trabalho de Pesquisa', data: 'Entregue em 20/04/2026', status: 'Avaliado', cor: 'bg-green-100 text-green-700' },
                { nome: 'Projeto Final', data: 'Pendente - Vence em 30/08/2026', status: 'Pendente', cor: 'bg-yellow-100 text-yellow-700' },
              ].map((ativ, i) => (
                <div key={i} className="border rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg"><CheckSquare size={20} className="text-gray-500" /></div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-base">{ativ.nome}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{ativ.data}</p>
                    </div>
                  </div>
                  <div className="self-start sm:self-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${ativ.cor}`}>{ativ.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="p-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center flex flex-col items-center justify-center text-gray-500">
              <Clock size={48} className="mb-4 text-gray-400" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">Histórico Escolar</h4>
              <p className="max-w-md">O histórico completo de anos anteriores do aluno está sendo migrado para o novo sistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
