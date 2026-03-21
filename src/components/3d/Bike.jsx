import { useRef, useEffect, useState } from 'react';
import { useGLTF, OrbitControls, Clone } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import BikeHotspots from './BikeHotspots';

const PART_MAP = {
  wheel: 'wheels', rim: 'wheels', tire: 'wheels', spoke: 'wheels',
  handle: 'handlebars', grip: 'handlebars', bar: 'handlebars', stem: 'handlebars',
  chain: 'drivetrain', crank: 'drivetrain', pedal: 'drivetrain', cassette: 'drivetrain', derail: 'drivetrain', gear: 'drivetrain', rotor: 'wheels', caliper: 'wheels',
  fork: 'suspension', shock: 'suspension', damper: 'suspension',
  seat: 'frame', saddle: 'frame', post: 'frame', frame: 'frame', body: 'frame', paint: 'frame'
};

function detectPart(name) {
  const lower = name.toLowerCase();
  for (const [kw, part] of Object.entries(PART_MAP)) {
    if (lower.includes(kw)) return part;
  }
  return 'frame';
}

// Hero: bike positioning (handled responsively inside component)
const GARAGE_Y = 0;

export default function Bike({ color, isGarageOpen, onToggleGarage, onSelectPart, selectedPart }) {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const group = useRef();
  const wrapperRef = useRef();
  const orbitRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const { scene, materials } = useGLTF('/models/santa_cruz_v10_downhill_mountain_bicycle.glb');

  // ── Color change via GSAP (Targets cloned materials in the scene) ──
  useEffect(() => {
    if (!materials) return;
    const tc = new THREE.Color(color);
    for (const [, mat] of Object.entries(materials)) {
      if (mat?.color && mat.name &&
        (mat.name.toLowerCase().includes('frame') ||
         mat.name.toLowerCase().includes('paint') ||
         mat.name.toLowerCase().includes('body'))) {
        gsap.to(mat.color, { r: tc.r, g: tc.g, b: tc.b, duration: 1.4, ease: 'power3.out' });
      }
    }
  }, [color, materials]);

  // ── Auto-center + Initial Positioning ──
  useEffect(() => {
    if (!group.current || !scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Scale factor (Strictly 4.2 for desktop, decreased by 40% for mobile as requested)
    const baseScale = isMobileScreen ? 2.5 : 4.2;
    const scaleFactor = baseScale / size.y;
    
    if (group.current) {
      if (isGarageOpen) {
         group.current.scale.setScalar(scaleFactor);
      } else {
        gsap.to(group.current.scale, {
          x: scaleFactor, y: scaleFactor, z: scaleFactor,
          duration: 0.8, ease: 'power2.out'
        });
      }
    }

    group.current.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    );

    wrapperRef.current = group.current.parent;
    if (wrapperRef.current) {
      const offsetX = isMobileScreen ? 1.0 : 4.2;
      // Set initial positions based on state
      if (isGarageOpen) {
        wrapperRef.current.position.set(0, GARAGE_Y, 0);
      } else {
        wrapperRef.current.position.set(offsetX, 0, 0);
      }
      wrapperRef.current.rotation.set(0, -Math.PI / 1.6, 0);
    }
  }, [scene, isGarageOpen, isMobileScreen]);

  // ── Mode transition: Hero ↔ Garage ──
  useEffect(() => {
    const w = wrapperRef.current;
    if (!w) return;

    gsap.killTweensOf(w.position);
    gsap.killTweensOf(w.rotation);

    const offsetX = isMobileScreen ? 1.0 : 4.2;

    if (isGarageOpen) {
      // Smooth travel to garage center
      gsap.to(w.position, { x: 0, y: GARAGE_Y, z: 0, duration: 1.2, ease: 'power3.inOut' });
      gsap.to(w.rotation, { y: -Math.PI / 1.6, duration: 1.2, ease: 'power3.inOut' });
    } else {
      // Smooth return to hero position on the right
      gsap.to(w.position, { x: offsetX, y: 0, z: 0, duration: 1.2, ease: 'power3.inOut' });
      gsap.to(w.rotation, { y: -Math.PI / 1.6, duration: 1.2, ease: 'power3.inOut' });
    }
  }, [isGarageOpen, isMobileScreen]);

  // ── Reset OrbitControls target when returning from inspection ──
  useEffect(() => {
    if (isGarageOpen && !selectedPart && orbitRef.current) {
      gsap.to(orbitRef.current.target, { x: 0, y: 0, z: 0, duration: 1.0, ease: 'power3.inOut',
        onUpdate: () => orbitRef.current.update()
      });
    }
  }, [selectedPart, isGarageOpen]);

  // ── Interaction Cursors ──
  useEffect(() => {
    // using document.body to avoid direct gl.domElement modification warning
    document.body.style.cursor = isGarageOpen ? 'grab' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [isGarageOpen]);

  const handlePartClick = (e) => {
    e.stopPropagation();
    if (!isGarageOpen) {
      onToggleGarage();
      return;
    }
    const partName = e.object.name || (e.object.parent?.name);
    onSelectPart(detectPart(partName));
  };

  return (
    <>
      <group dispose={null} onClick={handlePartClick}>
        <group ref={group}>
          {/* using <Clone> avoids conflict with background display bikes */}
          <Clone object={scene} castShadow receiveShadow />
          
          {/* Hotspots tracking the inner group transforms */}
          <BikeHotspots
            visible={isGarageOpen}
            onSelectPart={onSelectPart}
            selectedPart={selectedPart}
          />
        </group>
      </group>

      {/* OrbitControls — only in garage overview mode */}
      {isGarageOpen && !selectedPart && (
        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.85}
          makeDefault
        />
      )}
    </>
  );
}

useGLTF.preload('/models/santa_cruz_v10_downhill_mountain_bicycle.glb');
