import type { Task } from '../types'

export default function KpiCards({ tasks }: { tasks: Task[] }) {
  const kpis = [
    { label: 'Összes feladat / Total', value: tasks.length },
    { label: 'Folyamatban / In Progress', value: tasks.filter((t) => t.status === 'In Progress').length },
    { label: 'Elkészült / Done', value: tasks.filter((t) => t.status === 'Done').length },
  ]
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <div key={k.label} className="card kpi">
          <span className="kpi-label">{k.label}</span>
          <span className="kpi-value">{k.value}</span>
        </div>
      ))}
    </div>
  )
}
