import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { HOTSPOTS_DATA } from '../data/curriculum';
import { Hotspot } from '../types';
import { audioService } from '../utils/audio';

interface LungCanvas3DProps {
  selectedHotspotId: number | null;
  onSelectHotspot: (id: number) => void;
  isBreathingActive: boolean;
  onDiveToAlveolus?: () => void;
  hotspots?: Hotspot[];
}

export const LungCanvas3D: React.FC<LungCanvas3DProps> = ({
  selectedHotspotId,
  onSelectHotspot,
  isBreathingActive,
  hotspots,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lungsGroupRef = useRef<THREE.Group | null>(null);
  const diaphragmRef = useRef<THREE.Mesh | null>(null);
  const rightLungRef = useRef<THREE.Group | null>(null);
  const leftLungRef = useRef<THREE.Group | null>(null);
  const hotspotSpritesRef = useRef<{ id: number; sprite: THREE.Sprite; pos: THREE.Vector3 }[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const zoomLevel = useRef(6.2);
  const targetZoom = useRef(6.2);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomLevel.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf43f5e, 1.1);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.2);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(14, 28, 0x1e293b, 0x0f172a);
    grid.position.y = -2.8;
    scene.add(grid);

    const rootGroup = new THREE.Group();
    lungsGroupRef.current = rootGroup;
    scene.add(rootGroup);

    const lungMaterialRight = new THREE.MeshStandardMaterial({
      color: 0xdf6a7a,
      roughness: 0.35,
      metalness: 0.1,
    });

    const lungMaterialLeft = new THREE.MeshStandardMaterial({
      color: 0xd95f70,
      roughness: 0.35,
      metalness: 0.1,
    });

    const tracheaMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.15,
    });

    const cartilageRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
    });

    const bronchialMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });

    // Right Lung
    const rightLung = new THREE.Group();
    rightLungRef.current = rightLung;

    const rSuperiorGeo = new THREE.SphereGeometry(0.85, 32, 24);
    rSuperiorGeo.scale(1.0, 1.1, 0.85);
    const rSuperior = new THREE.Mesh(rSuperiorGeo, lungMaterialRight);
    rSuperior.position.set(-1.1, 0.7, 0);
    rSuperior.rotation.set(0.1, 0.15, 0.2);
    rightLung.add(rSuperior);

    const rMiddleGeo = new THREE.SphereGeometry(0.75, 32, 24);
    rMiddleGeo.scale(1.05, 0.8, 0.85);
    const rMiddle = new THREE.Mesh(rMiddleGeo, lungMaterialRight);
    rMiddle.position.set(-1.25, -0.1, 0.1);
    rMiddle.rotation.set(0, 0.1, 0.15);
    rightLung.add(rMiddle);

    const rInferiorGeo = new THREE.SphereGeometry(0.95, 32, 24);
    rInferiorGeo.scale(1.15, 1.1, 0.9);
    const rInferior = new THREE.Mesh(rInferiorGeo, lungMaterialRight);
    rInferior.position.set(-1.2, -1.0, -0.05);
    rInferior.rotation.set(-0.1, 0.05, 0.1);
    rightLung.add(rInferior);

    rootGroup.add(rightLung);

    // Left Lung
    const leftLung = new THREE.Group();
    leftLungRef.current = leftLung;

    const lSuperiorGeo = new THREE.SphereGeometry(0.85, 32, 24);
    lSuperiorGeo.scale(0.95, 1.15, 0.85);
    const lSuperior = new THREE.Mesh(lSuperiorGeo, lungMaterialLeft);
    lSuperior.position.set(1.1, 0.65, 0);
    lSuperior.rotation.set(0.1, -0.15, -0.2);
    leftLung.add(lSuperior);

    const lInferiorGeo = new THREE.SphereGeometry(0.9, 32, 24);
    lInferiorGeo.scale(1.05, 1.1, 0.88);
    const lInferior = new THREE.Mesh(lInferiorGeo, lungMaterialLeft);
    lInferior.position.set(1.15, -0.9, -0.05);
    lInferior.rotation.set(-0.1, -0.05, -0.1);
    leftLung.add(lInferior);

    rootGroup.add(leftLung);

    // Trachea & Bronchi
    const tracheaGroup = new THREE.Group();

    const tracheaGeo = new THREE.CylinderGeometry(0.24, 0.22, 1.6, 24);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMaterial);
    tracheaMesh.position.set(0, 1.8, 0.1);
    tracheaGroup.add(tracheaMesh);

    for (let i = 0; i < 7; i++) {
      const ringGeo = new THREE.TorusGeometry(0.25, 0.035, 12, 24, Math.PI * 1.6);
      const ring = new THREE.Mesh(ringGeo, cartilageRingMaterial);
      ring.position.set(0, 1.2 + i * 0.18, 0.1);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = Math.PI * 0.2;
      tracheaGroup.add(ring);
    }

    const rBronchusGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.9, 16);
    const rBronchus = new THREE.Mesh(rBronchusGeo, bronchialMaterial);
    rBronchus.position.set(-0.45, 0.8, 0.05);
    rBronchus.rotation.z = Math.PI / 4;
    tracheaGroup.add(rBronchus);

    const lBronchusGeo = new THREE.CylinderGeometry(0.14, 0.11, 1.05, 16);
    const lBronchus = new THREE.Mesh(lBronchusGeo, bronchialMaterial);
    lBronchus.position.set(0.5, 0.75, 0.05);
    lBronchus.rotation.z = -Math.PI / 3.4;
    tracheaGroup.add(lBronchus);

    rootGroup.add(tracheaGroup);

    // Diaphragm
    const diaphragmGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.45, 32);
    const diaphragmMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.6,
      transparent: true,
      opacity: 0.75,
    });
    const diaphragm = new THREE.Mesh(diaphragmGeo, diaphragmMat);
    diaphragm.position.set(0, -2.1, 0);
    diaphragm.scale.set(1.0, 0.5, 0.75);
    diaphragmRef.current = diaphragm;
    rootGroup.add(diaphragm);

    // Hotspot Sprites
    const createHotspotSprite = (id: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      ctx.beginPath();
      ctx.arc(64, 64, 48, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(64, 64, 34, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(id.toString(), 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.55, 0.55, 1);
      return sprite;
    };

    hotspotSpritesRef.current = [];
    const activeHotspots = hotspots && hotspots.length > 0 ? hotspots : HOTSPOTS_DATA;
    activeHotspots.forEach((hs) => {
      const sprite = createHotspotSprite(hs.id);
      sprite.position.set(...hs.position);
      rootGroup.add(sprite);
      hotspotSpritesRef.current.push({
        id: hs.id,
        sprite,
        pos: new THREE.Vector3(...hs.position),
      });
    });

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging.current) {
        targetRotation.current.y += 0.005;
      }

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

      if (lungsGroupRef.current) {
        lungsGroupRef.current.rotation.x = currentRotation.current.x;
        lungsGroupRef.current.rotation.y = currentRotation.current.y;
      }

      if (isBreathingActive) {
        const breathSpeed = 1.6;
        const breathScale = 1 + Math.sin(elapsedTime * breathSpeed) * 0.08;
        const diaShift = Math.sin(elapsedTime * breathSpeed) * 0.18;

        if (rightLungRef.current && leftLungRef.current) {
          rightLungRef.current.scale.set(breathScale, breathScale * 1.02, breathScale);
          leftLungRef.current.scale.set(breathScale, breathScale * 1.02, breathScale);
        }
        if (diaphragmRef.current) {
          diaphragmRef.current.position.y = -2.1 - diaShift;
        }
      } else {
        const restingScale = 1 + Math.sin(elapsedTime * 0.8) * 0.015;
        if (rightLungRef.current && leftLungRef.current) {
          rightLungRef.current.scale.set(restingScale, restingScale, restingScale);
          leftLungRef.current.scale.set(restingScale, restingScale, restingScale);
        }
      }

      zoomLevel.current += (targetZoom.current - zoomLevel.current) * 0.1;
      if (cameraRef.current) {
        cameraRef.current.position.z = zoomLevel.current;
        currentLookAt.current.lerp(cameraTarget.current, 0.08);
        cameraRef.current.lookAt(currentLookAt.current);
      }

      hotspotSpritesRef.current.forEach((item) => {
        const isSelected = item.id === selectedHotspotId;
        const pulse = Math.sin(elapsedTime * 4 + item.id) * 0.05;
        const baseScale = isSelected ? 0.75 : 0.52;
        item.sprite.scale.set(baseScale + pulse, baseScale + pulse, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, isBreathingActive, selectedHotspotId, hotspots]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const sprites = hotspotSpritesRef.current.map((h) => h.sprite);
    const intersects = raycaster.intersectObjects(sprites, false);

    if (intersects.length > 0) {
      const hitSprite = intersects[0].object as THREE.Sprite;
      const hit = hotspotSpritesRef.current.find((h) => h.sprite === hitSprite);
      if (hit) {
        audioService.playClick();
        onSelectHotspot(hit.id);
      }
    }
  };

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
    targetRotation.current.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotation.current.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetZoom.current = Math.max(3.8, Math.min(9.5, targetZoom.current + e.deltaY * 0.004));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!selectedHotspotId) {
      cameraTarget.current.set(0, 0, 0);
      targetZoom.current = 6.2;
      return;
    }

    const hs = HOTSPOTS_DATA.find((h) => h.id === selectedHotspotId);
    if (hs) {
      cameraTarget.current.set(hs.position[0] * 0.6, hs.position[1] * 0.6, 0);
      targetZoom.current = 5.0;
    }
  }, [selectedHotspotId]);

  const handleReset = () => {
    audioService.playClick();
    targetRotation.current = { x: 0, y: 0 };
    targetZoom.current = 6.2;
    cameraTarget.current.set(0, 0, 0);
    setIsRotating(true);
  };

  const toggleFullscreen = () => {
    audioService.playClick();
    const container = mountRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[580px] bg-[#070b14] overflow-hidden select-none flex flex-col justify-between">
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg pointer-events-auto">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Pulmones — paru-paru manusia
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              audioService.playClick();
              setIsRotating(!isRotating);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md ${
              isRotating
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Putar: {isRotating ? 'Aktif' : 'Diam'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-md"
            title="Kembalikan posisi kamera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Atur ulang</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-md"
            title="Layar penuh"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Layar penuh</span>
          </button>
        </div>
      </div>

      <div
        ref={mountRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing canvas-container"
      />

      <div className="absolute bottom-3 left-0 right-0 z-20 pointer-events-none flex justify-center px-4">
        <div className="bg-slate-900/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 text-[11px] text-slate-400 tracking-wide text-center shadow-lg">
          <span className="hidden md:inline">Seret untuk memutar · Gulir untuk zoom · Ketuk titik untuk membuka</span>
          <span className="inline md:hidden">Seret untuk memutar · Cubit untuk zoom · Ketuk titik untuk membuka</span>
        </div>
      </div>
    </div>
  );
};
