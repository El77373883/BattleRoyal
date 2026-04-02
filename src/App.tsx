import { Canvas } from '@react-three/fiber'
import { Ground } from './components/Ground'
import { Player } from './components/Player'
import { Zone } from './components/Zone'
import { Bot } from './components/Bot'
import { HUD } from './components/HUD'
import { Suspense } from 'react'

export default function App() {
  return (
    <>
      <HUD />
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: '#6fa8d6' }}
        dpr={[1, 1]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[15, 25, 10]} intensity={1.3} castShadow />
        <fog attach="fog" args={['#6fa8d6', 15, 85]} />
        <Suspense fallback={null}>
          <Ground />
          <Player />
          <Zone />
          {[...Array(4)].map((_, i) => (
            <Bot key={i} position={[Math.random() * 50 - 25, 1, Math.random() * 50 - 25]} />
          ))}
        </Suspense>
      </Canvas>
    </>
  )
}
