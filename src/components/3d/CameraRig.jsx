import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';

// Precise camera angles for each bike part
const VIEWS = {
  // Hero: camera left, target right to offset the bike at X=4.2
  default:    { pos: [0, 0.5, 6.5], target: [1.5, 0, 0] },
  // Garage: centered view
  garage:     { pos: [0, 0.3, 6.5], target: [0, 0, 0] },
  // Inspection close-ups
  wheels:     { pos: [1.2, -0.8, 3.0], target: [0.5, -0.9, 0] },
  handlebars: { pos: [-0.3, 1.1, 2.0], target: [-0.1, 0.9, 0] },
  drivetrain: { pos: [1.6, -0.4, 2.0], target: [0.3, -0.4, 0] },
  frame:      { pos: [2.5, 0.2, 2.0],  target: [0, 0.0, 0] },
  suspension: { pos: [0.6, 0.8, 2.2],  target: [0.2, 0.4, 0] },
};

const DAMP = {
  default: 0.5,
  garage:  0.35,
  part:    0.14, // snappy zoom
};

export default function CameraRig({ isGarageOpen, selectedPart }) {
  const { mouse } = useThree();

  useFrame((state, delta) => {
    // ── Garage orbit overview mode: FULLY YIELD to OrbitControls ──
    if (isGarageOpen && !selectedPart) return;

    const view = (selectedPart && VIEWS[selectedPart]) 
      ? VIEWS[selectedPart] 
      : isGarageOpen 
        ? VIEWS.garage 
        : VIEWS.default;

    const damp = selectedPart ? DAMP.part : DAMP.default;

    // Smooth position dampening
    easing.damp3(state.camera.position, view.pos, damp, delta);

    // Subtle immersive mouse tilt for hero/garage base views
    if (!selectedPart) {
      const px = mouse.x * 0.25;
      const py = mouse.y * 0.15;
      state.camera.position.x += (view.pos[0] + px - state.camera.position.x) * 0.015;
      state.camera.position.y += (view.pos[1] + py - state.camera.position.y) * 0.015;
    }

    state.camera.lookAt(...view.target);
  });

  return null;
}
