import { useRef, useState } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'
import { MAX_BACKUP_BYTES, parseBackup } from '../../tasks/taskBackup'
import type { TaskSnapshot } from '../../tasks/taskBackup'

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url; link.download = name
  document.body.append(link); link.click(); link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function TaskBackupControls({ onRestored }: { onRestored: () => void }) {
  const exportTasks = useAgentStore((state) => state.exportTasks)
  const importTasks = useAgentStore((state) => state.importTasks)
  const recoveryText = useAgentStore((state) => state.recoveryText)
  const locked = useAgentStore((state) => state.routine.mode !== 'stopped' || state.agents.some((agent) => agent.movement))
  const input = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<{ json: string; snapshot: TaskSnapshot } | null>(null)
  const [message, setMessage] = useState('')
  return (
    <section className="task-backup" aria-label="Backup de tarefas">
      <div className="workspace-actions">
        <button type="button" onClick={() => { download(exportTasks(), `office-game-backup-${new Date().toISOString().replaceAll(':', '-')}.json`); setMessage('Backup do estado atual exportado.') }}>Exportar backup</button>
        <button type="button" disabled={locked} onClick={() => input.current?.click()}>Importar backup</button>
        {recoveryText !== null && <button type="button" onClick={() => download(recoveryText, 'office-game-dados-anteriores.json')}>Baixar dados anteriores</button>}
      </div>
      <input ref={input} className="sr-only" aria-label="Arquivo de backup" type="file" accept=".json,application/json" onChange={async (event) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        setPending(null)
        if (!file) return
        if (file.size > MAX_BACKUP_BYTES) { setMessage('O backup admite até 2 MB. Nenhum dado foi alterado.'); return }
        try {
          const json = await file.text()
          const parsed = parseBackup(json)
          if (!parsed.ok) { setMessage(parsed.error); return }
          setPending({ json, snapshot: parsed.snapshot }); setMessage('Backup validado. Confira antes de restaurar.')
        } catch { setMessage('Não foi possível ler este arquivo. Nenhum dado foi alterado.') }
      }} />
      {pending && <div className="backup-preview">
        <p><strong>{pending.snapshot.tasks.length} tarefas</strong> e {pending.snapshot.participants.filter((person) => person.kind === 'person').length} pessoas no backup de {new Date(pending.snapshot.exportedAt).toLocaleString('pt-BR')}.</p>
        <p className="workspace-note">Restaurar substitui tarefas, pessoas e vínculos atuais. Exporte o estado aberto se desejar preservá-lo. Posição do escritório e câmera são mantidas.</p>
        <div className="workspace-actions"><button type="button" disabled={locked} onClick={() => {
          const result = importTasks(pending.json)
          setMessage(result.ok ? 'Backup restaurado.' : result.error)
          if (result.ok) { setPending(null); onRestored() }
        }}>Restaurar este backup</button><button type="button" onClick={() => { setPending(null); setMessage('Importação cancelada. Dados atuais preservados.') }}>Cancelar importação</button></div>
      </div>}
      {locked && <p className="workspace-note">A restauração fica disponível ao finalizar a rotina e todas as rotas.</p>}
      <p className="workspace-note" role="status">{message || 'Backup JSON versionado. O salvamento local pertence a este navegador/dispositivo.'}</p>
    </section>
  )
}
