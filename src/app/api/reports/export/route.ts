import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'grades'
    const format = searchParams.get('format') || 'csv'

    if (format === 'csv') {
      let csvContent = ''
      if (type === 'grades') {
        csvContent = 'Matricula,Nome do Aluno,Turma,1o Bimestre,2o Bimestre,3o Bimestre,4o Bimestre,Media Final,Situacao\n' +
          '2026001,João Silva,2º Ano A,8.5,7.0,9.0,8.5,8.25,Aprovado\n' +
          '2026002,Maria Oliveira,2º Ano A,9.0,8.5,9.5,9.0,9.00,Aprovado\n' +
          '2026003,Pedro Souza,2º Ano A,6.0,5.5,6.5,6.0,6.00,Recuperacao\n' +
          '2026004,Ana Costa,2º Ano A,9.5,9.0,10.0,9.5,9.50,Aprovado\n' +
          '2026005,Lucas Pereira,2º Ano A,7.0,7.5,8.0,7.5,7.50,Aprovado\n'
      } else if (type === 'attendance') {
        csvContent = 'Matricula,Nome do Aluno,Turma,Total Aulas,Presencas,Faltas,Justificadas,Percentual Frequencia,Status\n' +
          '2026001,João Silva,2º Ano A,80,76,3,1,95%,Regular\n' +
          '2026002,Maria Oliveira,2º Ano A,80,78,2,0,97.5%,Regular\n' +
          '2026003,Pedro Souza,2º Ano A,80,68,10,2,85%,Atencao\n' +
          '2026004,Ana Costa,2º Ano A,80,80,0,0,100%,Excelente\n' +
          '2026005,Lucas Pereira,2º Ano A,80,74,5,1,92.5%,Regular\n'
      } else {
        csvContent = 'Relatorio Geral EduMatrix\nData: ' + new Date().toISOString() + '\nGerado por: ' + (session.user.name || 'Professor') + '\n'
      }

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="relatorio_${type}_${Date.now()}.csv"`
        }
      })
    }

    return NextResponse.json({
      type,
      format,
      generatedAt: new Date(),
      generatedBy: session.user.name,
      status: 'ready'
    })
  } catch (error) {
    console.error('[REPORTS_EXPORT_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
