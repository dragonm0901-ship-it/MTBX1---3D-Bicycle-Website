import { useMemo } from 'react';
import { useGLTF, MeshReflectorMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// ──────────────────────────────────────────────────────────────────────────────
// Single wall panel with inset tile lines
function WallPanel({ position, rotation, width = 16, height = 6, color = '#1a1a1e' }) {
  const tiles = useMemo(() => {
    const lines = [];
    const cols = Math.round(width / 2.0);
    const rows = Math.round(height / 2.0);
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c / cols) * width;
      lines.push({ start: [x, -height / 2, 0.01], end: [x, height / 2, 0.01] });
    }
    for (let r = 0; r <= rows; r++) {
      const y = -height / 2 + (r / rows) * height;
      lines.push({ start: [-width / 2, y, 0.01], end: [width / 2, y, 0.01] });
    }
    return lines;
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
      </mesh>
      {tiles.map((t, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(...t.start), new THREE.Vector3(...t.end)]}
          color="#0d0d10"
          lineWidth={1.2}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Studio light fixture on ceiling
function CeilingLight({ position, color = '#b8d4ff', intensity = 30 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.12, 0.4]} />
        <meshStandardMaterial color="#111114" roughness={0.7} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[1.0, 0.01, 0.3]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={3} color={color} />
      </mesh>
      <rectAreaLight
        width={1.0}
        height={0.3}
        intensity={intensity}
        color={color}
        position={[0, -0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Bike wall mount
function WallMount({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.26, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.4} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// A display bike on a repair stand
function BikeOnStand({ position, rotation = [0,0,0], color = '#cc0000', scale = 0.9 }) {
  const { scene } = useGLTF('/models/santa_cruz_v10_downhill_mountain_bicycle.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      if (obj.isMesh && obj.material) {
        const mat = obj.material.clone();
        if (mat.name && (mat.name.toLowerCase().includes('frame') || mat.name.toLowerCase().includes('paint') || mat.name.toLowerCase().includes('body'))) {
          mat.color = new THREE.Color(color);
        }
        obj.material = mat;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const sf = (3.2 * scale) / size.y;
    c.scale.setScalar(sf);
    c.position.set(-center.x * sf, (-center.y * sf) + (1.82 * scale), -center.z * sf);
    return c;
  }, [scene, color, scale]);

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 1.8, 8]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.5} metalness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 16]} />
        <meshStandardMaterial color="#111114" roughness={0.7} metalness={0.6} />
      </mesh>
      <primitive object={cloned} />
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// A display bike hanging from the wall
function BikeOnWall({ position, rotation = [0,0,0], color = '#cc0000', scale = 0.85 }) {
  const { scene } = useGLTF('/models/santa_cruz_v10_downhill_mountain_bicycle.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      if (obj.isMesh && obj.material) {
        const mat = obj.material.clone();
        if (mat.name && (mat.name.toLowerCase().includes('frame') || mat.name.toLowerCase().includes('paint') || mat.name.toLowerCase().includes('body'))) {
          mat.color = new THREE.Color(color);
        }
        obj.material = mat;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const sf = (3.2 * scale) / size.y;
    c.scale.setScalar(sf);
    c.position.set(-center.x * sf, -center.y * sf, -center.z * sf);
    return c;
  }, [scene, color, scale]);

  return (
    <group position={position} rotation={rotation}>
      <WallMount position={[0, 0, 0.1]} />
      <primitive object={cloned} position={[0.2, -0.2, 0.2]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Tool board
function ToolBoard({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <boxGeometry args={[4, 2.2, 0.06]} />
        <meshStandardMaterial color="#161618" roughness={0.85} metalness={0.1}/>
      </mesh>
      {/* Red stripe */}
      <mesh position={[0, -1.05, 0.04]}>
        <boxGeometry args={[4, 0.12, 0.02]} />
        <meshStandardMaterial color="#b90202" roughness={0.8} metalness={0.2} emissive="#300000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Garage door
function GarageDoor({ position }) {
  const slats = 8;
  return (
    <group position={position}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[5, 4, 0.06]} />
        <meshStandardMaterial color="#1e1e22" roughness={0.7} metalness={0.55} />
      </mesh>
      {Array.from({ length: slats }).map((_, i) => (
        <mesh key={i} position={[0, -1.8 + i * 0.48, 0.04]} receiveShadow>
          <boxGeometry args={[5, 0.04, 0.02]} />
          <meshStandardMaterial color="#111114" roughness={0.9} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// NeonStrip
function NeonStrip({ start, end, color = '#ff1100' }) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
  const mx = (start[0] + end[0])/2;
  const my = (start[1] + end[1])/2;
  const mz = (start[2] + end[2])/2;

  return (
    <mesh position={[mx, my, mz]}>
      <boxGeometry args={[len, 0.04, 0.04]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} roughness={0} metalness={0} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN GARAGE ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function GarageEnvironment() {
  const ROOM_W  = 22;
  const ROOM_D  = 18;
  const ROOM_H  = 6.5;
  const HW = ROOM_W / 2;
  const HD = ROOM_D / 2;
  const HH = ROOM_H / 2;

  return (
    <group>
      {/* ── FLOOR ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <MeshReflectorMaterial
          blur={[300, 150]}
          resolution={512}
          mixBlur={0.6}
          mixStrength={40}
          roughness={0.95}
          depthScale={1.0}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0e0e11"
          metalness={0.6}
          mirror={0.7}
        />
      </mesh>

      {/* Floor red safety stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.84, HD - 2]}>
        <planeGeometry args={[ROOM_W, 0.15]} />
        <meshStandardMaterial color="#b90202" emissive="#600000" emissiveIntensity={0.8} />
      </mesh>

      {/* ── WALLS ── */}
      <WallPanel position={[0, HH - 1.85, -HD]} rotation={[0, 0, 0]} width={ROOM_W} height={ROOM_H} color="#18181c" />
      <WallPanel position={[-HW, HH - 1.85, 0]} rotation={[0, Math.PI / 2, 0]} width={ROOM_D} height={ROOM_H} color="#161618" />
      <WallPanel position={[HW, HH - 1.85, 0]} rotation={[0, -Math.PI / 2, 0]} width={ROOM_D} height={ROOM_H} color="#161618" />

      {/* ── CEILING ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H - 1.85, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#111114" />
      </mesh>

      {/* ── CEILING LIGHTS ── */}
      <CeilingLight position={[-5, ROOM_H - 2.0, -2]} color="#ccdeff" />
      <CeilingLight position={[0, ROOM_H - 2.0, -2]} color="#ddeeff" />
      <CeilingLight position={[5, ROOM_H - 2.0, -2]} color="#ccdeff" />
      <CeilingLight position={[-5, ROOM_H - 2.0, 4]} color="#ccdeff" />
      <CeilingLight position={[5, ROOM_H - 2.0, 4]} color="#ccdeff" />

      {/* ── NEON STRIPS ── */}
      <NeonStrip start={[-HW + 0.05, -1.7, -6]} end={[-HW + 0.05, -1.7, 6]} color="#ff1100" />
      <NeonStrip start={[HW - 0.05, ROOM_H - 2.2, -6]} end={[HW - 0.05, ROOM_H - 2.2, 4]} color="#0055cc" />

      {/* ── GARAGE DOOR ── */}
      <GarageDoor position={[0, 0.2, -HD + 0.08]} />

      {/* ── TOOL BOARD ── */}
      <ToolBoard position={[-HW + 0.06, 1.0, -3]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── HANGING BIKES ── */}
      <BikeOnWall position={[HW - 0.2, 2.5, -2]} rotation={[0, -Math.PI / 2, 0]} color="#1a4a2e" />
      <BikeOnWall position={[HW - 0.2, 2.5, 3]} rotation={[0, -Math.PI / 2, 0]} color="#003865" />

      {/* ── BIKES ON STANDS ── */}
      <BikeOnStand position={[-6, -1.85, -5]} rotation={[0, Math.PI * 0.15, 0]} color="#cc0000" scale={0.82} />
      <BikeOnStand position={[6, -1.85, -5]} rotation={[0, -Math.PI * 0.15, 0]} color="#c9a227" scale={0.82} />
      <BikeOnStand position={[-8, -1.85, -2]} rotation={[0, Math.PI * 0.4, 0]} color="#f0efeb" scale={0.7} />

      {/* ── SHELVES ── */}
      {[-1.5, 0.5, 2.5].map((z, i) => (
        <mesh key={i} position={[-HW + 0.4, -0.6 + i * 0.82, z]}>
          <boxGeometry args={[0.8, 0.04, 1.2]} />
          <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
