import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

export function Zone() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { zoneRadius } = useStore()

  useFrame(() => {
    if (!mesh.current) return
    mesh.current.scale.setScalar(zoneRadius / 80)
  })

  return (
    <mesh ref={mesh} position={[0, 6, 0]}>
      <cylinderGeometry args={[1, 1, 1, 32]} />
      <meshBasicMaterial color="#ff0000" transparent opacity={0.15} side={2} />
    </mesh>
  )
}
