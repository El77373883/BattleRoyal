import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

export function Player() {
  const { camera } = useThree()
  const group = useRef<THREE.Group>(null!)
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const { hp, setHp, ammo, setAmmo, updateZone, zoneRadius } = useStore()
  const [joystick, setJoystick] = useState({ x: 0, y: 0 })
  const [shooting, setShooting] = useState(false)
  const lastShot = useRef(0)

  // Controles táctiles
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

  // Lógica del juego (movimiento, cámara, disparo)
  useFrame((_, delta) => {
    if (!group.current) return

    const speed = 6
    direction.current.set(joystick.x, 0, joystick.y).normalize()
    velocity.current.lerp(direction.current.multiplyScalar(speed), 0.2)
    group.current.position.add(velocity.current.clone().multiplyScalar(delta))

    // Rotación suave
    if (velocity.current.length() > 0.5) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z)
      group.current.rotation.y = angle
    }

    // Cámara en 3ra persona
    const targetCam = new THREE.Vector3(
      group.current.position.x,
      group.current.position.y + 4,
      group.current.position.z + 8
    )
    camera.position.lerp(targetCam, 0.1)
    camera.lookAt(group.current.position.x, group.current.position.y + 1.5, group.current.position.z)

    // Zona de daño
    const distToCenter = new THREE.Vector2(group.current.position.x, group.current.position.z).length()
    if (distToCenter > zoneRadius) setHp(Math.max(0, hp - delta * 10))
    updateZone(delta)

    // Disparo
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

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* --- NUEVO MODELO REALISTA (LOW POLY) --- */}
      
      {/* Cabeza (Esfera) */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.8} /> {/* Piel */}
      </mesh>

      {/* Casco */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#2d3436" roughness={0.5} /> {/* Gris oscuro */}
      </mesh>

      {/* Cuerpo (Torso) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2f3e46" roughness={0.9} /> {/* Uniforme Táctico */}
      </mesh>

      {/* Mochila */}
      <mesh position={[0, 1.25, -0.3]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#8d6e63" /> {/* Marrón */}
      </mesh>

      {/* Pierna Izquierda */}
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#1e272e" /> {/* Pantalón Oscuro */}
      </mesh>

      {/* Pierna Derecha */}
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>

      {/* Brazo Izquierdo */}
      <mesh position={[-0.35, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#2f3e46" />
      </mesh>

      {/* Brazo Derecho (Sostiene el arma) */}
      <mesh position={[0.35, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#2f3e46" />
      </mesh>

      {/* --- ARMA (Rifle de Asalto) --- */}
      <group position={[0.45, 1.1, 0.2]} rotation={[0.1, 0, 0]}>
        {/* Cañón */}
        <mesh position={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Cuerpo del arma */}
        <mesh position={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.1, 0.12, 0.4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Culata */}
        <mesh position={[0, 0, -0.35]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.3]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Mango (Grip) */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  )
}
