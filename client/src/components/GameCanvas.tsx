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

  // Spawn items - Many more items with strategic mixing
  useEffect(() => {
    if (!gameStarted) return

    const spawnWave = () => {
      // Spawn 8-15 items at once for more chaos and challenge
      const itemCount = 8 + Math.floor(Math.random() * 8)
      const newItems: FallingItem[] = []

      // Create clusters of items for strategic placement
      const clusters = Math.ceil(itemCount / 4) // 2-4 clusters

      for (let cluster = 0; cluster < clusters; cluster++) {
        const clusterX = 15 + cluster * (70 / clusters) + Math.random() * 15 // Spread clusters across screen
        const itemsInCluster = Math.ceil(itemCount / clusters)

        for (let i = 0; i < itemsInCluster; i++) {
          // Mix items strategically - place trash near bags to create confusion
          let itemType: FallingItem["type"]
          const rand = Math.random()

          if (rand < 0.45) {
            itemType = "bag" // 45% regular bags
          } else if (rand < 0.75) {
            itemType = "trash" // 30% trash
          } else if (rand < 0.9) {
            itemType = "golden-bag" // 15% golden bags (bonus)
          } else {
            itemType = "toxic-trash" // 10% toxic trash (extra penalty)
          }

          const newItem: FallingItem = {
            id: itemIdRef.current++,
            type: itemType,
            // Cluster items together with slight randomization
            x: Math.max(5, Math.min(90, clusterX + (Math.random() - 0.5) * 20)),
            y: -10 - i * 15 - cluster * 30, // Stagger both within cluster and between clusters
            speed: 1.2 + Math.random() * 1.8, // Varied speeds for more chaos
            rotation: Math.random() * 360,
          }
          newItems.push(newItem)
        }
      }

      setItems((prev) => [...prev, ...newItems])
    }

    // Initial spawn
    spawnWave()

    // More frequent spawning for continuous challenge
    const spawnInterval = setInterval(spawnWave, 1500 + Math.random() * 1000) // Every 1.5-2.5 seconds

    return () => clearInterval(spawnInterval)
  }, [gameStarted])

  // Update item positions
  useEffect(() => {
    if (!gameStarted) return

    const updateInterval = setInterval(() => {
      setItems(
        (prev) =>
          prev
            .map((item) => ({
              ...item,
              y: item.y + item.speed,
              rotation: item.rotation + (item.type.includes("trash") ? 4 : 1.5), // Trash spins faster
            }))
            .filter((item) => item.y < 110), // Remove items that fall off screen
      )
    }, 35) // Faster updates for smoother animation

    return () => clearInterval(updateInterval)
  }, [gameStarted])

  const handleItemClick = useCallback(
    (item: FallingItem, event: React.MouseEvent) => {
      event.preventDefault()

      const clickTime = Date.now()
      const reactionTime = clickTime - clickTimeRef.current
      clickTimeRef.current = clickTime

      // Add click effect with different colors based on item type
      const rect = gameAreaRef.current?.getBoundingClientRect()
      if (rect) {
        const effectId = Date.now()
        setClickEffects((prev) => [
          ...prev,
          {
            id: effectId,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            type: item.type,
          },
        ])

        setTimeout(() => {
          setClickEffects((prev) => prev.filter((effect) => effect.id !== effectId))
        }, 800)
      }

      // Remove clicked item
      setItems((prev) => prev.filter((i) => i.id !== item.id))

      // Handle different item types
      if (item.type === "bag") {
        onBagCatch(reactionTime)
      } else if (item.type === "golden-bag") {
        onBagCatch(reactionTime * 2) // Double points for golden bags
      } else if (item.type === "trash") {
        onTrashHit()
      } else if (item.type === "toxic-trash") {
        onTrashHit() // Could be double penalty in future
        onTrashHit() // Double hit for toxic trash
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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl pixel-font text-gray-500">Get ready for the chaos...</div>
      </div>
    )
  }

  return (
    <div
      ref={gameAreaRef}
      className="absolute inset-0 cursor-crosshair overflow-hidden"
      style={{ background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)" }}
    >
      {/* Falling Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute cursor-pointer transform transition-transform hover:scale-110 ${
            item.type.includes("bag") ? "bag-bounce" : "trash-spin"
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg)`,
            fontSize: "2.5rem", // Slightly smaller due to more items
            zIndex: 10,
            filter: getItemGlow(item.type),
          }}
          onClick={(e) => handleItemClick(item, e)}
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

      {/* Background particles - more intense */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
      <div className="absolute top-20 right-4 bg-black/80 border border-gray-600 rounded-lg p-2 text-sm">
        <div className="text-emerald-400 font-bold">Items: {items.length}</div>
      </div>
    </div>
  )
}
