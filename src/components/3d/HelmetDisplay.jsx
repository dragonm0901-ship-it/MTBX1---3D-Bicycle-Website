import { useMemo } from 'react';
import * as THREE from 'three';

// ── Procedural helmet — static, no useFrame rotation ─────────────────────────
function ProceduralHelmet({ color = '#cc0000', scale = 0.35, rotY = 0 }) {
  const shellColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group scale={scale} rotation={[0, rotY, 0]}>
      {/* Main shell */}
      <mesh position={[0, 0.1, -0.1]}>
        <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={shellColor} roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, -0.15, 0.7]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.2, 0.35, 0.15]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.05} metalness={0.9} />
      </mesh>
      {/* Chin guard */}
      <mesh position={[0, -0.5, 0.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color={shellColor} roughness={0.25} metalness={0.35} />
      </mesh>
      {/* Vent slots */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0.1]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.03, 0.35]} />
          <meshStandardMaterial color="#0a0a10" roughness={0.9} />
        </mesh>
      ))}
      {/* Gold accent stripes */}
      {[-1, 1].map((side, i) => (
        <mesh key={`s${i}`} position={[side * 0.8, 0, 0.2]} rotation={[0, side * 0.15, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.4]} />
          <meshStandardMaterial color="#c9a227" emissive="#604800" emissiveIntensity={0.2} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ── Single helmet on shelf — NO pointLight ──────────────────────────────────
function HelmetOnShelf({ position, rotation = [0, 0, 0], shelfWidth = 1.2, color, rotY = 0 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Glass shelf */}
      <mesh>
        <boxGeometry args={[shelfWidth, 0.03, 0.45]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.1} metalness={0.5} transparent opacity={0.85} />
      </mesh>
      {/* LED strip — emissive only, no light */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[shelfWidth - 0.1, 0.006, 0.3]} />
        <meshStandardMaterial color="#b90202" emissive="#b90202" emissiveIntensity={2} roughness={0} />
      </mesh>
      {/* Brackets */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[s * (shelfWidth / 2 - 0.05), -0.12, 0]}>
          <boxGeometry args={[0.04, 0.24, 0.04]} />
          <meshStandardMaterial color="#222228" roughness={0.5} metalness={0.85} />
        </mesh>
      ))}
      {/* Helmet */}
      <group position={[0, 0.15, 0]}>
        <ProceduralHelmet color={color} scale={0.3} rotY={rotY} />
      </group>
    </group>
  );
}

// ── Three helmet displays on left wall ──────────────────────────────────────
export default function HelmetDisplay({ wallX = -11 }) {
  const shelves = [
    { z: -4, y: 1.5, color: '#cc0000', rotY: 0.3 },
    { z: 0,  y: 2.0, color: '#1a4a2e', rotY: -0.2 },
    { z: 4,  y: 1.5, color: '#003865', rotY: 0.5 },
  ];

  return (
    <group>
      {shelves.map((s, i) => (
        <HelmetOnShelf
          key={i}
          position={[wallX + 0.3, s.y, s.z]}
          rotation={[0, Math.PI / 2, 0]}
          color={s.color}
          rotY={s.rotY}
        />
      ))}
    </group>
  );
}
