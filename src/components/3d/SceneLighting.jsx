import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';

export default function SceneLighting({ isGarageOpen }) {
  const keyLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow-orbit key light in hero mode ONLY (not noticeable as flicker)
    if (keyLightRef.current && !isGarageOpen) {
      keyLightRef.current.position.x = 6 + Math.sin(t * 0.18) * 2.5;
      keyLightRef.current.position.z = 8 + Math.cos(t * 0.12) * 1.5;
    }
  });

  return (
    <group>
      {/* ── AMBIENT ── */}
      <ambientLight intensity={isGarageOpen ? 0.15 : 0.7} color={isGarageOpen ? '#12121e' : '#12121a'} />

      {/* ── KEY LIGHT — studio-grade directional ── */}
      <directionalLight
        ref={keyLightRef}
        position={[6, 12, 8]}
        intensity={isGarageOpen ? 3.5 : 6}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      {/* ── RIM LIGHT (cool, back-right) ── */}
      <directionalLight
        position={[-8, 4, -10]}
        intensity={isGarageOpen ? 5 : 4}
        color="#a8c8ff"
        castShadow={false}
      />

      {/* ── FILL LIGHT (warm, front-left) ── */}
      <directionalLight
        position={[-6, 3, 6]}
        intensity={isGarageOpen ? 1.2 : 1.8}
        color="#fff0e0"
        castShadow={false}
      />

      {/* ── SECOND FILL (cool, bottom) ── */}
      <directionalLight
        position={[0, -2, 4]}
        intensity={isGarageOpen ? 0.5 : 0.3}
        color="#cce0ff"
        castShadow={false}
      />

      {/* ═══════ GARAGE-ONLY STUDIO LIGHTING ═══════ */}
      {isGarageOpen && (
        <>
          {/* CENTER KEY SPOT */}
          <spotLight
            position={[0, 8, 1]}
            intensity={20}
            color="#eef2ff"
            angle={0.35}
            penumbra={0.6}
            distance={22}
            decay={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          {/* FRONT KEY SPOT */}
          <spotLight
            position={[0, 5, 8]}
            intensity={10}
            color="#fff5e8"
            angle={0.45}
            penumbra={0.8}
            distance={18}
            decay={2}
          />
          {/* RED UNDERGLOW */}
          <pointLight
            position={[0, -1.3, 2]}
            intensity={6}
            color="#ff1100"
            distance={10}
            decay={2}
          />
          {/* BLUE COUNTER-ACCENT */}
          <pointLight
            position={[0, -1.3, -3]}
            intensity={3}
            color="#0044cc"
            distance={8}
            decay={2}
          />
          {/* HEMISPHERE LIGHT */}
          <hemisphereLight
            color="#1a1a30"
            groundColor="#0a0500"
            intensity={0.4}
          />
        </>
      )}

      {/* ═══════ HERO-ONLY LIGHTING ═══════ */}
      {!isGarageOpen && (
        <spotLight
          position={[4, 10, 6]}
          intensity={10}
          color="#ffffff"
          angle={0.5}
          penumbra={0.55}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      )}

      {/* ── CONTACT SHADOWS ── */}
      <ContactShadows
        position={[0, -1.83, 0]}
        opacity={isGarageOpen ? 0.75 : 0.5}
        scale={isGarageOpen ? 18 : 10}
        blur={isGarageOpen ? 2.5 : 2.0}
        far={4}
        color="#000010"
      />
    </group>
  );
}