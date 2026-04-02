import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

// --- MODELO DEL SOLDADO DE ÉLITE ---
function Soldier() {
  return (
    <group>
      {/* --- CABEZA Y CASCO --- */}
      <group position={[0, 1.75, 0]}>
        {/* Cuello */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.15, 12]} />
          <meshStandardMaterial color="#d4a373" roughness={0.9} />
        </mesh>
        {/* Cabeza (Piel) */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Casco Táctico (Verde Militar) */}
        <mesh position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.16, 0.15, 4, 16]} />
          <meshStandardMaterial color="#344e41" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Auriculares del Casco */}
        <mesh position={[-0.18, 0.05, 0]}>
          <boxGeometry args={[0.05, 0.08, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.18, 0.05, 0]}>
          <boxGeometry args={[0.05, 0.08, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* --- CUERPO (CHALECO TÁCTICO) --- */}
      <group position={[0, 1.3, 0]}>
        {/* Torso Base */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.5, 8]} />
          <meshStandardMaterial color="#344e41" roughness={0.9} />
        </mesh>
        {/* Chaleco (Pecho) */}
        <mesh position={[0, 0.1, 0.12]}>
          <boxGeometry args={[0.35, 0.3, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        {/* Bolsillos del Chaleco */}
        <mesh position={[-0.08, 0, 0.22]}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.08, 0, 0.22]}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Mochila (Atrás) */}
        <mesh position={[0, 0.05, -0.2]}>
          <boxGeometry args={[0.3, 0.4, 0.15]} />
          <meshStandardMaterial color="#6b4f36" roughness={0.9} />
        </mesh>
      </group>

      {/* --- BRAZOS --- */}
      {/* Brazo Izquierdo */}
      <group position={[-0.3, 1.4, 0]}>
        <mesh>
          <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
          <meshStandardMaterial color="#344e41" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <meshStandardMaterial color="#d4a373" /> {/* Mano */}
        </mesh>
      </group>
      
      {/* Brazo Derecho (Sostiene arma) */}
      <group position={[0.3, 1.4, 0]}>
        <mesh rotation={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
          <meshStandardMaterial color="#344e41" roughness={0.9} />
        </mesh>
      </group>

      {/* --- PIERNAS (PANTALONES Y BOTAS) --- */}
      {/* Pierna Izquierda */}
      <group position={[-0.12, 0.8, 0]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
          <meshStandardMaterial color="#2b2b2b" roughness={0.95} /> {/* Pantalón */}
        </mesh>
        {/* Rodillera */}
        <mesh position={[0, 0.15, 0.08]}>
          <boxGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Bota */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Pierna Derecha */}
      <group position={[0.12, 0.8, 0]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
          <meshStandardMaterial color="#2b2b2b" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.15, 0.08]}>
          <boxGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* --- ARMA (AK-47 TÁCTICA) --- */}
      <group position={[0.35, 1.1, 0.3]} rotation={[0, 0.1, 0]}>
        {/* Cuerpo Principal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.5]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cañón */}
        <mesh position={[0, 0.02, 0.4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Cargador (Curvo) */}
        <mesh position={[0, -0.15, 0.1]}>
          <boxGeometry args={[0.05, 0.2, 0.06]} />
          <meshStandardMaterial color="#b5651d" roughness={0.5} /> {/* Color Bakelita/Madera */}
        </mesh>
        {/* Culata (Madera/Plástico) */}
        <mesh position={[0, 0, -0.3]}>
          <boxGeometry args={[0.05, 0.08, 0.3]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
      </group>
    </group>
  )
}

// --- COMPONENTE PRINCIPAL ---
export function Player() {
  const { camera } = useThree()
  const group = useRef<THREE.Group>(null!)
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const { hp, setHp, ammo, setAmmo, updateZone, zoneRadius } = useStore()
  const [joystick, setJoystick] = useState({ x: 0, y: 0 })
  const [shooting, setShooting] = useState(false)
  const lastShot = useRef(0)

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setJoystick({
        x: (t.clientX - rect.width / 2) / (rect.width / 2),
        y: (t.clientY - rect.height / 2) / (rect.height / 2)
      })
    }
    const handleTouchEnd = () => setJoystick({ x: 0, y: 0 })
    const handleShootStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).dataset.role === 'shoot') setShooting(true)
    }
    const handleShootEnd = () => setShooting(false)

    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchstart', handleShootStart)
    window.addEventListener('touchend', handleShootEnd)
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchstart', handleShootStart)
      window.removeEventListener('touchend', handleShootEnd)
    }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return

    const speed = 6
    direction.current.set(joystick.x, 0, joystick.y).normalize()
    velocity.current.lerp(direction.current.multiplyScalar(speed), 0.2)
    group.current.position.add(velocity.current.clone().multiplyScalar(delta))

    if (velocity.current.length() > 0.5) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z)
      group.current.rotation.y = angle
    }

    const targetCam = new THREE.Vector3(
      group.current.position.x,
      group.current.position.y + 5,
      group.current.position.z + 10
    )
    camera.position.lerp(targetCam, 0.1)
    camera.lookAt(group.current.position.x, group.current.position.y + 1.5, group.current.position.z)

    const distToCenter = new THREE.Vector2(group.current.position.x, group.current.position.z).length()
    if (distToCenter > zoneRadius) setHp(Math.max(0, hp - delta * 10))
    updateZone(delta)

    if (shooting && ammo > 0 && Date.now() - lastShot.current > 150) {
      lastShot.current = Date.now()
      setAmmo(ammo - 1)
      
      const raycaster = new THREE.Raycaster(camera.position, new THREE.Vector3(0, -0.2, -1).applyQuaternion(camera.quaternion))
      const intersects = raycaster.intersectObjects(window._bots || [], false)
      if (intersects.length > 0) {
        const bot = intersects[0].object as any
        if (bot.userData?.takeDamage) bot.userData.takeDamage(25)
      }
    }
  })

  return <group ref={group} position={[0, 0, 0]}><Soldier /></group>
}
