import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, RotateCw, RotateCcw } from 'lucide-react';
import { audioService } from '../utils/audio';

interface AlveolusCanvas3DProps {
  onBackToLungs: () => void;
}

export const AlveolusCanvas3D: React.FC<AlveolusCanvas3DProps> = ({ onBackToLungs }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const animationFrameId = useRef<number | null>(null);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const zoomLevel = useRef(5.5);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomLevel.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLightO2 = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLightO2.position.set(4, 4, 4);
    scene.add(pointLightO2);

    const pointLightCO2 = new THREE.PointLight(0xf43f5e, 1.8, 20);
    pointLightCO2.position.set(-4, -4, 4);
    scene.add(pointLightCO2);

    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    const alveolusMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfda4af,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.3,
      ior: 1.3,
      thickness: 0.5,
    });

    const capillaryMaterialRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.1,
    });

    const capillaryMaterialBlue = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.25,
      metalness: 0.1,
    });

    const sacPositions: [number, number, number, number][] = [
      [0, 0, 0, 1.0],
      [0.9, 0.4, -0.3, 0.85],
      [-0.85, 0.5, 0.2, 0.8],
      [0.2, 1.1, -0.2, 0.75],
      [-0.4, -0.9, 0.1, 0.85],
      [0.8, -0.7, 0.2, 0.78],
      [-0.9, -0.3, -0.5, 0.7],
      [0.1, -0.2, 0.9, 0.82],
      [-0.5, 0.8, -0.7, 0.72],
    ];

    sacPositions.forEach(([x, y, z, r]) => {
      const geo = new THREE.SphereGeometry(r, 32, 24);
      const mesh = new THREE.Mesh(geo, alveolusMaterial);
      mesh.position.set(x, y, z);
      clusterGroup.add(mesh);
    });

    for (let i = 0; i < 14; i++) {
      const torusGeo = new THREE.TorusGeometry(1.2 + (i % 3) * 0.2, 0.045, 12, 32);
      const torus = new THREE.Mesh(torusGeo, i % 2 === 0 ? capillaryMaterialRed : capillaryMaterialBlue);
      torus.position.set((Math.sin(i) * 0.6), (Math.cos(i) * 0.6), (Math.sin(i * 2) * 0.4));
      torus.rotation.set(i * 0.5, i * 0.7, i * 0.3);
      clusterGroup.add(torus);
    }

    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 1.3 + Math.random() * 0.8;

      positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = dist * Math.cos(phi);

      if (i % 2 === 0) {
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.74;
        colors[i * 3 + 2] = 0.97;
      } else {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.25;
        colors[i * 3 + 2] = 0.35;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    clusterGroup.add(particles);

    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging.current) {
        targetRotation.current.y += 0.006;
      }

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

      clusterGroup.rotation.x = currentRotation.current.x;
      clusterGroup.rotation.y = currentRotation.current.y;

      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.025;
      clusterGroup.scale.set(pulse, pulse, pulse);

      particles.rotation.y -= 0.01;
      particles.rotation.x += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[580px] bg-[#050811] overflow-hidden select-none flex flex-col justify-between">
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <button
          onClick={() => {
            audioService.playClick();
            onBackToLungs();
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Paru-paru</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 text-xs text-cyan-300 font-medium">
            Mikro Alveoli & Kapiler Darah
          </div>

          <button
            onClick={() => {
              audioService.playClick();
              setIsRotating(!isRotating);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md ${
              isRotating
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Putar</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              targetRotation.current = { x: 0, y: 0 };
              setIsRotating(true);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800"
            title="Atur ulang"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing canvas-container"
      />

      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 max-w-xl text-center shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-center gap-4 text-xs font-medium mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Oksigen (O₂) masuk ke kapiler
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> CO₂ keluar ke alveolus
            </span>
          </div>
          <p className="text-[12px] text-slate-300">
            Dinding alveolus hanya setebal satu lapis sel epitel pipih, memungkinkan pertukaran gas terjadi sangat cepat secara difusi.
          </p>
        </div>
      </div>
    </div>
  );
};
