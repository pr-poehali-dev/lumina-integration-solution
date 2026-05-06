import { useState } from "react"
import Icon from "@/components/ui/icon"

interface Camera {
  id: number
  name: string
  active: boolean
  snapshot?: string
}

const CAMERAS: Camera[] = [
  { id: 1, name: "Камера 1", active: true },
  { id: 2, name: "Камера 2", active: true },
  { id: 3, name: "Камера 3", active: true },
  { id: 4, name: "Камера 4", active: true },
  { id: 5, name: "Камера 5", active: true },
  { id: 6, name: "Камера 6", active: true },
  { id: 7, name: "Камера 7", active: true },
  { id: 8, name: "Камера 8", active: true },
  { id: 9, name: "Камера 9", active: true },
  { id: 10, name: "Камера 10", active: true },
  { id: 11, name: "Камера 11", active: true },
  { id: 12, name: "Камера 12", active: true },
  { id: 13, name: "Камера 13", active: true },
  { id: 14, name: "Камера 14", active: true },
  { id: 15, name: "Камера 15", active: true },
  { id: 16, name: "Камера 16", active: true },
  { id: 17, name: "Камера 17", active: true },
  { id: 18, name: "Камера 18", active: true },
  { id: 19, name: "Камера 19", active: true },
  { id: 20, name: "Не настроено", active: false },
  { id: 21, name: "Не настроено", active: false },
  { id: 22, name: "Не настроено", active: false },
  { id: 23, name: "Не настроено", active: false },
  { id: 24, name: "Не настроено", active: false },
  { id: 25, name: "Не настроено", active: false },
  { id: 26, name: "Не настроено", active: false },
  { id: 27, name: "Не настроено", active: false },
  { id: 28, name: "Не настроено", active: false },
  { id: 29, name: "Не настроено", active: false },
  { id: 30, name: "Не настроено", active: false },
]

function getNow() {
  return new Date().toLocaleString("ru-RU", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
}

export default function Cameras() {
  const [selected, setSelected] = useState<number | null>(null)
  const [time, setTime] = useState(getNow)

  // обновляем время каждую секунду
  useState(() => {
    const t = setInterval(() => setTime(getNow()), 1000)
    return () => clearInterval(t)
  })

  const selectedCam = CAMERAS.find(c => c.id === selected)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#111]">
        <div className="flex items-center gap-3">
          <Icon name="Video" size={20} className="text-green-400" />
          <span className="font-semibold text-sm tracking-wide uppercase">Видеонаблюдение</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {CAMERAS.filter(c => c.active).length} камер онлайн
          </span>
          <span>{time}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Camera Grid */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-6 gap-1.5" style={{ gridAutoRows: "calc((100vh - 100px) / 5)" }}>
            {CAMERAS.map(cam => (
              <button
                key={cam.id}
                onClick={() => cam.active ? setSelected(selected === cam.id ? null : cam.id) : undefined}
                disabled={!cam.active}
                className={[
                  "relative rounded overflow-hidden border-2 transition-all duration-150 text-left group",
                  cam.active
                    ? selected === cam.id
                      ? "border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)] scale-[1.02] z-10"
                      : "border-transparent hover:border-green-400/50 cursor-pointer hover:scale-[1.01] hover:z-10"
                    : "border-white/5 cursor-default opacity-60",
                ].join(" ")}
              >
                {cam.active ? (
                  <>
                    {/* Live feed placeholder — replace with real stream */}
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                      <img
                        src="https://cdn.poehali.dev/projects/086c5eb6-51bd-4204-ab01-bf62edd5dadf/bucket/76ac6fd5-3025-4e09-b9e3-330ea6de1882.png"
                        alt={cam.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ objectPosition: `${((cam.id - 1) % 6) * 20}% ${Math.floor((cam.id - 1) / 6) * 20}%` }}
                      />
                    </div>

                    {/* Overlay top */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-gradient-to-b from-black/70 to-transparent">
                      <span className="text-[10px] text-white/80 font-medium">{cam.name}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-[9px] text-green-400">LIVE</span>
                      </span>
                    </div>

                    {/* Selected badge */}
                    {selected === cam.id && (
                      <div className="absolute inset-0 border-2 border-green-400 rounded pointer-events-none">
                        <div className="absolute bottom-1 right-1 bg-green-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                          ВЫБРАНА
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center gap-1">
                    <Icon name="VideoOff" size={16} className="text-white/20" />
                    <span className="text-[10px] text-white/30">Не настроено</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Side panel — shown when camera selected */}
        {selected && selectedCam && (
          <aside className="w-64 border-l border-white/10 bg-[#111] flex flex-col shrink-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-sm">{selectedCam.name}</span>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1">
              <div className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1a]">
                <img
                  src="https://cdn.poehali.dev/projects/086c5eb6-51bd-4204-ab01-bf62edd5dadf/bucket/76ac6fd5-3025-4e09-b9e3-330ea6de1882.png"
                  alt={selectedCam.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 text-xs text-white/50">
                <div className="flex justify-between">
                  <span>Статус</span>
                  <span className="text-green-400 font-medium">Онлайн</span>
                </div>
                <div className="flex justify-between">
                  <span>ID камеры</span>
                  <span className="text-white/80">{selectedCam.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Время</span>
                  <span className="text-white/80">{time}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-xs text-white/30 uppercase tracking-wider font-medium">Действия</p>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors text-left">
                  <Icon name="Maximize2" size={14} />
                  Открыть на весь экран
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors text-left">
                  <Icon name="Camera" size={14} />
                  Сделать снимок
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors text-left">
                  <Icon name="Settings" size={14} />
                  Настройки камеры
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
