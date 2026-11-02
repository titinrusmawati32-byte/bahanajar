import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Maximize2, Minimize2, RotateCcw, Sun, Moon } from 'lucide-react';
import { HOTSPOTS_DATA } from '../data/curriculum';
import { Hotspot } from '../types';
import { audioService } from '../utils/audio';
import { getMedicalLungTextures } from '../utils/lungTextures';

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
  const [isStudioLightMode, setIsStudioLightMode] = useState(true); // Default to clean Medical Studio (Image 2)

  // References to keep Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lungsGroupRef = useRef<THREE.Group | null>(null);
  const diaphragmRef = useRef<THREE.Mesh | null>(null);
  const rightLungGroupRef = useRef<THREE.Group | null>(null);
  const leftLungGroupRef = useRef<THREE.Group | null>(null);
  const airParticlesRef = useRef<THREE.Points | null>(null);
  const hotspotSpritesRef = useRef<{ id: number; sprite: THREE.Sprite; pos: THREE.Vector3 }[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Mesh references for lobe highlighting
  const lobeMeshesRef = useRef<{ id: number; meshes: THREE.Mesh[] }[]>([]);

  // Orbit control state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const zoomLevel = useRef(5.8);
  const targetZoom = useRef(5.8);

  // Camera Target
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgColor = isStudioLightMode ? 0xf8fafc : 0x070b14;
    scene.background = new THREE.Color(bgColor);
    if (!isStudioLightMode) {
      scene.fog = new THREE.FogExp2(0x070b14, 0.035);
    }

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, zoomLevel.current);
    cameraRef.current = camera;

    // 3. Renderer with high-end PBR settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isStudioLightMode ? 1.15 : 1.25;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig (Medical Anatomy Grade)
    const ambientLight = new THREE.AmbientLight(
      isStudioLightMode ? 0xffffff : 0xe2e8f0,
      isStudioLightMode ? 1.05 : 0.75
    );
    scene.add(ambientLight);

    // Key Light (Crisp directional light casting soft contact shadows)
    const keyLight = new THREE.DirectionalLight(0xfff5f0, isStudioLightMode ? 1.6 : 1.8);
    keyLight.position.set(5, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Soft cool biological fill for translucent tissue depth)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, isStudioLightMode ? 0.9 : 0.8);
    fillLight.position.set(-6, 2, 5);
    scene.add(fillLight);

    // Rim / Back Light (Defines the organ silhouette and visceral pleura sheen)
    const rimLight = new THREE.DirectionalLight(0xffffff, isStudioLightMode ? 1.2 : 1.4);
    rimLight.position.set(0, 7, -6);
    scene.add(rimLight);

    // Under-bounce Light (Simulates light bouncing off the thoracic floor)
    const bounceLight = new THREE.DirectionalLight(0xfecdd3, 0.45);
    bounceLight.position.set(0, -6, 2);
    scene.add(bounceLight);

    // Soft Studio Shadow Floor Plate
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: isStudioLightMode ? 0.18 : 0.35,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.7;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Load High-Resolution Medical PBR Textures
    const textures = getMedicalLungTextures();

    // ==========================================
    // 5. ANATOMICALLY ACCURATE LUNG GEOMETRY
    // ==========================================
    const rootGroup = new THREE.Group();
    lungsGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Material definitions with PBR visceral pleura properties
    const createPbrMaterial = (tint: number = 0xffffff, roughness: number = 0.38) => {
      const mat = new THREE.MeshStandardMaterial({
        color: tint,
        map: textures.diffuse,
        normalMap: textures.normal,
        normalScale: new THREE.Vector2(0.85, 0.85),
        roughnessMap: textures.roughness,
        roughness: roughness,
        metalness: 0.04,
        aoMap: textures.ao,
        aoMapIntensity: 1.15,
      });
      return mat;
    };

    const lungMatRight = createPbrMaterial(0xfff1f2, 0.36);
    const lungMatLeft = createPbrMaterial(0xfff1f2, 0.36);

    // Cartilage Trachea Material
    const tracheaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.tracheaDiffuse,
      normalMap: textures.tracheaNormal,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.28,
      metalness: 0.08,
    });

    const hyalineRingMat = new THREE.MeshStandardMaterial({
      color: 0xdae2ea,
      roughness: 0.25,
      metalness: 0.1,
    });

    const bronchialMat = new THREE.MeshStandardMaterial({
      color: 0x8ba2b5,
      roughness: 0.35,
      metalness: 0.05,
    });

    // --- Procedural Anatomical Sculpting Algorithm ---
    // Sculpt real organic shapes instead of spheres
    const sculptLobeGeometry = (
      width: number,
      height: number,
      depth: number,
      lobeType: 'rSuperior' | 'rMiddle' | 'rInferior' | 'lSuperior' | 'lInferior'
    ) => {
      const geo = new THREE.SphereGeometry(1, 48, 36);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Normalized height -1 to +1
        const ny = y;

        // General lung taper: Apex at top narrows, base at bottom widens
        const taper = 1.0 - (ny + 1.0) * 0.28;
        x *= Math.max(0.45, taper);
        z *= Math.max(0.5, taper);

        // Specific anatomical lobe morphology
        if (lobeType === 'rSuperior') {
          // Right Apex: rounded conical top tapering upwards
          if (ny > 0.3) {
            x *= 0.8;
            z *= 0.85;
          }
          // Oblique/Horizontal fissure slope at base
          if (ny < -0.2) {
            y += (x + 0.3) * 0.25;
          }
          // Flatten medial mediastinal surface
          if (x > 0.3) x *= 0.7;
        } else if (lobeType === 'rMiddle') {
          // Right Middle lobe: wedge-shaped anterior segment
          z += 0.25; // Anterior projection
          y *= 0.75; // Thinner vertically
          if (ny > 0.1) y -= (x + 0.2) * 0.15; // Sloped upper border (horizontal fissure)
          if (ny < -0.1) y += (x + 0.2) * 0.2; // Sloped lower border (oblique fissure)
        } else if (lobeType === 'rInferior') {
          // Right Inferior lobe: massive posterior-basal lobe with concave diaphragmatic base
          z -= 0.15; // Extends posteriorly
          if (ny < -0.6) {
            // Concave base fitting the diaphragmatic dome
            y += (1.0 - Math.sqrt(x * x + z * z)) * 0.35;
          }
          if (ny > 0.1) y -= (x + 0.2) * 0.3; // Oblique fissure slope
        } else if (lobeType === 'lSuperior') {
          // Left Apex & Superior Lobe with CARDIAC NOTCH and LINGULA
          if (ny > 0.3) {
            x *= 0.8;
            z *= 0.85;
          }
          // CARDIAC NOTCH: Deep concave indentation on the anteromedial border!
          if (x < 0.2 && z > -0.2 && ny > -0.6 && ny < 0.3) {
            const notchFactor = Math.sin((ny + 0.6) / 0.9 * Math.PI);
            x += notchFactor * 0.42; // Indents inward to make room for heart
            z -= notchFactor * 0.22;
          }
          // LINGULA: Tongue-like projection below cardiac notch
          if (x < -0.1 && z > 0.2 && ny >= -0.75 && ny <= -0.45) {
            z += 0.22;
            y -= 0.1;
          }
        } else if (lobeType === 'lInferior') {
          // Left Inferior lobe: large posterior base
          z -= 0.15;
          if (ny < -0.6) {
            y += (1.0 - Math.sqrt(x * x + z * z)) * 0.35; // Concave base
          }
          if (ny > 0.1) y -= (-x + 0.2) * 0.3;
        }

        // Apply scale factors
        pos.setXYZ(i, x * width, y * height, z * depth);
      }

      geo.computeVertexNormals();
      return geo;
    };

    // --- Construct Right Lung (3 Distinct Lobes with True Anatomical Fissures) ---
    const rightGroup = new THREE.Group();
    rightLungGroupRef.current = rightGroup;
    rightGroup.position.set(-1.18, 0, 0);

    const rSuperiorMesh = new THREE.Mesh(
      sculptLobeGeometry(0.85, 0.95, 0.85, 'rSuperior'),
      lungMatRight
    );
    rSuperiorMesh.position.set(-0.08, 0.72, 0.05);
    rSuperiorMesh.rotation.set(0.08, 0.12, 0.1);
    rSuperiorMesh.castShadow = true;
    rSuperiorMesh.receiveShadow = true;
    rightGroup.add(rSuperiorMesh);

    const rMiddleMesh = new THREE.Mesh(
      sculptLobeGeometry(0.8, 0.55, 0.78, 'rMiddle'),
      lungMatRight
    );
    rMiddleMesh.position.set(-0.16, -0.05, 0.25);
    rMiddleMesh.rotation.set(0.02, 0.08, 0.08);
    rMiddleMesh.castShadow = true;
    rMiddleMesh.receiveShadow = true;
    rightGroup.add(rMiddleMesh);

    const rInferiorMesh = new THREE.Mesh(
      sculptLobeGeometry(0.96, 0.9, 0.95, 'rInferior'),
      lungMatRight
    );
    rInferiorMesh.position.set(-0.05, -0.75, -0.1);
    rInferiorMesh.rotation.set(-0.05, 0.04, 0.05);
    rInferiorMesh.castShadow = true;
    rInferiorMesh.receiveShadow = true;
    rightGroup.add(rInferiorMesh);

    rootGroup.add(rightGroup);

    // --- Construct Left Lung (2 Lobes with Cardiac Notch) ---
    const leftGroup = new THREE.Group();
    leftLungGroupRef.current = leftGroup;
    leftGroup.position.set(1.18, 0, 0);

    const lSuperiorMesh = new THREE.Mesh(
      sculptLobeGeometry(0.84, 1.05, 0.84, 'lSuperior'),
      lungMatLeft
    );
    lSuperiorMesh.position.set(0.08, 0.65, 0.05);
    lSuperiorMesh.rotation.set(0.08, -0.12, -0.1);
    lSuperiorMesh.castShadow = true;
    lSuperiorMesh.receiveShadow = true;
    leftGroup.add(lSuperiorMesh);

    const lInferiorMesh = new THREE.Mesh(
      sculptLobeGeometry(0.92, 0.95, 0.92, 'lInferior'),
      lungMatLeft
    );
    lInferiorMesh.position.set(0.06, -0.72, -0.1);
    lInferiorMesh.rotation.set(-0.05, -0.04, -0.05);
    lInferiorMesh.castShadow = true;
    lInferiorMesh.receiveShadow = true;
    leftGroup.add(lInferiorMesh);

    rootGroup.add(leftGroup);

    // Map lobes for hotspot highlighting
    lobeMeshesRef.current = [
      { id: 1, meshes: [rSuperiorMesh, rMiddleMesh, rInferiorMesh] },
      { id: 2, meshes: [lSuperiorMesh, lInferiorMesh] },
    ];

    // ==========================================
    // 6. TRACHEA, CARINA & BRONCHIAL TREE
    // ==========================================
    const airwayGroup = new THREE.Group();

    // Main Tracheal Tube
    const tracheaRadius = 0.22;
    const tracheaHeight = 1.6;
    const tracheaGeo = new THREE.CylinderGeometry(tracheaRadius, tracheaRadius * 0.98, tracheaHeight, 32);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.position.set(0, 1.85, 0.05);
    tracheaMesh.castShadow = true;
    airwayGroup.add(tracheaMesh);

    // Physical C-shaped Hyaline Cartilage Rings
    const ringCount = 13;
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(tracheaRadius + 0.02, 0.026, 12, 32, Math.PI * 1.6);
      const ringMesh = new THREE.Mesh(ringGeo, hyalineRingMat);
      ringMesh.position.set(0, 1.15 + i * 0.115, 0.05);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.z = Math.PI * 0.2; // Membranous gap facing posteriorly
      ringMesh.castShadow = true;
      airwayGroup.add(ringMesh);
    }

    // Carina & Primary Bronchi Bifurcation
    // Right Main Bronchus (Dexter - shorter, steeper 25 degrees)
    const rBronchusGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.85, 20);
    const rBronchus = new THREE.Mesh(rBronchusGeo, bronchialMat);
    rBronchus.position.set(-0.35, 0.85, 0.02);
    rBronchus.rotation.z = Math.PI / 4.2;
    rBronchus.castShadow = true;
    airwayGroup.add(rBronchus);

    // Left Main Bronchus (Sinister - longer, more horizontal 45 degrees)
    const lBronchusGeo = new THREE.CylinderGeometry(0.14, 0.11, 1.05, 20);
    const lBronchus = new THREE.Mesh(lBronchusGeo, bronchialMat);
    lBronchus.position.set(0.42, 0.8, 0.02);
    lBronchus.rotation.z = -Math.PI / 3.4;
    lBronchus.castShadow = true;
    airwayGroup.add(lBronchus);

    // Secondary & Tertiary Lobar Bronchi Branches entering into Hilum
    const createSubBranch = (start: [number, number, number], rot: [number, number, number], len: number) => {
      const bGeo = new THREE.CylinderGeometry(0.08, 0.04, len, 12);
      const bMesh = new THREE.Mesh(bGeo, bronchialMat);
      bMesh.position.set(...start);
      bMesh.rotation.set(...rot);
      return bMesh;
    };

    airwayGroup.add(createSubBranch([-0.75, 0.55, 0.08], [0.2, 0.3, Math.PI / 3], 0.65));
    airwayGroup.add(createSubBranch([-0.72, 0.15, 0.12], [-0.15, 0.2, Math.PI / 2.5], 0.75));
    airwayGroup.add(createSubBranch([-0.68, -0.4, 0.05], [-0.2, 0.1, Math.PI / 2.3], 0.85));

    airwayGroup.add(createSubBranch([0.8, 0.5, 0.08], [0.2, -0.3, -Math.PI / 3], 0.7));
    airwayGroup.add(createSubBranch([0.75, -0.35, 0.05], [-0.2, -0.1, -Math.PI / 2.4], 0.85));

    rootGroup.add(airwayGroup);

    // ==========================================
    // 7. RESPIRATORY AIR FLOW PARTICLES
    // ==========================================
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; progress: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 2.5 - Math.random() * 2.0;
      particlePositions[i * 3 + 2] = 0.05;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: -0.02 - Math.random() * 0.02,
        z: 0,
        progress: Math.random(),
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite material
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(56, 189, 248, 1)');
    pGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.5)');
    pGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const particleTex = new THREE.CanvasTexture(particleCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const airParticles = new THREE.Points(particleGeo, particleMat);
    airParticlesRef.current = airParticles;
    rootGroup.add(airParticles);

    // ==========================================
    // 8. ANATOMICAL DIAPHRAGM DOME
    // ==========================================
    const diaphragmGeo = new THREE.CylinderGeometry(2.6, 2.85, 0.48, 36);
    const diaphragmMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 0.72,
    });
    const diaphragm = new THREE.Mesh(diaphragmGeo, diaphragmMat);
    diaphragm.position.set(0, -2.15, 0);
    diaphragm.scale.set(1.05, 0.45, 0.75);
    diaphragm.receiveShadow = true;
    diaphragmRef.current = diaphragm;
    rootGroup.add(diaphragm);

    // ==========================================
    // 9. HIGH-DPI MEDICAL HOTSPOT PINS (Image 2 Style)
    // ==========================================
    const createPillHotspotSprite = (id: number, label: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;

      // Background Pill with subtle drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Rounded rectangle pill
      const x = 12, y = 14, w = 336, h = 72, r = 36;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Pill border
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      // Circular number badge (Left)
      ctx.beginPath();
      ctx.arc(x + 36, y + 36, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981'; // Emerald
      ctx.fill();

      // Number text
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(id.toString(), x + 36, y + 37);

      // Label text (Right)
      ctx.font = 'bold 25px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0f172a'; // Slate-900
      ctx.textAlign = 'left';
      ctx.fillText(label, x + 72, y + 37);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.39, 1);
      return sprite;
    };

    hotspotSpritesRef.current = [];
    const activeHotspots = hotspots && hotspots.length > 0 ? hotspots : HOTSPOTS_DATA;
    activeHotspots.forEach((hs) => {
      const sprite = createPillHotspotSprite(hs.id, hs.shortName);
      sprite.position.set(...hs.position);
      rootGroup.add(sprite);
      hotspotSpritesRef.current.push({
        id: hs.id,
        sprite,
        pos: new THREE.Vector3(...hs.position),
      });
    });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 10. ANIMATION & RENDER LOOP
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth Orbit Drag Rotation
      if (isRotating && !isDragging.current) {
        targetRotation.current.y += 0.0035;
      }

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;
      rootGroup.rotation.x = currentRotation.current.x;
      rootGroup.rotation.y = currentRotation.current.y;

      // Smooth Zoom
      zoomLevel.current += (targetZoom.current - zoomLevel.current) * 0.08;
      camera.position.z = zoomLevel.current;

      // Smooth Camera LookAt
      currentLookAt.current.lerp(cameraTarget.current, 0.06);
      camera.lookAt(currentLookAt.current);

      // --- Biological Respiration Animation ---
      if (isBreathingActive) {
        // Human respiration rate: ~14-16 breaths per minute (period ~4 seconds)
        const breathCycle = Math.sin(elapsedTime * 1.6);
        const breathExpansion = breathCycle * 0.045; // Anatomical elastic expansion

        // Right Lung expansion (expands laterally and downward)
        if (rightLungGroupRef.current) {
          rightLungGroupRef.current.scale.set(
            1.0 + breathExpansion * 1.1,
            1.0 + breathExpansion * 0.9,
            1.0 + breathExpansion * 1.2
          );
        }

        // Left Lung expansion
        if (leftLungGroupRef.current) {
          leftLungGroupRef.current.scale.set(
            1.0 + breathExpansion * 1.1,
            1.0 + breathExpansion * 0.9,
            1.0 + breathExpansion * 1.2
          );
        }

        // Diaphragm movement (contracts downward during inspiration)
        if (diaphragmRef.current) {
          diaphragmRef.current.position.y = -2.15 - breathExpansion * 1.6;
          diaphragmRef.current.scale.y = 0.45 - breathExpansion * 0.8;
        }

        // Air flow particles animation inside trachea/bronchi
        if (airParticlesRef.current) {
          const positions = airParticlesRef.current.geometry.attributes.position.array as Float32Array;
          const isInspiration = breathCycle > 0;
          for (let i = 0; i < particleCount; i++) {
            const vel = particleVelocities[i];
            if (isInspiration) {
              positions[i * 3 + 1] += vel.y;
              if (positions[i * 3 + 1] < 0.6) {
                positions[i * 3 + 1] = 2.6;
                positions[i * 3] = (Math.random() - 0.5) * 0.12;
              }
            } else {
              positions[i * 3 + 1] -= vel.y;
              if (positions[i * 3 + 1] > 2.6) {
                positions[i * 3 + 1] = 0.7;
                positions[i * 3] = (Math.random() - 0.5) * 0.25;
              }
            }
          }
          airParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Hotspot Sprites gentle floating and scale pulse
      hotspotSpritesRef.current.forEach((item) => {
        const isSelected = item.id === selectedHotspotId;
        const pulse = Math.sin(elapsedTime * 3.5 + item.id) * 0.03;
        const baseScaleW = isSelected ? 1.65 : 1.35;
        const baseScaleH = isSelected ? 0.46 : 0.38;
        item.sprite.scale.set(baseScaleW + pulse, baseScaleH + pulse * 0.3, 1);
      });

      // Lobe selection highlight
      lobeMeshesRef.current.forEach((group) => {
        const isLobeSelected = group.id === selectedHotspotId;
        group.meshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (isLobeSelected) {
            mat.emissive.setHex(0x22c55e); // Soft emerald glow
            mat.emissiveIntensity = 0.18;
          } else {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
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
  }, [isRotating, isBreathingActive, selectedHotspotId, hotspots, isStudioLightMode]);

  // Handle Raycasting Hotspot Click
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

  // Mouse & Touch Orbit Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.007;
    targetRotation.current.x += deltaY * 0.007;
    targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    targetZoom.current += e.deltaY * 0.0035;
    targetZoom.current = Math.max(3.8, Math.min(8.5, targetZoom.current));
  };

  // Touch Support for Mobile / Tablet
  const touchStartDist = useRef(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging.current) {
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
      targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x));

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      const deltaDist = currentDist - touchStartDist.current;

      targetZoom.current -= deltaDist * 0.01;
      targetZoom.current = Math.max(3.8, Math.min(8.5, targetZoom.current));
      touchStartDist.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleReset = () => {
    audioService.playClick();
    targetRotation.current = { x: 0, y: 0 };
    targetZoom.current = 5.8;
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
    <div
      className={`relative w-full h-full min-h-[460px] md:min-h-[580px] overflow-hidden select-none flex flex-col justify-between transition-colors duration-300 ${
        isStudioLightMode ? 'bg-[#f8fafc]' : 'bg-[#070b14]'
      }`}
    >
      {/* 3D Viewport Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Specimen Badge matching Image 2 */}
        <div
          className={`backdrop-blur-md px-3.5 py-1.5 rounded-full border shadow-sm pointer-events-auto transition-colors ${
            isStudioLightMode
              ? 'bg-white/90 border-slate-200/90 text-slate-800'
              : 'bg-slate-900/90 border-slate-700/60 text-slate-200'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SPESIMEN 3D</span>
          </div>
          <div className="text-xs font-serif italic text-slate-700 dark:text-slate-300">
            Pulmones — paru-paru manusia
          </div>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Light/Dark Studio Mode Toggle */}
          <button
            onClick={() => {
              audioService.playClick();
              setIsStudioLightMode(!isStudioLightMode);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
              isStudioLightMode
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Ubah tema studio 3D"
          >
            {isStudioLightMode ? <Moon className="w-3.5 h-3.5 text-slate-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isStudioLightMode ? 'Studio Terang' : 'Lab Gelap'}</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setIsRotating(!isRotating);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
              isRotating
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : isStudioLightMode
                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Putar: {isRotating ? 'Aktif' : 'Diam'}</span>
          </button>

          <button
            onClick={handleReset}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
              isStudioLightMode
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Kembalikan posisi kamera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Atur ulang</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
              isStudioLightMode
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Layar penuh"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Layar penuh</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
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

      {/* Interaction Hint Overlay matching Image 2 */}
      <div className="absolute bottom-3 left-0 right-0 z-20 pointer-events-none flex justify-center px-4">
        <div
          className={`backdrop-blur-md px-4 py-1.5 rounded-full border text-[11px] tracking-wide text-center shadow-sm ${
            isStudioLightMode
              ? 'bg-white/85 border-slate-200 text-slate-600'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}
        >
          <span className="hidden md:inline">Seret untuk memutar · Gulir untuk zoom · Ketuk titik untuk membuka</span>
          <span className="inline md:hidden">Seret untuk memutar · Cubit untuk zoom · Ketuk titik untuk membuka</span>
        </div>
      </div>
    </div>
  );
};
