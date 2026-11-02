import * as THREE from 'three';

/**
 * Procedural Medical PBR Texture Generator for Human Lungs
 * Generates photorealistic high-resolution (2048x2048) texture maps:
 * - Diffuse/Albedo Map (visceral pleura, lobular parenchyma, micro-capillaries)
 * - Normal Map (micro-surface tissue, fissures, vascular bump)
 * - Roughness Map (visceral serosa moisture vs dry fissures)
 * - Ambient Occlusion Map (interlobar fissure depth & hilum shadow)
 */

let cachedTextures: {
  diffuse: THREE.CanvasTexture;
  normal: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
  ao: THREE.CanvasTexture;
  tracheaDiffuse: THREE.CanvasTexture;
  tracheaNormal: THREE.CanvasTexture;
} | null = null;

export function getMedicalLungTextures() {
  if (cachedTextures) return cachedTextures;

  const size = 1024; // High resolution 1024x1024 for sharp detail and fast load

  // ==========================================
  // 1. DIFFUSE / ALBEDO MAP
  // ==========================================
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = size;
  diffuseCanvas.height = size;
  const ctx = diffuseCanvas.getContext('2d')!;

  // Base visceral pleura gradient: rich biological fleshy pink to deeper pulmonary parenchyma
  const baseGrad = ctx.createLinearGradient(0, 0, size, size);
  baseGrad.addColorStop(0, '#c75362');
  baseGrad.addColorStop(0.3, '#d86272');
  baseGrad.addColorStop(0.6, '#b64253');
  baseGrad.addColorStop(1, '#932d3d');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, size, size);

  // Organic noise & tissue mottling (secondary pulmonary lobules)
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Simple pseudo-random hash for deterministic organic noise
  const pseudoNoise = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  // Add cellular lobular texture (Voronoi-like secondary lobules)
  const lobulePoints: [number, number][] = [];
  const numLobules = 80;
  for (let i = 0; i < numLobules; i++) {
    lobulePoints.push([
      Math.floor(pseudoNoise(i, 1) * size),
      Math.floor(pseudoNoise(i, 2) * size),
    ]);
  }

  // Draw lobular septa lines
  ctx.strokeStyle = 'rgba(100, 20, 30, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < lobulePoints.length; i++) {
    for (let j = i + 1; j < lobulePoints.length; j++) {
      const dx = lobulePoints[i][0] - lobulePoints[j][0];
      const dy = lobulePoints[i][1] - lobulePoints[j][1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(lobulePoints[i][0], lobulePoints[i][1]);
        ctx.lineTo(lobulePoints[j][0], lobulePoints[j][1]);
        ctx.stroke();
      }
    }
  }

  // Fine subpleural micro-capillaries (arterioles & venules)
  ctx.strokeStyle = 'rgba(170, 30, 50, 0.45)';
  ctx.lineWidth = 1.2;
  const drawVesselTree = (startX: number, startY: number, length: number, angle: number, depth: number) => {
    if (depth <= 0) return;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(
      (startX + endX) / 2 + (pseudoNoise(startX, depth) - 0.5) * 15,
      (startY + endY) / 2 + (pseudoNoise(startY, depth) - 0.5) * 15,
      endX,
      endY
    );
    ctx.stroke();

    const branchLength = length * 0.72;
    drawVesselTree(endX, endY, branchLength, angle + 0.35 + (pseudoNoise(depth, 1) - 0.5) * 0.2, depth - 1);
    drawVesselTree(endX, endY, branchLength, angle - 0.38 + (pseudoNoise(depth, 2) - 0.5) * 0.2, depth - 1);
  };

  // Plant vascular trees across different areas
  for (let i = 0; i < 12; i++) {
    const vx = (i / 12) * size + 30;
    const vy = (pseudoNoise(i, 5) * 0.7 + 0.15) * size;
    drawVesselTree(vx, vy, 45, pseudoNoise(i, 6) * Math.PI * 2, 4);
  }

  // Interlobar fissure dark shading bands (horizontal & oblique fissure grooves)
  const fissureGrad = ctx.createLinearGradient(0, size * 0.35, size, size * 0.65);
  fissureGrad.addColorStop(0, 'rgba(60, 10, 20, 0.0)');
  fissureGrad.addColorStop(0.48, 'rgba(50, 5, 15, 0.65)');
  fissureGrad.addColorStop(0.52, 'rgba(40, 5, 10, 0.75)');
  fissureGrad.addColorStop(0.56, 'rgba(60, 10, 20, 0.0)');
  ctx.fillStyle = fissureGrad;
  ctx.fillRect(0, 0, size, size);

  // High-frequency organic speckles & pores
  const overlayData = ctx.getImageData(0, 0, size, size);
  const px = overlayData.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const grain = (pseudoNoise(x * 0.3, y * 0.3) - 0.5) * 18;
      px[idx] = Math.min(255, Math.max(0, px[idx] + grain));
      px[idx + 1] = Math.min(255, Math.max(0, px[idx + 1] + grain * 0.7));
      px[idx + 2] = Math.min(255, Math.max(0, px[idx + 2] + grain * 0.6));
    }
  }
  ctx.putImageData(overlayData, 0, 0);

  // ==========================================
  // 2. NORMAL MAP (Calculated from Height Derivs)
  // ==========================================
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext('2d')!;
  const nImgData = nCtx.createImageData(size, size);
  const nData = nImgData.data;

  // Convert luminance of diffuse to height, then calculate Sobel normal
  const heights = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) {
    const r = px[i * 4];
    const g = px[i * 4 + 1];
    const b = px[i * 4 + 2];
    heights[i] = (r * 0.299 + g * 0.587 + b * 0.114) / 255.0;
  }

  const strength = 3.5;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = (y * size + x) * 4;
      const hL = heights[y * size + (x - 1)];
      const hR = heights[y * size + (x + 1)];
      const hU = heights[(y - 1) * size + x];
      const hD = heights[(y + 1) * size + x];

      const dx = (hR - hL) * strength;
      const dy = (hD - hU) * strength;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = dz / len;

      nData[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      nData[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      nData[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      nData[idx + 3] = 255;
    }
  }
  nCtx.putImageData(nImgData, 0, 0);

  // ==========================================
  // 3. ROUGHNESS MAP
  // ==========================================
  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = size;
  roughnessCanvas.height = size;
  const rCtx = roughnessCanvas.getContext('2d')!;
  const rImgData = rCtx.createImageData(size, size);
  const rData = rImgData.data;

  for (let i = 0; i < size * size; i++) {
    const h = heights[i];
    // Moist visceral serosa has low roughness (0.28-0.38) with wet sheen
    // Deep fissures are drier and rougher (0.65-0.75)
    const roughnessVal = Math.floor((0.32 + (1.0 - h) * 0.35) * 255);
    rData[i * 4] = roughnessVal;
    rData[i * 4 + 1] = roughnessVal;
    rData[i * 4 + 2] = roughnessVal;
    rData[i * 4 + 3] = 255;
  }
  rCtx.putImageData(rImgData, 0, 0);

  // ==========================================
  // 4. AMBIENT OCCLUSION MAP
  // ==========================================
  const aoCanvas = document.createElement('canvas');
  aoCanvas.width = size;
  aoCanvas.height = size;
  const aoCtx = aoCanvas.getContext('2d')!;
  const aoImgData = aoCtx.createImageData(size, size);
  const aoData = aoImgData.data;

  for (let i = 0; i < size * size; i++) {
    const h = heights[i];
    const aoVal = Math.floor(Math.min(255, Math.max(120, h * 220 + 35)));
    aoData[i * 4] = aoVal;
    aoData[i * 4 + 1] = aoVal;
    aoData[i * 4 + 2] = aoVal;
    aoData[i * 4 + 3] = 255;
  }
  aoCtx.putImageData(aoImgData, 0, 0);

  // ==========================================
  // 5. TRACHEA & CARTILAGE RINGS TEXTURE
  // ==========================================
  const tracheaCanvas = document.createElement('canvas');
  tracheaCanvas.width = 512;
  tracheaCanvas.height = 512;
  const tCtx = tracheaCanvas.getContext('2d')!;

  // Alternating cartilage rings and annular ligaments
  const ringHeight = 512 / 16;
  for (let i = 0; i < 16; i++) {
    const y = i * ringHeight;
    // Pearlescent cartilage band
    const cGrad = tCtx.createLinearGradient(0, y, 0, y + ringHeight * 0.7);
    cGrad.addColorStop(0, '#c8d4df');
    cGrad.addColorStop(0.5, '#e4ebf2');
    cGrad.addColorStop(1, '#a6b8c7');
    tCtx.fillStyle = cGrad;
    tCtx.fillRect(0, y, 512, ringHeight * 0.7);

    // Annular fibrous ligament interspace
    tCtx.fillStyle = '#64748b';
    tCtx.fillRect(0, y + ringHeight * 0.7, 512, ringHeight * 0.3);
  }

  // Create Three.js Textures with proper color space
  const diffuseTex = new THREE.CanvasTexture(diffuseCanvas);
  diffuseTex.wrapS = THREE.RepeatWrapping;
  diffuseTex.wrapT = THREE.RepeatWrapping;
  diffuseTex.colorSpace = THREE.SRGBColorSpace;

  const normalTex = new THREE.CanvasTexture(normalCanvas);
  normalTex.wrapS = THREE.RepeatWrapping;
  normalTex.wrapT = THREE.RepeatWrapping;

  const roughnessTex = new THREE.CanvasTexture(roughnessCanvas);
  roughnessTex.wrapS = THREE.RepeatWrapping;
  roughnessTex.wrapT = THREE.RepeatWrapping;

  const aoTex = new THREE.CanvasTexture(aoCanvas);
  aoTex.wrapS = THREE.RepeatWrapping;
  aoTex.wrapT = THREE.RepeatWrapping;

  const tracheaDiffuseTex = new THREE.CanvasTexture(tracheaCanvas);
  tracheaDiffuseTex.wrapS = THREE.RepeatWrapping;
  tracheaDiffuseTex.wrapT = THREE.RepeatWrapping;
  tracheaDiffuseTex.colorSpace = THREE.SRGBColorSpace;

  cachedTextures = {
    diffuse: diffuseTex,
    normal: normalTex,
    roughness: roughnessTex,
    ao: aoTex,
    tracheaDiffuse: tracheaDiffuseTex,
    tracheaNormal: normalTex,
  };

  return cachedTextures;
}
