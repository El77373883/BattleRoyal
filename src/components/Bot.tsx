import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

declare global { interface Window { _bots: THREE.Object3D[] } }
window._bots = window._bots || []

export function Bot({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null!)
  const hp = useRef(100)
  const { hp: playerHp, setHp, addKill } = useStore()
  const isDead = useRef(false)

  useEffect(() => {
    if (group.current) window._bots.push(group.current)
    return () => {
      window._bots = window._bots.filter(b => b !== group.current)
    }
  }, [])

  useFrame((state, delta) => {
    if (!group.current || isDead.current) return
    
    // IA: Ir hacia el jugador (0,0,0)
    const dir = new THREE.Vector3(0, 1, 0).sub(group.current.position).normalize()
    group.current.position.add(dir.multiplyScalar(1.5 * delta))

    // Daño al jugador si está cerca
    const dist = group.current.position.distanceTo(new THREE.Vector3(0, 1, 0))
    if (dist < 2.5) setHp(Math.max(0, playerHp - delta * 5))
  })

  const takeDamage = (amount: number) => {
    if (isDead.current) return
    hp.current -= amount
    if (hp.current <= 0) {
      isDead.current = true
      addKill()
      if (group.current) group.current.visible = false
    }
  }

  return (
    <group ref={group} position={position}>
      {/* Enemigo Rojo con userData para recibir daño */}
      <mesh 
        castShadow 
        position={[0, 1, 0]}
        userData={{ takeDamage }} 
      >
        <capsuleGeometry args={[0.35, 1.1, 4, 8]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
    </group>
  )
}
