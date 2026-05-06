import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface Camera {
  id: number
  name: string
  image: string | null
}

const TOTAL = 30

const initCameras = (): Camera[] =>
  Array.from({ length: TOTAL }, (_, i) => ({
    id: i + 1,
    name: `Камера ${i + 1}`,
    image: null,
  }))

function getNow() {
  return new Date().toLocaleString("ru-RU", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
}

export default function Cameras() {
  const [cameras, setCameras] = useState<Camera[]>(initCameras)
  const [selected, setSelected] = useState<number | null>(null)
  const [time, setTime] = useState(getNow)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingId = useRef<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(getNow()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleCameraClick = (id: number) => {
    setSelected(prev => prev === id ? null : id)
  }

  const handleUploadClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    pendingId.current = id
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || pendingId.current === null) return
    const url = URL.createObjectURL(file)
    const id = pendingId.current
    setCameras(prev => prev.map(c => c.id === id ? { ...c, image: url, name: `Камера ${id}` } : c))
    pendingId.current = null
    e.target.value = ""
  }

  const handleRemoveImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCameras(prev => prev.map(c => c.id === id ? { ...c, image: null } : c))
    if (selected === id) setSelected(null)
  }

  const activeCams = cameras.filter(c => c.image !== null).length
  const selectedCam = cameras.find(c => c.id === selected)

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#111] shrink-0">
        <div className="flex items-center gap-3">
          <Icon name="Video" size={20} className="text-green-400" />
          <span className="font-semibold text-sm tracking-wide uppercase">Видеонаблюдение</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {activeCams} из {TOTAL} камер настроено
          </span>
          <span>{time}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Camera Grid */}
        <div className="flex-1 overflow-y-auto p-2">
          <div
            className="grid gap-1.5 h-full"
            style={{
              gridTemplateColumns: "repeat(6, 1fr)",
              gridAutoRows: "calc((100vh - 60px - 16px) / 5)",
            }}
          >
            {cameras.map(cam => {
              const isSelected = selected === cam.id
              const hasImage = cam.image !== null

              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraClick(cam.id)}
                  className={[
                    "relative rounded overflow-hidden border-2 transition-all duration-150 text-left group focus:outline-none",
                    isSelected
                      ? "border-green-400 shadow-[0_0_14px_rgba(74,222,128,0.45)] z-10"
                      : "border-white/10 hover:border-green-400/40 hover:z-10",
                  ].join(" ")}
                >
                  {hasImage ? (
                    <>
                      <img
                        src={cam.image!}
                        alt={cam.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Top bar */}
                      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-1.5 py-1 bg-gradient-to-b from-black/70 to-transparent">
                        <span className="text-[10px] text-white/90 font-medium">{cam.name}</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-[9px] text-green-400">LIVE</span>
                        </span>
                      </div>

                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span
                          onClick={e => handleUploadClick(cam.id, e)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium cursor-pointer transition-colors"
                        >
                          <Icon name="ImagePlus" size={11} />
                          Заменить
                        </span>
                        <span
                          onClick={e => handleRemoveImage(cam.id, e)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-white text-[10px] font-medium cursor-pointer transition-colors"
                        >
                          <Icon name="Trash2" size={11} />
                          Удалить
                        </span>
                      </div>

                      {/* Selected outline */}
                      {isSelected && (
                        <div className="absolute inset-0 ring-2 ring-green-400 rounded pointer-events-none">
                          <div className="absolute bottom-1 right-1 bg-green-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                            ВЫБРАНА
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty camera — click to upload */
                    <div
                      className="w-full h-full bg-[#111] flex flex-col items-center justify-center gap-2 group-hover:bg-[#1a1a1a] transition-colors"
                      onClick={e => handleUploadClick(cam.id, e)}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon name="ImagePlus" size={16} className="text-white/30 group-hover:text-white/60" />
                      </div>
                      <span className="text-[10px] text-white/25 group-hover:text-white/50 transition-colors">{cam.name}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        {selected && selectedCam && (
          <aside className="w-60 border-l border-white/10 bg-[#111] flex flex-col shrink-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-sm">{selectedCam.name}</span>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {/* Preview */}
              <div className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                {selectedCam.image ? (
                  <img src={selectedCam.image} alt={selectedCam.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="VideoOff" size={24} className="text-white/20" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5 text-xs text-white/50">
                <div className="flex justify-between">
                  <span>Статус</span>
                  <span className={selectedCam.image ? "text-green-400 font-medium" : "text-white/30"}>
                    {selectedCam.image ? "Активна" : "Не настроена"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="text-white/80">{selectedCam.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Время</span>
                  <span className="text-white/80">{time}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={e => handleUploadClick(selectedCam.id, e)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <Icon name="ImagePlus" size={14} />
                  {selectedCam.image ? "Заменить фото" : "Загрузить фото"}
                </button>
                {selectedCam.image && (
                  <button
                    onClick={e => handleRemoveImage(selectedCam.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Icon name="Trash2" size={14} />
                    Удалить фото
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
