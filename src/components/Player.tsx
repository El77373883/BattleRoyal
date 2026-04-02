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
    const speed = 5
    direction.current.set(joystick.x, 0, joystick.y).normalize()
    velocity.current.lerp(direction.current.multiplyScalar(speed), 0.15)
    group.current.position.add(velocity.current.clone().multiplyScalar(delta))

    // Cámara sigue al jugador
    const targetCam = new THREE.Vector3(
      group.current.position.x,
      group.current.position.y + 3.5,
      group.current.position.z + 7
    )
    camera.position.lerp(targetCam, 0.08)
    camera.lookAt(group.current.position.x, group.current.position.y + 1, group.current.position.z)

    // Zona
    const distToCenter = new THREE.Vector2(group.current.position.x, group.current.position.z).length()
    if (distToCenter > zoneRadius) setHp(Math.max(0, hp - delta * 10))
    updateZone(delta)

    // Disparo
    if (shooting && ammo > 0 && Date.now() - lastShot.current > 180) {
      lastShot.current = Date.now()
      setAmmo(ammo - 1)
      
      const raycaster = new THREE.Raycaster(camera.position, new THREE.Vector3(0, -0.15, -1).applyQuaternion(camera.quaternion))
      const intersects = raycaster.intersectObjects(window._bots || [], false)
      if (intersects.length > 0) {
        const bot = intersects[0].object as any
        if (bot.userData?.takeDamage) bot.userData.takeDamage(34)
      }
    }
  })

  return (
    <group ref={group} position={[0, 1, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 1.1, 4, 8]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
    </group>
  )
}
