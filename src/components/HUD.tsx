import { useStore } from '../store'
import { useState } from 'react'

export function HUD() {
  const { hp, ammo, kills, zoneRadius, isGameOver, reset } = useStore()
  const [showRestart, setShowRestart] = useState(false)

  if (hp <= 0 && !isGameOver) {
    // Pequeño delay para evitar re-render loop
    setTimeout(() => {
      useStore.setState({ isGameOver: true })
      setShowRestart(true)
    }, 100)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold' }}>🎯 {kills} Kills</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Zona: {Math.round(zoneRadius)}m</div>
      </div>

      <div style={{ position: 'absolute', bottom: 110, left: 20, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
        <div style={{ fontSize: 18 }}>❤️ {Math.round(hp)}/100</div>
        <div style={{ fontSize: 18 }}>🔫 {ammo}/30</div>
      </div>

      <div style={{
        position: 'absolute', bottom: 40, right: 30, width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'auto', userSelect: 'none'
      }} data-role="shoot">
        <span style={{ fontSize: 28 }}>🔥</span>
      </div>

      {showRestart && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)', padding: '28px', borderRadius: '12px',
          textAlign: 'center', color: '#fff', pointerEvents: 'auto'
        }}>
          <h2 style={{ marginBottom: 8 }}>💀 ELIMINADO</h2>
          <p style={{ marginBottom: 18 }}>Kills: {kills}</p>
          <button onClick={() => { reset(); setShowRestart(false) }} style={{
            padding: '12px 28px', fontSize: 18, background: '#ff5555',
            border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
          }}>REINICIAR</button>
        </div>
      )}
    </div>
  )
}
