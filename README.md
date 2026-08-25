# EduMatrix — ERP Educacional para Professores

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

## Visão Geral

EduMatrix é uma plataforma ERP (Enterprise Resource Planning) completa e moderna, desenvolvida especificamente para as necessidades de professores e educadores. O sistema atua como o principal assistente do docente, consolidando todos os aspectos da vida profissional em uma única plataforma integrada e altamente responsiva.

A plataforma se fundamenta em três pilares principais:
- **GESTÃO:** Controle total sobre turmas, alunos, notas, faltas e diário de classe.
- **ENSINO:** Planejamento de aulas, acompanhamento do desempenho acadêmico e interações.
- **CONTEÚDO:** Repositório pessoal para provas, listas, e uma biblioteca educacional para pesquisa rápida.

## Funcionalidades Principais

- 📊 **Dashboard inteligente:** Visão geral diária, alertas de tarefas pendentes e métricas chave de desempenho.
- 📂 **Repositório pessoal do professor:** Gerencie, armazene e classifique seus materiais, provas, planos de aula e arquivos multimídia.
- 📚 **Biblioteca educacional:** Acesso a recursos educacionais categorizados por disciplina e nível.
- 🧮 **Motor de resolução de exercícios:** Ferramentas avançadas para correção automatizada e geração de gabaritos detalhados.
- 🏆 **Turmas e alunos:** Controle de chamadas, boletins, relatórios de desempenho e histórico do aluno.
- 📅 **Calendário e Planejamento:** Cronograma escolar, planejamento de aulas e integração com eventos institucionais.

## Stack Tecnológica

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| **Frontend/Framework** | Next.js (App Router) | 14.x |
| **Linguagem** | TypeScript | 5.x |
| **Estilização** | Tailwind CSS / shadcn/ui | 3.x |
| **Banco de Dados** | PostgreSQL | 15.x |
| **ORM** | Prisma | 5.x |
| **Autenticação** | NextAuth.js | 4.x |

## Arquitetura

O projeto adota uma arquitetura escalável e organizada:

```text
edumatrix/
├── public/             # Arquivos estáticos (imagens, ícones, fontes)
├── prisma/             # Schema do banco de dados e migrações
├── src/
│   ├── app/            # Next.js App Router (Páginas, Layouts e API routes)
│   ├── components/     # Componentes React reutilizáveis (UI, layouts)
│   ├── lib/            # Utilitários, configurações (ex: cliente Prisma)
│   ├── types/          # Definições de tipos TypeScript globais
│   └── actions/        # Server actions do Next.js 14
├── docker-compose.yml  # Configuração para banco local em ambiente dev
└── package.json        # Dependências e scripts npm
```

## Pré-requisitos

Para rodar este projeto, você precisará ter instalado em sua máquina:
- Node.js >= 18
- Docker & Docker Compose (para subir o PostgreSQL facilmente)
- npm >= 9 (ou yarn/pnpm correspondentes)

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente:

### 1. Clonar o repositório
```bash
git clone https://github.com/usuario/edumatrix.git
cd edumatrix
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações e credenciais
```

### 4. Subir banco de dados com Docker
```bash
docker-compose up -d
# Aguarde o PostgreSQL inicializar (geralmente poucos segundos)
```

### 5. Executar migrations
```bash
npm run db:migrate
```

### 6. Popular banco com dados iniciais
```bash
npm run db:seed
```

### 7. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse a aplicação em: http://localhost:3000

## Credenciais de Demonstração

Utilize estas credenciais geradas pelo seed para testar o sistema localmente:

| Perfil | Email | Senha |
|---|---|---|
| Administrador | admin@edumatrix.com | admin123 |
| Professor | professor@edumatrix.com | professor123 |
| Professor 2 | ana@edumatrix.com | professor123 |

## Comandos Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta 3000 |
| `npm run build` | Cria a build otimizada de produção |
| `npm start` | Inicia o servidor de produção (requer build prévio) |
| `npm run lint` | Executa o ESLint para encontrar e corrigir problemas no código |
| `npm run db:migrate`| Aplica o schema do Prisma no banco de dados e cria migrações |
| `npm run db:seed` | Popula o banco com dados iniciais para testes |
| `npm run db:studio` | Abre a interface gráfica do Prisma para visualizar os dados |
| `npm run db:reset` | Apaga o banco de dados e recria do zero, executando seed |

## Variáveis de Ambiente

Para o sistema funcionar, o arquivo `.env` deve ser configurado. Principais variáveis:

- `DATABASE_URL`: String de conexão com o PostgreSQL (ex: `postgresql://user:pass@localhost:5432/edumatrix`)
- `NEXTAUTH_SECRET`: Chave secreta para criptografia da sessão do NextAuth
- `NEXTAUTH_URL`: URL base da aplicação (ex: `http://localhost:3000`)

## Banco de Dados

- **Schema Overview**: O schema inclui modelos essenciais como `User`, `Class`, `Student`, `Subject`, `LessonPlan`, `Resource`, etc. (Aproximadamente 10-15 tabelas core).
- **Resetar Banco de Dados**: Caso precise limpar todas as informações locais e começar de novo: `npm run db:reset`
- **Visualização de Dados**: Para explorar as tabelas e dados facilmente via interface web: `npm run db:studio`

## Testes

```bash
npm run test        # Executa testes unitários (Jest/Vitest)
npm run test:e2e    # Executa testes End-to-End (Cypress/Playwright)
```

## Deploy

### Vercel
A forma mais simples de realizar o deploy do front-end e APIs é via Vercel:
```bash
npm install -g vercel
vercel
```
*Nota: A Vercel é ideal para hospedagem do Next.js, mas você precisará de um provedor de PostgreSQL externo (como Supabase, Neon, ou AWS RDS) e configurar o `DATABASE_URL` na dashboard da Vercel.*

### Docker
Para implantar a aplicação completa em seu próprio servidor VPS:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## Rotas da Aplicação

| Rota | Descrição |
| --- | --- |
| `/` | Landing page / Página de login |
| `/dashboard` | Dashboard principal com métricas e resumo diário |
| `/classes` | Gestão de turmas e diário de classe |
| `/students` | Lista e gestão do desempenho e perfil de alunos |
| `/repository` | Repositório de arquivos e materiais do professor |
| `/library` | Biblioteca de recursos educacionais do sistema |
| `/tools/solver`| Motor de resolução de exercícios |
| `/settings` | Configurações do perfil e da conta do usuário |

## API Routes

| Endpoint API | Métodos | Descrição |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | POST, GET | Rotas do NextAuth para autenticação |
| `/api/classes` | GET, POST | Listar turmas ou criar uma nova turma |
| `/api/classes/[id]` | GET, PUT, DEL| Manipular informações de uma turma específica |
| `/api/students` | GET, POST | Gerenciamento de estudantes |
| `/api/repository` | GET, POST | Upload e recuperação de arquivos do professor |
| `/api/dashboard` | GET | Recuperar métricas do dashboard |

## Contribuição

1. Faça o Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Faça o commit das suas alterações (`git commit -m 'Adiciona NovaFuncionalidade'`)
4. Faça o push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

**EduMatrix Platform**
Desenvolvido para revolucionar a forma como professores ensinam e gerenciam suas rotinas.
- Email: contato@edumatrix.com
- Website: https://edumatrix.com
