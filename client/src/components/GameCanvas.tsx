"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

interface FallingItem {
  id: number
  type: "bag" | "trash" | "golden-bag" | "toxic-trash"
  x: number
  y: number
  speed: number
  rotation: number
}

interface GameCanvasProps {
  onBagCatch: (reactionTime: number) => void
  onTrashHit: () => void
  gameStarted: boolean
}

export default function GameCanvas({ onBagCatch, onTrashHit, gameStarted }: GameCanvasProps) {
  const [items, setItems] = useState<FallingItem[]>([])
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number; type: string }>>([])
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const itemIdRef = useRef(0)
  const clickTimeRef = useRef<number>(0)

  // Responsive item spawning based on screen size
  useEffect(() => {
    if (!gameStarted) return

    const spawnWave = () => {
      const isMobile = window.innerWidth < 768
      const itemCount = isMobile ? 4 + Math.floor(Math.random() * 4) : 8 + Math.floor(Math.random() * 8)
      const newItems: FallingItem[] = []

      const clusters = Math.ceil(itemCount / (isMobile ? 2 : 4))

      for (let cluster = 0; cluster < clusters; cluster++) {
        const clusterX = 15 + cluster * (70 / clusters) + Math.random() * 15
        const itemsInCluster = Math.ceil(itemCount / clusters)

        for (let i = 0; i < itemsInCluster; i++) {
          let itemType: FallingItem["type"]
          const rand = Math.random()

          if (rand < 0.45) {
            itemType = "bag"
          } else if (rand < 0.75) {
            itemType = "trash"
          } else if (rand < 0.9) {
            itemType = "golden-bag"
          } else {
            itemType = "toxic-trash"
          }

          const newItem: FallingItem = {
            id: itemIdRef.current++,
            type: itemType,
            x: Math.max(5, Math.min(90, clusterX + (Math.random() - 0.5) * 20)),
            y: -10 - i * 15 - cluster * 30,
            speed: isMobile ? 1.0 + Math.random() * 1.5 : 1.2 + Math.random() * 1.8,
            rotation: Math.random() * 360,
          }
          newItems.push(newItem)
        }
      }

      setItems((prev) => [...prev, ...newItems])
    }

    spawnWave()

    const spawnInterval = setInterval(spawnWave, 2000 + Math.random() * 1000)

    return () => clearInterval(spawnInterval)
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted) return

    const updateInterval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + item.speed,
            rotation: item.rotation + (item.type.includes("trash") ? 4 : 1.5),
          }))
          .filter((item) => item.y < 110),
      )
    }, 35)

    return () => clearInterval(updateInterval)
  }, [gameStarted])

  const handleItemClick = useCallback(
    (item: FallingItem, event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()

      const clickTime = Date.now()
      const reactionTime = clickTime - clickTimeRef.current
      clickTimeRef.current = clickTime

      const rect = gameAreaRef.current?.getBoundingClientRect()
      if (rect) {
        const effectId = Date.now()
        const clientX = "touches" in event ? event.touches[0]?.clientX || 0 : event.clientX
        const clientY = "touches" in event ? event.touches[0]?.clientY || 0 : event.clientY

        setClickEffects((prev) => [
          ...prev,
          {
            id: effectId,
            x: clientX - rect.left,
            y: clientY - rect.top,
            type: item.type,
          },
        ])

        setTimeout(() => {
          setClickEffects((prev) => prev.filter((effect) => effect.id !== effectId))
        }, 800)
      }

      setItems((prev) => prev.filter((i) => i.id !== item.id))

      if (item.type === "bag") {
        onBagCatch(reactionTime)
      } else if (item.type === "golden-bag") {
        onBagCatch(reactionTime * 2)
      } else if (item.type === "trash") {
        onTrashHit()
      } else if (item.type === "toxic-trash") {
        onTrashHit()
        onTrashHit()
      }
    },
    [onBagCatch, onTrashHit],
  )

  const getItemEmoji = (type: FallingItem["type"]) => {
    switch (type) {
      case "bag":
        return "💰"
      case "golden-bag":
        return "🏆"
      case "trash":
        return "🗑️"
      case "toxic-trash":
        return "☢️"
      default:
        return "💰"
    }
  }

  const getItemGlow = (type: FallingItem["type"]) => {
    switch (type) {
      case "bag":
        return "drop-shadow(0 0 8px #10b981)"
      case "golden-bag":
        return "drop-shadow(0 0 12px #fbbf24)"
      case "trash":
        return "drop-shadow(0 0 8px #ef4444)"
      case "toxic-trash":
        return "drop-shadow(0 0 12px #8b5cf6)"
      default:
        return "drop-shadow(0 0 8px #10b981)"
    }
  }

  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="text-2xl sm:text-3xl md:text-4xl pixel-font text-gray-500 text-center">
          Get ready for the chaos...
        </div>
      </div>
    )
  }

  return (
    <div
      ref={gameAreaRef}
      className="absolute inset-0 cursor-crosshair overflow-hidden touch-none"
      style={{ background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)" }}
    >
      {/* Falling Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute cursor-pointer transform transition-transform hover:scale-110 active:scale-95 ${
            item.type.includes("bag") ? "bag-bounce" : "trash-spin"
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg)`,
            fontSize: window.innerWidth < 768 ? "2rem" : "2.5rem",
            zIndex: 10,
            filter: getItemGlow(item.type),
            touchAction: "none",
          }}
          onClick={(e) => handleItemClick(item, e)}
          onTouchStart={(e) => {
            e.preventDefault()
            handleItemClick(item, e)
          }}
        >
          {getItemEmoji(item.type)}
        </div>
      ))}

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="absolute pointer-events-none"
          style={{
            left: effect.x - 30,
            top: effect.y - 30,
            width: 60,
            height: 60,
          }}
        >
          <div
            className={`w-full h-full border-4 rounded-full click-ripple ${
              effect.type.includes("bag")
                ? "border-emerald-400"
                : effect.type === "toxic-trash"
                  ? "border-purple-400"
                  : "border-red-400"
            }`}
          />
        </div>
      ))}

      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Item count indicator */}
      <div className="absolute top-16 sm:top-20 right-2 sm:right-4 bg-black/80 border border-gray-600 rounded-lg p-1 sm:p-2 text-xs sm:text-sm">
        <div className="text-emerald-400 font-bold">Items: {items.length}</div>
      </div>
    </div>
  )
}
