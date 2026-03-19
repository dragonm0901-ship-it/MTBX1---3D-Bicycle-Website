import { useRef, useState, useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HOTSPOTS = [
  {
    id: 'wheels',
    label: 'WHEELS',
    sub: '29" Carbon · DT Swiss',
    dotPos: [0.6, -0.75, 0.15],
    labelPos: [1.6, -0.3, 0.15],
    accentColor: '#0a8aff',
  },
  {
    id: 'handlebars',
    label: 'COCKPIT',
    sub: 'Race Face Atlas',
    dotPos: [-0.1, 0.9, 0.1],
    labelPos: [-1.5, 1.4, 0.1],
    accentColor: '#c9a227',
  },
  {
    id: 'drivetrain',
    label: 'DRIVETRAIN',
    sub: 'Shimano XT 12-spd',
    dotPos: [0.25, -0.5, -0.1],
    labelPos: [1.6, -0.9, -0.1],
    accentColor: '#2dcf52',
  },
  {
    id: 'frame',
    label: 'FRAME',
    sub: 'T1000 Carbon · 2.1kg',
    dotPos: [-0.08, 0.15, 0.05],
    labelPos: [-1.6, 0.55, 0.05],
    accentColor: '#b90202',
  },
  {
    id: 'suspension',
    label: 'SUSPENSION',
    sub: 'Fox 38 Factory · 203mm',
    dotPos: [0.45, 0.5, 0.12],
    labelPos: [1.6, 1.0, 0.12],
    accentColor: '#9b59b6',
  },
];

function HotspotDot({ position, color, isHovered, isSelected, visible }) {
  const outerRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
    if (!outerRef.current || !visible) return;
    const t = state.clock.elapsedTime;
    const pulse = 1.4 + Math.sin(t * 2.5) * 0.3;
    outerRef.current.scale.setScalar(isHovered || isSelected ? 2.4 : pulse);
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = (isHovered ? 10 : 5) + Math.sin(t * 3) * 2;
    }
  });

  return (
    <mesh position={position}>
      <mesh ref={outerRef} scale={1.6}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 4 : 2}
          transparent
          opacity={(isHovered || isSelected ? 0.3 : 0.12) * (visible ? 1 : 0.1)}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 10 : 5}
          roughness={0}
          metalness={0}
          transparent
          opacity={visible ? 1 : 0.15}
          depthWrite={false}
        />
      </mesh>
    </mesh>
  );
}

function AnimatedLine({ start, end, color, isActive, visible }) {
  const lineRef = useRef();

  useFrame((state) => {
    if (!lineRef.current?.material) return;
    lineRef.current.material.dashOffset = -state.clock.elapsedTime * 0.8;
  });

  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end]);

  return (
    <Line
      ref={lineRef}
      points={points}
      color={isActive ? color : '#ffffff'}
      lineWidth={isActive ? 2.0 : 0.8}
      transparent
      opacity={(isActive ? 0.9 : 0.25) * (visible ? 1 : 0.1)}
      dashed
      dashSize={isActive ? 0.08 : 0.06}
      gapSize={0.04}
      dashScale={1}
    />
  );
}

export default function BikeHotspots({ visible, onSelectPart, selectedPart }) {
  const [hoveredId, setHoveredId] = useState(null);

  if (!visible) return null;

  return (
    <group>
      {HOTSPOTS.map((h) => {
        const isHovered = hoveredId === h.id;
        const isSelected = selectedPart === h.id;
        const isActive = isHovered || isSelected;
        const isVisible = !selectedPart || selectedPart === h.id;

        return (
          <group key={h.id}>
            <AnimatedLine start={h.dotPos} end={h.labelPos} color={h.accentColor} isActive={isActive} visible={isVisible} />
            
            <HotspotDot
              position={h.dotPos}
              color={h.accentColor}
              isHovered={isHovered}
              isSelected={isSelected}
              visible={isVisible}
            />

            {isVisible && (
              <Html
                position={[h.labelPos[0] + (h.labelPos[0] > 0 ? 0.05 : -0.05), h.labelPos[1], h.labelPos[2]]}
                style={{
                  transform: h.labelPos[0] > 0 ? 'none' : 'translateX(-100%)',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  zIndex: 50,
                }}
                distanceFactor={6}
              >
                <div
                  onClick={() => onSelectPart(h.id)}
                  onMouseEnter={() => setHoveredId(h.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isActive ? h.accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                    background: isActive ? 'rgba(5,5,8,0.95)' : 'rgba(5,5,8,0.7)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: isActive
                      ? `0 0 24px ${h.accentColor}30, 0 4px 20px rgba(0,0,0,0.6)`
                      : '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'translateY(-3px) scale(1.03)' : 'none',
                    whiteSpace: 'nowrap',
                    minWidth: '115px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    fontSize: '9px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    color: isActive ? h.accentColor : 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                  }}>
                    {h.label}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 400,
                    color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                    lineHeight: 1.2,
                  }}>
                    {h.sub}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
