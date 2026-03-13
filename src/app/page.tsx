'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { 
  Phone, Mail, MapPin, ArrowRight, Menu, X,
  Truck, Car, Users, Eraser, Shield, Award, Clock, CheckCircle2,
  Play, Quote, Zap, Building2, TrendingUp, Wrench, ChevronLeft, ChevronRight,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================
// SECTION CONFIGURATION
// ============================================

const SECTIONS = {
  HERO: 0,
  STATS: 1,
  SERVICES: 2,
  ADVANTAGES: 3,
  GALLERY: 4,
  CALCULATOR: 5,
  TESTIMONIALS: 6,
  CONTACT: 7
} as const

const TOTAL_SECTIONS = 8

// ============================================
// DYNAMIC ROAD BACKGROUND
// ============================================

function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      
      <motion.div 
        className="absolute inset-0"
        animate={{ x: [-200, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="w-[300%] h-full opacity-[0.04]"
          style={{
            background: `repeating-linear-gradient(90deg, transparent 0px, transparent 150px, rgba(251, 191, 36, 0.8) 150px, rgba(251, 191, 36, 0.8) 155px)`
          }}
        />
      </motion.div>

      <motion.div 
        className="absolute inset-0"
        animate={{ y: [0, 160] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="w-full h-[200%] opacity-[0.03]"
          style={{
            background: `repeating-linear-gradient(0deg, transparent 0px, transparent 60px, rgba(255, 255, 255, 0.6) 60px, rgba(255, 255, 255, 0.6) 65px)`
          }}
        />
      </motion.div>

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 60%)',
          left: '-10%',
          top: '5%'
        }}
        animate={{ x: [0, 100, 50, 0], y: [0, 80, 120, 0], scale: [1, 1.2, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)',
          right: '-5%',
          bottom: '15%'
        }}
        animate={{ x: [0, -80, -40, 0], y: [0, -100, -50, 0], scale: [1, 1.15, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  )
}

// ============================================
// SPOTLIGHT EFFECT
// ============================================

function SpotlightEffect() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isClient, setIsClient] = useState(false)

  const background = useMotionTemplate`
    radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(249, 115, 22, 0.1), transparent 50%)
  `

  useEffect(() => {
    setIsClient(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  if (!isClient) return null

  return <motion.div className="pointer-events-none fixed inset-0 z-30" style={{ background }} />
}

// ============================================
// 3D ROAD MARKING SCENE
// ============================================

function RoadMarkingScene({ currentSection }: { currentSection: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Group>(null)
  const machineRef = useRef<THREE.Group>(null)
  const conesRef = useRef<THREE.Group>(null)
  
  const mouseX = useMotionValue(0)
  const timeRef = useRef(0)
  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX])

  useFrame((state, delta) => {
    timeRef.current += delta
    const time = timeRef.current
    
    // Z-axis camera movement based on section
    const targetZ = 15 - currentSection * 3
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03)
    
    const targetRotY = mouseX.get() * 0.06
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotY, 0.03)
    
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX.get() * 0.04, 0.03)
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((line) => {
        const mesh = line as THREE.Mesh
        mesh.position.z += 0.06
        if (mesh.position.z > 20) mesh.position.z = -40
      })
    }
    
    if (machineRef.current) {
      machineRef.current.position.y = 0.6 + Math.sin(time * 3) * 0.05
      machineRef.current.rotation.z = Math.sin(time * 2) * 0.02
      machineRef.current.position.z = -5 + Math.sin(time * 0.3) * 4
      
      const spray = machineRef.current.getObjectByName('spray')
      if (spray) {
        const scale = 1 + Math.sin(time * 10) * 0.3
        spray.scale.set(scale, scale * 1.3, scale)
        ;(spray.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(time * 8) * 0.15
      }
    }
    
    if (conesRef.current) {
      conesRef.current.children.forEach((cone, i) => {
        cone.position.y = 0.4 + Math.sin(time * 2 + i * 1.5) * 0.03
        cone.rotation.z = Math.sin(time * 1.5 + i * 2) * 0.05
      })
    }
  })

  const [lightOn, setLightOn] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => setLightOn(v => !v), 400)
    return () => clearInterval(interval)
  }, [])

  const centerLinePositions = Array.from({ length: 50 }, (_, i) => -40 + i * 2)

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#f97316" />
      <pointLight position={[5, 3, 5]} intensity={0.4} color="#fbbf24" />
      
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -5]}>
          <planeGeometry args={[16, 80]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.02} />
        </mesh>
        
        {[-7, 7].map((x, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -5]}>
            <planeGeometry args={[0.25, 80]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        ))}
        
        <group ref={linesRef}>
          {centerLinePositions.map((z, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
              <planeGeometry args={[0.25, 1.5]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f97316" emissiveIntensity={0.7} />
            </mesh>
          ))}
        </group>
        
        {[12, -25].map((zPos, idx) => (
          <group key={idx} position={[0, 0.02, zPos]}>
            {Array.from({ length: 16 }).map((_, i) => (
              <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-6 + i * 0.8, 0, 0]}>
                <planeGeometry args={[0.7, 4.5]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        ))}
        
        <group ref={machineRef} position={[2, 0.6, -5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.8, 2.5]} />
            <meshStandardMaterial color="#fb923c" metalness={0.65} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.55, -0.6]}>
            <boxGeometry args={[1.3, 0.6, 1.2]} />
            <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.6, -1.2]}>
            <boxGeometry args={[1.2, 0.45, 0.05]} />
            <meshStandardMaterial color="#60a5fa" metalness={0.95} roughness={0.05} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.5, 0.9]}>
            <cylinderGeometry args={[0.5, 0.5, 1, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.55} roughness={0.35} />
          </mesh>
          {[[-0.95, -0.28, 0.8], [0.95, -0.28, 0.8], [-0.95, -0.28, -0.8], [0.95, -0.28, -0.8]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.25, 20]} />
              <meshStandardMaterial color="#27272a" roughness={0.85} />
            </mesh>
          ))}
          <mesh position={[0, 0.1, 1.5]}>
            <coneGeometry args={[0.2, 0.45, 12]} />
            <meshStandardMaterial color="#52525b" />
          </mesh>
          <mesh name="spray" position={[0, -0.05, 2]}>
            <coneGeometry args={[0.35, 0.8, 12]} />
            <meshStandardMaterial color="#fbbf24" transparent opacity={0.35} emissive="#f97316" emissiveIntensity={0.7} />
          </mesh>
          {[[-0.6, 1.05, 0], [0.6, 1.05, 0]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial 
                color={i === 0 ? "#ef4444" : "#fbbf24"} 
                emissive={i === 0 ? "#ef4444" : "#fbbf24"} 
                emissiveIntensity={(i === 0 ? lightOn : !lightOn) ? 2 : 0.2} 
              />
            </mesh>
          ))}
        </group>
        
        <group ref={conesRef}>
          {[
            [-4.5, 0.4, 10], [4.5, 0.35, 6], [-5, 0.38, -2], [5, 0.42, -6],
            [-5.5, 0.36, 2], [5.5, 0.38, -10], [-4, 0.4, -15], [4, 0.38, -20],
            [-5, 0.35, -30], [5, 0.4, -35]
          ].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh>
                <coneGeometry args={[0.25, 0.7, 12]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#f97316" : "#ffffff"} emissive={i % 2 === 0 ? "#f97316" : "#ffffff"} emissiveIntensity={0.25} />
              </mesh>
              <mesh position={[0, -0.32, 0]}>
                <boxGeometry args={[0.55, 0.1, 0.55]} />
                <meshStandardMaterial color="#1f1f1f" />
              </mesh>
            </group>
          ))}
        </group>
        
        {[-6, 6].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {[10, -5, -20].map((z, j) => (
              <group key={j} position={[0, 0, z]}>
                <mesh position={[0, 2.5, 0]}>
                  <cylinderGeometry args={[0.1, 0.15, 5, 12]} />
                  <meshStandardMaterial color="#52525b" metalness={0.7} />
                </mesh>
                <mesh position={[x > 0 ? -1.5 : 1.5, 4.8, 0]}>
                  <boxGeometry args={[0.4, 0.2, 0.6]} />
                  <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </>
  )
}

// ============================================
// SERVICES SLIDER - PREMIUM COVERFLOW
// ============================================

function ServicesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  
  // Auto-play with infinite loop - slower speed (5 seconds)
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused])

  // Drag handling
  const handleDragEnd = (_: unknown, info: { offset: { x: number }, velocity: { x: number } }) => {
    const threshold = 100
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      setCurrentIndex((prev) => (prev + 1) % services.length)
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div className="relative h-[480px] flex items-center justify-center overflow-visible">
        <motion.div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          {services.map((service, index) => {
            // Calculate circular offset for infinite loop
            const totalItems = services.length
            let offset = index - currentIndex
            
            // Normalize offset to range [-totalItems/2, totalItems/2] for shortest path
            if (offset > totalItems / 2) offset -= totalItems
            if (offset < -totalItems / 2) offset += totalItems
            
            const isActive = offset === 0
            
            // Calculate 3D transforms
            let translateX = 0
            let translateZ = 0
            let rotateY = 0
            let scale = 1
            let opacity = 0.3
            let zIndex = 0
            
            if (isActive) {
              translateX = 0
              translateZ = 100
              scale = 1
              opacity = 1
              zIndex = 40
            } else if (offset === -1) {
              translateX = -420
              translateZ = -100
              rotateY = 35
              scale = 0.85
              opacity = 0.5
              zIndex = 20
            } else if (offset === 1) {
              translateX = 420
              translateZ = -100
              rotateY = -35
              scale = 0.85
              opacity = 0.5
              zIndex = 20
            } else {
              // Hidden cards
              translateX = offset > 0 ? 600 : -600
              translateZ = -200
              scale = 0.7
              opacity = 0
              zIndex = 0
            }

            return (
              <motion.div
                key={service.title}
                className="absolute cursor-pointer"
                style={{
                  x: translateX,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                onClick={() => !isActive && goToSlide(index)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                <ServiceSlideCard
                  {...service}
                  isActive={isActive}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-12 bg-gradient-to-r from-orange-500 to-yellow-400' 
                : 'w-3 bg-zinc-600 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 transition-all group"
      >
        <ChevronLeft className="w-6 h-6 text-zinc-400 group-hover:text-orange-400 transition-colors" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 transition-all group"
      >
        <ChevronRight className="w-6 h-6 text-zinc-400 group-hover:text-orange-400 transition-colors" />
      </button>
    </div>
  )
}

// ============================================
// SERVICE SLIDE CARD - ROAD MARKING STYLE
// ============================================

function ServiceSlideCard({ icon: Icon, title, description, price, image, isActive }: { 
  icon: React.ElementType
  title: string
  description: string
  price: string
  image: string
  isActive: boolean
}) {
  return (
    <motion.div
      className="relative w-[380px] h-[460px] rounded-2xl overflow-visible"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      whileHover={isActive ? { scale: 1.02 } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
      </div>

      {/* ROAD MARKING STYLE BORDER */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner accents - дорожные уголки */}
        <div className="absolute top-0 left-0 w-12 h-12">
          <div className="absolute top-3 left-0 w-full h-1 bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="absolute top-0 left-3 w-1 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>
        <div className="absolute top-0 right-0 w-12 h-12">
          <div className="absolute top-3 left-0 w-full h-1 bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="absolute top-0 right-3 w-1 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12">
          <div className="absolute bottom-3 left-0 w-full h-1 bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="absolute bottom-0 left-3 w-1 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-12 h-12">
          <div className="absolute bottom-3 left-0 w-full h-1 bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="absolute bottom-0 right-3 w-1 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>

        {/* Dashed border - пунктирная линия разметки */}
        <div className="absolute inset-3 rounded-xl overflow-hidden pointer-events-none">
          {/* Top dashed line */}
          <div className="absolute top-0 left-4 right-4 h-1 flex justify-between">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-full bg-white/80"
                style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
                animate={isActive ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.5 }}
                transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
          {/* Bottom dashed line */}
          <div className="absolute bottom-0 left-4 right-4 h-1 flex justify-between">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-full bg-white/80"
                style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
                animate={isActive ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.5 }}
                transition={{ duration: 1.5, delay: i * 0.1 + 0.5, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        {/* Side marking lines */}
        <div className="absolute top-16 bottom-16 left-0 w-1 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-6 bg-orange-500 rounded-r"
              style={{ boxShadow: '0 0 12px rgba(249, 115, 22, 0.7)' }}
              animate={isActive ? { opacity: [0.5, 1, 0.5], x: [0, 2, 0] } : {}}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
        <div className="absolute top-16 bottom-16 right-0 w-1 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-6 bg-orange-500 rounded-l"
              style={{ boxShadow: '0 0 12px rgba(249, 115, 22, 0.7)' }}
              animate={isActive ? { opacity: [0.5, 1, 0.5], x: [0, -2, 0] } : {}}
              transition={{ duration: 2, delay: i * 0.2 + 0.1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      {/* Active card glow effect */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), transparent 40%, transparent 60%, rgba(250, 204, 21, 0.3))',
            filter: 'blur(8px)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        {/* Icon with road marking style */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="relative w-14 h-14 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.1))',
              border: '3px solid #fbbf24',
              borderRadius: '8px',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)',
            }}
          >
            <Icon className="w-7 h-7 text-orange-400" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          
          {/* Price with road sign style */}
          <div 
            className="px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              border: '3px solid #fbbf24',
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.4)',
            }}
          >
            <span className="font-bold text-white text-sm tracking-wide">{price}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        
        {/* Description with road stripe decoration */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1 pt-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <div className="w-2 h-2 bg-orange-500/60 rounded-full" />
            <div className="w-2 h-2 bg-orange-500/30 rounded-full" />
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{description}</p>
        </div>

        {/* CTA Button */}
        {isActive && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              border: '2px solid #fbbf24',
              boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)',
            }}
          >
            <span>Заказать услугу</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* Road texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  )
}

// ============================================
// STAT CARD - ROAD SIGN STYLE
// ============================================

function StatCard({ value, suffix, label, icon: Icon, image, index }: { 
  value: number
  suffix: string
  label: string
  icon: React.ElementType
  image: string
  index: number 
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
      onViewportEnter={() => setIsVisible(true)}
      className="relative p-6 rounded-2xl overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image}
          alt={label}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/90" />
      </div>

      {/* ROAD SIGN STYLE BORDER */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Octagon-like corners (like stop sign) */}
        {[
          { top: '8px', left: '0', width: '20px', height: '3px' },
          { top: '0', left: '8px', width: '3px', height: '20px' },
          { top: '8px', right: '0', width: '20px', height: '3px' },
          { top: '0', right: '8px', width: '3px', height: '20px' },
          { bottom: '8px', left: '0', width: '20px', height: '3px' },
          { bottom: '0', left: '8px', width: '3px', height: '20px' },
          { bottom: '8px', right: '0', width: '20px', height: '3px' },
          { bottom: '0', right: '8px', width: '3px', height: '20px' },
        ].map((style, i) => (
          <div
            key={i}
            className="absolute bg-orange-500"
            style={{
              ...style,
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.6)',
            }}
          />
        ))}

        {/* Circular road sign border */}
        <div className="absolute inset-4 rounded-full border-4 border-white/30 group-hover:border-white/60 transition-colors" />
        
        {/* Inner ring animation */}
        <motion.div
          className="absolute inset-6 rounded-full"
          style={{ border: '2px dashed rgba(251, 191, 36, 0.5)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Moving reflection on border */}
        <motion.div
          className="absolute top-4 left-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ 
            x: ['-100px', '100px'],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center py-4">
        {/* Icon in road sign style */}
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 relative"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: '3px solid #fbbf24',
              boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)',
            }}
          />
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
            <Icon className="w-6 h-6 text-orange-400" />
          </div>
        </motion.div>

        {/* Counter with road display style */}
        <motion.div 
          className="relative inline-block px-4 py-2 mb-2"
          style={{
            background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
            border: '2px solid #fbbf24',
            borderRadius: '4px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(250, 204, 21, 0.3)',
          }}
          animate={isVisible ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
        >
          <span 
            className="text-3xl font-bold"
            style={{ 
              background: 'linear-gradient(180deg, #fde047, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            }}
          >
            {displayValue.toLocaleString('ru-RU')}{suffix}
          </span>
        </motion.div>

        {/* Label with road stripe decoration */}
        <div className="flex items-center justify-center gap-2">
          <motion.div 
            className="w-4 h-0.5 bg-orange-500"
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
          />
          <span className="text-zinc-400 text-sm font-medium tracking-wider uppercase">{label}</span>
          <motion.div 
            className="w-4 h-0.5 bg-orange-500"
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// ADVANTAGE CARD - ROAD STRIPE STYLE
// ============================================

function AdvantageCard({ icon: Icon, title, desc, image, index }: { 
  icon: React.ElementType
  title: string
  desc: string
  image: string
  index: number 
}) {
  // Pre-defined widths for road stripes (no random to avoid hydration issues)
  const topStripeWidths = [22, 28, 18, 32, 24, 20, 26, 30, 19, 25, 21, 27]
  const bottomStripeWidths = [25, 19, 30, 22, 28, 18, 24, 20, 26, 32, 23, 17]

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 200 }}
      className="relative overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800/95 to-zinc-900">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
        />
      </div>

      {/* ROAD STRIPE LEFT BORDER */}
      <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col justify-between py-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-full h-4 bg-white"
            style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scaleY: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.5, 
              delay: i * 0.15 + index * 0.1, 
              repeat: Infinity 
            }}
          />
        ))}
      </div>

      {/* Orange center line accent */}
      <motion.div
        className="absolute left-4 top-0 bottom-0 w-1"
        style={{ 
          background: 'linear-gradient(180deg, transparent, #f97316, #fbbf24, #f97316, transparent)',
        }}
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
      />

      {/* Top road stripe */}
      <div className="absolute top-0 left-8 right-0 h-1 flex items-center gap-2 px-4">
        {topStripeWidths.map((width, i) => (
          <motion.div
            key={i}
            className="h-full bg-orange-500 rounded-b"
            style={{ width: `${width}px`, boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)' }}
            initial={{ opacity: 0.3 }}
            whileHover={{ opacity: 1 }}
          />
        ))}
      </div>

      {/* Bottom road stripe */}
      <div className="absolute bottom-0 left-8 right-0 h-1 flex items-center gap-2 px-4">
        {bottomStripeWidths.map((width, i) => (
          <motion.div
            key={i}
            className="h-full bg-orange-500 rounded-t"
            style={{ width: `${width}px`, boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)' }}
            initial={{ opacity: 0.3 }}
            whileHover={{ opacity: 1 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative p-6 pl-10 flex items-start gap-5">
        {/* Icon in diamond shape like road marking */}
        <motion.div 
          className="relative w-16 h-16 flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {/* Diamond background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              transform: 'rotate(45deg) scale(0.7)',
              border: '3px solid #fde047',
              boxShadow: '0 0 20px rgba(250, 204, 21, 0.5)',
            }}
          />
          {/* Inner diamond */}
          <div 
            className="absolute inset-2 bg-zinc-900 flex items-center justify-center"
            style={{ transform: 'rotate(45deg) scale(0.55)' }}
          >
            <Icon className="w-8 h-8 text-orange-400" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1 py-2">
          <h4 className="font-semibold text-lg text-white mb-1.5 group-hover:text-orange-400 transition-colors">
            {title}
          </h4>
          <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
          
          {/* Animated road arrow */}
          <motion.div 
            className="flex items-center gap-1 mt-3"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
            >
              <ArrowRight className="w-4 h-4 text-orange-500/70" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-orange-500/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.1), transparent 30%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  )
}

// ============================================
// GALLERY CARD - ZEBRA CROSSING STYLE
// ============================================

function GalleryCard({ image, title, index }: { image: string; title: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative h-64 overflow-visible cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.img 
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* ZEBRA CROSSING BORDER - alternating stripes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top zebra stripes */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-full"
              style={{
                background: i % 2 === 0 ? '#ffffff' : 'transparent',
                boxShadow: i % 2 === 0 ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
              }}
              animate={i % 2 === 0 ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Bottom zebra stripes */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-full"
              style={{
                background: i % 2 === 0 ? '#ffffff' : 'transparent',
                boxShadow: i % 2 === 0 ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
              }}
              animate={i % 2 === 0 ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.5, delay: i * 0.05 + 0.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Left side - road edge line */}
        <div className="absolute top-3 bottom-3 left-0 w-2">
          <div className="h-full bg-orange-500" style={{ boxShadow: '0 0 15px rgba(249, 115, 22, 0.7)' }} />
        </div>

        {/* Right side - road edge line */}
        <div className="absolute top-3 bottom-3 right-0 w-2">
          <div className="h-full bg-orange-500" style={{ boxShadow: '0 0 15px rgba(249, 115, 22, 0.7)' }} />
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), transparent 50%, rgba(250, 204, 21, 0.2))',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Number badge */}
      <motion.div
        className="absolute top-5 left-5 z-20 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: '2px solid #fbbf24',
          boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)',
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <span className="text-white text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
      </motion.div>

      {/* Play/View button */}
      <motion.div
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '2px solid #fbbf24',
        }}
        initial={{ scale: 0.5 }}
        whileHover={{ scale: 1 }}
      >
        <Play className="w-4 h-4 text-white ml-0.5" />
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pl-7">
        {/* Title with road marking style */}
        <motion.div 
          className="inline-flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-md"
          style={{
            background: 'rgba(9, 9, 11, 0.8)',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 20px rgba(250, 204, 21, 0.2)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Walking person icon like on zebra */}
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white rounded-full" />
            <div className="flex flex-col gap-0.5">
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-1 bg-white/70 rounded" />
            </div>
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================
// TESTIMONIAL CARD - ROAD MARKING STYLE
// ============================================

function TestimonialCard({ name, role, text, avatar, isActive }: { 
  name: string
  role: string
  text: string
  avatar: string
  isActive: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        x: isActive ? 0 : -80,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="absolute inset-0 rounded-2xl overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/card-city.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      </div>

      {/* ROAD MARKING BORDER */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Double yellow line - left */}
        <div className="absolute left-0 top-8 bottom-8 w-4 flex gap-1">
          <div className="w-1.5 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="w-1.5 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>

        {/* Double yellow line - right */}
        <div className="absolute right-0 top-8 bottom-8 w-4 flex gap-1">
          <div className="w-1.5 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
          <div className="w-1.5 h-full bg-yellow-400" style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)' }} />
        </div>

        {/* Dashed center line - top */}
        <div className="absolute top-0 left-12 right-12 h-2 flex justify-between">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-6 h-full bg-white"
              style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
              animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }}
              transition={{ duration: 1.2, delay: i * 0.08, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Dashed center line - bottom */}
        <div className="absolute bottom-0 left-12 right-12 h-2 flex justify-between">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-6 h-full bg-white"
              style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
              animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }}
              transition={{ duration: 1.2, delay: i * 0.08 + 0.4, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Road corner markings */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-orange-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-orange-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-orange-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-orange-500" />

        {/* Animated sweeping light */}
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 w-20 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.15), transparent)',
            }}
            animate={{ x: [-80, 600] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-8 pl-10">
        {/* Quote icon as road sign */}
        <motion.div 
          className="relative w-14 h-14 mb-5"
          animate={isActive ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)',
            }}
          />
          <div className="absolute inset-2 bg-zinc-900 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <Quote className="w-5 h-5 text-orange-400" />
          </div>
        </motion.div>

        {/* Testimonial text */}
        <p className="text-xl leading-relaxed flex-grow text-zinc-200 italic">
          "{text}"
        </p>

        {/* Author section with road stripe */}
        <div className="flex items-center gap-5 mt-6 pt-5 relative">
          {/* Road stripe divider */}
          <div className="absolute top-0 left-0 right-0 h-1 flex gap-2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 h-full bg-zinc-700/50" />
            ))}
          </div>

          {/* Avatar in road sign style */}
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ 
                border: '3px solid #fbbf24',
                boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)',
              }}
            >
              <img 
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Verified badge */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-zinc-900 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </motion.div>
          </div>

          {/* Author info */}
          <div>
            <div className="font-semibold text-white text-lg">{name}</div>
            <div className="text-zinc-400 text-sm">{role}</div>
            
            {/* Star rating with road marking style */}
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-orange-500"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  }}
                  animate={isActive ? { opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// GRADIENT TEXT
// ============================================

function GradientText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${className}`}>
      {children}
    </span>
  )
}

// ============================================
// MAGNETIC BUTTON
// ============================================

function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2)
  }

  return (
    <motion.button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0) }} style={{ x, y }} whileTap={{ scale: 0.95 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  )
}

// ============================================
// SECTION WRAPPER
// ============================================

function SectionWrapper({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {children}
    </div>
  )
}

// ============================================
// FLOATING PARTICLES - CLIENT ONLY
// ============================================

function FloatingParticles() {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, duration: number, delay: number}[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 5
    })))
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-500/15 blur-sm"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ============================================
// DATA
// ============================================

const services = [
  { icon: Truck, title: 'Дорожная разметка', description: 'Нанесение продольных и поперечных линий, стрелок, надписей на дороги любой категории', price: 'от 150 ₽/м²', image: '/service-road.jpg' },
  { icon: Car, title: 'Разметка парковок', description: 'Комплексная разметка парковочных зон с нумерацией мест и навигационными указателями', price: 'от 120 ₽/м²', image: '/service-parking.jpg' },
  { icon: Users, title: 'Пешеходные переходы', description: 'Нанесение «зебр» со светоотражающим эффектом для максимальной безопасности', price: 'от 180 ₽/м²', image: '/service-zebra.jpg' },
  { icon: Eraser, title: 'Удаление разметки', description: 'Бережное удаление старой разметки методами гидроабразивной очистки', price: 'от 80 ₽/м²', image: '/service-removal.jpg' }
]

const stats = [
  { value: 500, suffix: '+', label: 'Объектов', icon: Building2, image: '/gallery-3.jpg' },
  { value: 15, suffix: '', label: 'Лет опыта', icon: Award, image: '/card-equipment.jpg' },
  { value: 50, suffix: '+', label: 'Городов', icon: MapPin, image: '/card-city.jpg' },
  { value: 99, suffix: '%', label: 'Клиентов', icon: TrendingUp, image: '/card-worker.jpg' }
]

const advantages = [
  { icon: Wrench, title: 'Современное оборудование', desc: 'Машины Graco и MRL с точным дозированием краски', image: '/card-equipment.jpg' },
  { icon: Shield, title: 'Гарантия 24 месяца', desc: 'Официальная гарантия на все виды работ', image: '/card-highway.jpg' },
  { icon: CheckCircle2, title: 'Строго по ГОСТ', desc: 'ГОСТ Р 51256-2018 и ГОСТ 32953-2014', image: '/card-material.jpg' },
  { icon: Clock, title: 'Точные сроки', desc: 'Соблюдаем сроки, за просрочку — штраф', image: '/card-worker.jpg' }
]

const galleryItems = [
  { image: '/gallery-1.jpg', title: 'Ночная разметка' },
  { image: '/gallery-2.jpg', title: 'Нанесение термопластика' },
  { image: '/gallery-3.jpg', title: 'Дорожная развязка' },
  { image: '/gallery-4.jpg', title: 'Разметка складов' }
]

const testimonials = [
  { name: 'Александр Петров', role: 'Директор, ООО "СтройКомплект"', text: 'Заказывали разметку склада 5000 м². Работу выполнили за 2 дня, качество отличное. Рекомендую!', avatar: '/avatar-1.jpg' },
  { name: 'Елена Сидорова', role: 'Управляющая, ТЦ "Меридиан"', text: 'Уже третий год работаем с РАЗМЕТКА-ПРО. Паркинг на 800 машин всегда в идеальном состоянии.', avatar: '/avatar-2.jpg' },
  { name: 'Дмитрий Козлов', role: 'Главный инженер, Администрация', text: 'Исполнители по госконтракту. Все работы по ГОСТ, сроки соблюдены.', avatar: '/avatar-3.jpg' }
]

const clients = ['Мосгортранс', 'Мэрия Москвы', 'Магнит', 'Лента', 'X5 Group', 'Газпром']

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [selectedService, setSelectedService] = useState('road')
  const [area, setArea] = useState(500)
  
  const scrollAccumulator = useRef(0)
  const isScrolling = useRef(false)

  const goToSection = useCallback((section: number) => {
    setCurrentSection(Math.max(0, Math.min(TOTAL_SECTIONS - 1, section)))
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isScrolling.current) return
      
      scrollAccumulator.current += e.deltaY
      const threshold = 150
      
      if (scrollAccumulator.current > threshold) {
        isScrolling.current = true
        goToSection(currentSection + 1)
        scrollAccumulator.current = 0
        setTimeout(() => { isScrolling.current = false }, 800)
      } else if (scrollAccumulator.current < -threshold) {
        isScrolling.current = true
        goToSection(currentSection - 1)
        scrollAccumulator.current = 0
        setTimeout(() => { isScrolling.current = false }, 800)
      }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSection(currentSection + 1)
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') goToSection(currentSection - 1)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('wheel', handleWheel); window.removeEventListener('keydown', handleKeyDown) }
  }, [currentSection, goToSection])

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  // Preload all images
  useEffect(() => {
    const allImages = [
      '/service-road.jpg',
      '/service-parking.jpg',
      '/service-zebra.jpg',
      '/service-removal.jpg',
      '/gallery-1.jpg',
      '/gallery-2.jpg',
      '/gallery-3.jpg',
      '/gallery-4.jpg',
      '/card-equipment.jpg',
      '/card-highway.jpg',
      '/card-city.jpg',
      '/card-worker.jpg',
      '/card-material.jpg',
      '/avatar-1.jpg',
      '/avatar-2.jpg',
      '/avatar-3.jpg'
    ]
    allImages.forEach(src => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 1000))
    setFormData({ name: '', phone: '', message: '' })
  }

  const calculatePrice = useCallback(() => {
    const prices: Record<string, number> = { road: 150, parking: 120, zebra: 180, removal: 80 }
    return (prices[selectedService] || 150) * area
  }, [selectedService, area])

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white antialiased overflow-hidden">
      <DynamicBackground />
      <FloatingParticles />
      <SpotlightEffect />
      
      {/* 3D Scene with Z-axis scroll */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
          <RoadMarkingScene currentSection={currentSection} />
        </Canvas>
      </div>

      {/* Navigation - Minimal Road Style */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between"
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => goToSection(SECTIONS.HERO)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 191, 36, 0.1))',
                  }}
                  whileHover={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 191, 36, 0.15))'
                  }}
                >
                  <Truck className="w-5 h-5 text-orange-400" />
                </motion.div>
                {/* Subtle glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">
                  <GradientText>РАЗМЕТКА-ПРО</GradientText>
                </span>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center">
              {[
                { name: 'Главная', section: SECTIONS.HERO },
                { name: 'Достижения', section: SECTIONS.STATS },
                { name: 'Услуги', section: SECTIONS.SERVICES },
                { name: 'Преимущества', section: SECTIONS.ADVANTAGES },
                { name: 'Галерея', section: SECTIONS.GALLERY },
                { name: 'Калькулятор', section: SECTIONS.CALCULATOR },
                { name: 'Отзывы', section: SECTIONS.TESTIMONIALS },
                { name: 'Контакты', section: SECTIONS.CONTACT },
              ].map((item) => {
                const isActive = currentSection === item.section
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => goToSection(item.section)}
                    className="relative px-3 py-2 group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Background highlight that slides in */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(180deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))'
                          : 'transparent',
                      }}
                      layoutId="navHighlight"
                      transition={{ 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 30 
                      }}
                    />
                    
                    {/* Road marking underline - appears on hover and active */}
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #fbbf24, #f97316, #fbbf24, transparent)',
                          backgroundSize: '200% 100%',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ 
                          x: isActive ? '0%' : '-100%',
                          backgroundPosition: isActive ? ['0% 0%', '100% 0%'] : '0% 0%'
                        }}
                        transition={{ 
                          x: { type: 'spring', stiffness: 500, damping: 30 },
                          backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
                        }}
                        whileHover={{ x: '0%' }}
                      />
                    </div>

                    {/* Left accent line */}
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full"
                      style={{ background: '#fbbf24' }}
                      animate={{
                        height: isActive ? 16 : 0,
                        opacity: isActive ? 1 : 0
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />

                    <span 
                      className="relative z-10 text-xs font-medium transition-colors duration-300"
                      style={{ 
                        color: isActive ? '#fb923c' : '#71717a',
                      }}
                    >
                      {item.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Phone & CTA */}
            <div className="hidden md:flex items-center gap-5">
              <motion.a 
                href="tel:+78001234567" 
                className="text-sm text-zinc-400 flex items-center gap-2 hover:text-orange-400 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">8 (800) 123-45-67</span>
              </motion.a>
              
              <motion.button
                onClick={() => goToSection(SECTIONS.CONTACT)}
                className="relative px-5 py-2.5 text-white font-semibold rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Subtle animated line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                />
                <span>Расчёт</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-orange-400 rounded-full origin-left"
                  animate={{ 
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? -1 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-orange-400 rounded-full"
                  animate={{ 
                    opacity: mobileMenuOpen ? 0 : 1,
                    x: mobileMenuOpen ? 20 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-orange-400 rounded-full origin-left"
                  animate={{ 
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? 1 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </motion.button>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              >
                <div className="pt-4 pb-2 space-y-1">
                  {[
                    { name: 'Главная', section: SECTIONS.HERO },
                    { name: 'Достижения', section: SECTIONS.STATS },
                    { name: 'Услуги', section: SECTIONS.SERVICES },
                    { name: 'Преимущества', section: SECTIONS.ADVANTAGES },
                    { name: 'Галерея', section: SECTIONS.GALLERY },
                    { name: 'Калькулятор', section: SECTIONS.CALCULATOR },
                    { name: 'Отзывы', section: SECTIONS.TESTIMONIALS },
                    { name: 'Контакты', section: SECTIONS.CONTACT },
                  ].map((item, i) => {
                    const isActive = currentSection === item.section
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { 
                          goToSection(item.section)
                          setMobileMenuOpen(false)
                        }}
                        className="relative w-full text-left py-3 px-4 rounded-lg flex items-center justify-between group"
                        whileHover={{ x: 4 }}
                      >
                        {/* Background */}
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: isActive 
                              ? 'linear-gradient(90deg, rgba(249, 115, 22, 0.1), transparent)'
                              : 'transparent',
                          }}
                        />
                        
                        {/* Left accent */}
                        <motion.div
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ background: '#fbbf24' }}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            scaleY: isActive ? 1 : 0
                          }}
                        />

                        <span 
                          className="relative z-10 font-medium transition-colors"
                          style={{ color: isActive ? '#fb923c' : '#a1a1aa' }}
                        >
                          {item.name}
                        </span>

                        <motion.div
                          animate={{ 
                            x: isActive ? 0 : -5, 
                            opacity: isActive ? 1 : 0 
                          }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <ArrowRight className="w-4 h-4 text-orange-400" />
                        </motion.div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Section Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
          <button key={i} onClick={() => goToSection(i)} className={`w-2 h-8 rounded-full transition-all duration-300 ${i === currentSection ? 'bg-orange-500' : 'bg-zinc-700 hover:bg-zinc-600'}`} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-800 z-50">
        <motion.div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400" style={{ width: `${((currentSection + 1) / TOTAL_SECTIONS) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* HERO SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.HERO}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <Zap className="w-4 h-4" /> Лидер рынка с 2009 года
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white mb-2">Профессиональная</span>
            <GradientText className="block">дорожная разметка</GradientText>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Гарантия <span className="text-orange-400 font-semibold">24 месяца</span>. Работаем по ГОСТ. 
            <span className="text-orange-400 font-semibold"> 500+ объектов</span> по всей России.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <MagneticButton onClick={() => goToSection(SECTIONS.SERVICES)} className="group px-8 py-4 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-3">
              <span>Рассчитать стоимость</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton onClick={() => goToSection(SECTIONS.GALLERY)} className="px-8 py-4 bg-zinc-800/60 text-white font-medium rounded-xl border border-zinc-700 flex items-center gap-3">
              <Play className="w-5 h-5" /><span>Наши работы</span>
            </MagneticButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-8 border-t border-zinc-800/50">
            <p className="text-zinc-500 text-sm mb-4">Нам доверяют</p>
            <div className="flex flex-wrap justify-center gap-8">
              {clients.map((client, i) => (
                <motion.div key={client} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }} className="text-zinc-500 text-sm font-medium hover:text-orange-400 transition-colors cursor-default">
                  {client}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* STATS SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.STATS}>
        <div className="max-w-5xl mx-auto px-6 w-full">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-center mb-12">
            Наши <GradientText>достижения</GradientText>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SERVICES SECTION - PREMIUM SLIDER */}
      <SectionWrapper isVisible={currentSection === SECTIONS.SERVICES}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши <GradientText>услуги</GradientText></h2>
            <p className="text-zinc-400 text-lg">Профессиональная разметка любой сложности</p>
          </motion.div>
          <ServicesSlider />
        </div>
      </SectionWrapper>

      {/* ADVANTAGES SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.ADVANTAGES}>
        <div className="max-w-4xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Почему <GradientText>выбирают нас</GradientText></h2>
            <p className="text-zinc-400 text-lg">Мы создаём безопасные дороги на годы вперёд</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {advantages.map((item, i) => (
              <AdvantageCard key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* GALLERY SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.GALLERY}>
        <div className="max-w-5xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><GradientText>Галерея</GradientText> работ</h2>
            <p className="text-zinc-400 text-lg">Примеры наших проектов</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((item, i) => (
              <GalleryCard key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CALCULATOR SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.CALCULATOR}>
        <div className="max-w-xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><GradientText>Калькулятор</GradientText></h2>
            <p className="text-zinc-400">Получите предварительный расчёт за 30 секунд</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden border border-zinc-800/50">
            {/* Background image */}
            <img 
              src="/card-material.jpg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-zinc-900/50" />
            
            <div className="relative z-10 p-8 space-y-6">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-4 block">Тип разметки</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ id: 'road', name: 'Дорожная', price: 150 }, { id: 'parking', name: 'Парковка', price: 120 }, { id: 'zebra', name: 'Зебра', price: 180 }, { id: 'removal', name: 'Удаление', price: 80 }].map((type) => (
                    <button key={type.id} onClick={() => setSelectedService(type.id)} className={`p-3 rounded-xl text-sm font-medium transition-all ${selectedService === type.id ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 border-2' : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600 border'}`}>
                      {type.name}
                      <span className="block text-xs mt-1 opacity-70">{type.price} ₽/м²</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-4 block">Площадь: <span className="text-orange-400 font-bold">{area} м²</span></label>
                <input type="range" min="50" max="5000" step="50" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs text-zinc-500 mt-2"><span>50 м²</span><span>5000 м²</span></div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400">Стоимость:</span>
                  <span className="text-3xl font-bold"><GradientText>{calculatePrice().toLocaleString('ru-RU')} ₽</GradientText></span>
                </div>
                <MagneticButton onClick={() => goToSection(SECTIONS.CONTACT)} className="w-full py-4 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30">
                  Получить точный расчёт
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* TESTIMONIALS SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.TESTIMONIALS}>
        <div className="max-w-3xl mx-auto px-6 w-full">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-center mb-12">
            Что говорят <GradientText>клиенты</GradientText>
          </motion.h2>

          <div className="relative h-[280px]">
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) => activeTestimonial === i && (
                <TestimonialCard key={t.name} {...t} isActive={true} />
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-orange-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600 w-2'}`} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CONTACT SECTION */}
      <SectionWrapper isVisible={currentSection === SECTIONS.CONTACT}>
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь <GradientText>с нами</GradientText></h2>
              <p className="text-zinc-400 text-lg mb-8">Оставьте заявку и наш специалист свяжется с вами в течение 15 минут</p>
              
              <div className="space-y-4">
                <a href="tel:+78001234567" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-900/40 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Phone className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Телефон</div>
                    <div className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors">8 (800) 123-45-67</div>
                  </div>
                </a>
                
                <a href="mailto:info@razmetka-pro.ru" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-900/40 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Email</div>
                    <div className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors">info@razmetka-pro.ru</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Адрес</div>
                    <div className="text-lg font-medium text-white">Москва, ул. Примерная, 1</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-3xl overflow-hidden border border-zinc-800/50">
              {/* Background image */}
              <img 
                src="/gallery-2.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-zinc-900/50" />
              
              <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:outline-none transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:outline-none transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Сообщение</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Опишите ваш проект..."
                  />
                </div>
                <MagneticButton className="w-full py-4 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30">
                  Отправить заявку
                </MagneticButton>
              </form>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
