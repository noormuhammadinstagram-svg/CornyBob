import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FIELD_COBS = 14
const LOOSE_KERNELS = 40
const DUST_COUNT = 90

function CornCobMesh({ scale = 1 }) {
  const kernelPositions = useMemo(() => {
    const points = []
    const rows = 8
    const cols = 10
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const y = (row / (rows - 1) - 0.5) * 1.15
        const radius = 0.28 * (1 - Math.abs(y) * 0.25)
        const angle = (col / cols) * Math.PI * 2 + row * 0.22
        points.push([
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ])
      }
    }
    return points
  }, [])

  return (
    <group scale={scale}>
      {/* Cob core */}
      <mesh>
        <capsuleGeometry args={[0.22, 0.85, 6, 12]} />
        <meshStandardMaterial
          color="#e8a317"
          emissive="#8a5a00"
          emissiveIntensity={0.25}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      {/* Kernels packed on the cob */}
      {kernelPositions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? '#f5c542' : index % 3 === 1 ? '#ffcc33' : '#e6a800'}
            emissive="#b8860b"
            emissiveIntensity={0.2}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Husks / leaves at top */}
      <mesh position={[0.12, 0.72, 0]} rotation={[0.2, 0.4, 0.5]}>
        <coneGeometry args={[0.12, 0.55, 5]} />
        <meshStandardMaterial
          color="#1a2e10"
          roughness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[-0.1, 0.7, 0.05]} rotation={[-0.15, -0.3, -0.45]}>
        <coneGeometry args={[0.1, 0.5, 5]} />
        <meshStandardMaterial
          color="#14240c"
          roughness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

function CornStalk({
  x,
  z,
  height,
  lean,
  phase,
  cobHeight,
  cobScale,
  cobSide,
}) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = lean + Math.sin(t * 0.45 + phase) * 0.05
    ref.current.rotation.x = Math.sin(t * 0.3 + phase) * 0.03
  })

  return (
    <group ref={ref} position={[x, -2.4, z]}>
      {/* Main stalk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.08, height, 8]} />
        <meshStandardMaterial
          color="#0d1a08"
          emissive="#1a2e10"
          emissiveIntensity={0.15}
          roughness={0.95}
        />
      </mesh>

      {/* Leaves */}
      {[0.35, 0.55, 0.75].map((ratio, index) => (
        <mesh
          key={index}
          position={[
            (index % 2 === 0 ? 0.25 : -0.25) * cobSide,
            height * ratio,
            0,
          ]}
          rotation={[
            0.2,
            index * 0.8,
            (index % 2 === 0 ? -0.9 : 0.9) + lean * 0.5,
          ]}
        >
          <planeGeometry args={[0.9, 0.22]} />
          <meshStandardMaterial
            color="#102010"
            emissive="#1a3018"
            emissiveIntensity={0.12}
            roughness={1}
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}

      {/* Cob on the stalk */}
      <group
        position={[0.18 * cobSide, height * cobHeight, 0.05]}
        rotation={[0.15, 0.2 * cobSide, 0.35 * cobSide]}
      >
        <CornCobMesh scale={cobScale} />
      </group>
    </group>
  )
}

function CornField() {
  const stalks = useMemo(
    () =>
      Array.from({ length: FIELD_COBS }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1
        const row = Math.floor(index / 2)
        return {
          x: side * (2.2 + (row % 4) * 0.85 + Math.random() * 0.4),
          z: -1.2 - row * 0.55 - Math.random() * 0.3,
          height: 3.2 + Math.random() * 1.6,
          lean: side * (0.08 + Math.random() * 0.12),
          phase: Math.random() * Math.PI * 2,
          cobHeight: 0.45 + Math.random() * 0.25,
          cobScale: 0.55 + Math.random() * 0.25,
          cobSide: side,
        }
      }),
    [],
  )

  return (
    <group>
      {stalks.map((stalk, index) => (
        <CornStalk key={index} {...stalk} />
      ))}
    </group>
  )
}

function LooseKernels() {
  const meshRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const kernels = useMemo(
    () =>
      Array.from({ length: LOOSE_KERNELS }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: -1 + Math.random() * 4,
        z: (Math.random() - 0.5) * 6,
        speed: 0.2 + Math.random() * 0.35,
        drift: 0.12 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.2,
        scaleX: 0.07 + Math.random() * 0.04,
        scaleY: 0.11 + Math.random() * 0.05,
        scaleZ: 0.06 + Math.random() * 0.03,
      })),
    [],
  )

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime

    kernels.forEach((kernel, index) => {
      dummy.position.set(
        kernel.x + Math.sin(t * kernel.drift + kernel.phase) * 0.25,
        kernel.y + Math.cos(t * kernel.speed + kernel.phase) * 0.35,
        kernel.z,
      )
      dummy.rotation.set(
        t * kernel.spin * 0.5,
        t * kernel.spin,
        kernel.phase,
      )
      dummy.scale.set(kernel.scaleX, kernel.scaleY, kernel.scaleZ)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LOOSE_KERNELS]}>
      {/* Kernel-like teardrop / grain shape */}
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        color="#f0b429"
        emissive="#a67c00"
        emissiveIntensity={0.22}
        roughness={0.45}
        metalness={0.18}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function GoldenDust() {
  const pointsRef = useRef(null)

  const positions = useMemo(() => {
    const data = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 14
      data[i * 3 + 1] = (Math.random() - 0.5) * 8
      data[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return data
  }, [])

  const phases = useMemo(
    () => Float32Array.from({ length: DUST_COUNT }, () => Math.random() * Math.PI * 2),
    [],
  )

  useFrame((state) => {
    const points = pointsRef.current
    if (!points) return
    const t = state.clock.elapsedTime
    const arr = points.geometry.attributes.position.array

    for (let i = 0; i < DUST_COUNT; i += 1) {
      const phase = phases[i]
      arr[i * 3 + 1] += Math.sin(t * 0.35 + phase) * 0.0018
      arr[i * 3] += Math.cos(t * 0.22 + phase) * 0.0012
    }

    points.geometry.attributes.position.needsUpdate = true
    points.rotation.y = t * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffd666"
        size={0.035}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function GroundMist() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, -1]}>
      <circleGeometry args={[10, 32]} />
      <meshStandardMaterial
        color="#080808"
        transparent
        opacity={0.65}
        roughness={1}
      />
    </mesh>
  )
}

function Scene() {
  const groupRef = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.06) * 0.06
  })

  return (
    <group ref={groupRef}>
      <GroundMist />
      <CornField />
      <LooseKernels />
      <GoldenDust />
    </group>
  )
}

function AboutCornField() {
  return (
    <div className="corn-field-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.6, 7.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#050505', 4.5, 12]} />
        <ambientLight intensity={0.22} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={0.7}
          color="#ffe08a"
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.25}
          color="#6b8f4e"
        />
        <pointLight position={[0, 2, 4]} intensity={0.35} color="#f5c542" />
        <pointLight position={[-4, 0, 2]} intensity={0.2} color="#c084fc" />
        <Scene />
      </Canvas>
      <div className="corn-field-bg__veil" />
    </div>
  )
}

export default AboutCornField
