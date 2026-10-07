export function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div className="agent-progress">
      <div className="agent-progress-heading">
        <span>Progresso</span>
        <strong>{percentage}%</strong>
      </div>
      <progress aria-label="Progresso da tarefa" value={percentage} max={100} />
    </div>
  )
}
