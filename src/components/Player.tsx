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

    // Movimiento
    const speed = 6
    direction.current.set(joystick.x, 0, joystick.y).normalize()
    velocity.current.lerp(direction.current.multiplyScalar(speed), 0.2)
    group.current.position.add(velocity.current.clone().multiplyScalar(delta))

    // 🔄 ROTACIÓN: Gira hacia donde caminas
    if (velocity.current.length() > 0.5) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z)
      group.current.rotation.y = angle
    }

    // Cámara
    const targetCam = new THREE.Vector3(
      group.current.position.x,
      group.current.position.y + 5,
      group.current.position.z + 10
    )
    camera.position.lerp(targetCam, 0.1)
    camera.lookAt(group.current.position.x, group.current.position.y + 1.5, group.current.position.z)

    // Zona
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
      {/* --- MODELO DEL SOLDADO --- */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#2b2d42" />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.35]} />
        <meshStandardMaterial color="#3a5a40" />
      </mesh>
      <mesh position={[0, 1.2, -0.25]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#e76f51" />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color="#e9c46a" />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color="#2a9d8f" />
      </mesh>
      <mesh position={[0.35, 1.2, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.7]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}
