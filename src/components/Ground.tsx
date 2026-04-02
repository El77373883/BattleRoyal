import { useRef } from 'react'
import * as THREE from 'three'

export function Ground() {
  const mesh = useRef<THREE.Mesh>(null!)
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 32, 32]} />
      <meshStandardMaterial color="#5a8c5c" roughness={0.9} />
    </mesh>
  )
}
