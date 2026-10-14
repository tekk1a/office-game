import { useState } from 'react'
import { useAgentStore } from '../../agents/useAgentStore'

export function PeopleControls() {
  const people = useAgentStore((state) => state.participants)
  const enabled = useAgentStore((state) => state.workspaceMode === 'tasks')
  const savePerson = useAgentStore((state) => state.savePerson)
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  return (
    <section className="people-controls" aria-label="Responsáveis humanos">
      <div className="workspace-section-heading"><h3>Pessoas responsáveis</h3><button type="button" disabled={!enabled} onClick={() => { setEditing('new'); setName(''); setRole(''); setMessage('') }}>Adicionar pessoa</button></div>
      <p className="workspace-note">Cadastro local de responsáveis. As tarefas de pessoas são acompanhadas na fila; o escritório mantém seus três agentes.</p>
      <ul className="people-list">{people.filter((person) => person.kind === 'person').map((person) => <li key={person.id}><span><strong>{person.name}</strong> · {person.role || 'Pessoa'}</span><button type="button" disabled={!enabled} aria-label={`Editar pessoa ${person.name}`} onClick={() => { setEditing(person.id); setName(person.name); setRole(person.role); setMessage('') }}>Editar</button></li>)}</ul>
      {people.every((person) => person.kind !== 'person') && <p className="workspace-note">Nenhuma pessoa cadastrada.</p>}
      {editing && enabled && <form className="person-editor" aria-label="Cadastro de pessoa" onSubmit={(event) => {
        event.preventDefault()
        const result = savePerson({ name, role }, editing === 'new' ? undefined : editing)
        if (!result.ok) { setMessage(result.error); return }
        setEditing(null); setMessage('Responsável salvo neste navegador.')
      }}>
        <div><label htmlFor="person-name">Nome da pessoa</label><input id="person-name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></div>
        <div><label htmlFor="person-role">Função da pessoa</label><input id="person-role" maxLength={100} value={role} onChange={(event) => setRole(event.target.value)} /></div>
        <div className="workspace-actions"><button type="submit">Salvar pessoa</button><button type="button" onClick={() => { setEditing(null); setMessage('') }}>Cancelar cadastro</button></div>
      </form>}
      <p className="workspace-note" role="status">{message}</p>
    </section>
  )
}
