import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

type Category = "Еда" | "Транспорт" | "Развлечения" | "Здоровье" | "Одежда" | "Жильё" | "Прочее"

interface Expense {
  id: number
  title: string
  amount: number
  category: Category
  date: string
}

const CATEGORIES: Category[] = ["Еда", "Транспорт", "Развлечения", "Здоровье", "Одежда", "Жильё", "Прочее"]

const CATEGORY_ICONS: Record<Category, string> = {
  Еда: "UtensilsCrossed",
  Транспорт: "Car",
  Развлечения: "Gamepad2",
  Здоровье: "Heart",
  Одежда: "ShoppingBag",
  Жильё: "Home",
  Прочее: "MoreHorizontal",
}

const CATEGORY_COLORS: Record<Category, string> = {
  Еда: "bg-orange-500/20 text-orange-300",
  Транспорт: "bg-blue-500/20 text-blue-300",
  Развлечения: "bg-purple-500/20 text-purple-300",
  Здоровье: "bg-red-500/20 text-red-300",
  Одежда: "bg-pink-500/20 text-pink-300",
  Жильё: "bg-teal-500/20 text-teal-300",
  Прочее: "bg-gray-500/20 text-gray-300",
}

const INITIAL_EXPENSES: Expense[] = [
  { id: 1, title: "Продукты в Пятёрочке", amount: 2340, category: "Еда", date: "2026-05-05" },
  { id: 2, title: "Метро за неделю", amount: 560, category: "Транспорт", date: "2026-05-04" },
  { id: 3, title: "Кино с другом", amount: 800, category: "Развлечения", date: "2026-05-03" },
  { id: 4, title: "Аптека", amount: 1200, category: "Здоровье", date: "2026-05-02" },
  { id: 5, title: "Обед в кафе", amount: 650, category: "Еда", date: "2026-05-01" },
]

const formatMoney = (n: number) =>
  n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 })

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const [filterCategory, setFilterCategory] = useState<Category | "Все">("Все")
  const [form, setForm] = useState({ title: "", amount: "", category: "Еда" as Category, date: new Date().toISOString().slice(0, 10) })

  const totalThisMonth = useMemo(() => {
    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    return expenses
      .filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === month && d.getFullYear() === year
      })
      .reduce((s, e) => s + e.amount, 0)
  }, [expenses])

  const byCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {}
    expenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount })
    return Object.entries(map).sort((a, b) => (b[1] as number) - (a[1] as number)) as [Category, number][]
  }, [expenses])

  const topCategory = byCategory[0]

  const filtered = filterCategory === "Все" ? expenses : expenses.filter(e => e.category === filterCategory)

  const handleAdd = () => {
    if (!form.title.trim() || !form.amount) return
    setExpenses(prev => [
      { id: Date.now(), title: form.title.trim(), amount: Number(form.amount), category: form.category, date: form.date },
      ...prev,
    ])
    setForm({ title: "", amount: "", category: "Еда", date: new Date().toISOString().slice(0, 10) })
    setShowForm(false)
  }

  const handleDelete = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id))

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col py-6 px-4 gap-2">
        <div className="flex items-center gap-2 px-3 mb-6">
          <Icon name="Wallet" size={22} />
          <span className="text-lg font-semibold">FinTrack</span>
        </div>

        {[
          { icon: "LayoutDashboard", label: "Дашборд", active: true },
          { icon: "List", label: "Расходы", active: false },
          { icon: "BarChart2", label: "Аналитика", active: false },
          { icon: "Settings", label: "Настройки", active: false },
        ].map(item => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              item.active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </button>
        ))}

        <div className="mt-auto">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/50 mb-1">Потрачено в мае</p>
            <p className="text-xl font-bold">{formatMoney(totalThisMonth)}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <div>
            <h1 className="text-xl font-semibold">Мои расходы</h1>
            <p className="text-sm text-white/50">Май 2026</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-black hover:bg-white/90 rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2"
          >
            <Icon name="Plus" size={16} />
            Добавить расход
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <p className="text-xs text-white/50 mb-1">Всего записей</p>
              <p className="text-3xl font-bold">{expenses.length}</p>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <p className="text-xs text-white/50 mb-1">За этот месяц</p>
              <p className="text-3xl font-bold">{formatMoney(totalThisMonth)}</p>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <p className="text-xs text-white/50 mb-1">Топ категория</p>
              <p className="text-3xl font-bold">{topCategory ? topCategory[0] : "—"}</p>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
            <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">По категориям</h2>
            <div className="space-y-3">
              {byCategory.map(([cat, total]) => {
                const pct = Math.round((total / (expenses.reduce((s, e) => s + e.amount, 0) || 1)) * 100)
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[cat]}`}>{cat}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-white/40" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-24 text-right">{formatMoney(total)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["Все", ...CATEGORIES] as (Category | "Все")[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === cat ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expenses Table */}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-white/50 font-medium">Название</th>
                  <th className="text-left px-6 py-3 text-white/50 font-medium">Категория</th>
                  <th className="text-left px-6 py-3 text-white/50 font-medium">Дата</th>
                  <th className="text-right px-6 py-3 text-white/50 font-medium">Сумма</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-white/30 py-12">Расходов нет</td>
                  </tr>
                )}
                {filtered.map(e => (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{e.title}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[e.category]}`}>
                        <Icon name={CATEGORY_ICONS[e.category]} size={12} />
                        {e.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50">{formatDate(e.date)}</td>
                    <td className="px-6 py-4 text-right font-semibold">{formatMoney(e.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#141820] ring-1 ring-white/15 rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Новый расход</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Название</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Например: обед в кафе"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Сумма, ₽</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  min={1}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Категория</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/15 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#141820]">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Дата</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/15 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border-white/15 bg-transparent text-white hover:bg-white/5"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!form.title.trim() || !form.amount}
                  className="flex-1 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-40"
                >
                  Добавить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}