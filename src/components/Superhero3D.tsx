'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type SuperheroGender = 'MALE' | 'FEMALE' | 'NON_BINARY';

export interface Superhero3DProps {
  gender?: SuperheroGender | string;
  level: number;
  height?: string | number;
  width?: string | number;
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  suitTheme?: 'CRIMSON' | 'CYBER' | 'SHADOW' | 'SOLAR';
  showControls?: boolean;
  equippedWeapon?: 'KATANA' | 'STAFF' | 'SHIELD' | 'NONE';
  onGenderChange?: (gender: SuperheroGender) => void;
}

export const SUIT_THEMES = {
  CRIMSON: {
    name: 'Crimson Avenger',
    surface: 0x991b1b, // Deep Metallic Red
    joints: 0xd97706,  // Burnished Gold Trim
    glow: 0x38bdf8,    // Cyan Arc Reactor
    cape: 0x7f1d1d,
  },
  CYBER: {
    name: 'Cyber Neon',
    surface: 0x0f172a, // Carbon Stealth Navy
    joints: 0x06b6d4,  // Electric Cyan Accents
    glow: 0x22d3ee,    // Bright Cyan Plasma
    cape: 0x0284c7,
  },
  SHADOW: {
    name: 'Shadow Knight',
    surface: 0x18181b, // Obsidian Black
    joints: 0x7c3aed,  // Royal Violet Trim
    glow: 0xa855f7,    // Violet Void
    cape: 0x3b0764,
  },
  SOLAR: {
    name: 'Solar Paragon',
    surface: 0xe2e8f0, // Platinum White Armor
    joints: 0xf59e0b,  // Radiant Sun Gold
    glow: 0xfbbf24,    // Golden Solar Flare
    cape: 0xb45309,
  },
};

export const Superhero3D: React.FC<Superhero3DProps> = ({
  gender = 'MALE',
  level,
  height = '100%',
  width = '100%',
  className = '',
  interactive = true,
  autoRotate: initialAutoRotate = true,
  suitTheme: initialSuitTheme = 'CRIMSON',
  showControls = true,
  equippedWeapon = 'KATANA',
  onGenderChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialGender: SuperheroGender =
    gender === 'FEMALE' ? 'FEMALE' : gender === 'NON_BINARY' ? 'NON_BINARY' : 'MALE';
  const [currentGender, setCurrentGender] = useState<SuperheroGender>(initialGender);
  const [suitTheme, setSuitTheme] = useState<'CRIMSON' | 'CYBER' | 'SHADOW' | 'SOLAR'>(initialSuitTheme);
  const [activeWeapon, setActiveWeapon] = useState<'KATANA' | 'STAFF' | 'SHIELD' | 'NONE'>(equippedWeapon);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [cameraView, setCameraView] = useState<'FULL' | 'BUST'>('FULL');
  const [animState, setAnimState] = useState<'idle' | 'walk' | 'run' | 'victory' | 'wave'>('idle');

  useEffect(() => {
    if (gender) {
      const g: SuperheroGender = gender === 'FEMALE' ? 'FEMALE' : gender === 'NON_BINARY' ? 'NON_BINARY' : 'MALE';
      setCurrentGender(g);
    }
  }, [gender]);

  // Evolution stage: 1, 2, 3, or 4
  const stage = level >= 10 ? 4 : level >= 6 ? 3 : level >= 3 ? 2 : 1;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // Initial camera position (perfectly centered on model)
    const targetCamZ = cameraView === 'BUST' ? 2.1 : 3.8;
    const targetCamY = cameraView === 'BUST' ? 0.6 : 0.05;
    camera.position.set(0, targetCamY, targetCamZ);
    camera.lookAt(0, cameraView === 'BUST' ? 0.5 : 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Cinematic Studio 3-Point Lighting
    // Key Light (White directional with soft shadow)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Rim Backlight (Cool Cyan edge lighting for dramatic superhero rim)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.4);
    rimLight.position.set(-3.0, 3.0, -3.5);
    scene.add(rimLight);

    // Fill Light (Soft neutral fill - brightened for crisp visibility in all themes)
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.2);
    fillLight.position.set(-3.0, 1.5, 3.5);
    scene.add(fillLight);

    // Frontal Chest/Face Spotlight
    const frontLight = new THREE.DirectionalLight(0xecfeff, 1.8);
    frontLight.position.set(0, 2.0, 4.0);
    scene.add(frontLight);

    // Ambient bounce light
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    // 3. Materials
    const theme = SUIT_THEMES[suitTheme];

    const surfaceMat = new THREE.MeshStandardMaterial({
      color: theme.surface,
      roughness: 0.32,
      metalness: 0.65,
    });

    const jointsMat = new THREE.MeshStandardMaterial({
      color: theme.joints,
      roughness: 0.22,
      metalness: 0.85,
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: theme.glow,
      emissive: theme.glow,
      emissiveIntensity: 3.2,
      roughness: 0.1,
      metalness: 0.1,
    });

    const capeMat = new THREE.MeshStandardMaterial({
      color: theme.cape,
      roughness: 0.6,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    // 4. Character & Stage Groups
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Pedestal Platform
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.18, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.35,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.3;
    pedestal.receiveShadow = true;
    stageGroup.add(pedestal);

    // Neon Stage Glow Ring
    const ringGeo = new THREE.TorusGeometry(1.35, 0.03, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, glowMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.21;
    stageGroup.add(ringMesh);

    // 5. Load Real 3D Rigged Humanoid Model
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let capeMesh: THREE.Mesh | null = null;
    let orbitalRings: THREE.Group | null = null;
    let chestReactor: THREE.Mesh | null = null;
    let floatingHalo: THREE.Mesh | null = null;
    let floatingOrbs: THREE.Group | null = null;

    // Distinct Heroic Silhouette & Muscular bulk scaling by level & gender
    const bulk = stage === 1 ? 0.92 : stage === 2 ? 1.0 : stage === 3 ? 1.15 : 1.3;
    const widthScale =
      currentGender === 'FEMALE'
        ? 0.82 * bulk
        : currentGender === 'NON_BINARY'
        ? 0.96 * bulk
        : 1.18 * bulk;
    const depthScale =
      currentGender === 'FEMALE'
        ? 0.84 * bulk
        : currentGender === 'NON_BINARY'
        ? 0.93 * bulk
        : 1.12 * bulk;

    loader.load(
      '/hero-model.glb',
      (gltf) => {
        const model = gltf.scene;

        // Calculate model's natural bounds
        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);

        // Target height = 2.4 units so the character fits from y = -1.2 to +1.2
        const targetHeight = 2.4;
        const uniformScale = (targetHeight / rawSize.y) * bulk;

        model.scale.set(uniformScale * widthScale, uniformScale, uniformScale * depthScale);

        // Recalculate scaled box and center exactly at (0, 0, 0)
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        model.position.x = -scaledCenter.x;
        model.position.y = -scaledCenter.y;
        model.position.z = -scaledCenter.z;

        // Align pedestal exactly to the feet
        pedestal.position.y = -1.2 - 0.09;
        ringMesh.position.y = -1.2;

        // Apply realistic PBR suit materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.name === 'Beta_Joints') {
              mesh.material = jointsMat;
            } else {
              mesh.material = surfaceMat;
            }
          }
        });

        characterGroup.add(model);

        // Setup Skeletal Animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);

          gltf.animations.forEach((clip, i) => {
            const name = clip.name.toLowerCase();
            const action = mixer!.clipAction(clip);
            if (name.includes('idle') || i === 2) actions['idle'] = action;
            else if (name.includes('walk') || i === 6) actions['walk'] = action;
            else if (name.includes('run') || i === 3) actions['run'] = action;
            else if (name.includes('agree') || i === 0) actions['victory'] = action;
            else if (name.includes('wave') || i === 7) actions['wave'] = action;
            actions[name] = action;
          });

          // Play current animation
          const activeAction = actions[animState] || actions['idle'] || mixer.clipAction(gltf.animations[2]);
          if (activeAction) activeAction.play();
        }

        // Add Superhero Additions:
        // A. Glowing Arc Reactor on Chest
        const reactorGeo = new THREE.CylinderGeometry(0.08 * bulk, 0.08 * bulk, 0.04, 20);
        chestReactor = new THREE.Mesh(reactorGeo, glowMat);
        chestReactor.rotation.x = Math.PI / 2;
        chestReactor.position.set(0, 0.35 * bulk, 0.22 * depthScale);
        characterGroup.add(chestReactor);

        // B. Vibranium Armor Pauldrons (Stage 2+)
        if (stage >= 2) {
          const pauldronGeo = new THREE.SphereGeometry(0.16 * bulk, 16, 16);
          pauldronGeo.scale(1.3, 0.8, 1.0);

          const leftPauldron = new THREE.Mesh(pauldronGeo, jointsMat);
          leftPauldron.position.set(-0.52 * widthScale, 0.62 * bulk, 0);
          leftPauldron.castShadow = true;

          const rightPauldron = new THREE.Mesh(pauldronGeo, jointsMat);
          rightPauldron.position.set(0.52 * widthScale, 0.62 * bulk, 0);
          rightPauldron.castShadow = true;

          characterGroup.add(leftPauldron, rightPauldron);
        }

        // C. Flowing Animated Superhero Cape (Stage 2+)
        if (stage >= 2) {
          const capeGeo = new THREE.PlaneGeometry(0.82 * widthScale, 1.7 * bulk, 16, 16);
          capeMesh = new THREE.Mesh(capeGeo, capeMat);
          capeMesh.position.set(0, 0.55 * bulk, -0.22 * depthScale);
          capeMesh.castShadow = true;
          characterGroup.add(capeMesh);
        }

        // D. Cosmic Titan Wings & Orbital Rings (Stage 4, Level 10+)
        if (stage >= 4) {
          const wingsGroup = new THREE.Group();
          const wingShape = new THREE.Shape();
          wingShape.moveTo(0, 0);
          wingShape.lineTo(0.5, 1.1);
          wingShape.lineTo(1.3, 0.9);
          wingShape.lineTo(0.7, 0.4);
          wingShape.lineTo(1.4, 0.2);
          wingShape.lineTo(0.3, -0.4);
          wingShape.closePath();

          const wingGeo = new THREE.ShapeGeometry(wingShape);
          const wingL = new THREE.Mesh(wingGeo, glowMat);
          wingL.position.set(-0.28 * widthScale, 0.45 * bulk, -0.25);
          wingL.rotation.y = Math.PI - 0.25;

          const wingR = new THREE.Mesh(wingGeo, glowMat);
          wingR.position.set(0.28 * widthScale, 0.45 * bulk, -0.25);
          wingR.rotation.y = 0.25;

          wingsGroup.add(wingL, wingR);
          characterGroup.add(wingsGroup);

          // Orbital Starlight Rings
          orbitalRings = new THREE.Group();
          for (let i = 0; i < 2; i++) {
            const orbRingGeo = new THREE.TorusGeometry(1.1 + i * 0.25, 0.015, 8, 48);
            const orbMesh = new THREE.Mesh(orbRingGeo, glowMat);
            orbMesh.rotation.x = Math.PI / (3 + i);
            orbMesh.rotation.y = Math.PI / 4;
            orbitalRings.add(orbMesh);
          }
          orbitalRings.position.y = 0.3;
          characterGroup.add(orbitalRings);
        }

        // E. 3D Weapon Attachments
        if (activeWeapon !== 'NONE') {
          const weaponGroup = new THREE.Group();
          if (activeWeapon === 'KATANA') {
            const hiltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.26, 12);
            const hiltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
            const hilt = new THREE.Mesh(hiltGeo, hiltMat);

            const guardGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.012, 16);
            const guard = new THREE.Mesh(guardGeo, jointsMat);
            guard.position.y = 0.13;

            const bladeGeo = new THREE.BoxGeometry(0.032, 0.95, 0.01);
            const blade = new THREE.Mesh(bladeGeo, glowMat);
            blade.position.y = 0.13 + 0.475;

            const katana = new THREE.Group();
            katana.add(hilt, guard, blade);
            katana.rotation.z = -0.35;
            katana.rotation.x = 0.15;
            katana.position.set(0.52 * widthScale, 0.08, 0.15);
            weaponGroup.add(katana);
          } else if (activeWeapon === 'SHIELD') {
            const shieldGeo = new THREE.CylinderGeometry(0.26, 0.12, 0.6, 6);
            const shield = new THREE.Mesh(shieldGeo, jointsMat);
            shield.rotation.x = Math.PI / 2;
            const shieldCoreGeo = new THREE.SphereGeometry(0.07, 16, 16);
            const shieldCore = new THREE.Mesh(shieldCoreGeo, glowMat);
            shieldCore.position.y = 0.15;
            shield.add(shieldCore);
            shield.position.set(-0.52 * widthScale, 0.18, 0.15);
            shield.rotation.y = 0.4;
            weaponGroup.add(shield);
          } else if (activeWeapon === 'STAFF') {
            const staffGeo = new THREE.CylinderGeometry(0.02, 0.016, 1.7, 12);
            const staff = new THREE.Mesh(staffGeo, jointsMat);
            const orbGeo = new THREE.SphereGeometry(0.07, 16, 16);
            const orb = new THREE.Mesh(orbGeo, glowMat);
            orb.position.y = 0.88;
            staff.add(orb);
            staff.position.set(0.52 * widthScale, 0.08, 0.15);
            weaponGroup.add(staff);
          }
          characterGroup.add(weaponGroup);
        }

        // F. Distinct Gender Visual Archetype Features
        const genderFeatures = new THREE.Group();

        if (currentGender === 'FEMALE') {
          // 1. Golden Superhero Diadem / Tiara
          const tiaraGeo = new THREE.TorusGeometry(0.18, 0.014, 8, 32, Math.PI * 0.7);
          const tiara = new THREE.Mesh(tiaraGeo, jointsMat);
          tiara.rotation.x = -Math.PI / 2 + 0.22;
          tiara.rotation.z = Math.PI / 7;
          tiara.position.set(0, 0.98, 0.05);

          const gemGeo = new THREE.OctahedronGeometry(0.045);
          const gem = new THREE.Mesh(gemGeo, glowMat);
          gem.position.set(0, 1.02, 0.17);
          tiara.add(gem);
          genderFeatures.add(tiara);

          // 2. Twin Cyber Ponytails / Flowing Energy Strands
          for (const side of [-1, 1]) {
            const ponytailGroup = new THREE.Group();
            for (let s = 0; s < 4; s++) {
              const segGeo = new THREE.CylinderGeometry(0.026 - s * 0.005, 0.022 - s * 0.005, 0.18, 8);
              const seg = new THREE.Mesh(segGeo, s % 2 === 0 ? jointsMat : glowMat);
              seg.position.y = -s * 0.16;
              seg.position.z = -s * 0.035;
              seg.rotation.x = -0.28;
              ponytailGroup.add(seg);
            }
            ponytailGroup.position.set(side * 0.1, 0.94, -0.16);
            ponytailGroup.rotation.z = side * 0.22;
            genderFeatures.add(ponytailGroup);
          }

          // 3. Sculpted Valkyrie Breastplate Cuirass
          for (const side of [-1, 1]) {
            const breastGeo = new THREE.SphereGeometry(0.11 * bulk, 16, 16);
            breastGeo.scale(1.1, 1.0, 0.75);
            const breast = new THREE.Mesh(breastGeo, jointsMat);
            breast.position.set(side * 0.14 * widthScale, 0.32 * bulk, 0.22 * depthScale);
            genderFeatures.add(breast);
          }

          // 4. Sleek Winged Shoulder Blades
          for (const side of [-1, 1]) {
            const wingBladeGeo = new THREE.BoxGeometry(0.04, 0.32, 0.14);
            const wingBlade = new THREE.Mesh(wingBladeGeo, glowMat);
            wingBlade.position.set(side * 0.48 * widthScale, 0.58 * bulk, -0.05);
            wingBlade.rotation.z = side * -0.4;
            wingBlade.rotation.y = side * 0.2;
            genderFeatures.add(wingBlade);
          }

          // 5. Golden Waist Sash
          const sashGeo = new THREE.TorusGeometry(0.24 * widthScale, 0.022, 8, 32);
          const sash = new THREE.Mesh(sashGeo, jointsMat);
          sash.rotation.x = Math.PI / 2 + 0.15;
          sash.position.set(0, -0.15 * bulk, 0);
          genderFeatures.add(sash);
        } else if (currentGender === 'MALE') {
          // 1. Spartan / Gladiator Helmet Crest
          const crestGeo = new THREE.BoxGeometry(0.04, 0.22, 0.36);
          const crest = new THREE.Mesh(crestGeo, jointsMat);
          crest.position.set(0, 1.14, 0.02);

          const crestGlowGeo = new THREE.BoxGeometry(0.016, 0.06, 0.38);
          const crestGlow = new THREE.Mesh(crestGlowGeo, glowMat);
          crestGlow.position.y = 0.12;
          crest.add(crestGlow);
          genderFeatures.add(crest);

          // 2. Heavy Titan Fortress Pauldrons
          for (const side of [-1, 1]) {
            const titanP = new THREE.Group();
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.28), jointsMat);
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.24), surfaceMat);
            p2.position.y = 0.08;
            const pVent = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.15), glowMat);
            pVent.position.y = 0.14;
            titanP.add(p1, p2, pVent);
            titanP.position.set(side * 0.58 * widthScale, 0.65 * bulk, 0);
            titanP.rotation.z = side * -0.25;
            genderFeatures.add(titanP);
          }

          // 3. Angular V-Taper Heavy Chest Armor Plates
          const chestPlateGeo = new THREE.BoxGeometry(0.48 * widthScale, 0.35 * bulk, 0.08);
          const chestPlate = new THREE.Mesh(chestPlateGeo, surfaceMat);
          chestPlate.position.set(0, 0.36 * bulk, 0.2 * depthScale);
          genderFeatures.add(chestPlate);

          // 4. Reinforced Heavy Gauntlet Bands
          for (const side of [-1, 1]) {
            const gauntletGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.26, 12);
            const gauntlet = new THREE.Mesh(gauntletGeo, jointsMat);
            gauntlet.position.set(side * 0.52 * widthScale, 0.05 * bulk, 0.05);
            genderFeatures.add(gauntlet);
          }
        } else {
          // NON_BINARY (ENBY / CYBER-MYSTIC)
          // 1. Floating Celestial Astral Halo
          const haloGeo = new THREE.TorusGeometry(0.28, 0.018, 12, 48);
          floatingHalo = new THREE.Mesh(haloGeo, glowMat);
          floatingHalo.rotation.x = Math.PI / 3;
          floatingHalo.position.set(0, 1.26, -0.05);
          genderFeatures.add(floatingHalo);

          // 2. Cyber Ocular Visor
          const visorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16, 1, false, 0, Math.PI);
          const visor = new THREE.Mesh(visorGeo, glowMat);
          visor.rotation.y = -Math.PI / 2;
          visor.position.set(0, 0.94, 0.14);
          genderFeatures.add(visor);

          // 3. Asymmetrical Cybernetic Left Arm Conduits
          const cyberArm = new THREE.Group();
          const armP = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.3, 12), jointsMat);
          const lineGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.1), glowMat);
          cyberArm.add(armP, lineGlow);
          cyberArm.position.set(-0.52 * widthScale, 0.05 * bulk, 0.05);
          genderFeatures.add(cyberArm);

          // 4. Right Mystic Robe / Shoulder Shroud
          const shroudGeo = new THREE.ConeGeometry(0.26 * widthScale, 0.45 * bulk, 16);
          const shroud = new THREE.Mesh(shroudGeo, surfaceMat);
          shroud.rotation.z = -0.35;
          shroud.position.set(0.48 * widthScale, 0.6 * bulk, 0);
          genderFeatures.add(shroud);

          // 5. Orbiting Mystic Runic Orbs
          floatingOrbs = new THREE.Group();
          for (let i = 0; i < 3; i++) {
            const angle = (i * (2 * Math.PI)) / 3;
            const orbGeo = new THREE.SphereGeometry(0.045, 12, 12);
            const orb = new THREE.Mesh(orbGeo, glowMat);
            orb.position.set(Math.cos(angle) * 0.65, 0.2, Math.sin(angle) * 0.65);
            floatingOrbs.add(orb);
          }
          genderFeatures.add(floatingOrbs);
        }

        characterGroup.add(genderFeatures);
      },
      undefined,
      (err) => {
        console.error('Error loading hero model:', err);
      }
    );

    // 6. Interactive Orbit & Drag Controls
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      previousMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousMouseX;
      previousMouseX = clientX;
      targetRotationY += deltaX * 0.012;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z = Math.min(6.0, Math.max(1.8, camera.position.z + e.deltaY * 0.003));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    domElem.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    domElem.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 7. Render Loop with Wind Cloth Physics
    let animationFrameId: number;
    let lastTime = performance.now() * 0.001;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now() * 0.001;
      const delta = now - lastTime;
      lastTime = now;

      // Update skeletal animation mixer
      if (mixer) {
        mixer.update(delta);
      }

      // Auto-rotation
      if (autoRotate && !isDragging) {
        targetRotationY += 0.006;
      }

      // Smooth rotation damping
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      characterGroup.rotation.y = currentRotationY;

      // Procedural Cape Wind Flutter
      if (capeMesh) {
        const posAttr = capeMesh.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const y = posAttr.getY(i);
          const factor = Math.max(0, -y + 0.8);
          const zWave = Math.sin(now * 4.2 + y * 2.5) * 0.08 * factor;
          const xWave = Math.cos(now * 3.2 + y * 2.0) * 0.03 * factor;
          posAttr.setZ(i, zWave);
          posAttr.setX(i, xWave);
        }
        posAttr.needsUpdate = true;
      }

      // Orbital Rings Rotation
      if (orbitalRings) {
        orbitalRings.rotation.z += 0.02;
        orbitalRings.rotation.y += 0.012;
      }

      // Floating Halo & Orbiting Orbs for Non-Binary Archetype
      if (floatingHalo) {
        floatingHalo.rotation.z += 0.015;
        floatingHalo.position.y = 1.25 + Math.sin(now * 2.5) * 0.03;
      }
      if (floatingOrbs) {
        floatingOrbs.rotation.y += 0.025;
      }

      // Arc Reactor Glow Pulse
      if (chestReactor) {
        const mat = chestReactor.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 2.6 + Math.sin(now * 3.5) * 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onPointerDown);
      domElem.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElem.removeEventListener('touchstart', onPointerDown);
      domElem.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);

      if (container && domElem.parentNode === container) {
        container.removeChild(domElem);
      }
      renderer.dispose();
    };
  }, [currentGender, level, suitTheme, autoRotate, cameraView, animState, activeWeapon, stage, interactive]);

  const activeTheme = SUIT_THEMES[suitTheme];

  return (
    <div
      style={{ height, width }}
      className={`relative select-none overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls - Top Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Level & Evolution Tier Badge */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <div className="flex items-center space-x-2 rounded-xl bg-slate-950/85 border border-slate-800/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md pointer-events-auto">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-black text-cyan-400 font-mono tracking-wider">
                STAGE {stage}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-bold text-slate-200">
                {stage === 1
                  ? 'Vigilante'
                  : stage === 2
                  ? 'Defender'
                  : stage === 3
                  ? 'Avenger'
                  : 'Titan'}
              </span>
            </div>
          </div>

          {/* Camera Zoom & 360 Toggle */}
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            <button
              onClick={() => setCameraView(cameraView === 'FULL' ? 'BUST' : 'FULL')}
              className={`rounded-xl border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow backdrop-blur-md transition active:scale-95 ${
                cameraView === 'BUST'
                  ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cameraView === 'BUST' ? '🔍 Focus: Torso' : '👤 Full Body'}
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`rounded-xl border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow backdrop-blur-md transition active:scale-95 ${
                autoRotate
                  ? 'border-amber-500 bg-amber-500/25 text-amber-300 ring-1 ring-amber-400'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {autoRotate ? '360° Orbit' : 'Static'}
            </button>
          </div>
        </div>
      )}

      {/* Floating HUD Controls - Bottom Bar Stack */}
      {showControls && (
        <div className="absolute bottom-2 left-2 right-2 flex flex-col items-center space-y-1.5 pointer-events-none">
          {/* Top Row: Weapons & Emotes Combined */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-950/90 border border-slate-800/90 px-2 py-1 shadow-xl backdrop-blur-md pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
            {/* Weapon Pickers */}
            <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-800 shrink-0">
              {(['KATANA', 'SHIELD', 'STAFF', 'NONE'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setActiveWeapon(w)}
                  title={`Equip ${w}`}
                  className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition active:scale-95 whitespace-nowrap ${
                    activeWeapon === w
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w === 'KATANA' ? '🗡️ Blade' : w === 'SHIELD' ? '🛡️ Shield' : w === 'STAFF' ? '🪄 Staff' : '✖️ None'}
                </button>
              ))}
            </div>

            {/* Emote Trigger Buttons */}
            <div className="flex items-center space-x-0.5 shrink-0">
              {(
                [
                  { id: 'idle', label: '🧍 Idle' },
                  { id: 'victory', label: '🕺 Victory' },
                  { id: 'run', label: '⚔️ Strike' },
                  { id: 'wave', label: '👋 Wave' },
                  { id: 'walk', label: '🚶 Walk' },
                ] as const
              ).map((e) => (
                <button
                  key={e.id}
                  onClick={() => setAnimState(e.id)}
                  title={`Trigger ${e.label} emote`}
                  className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition active:scale-95 whitespace-nowrap ${
                    animState === e.id
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Suits & Subtle Orbit Hint */}
          <div className="flex items-center justify-between w-full px-1 pointer-events-auto">
            {/* Suit Colorway Selector */}
            <div className="flex items-center space-x-1 rounded-2xl bg-slate-950/90 border border-slate-800/90 p-1 shadow-xl backdrop-blur-md">
              {(['CRIMSON', 'CYBER', 'SHADOW', 'SOLAR'] as const).map((t) => {
                const th = SUIT_THEMES[t];
                const isSelected = suitTheme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSuitTheme(t)}
                    title={`Equip ${th.name}`}
                    className={`flex items-center space-x-1 rounded-xl px-2 py-0.5 text-[10px] font-bold transition active:scale-95 whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full border border-black/40 shadow-sm shrink-0"
                      style={{ backgroundColor: `#${th.surface.toString(16).padStart(6, '0')}` }}
                    />
                    <span>{th.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Interaction hint */}
            <div className="hidden sm:block text-[9px] font-mono text-slate-400 bg-slate-950/85 border border-slate-800/80 px-2.5 py-1 rounded-full shadow-sm">
              360° Orbit • Scroll Zoom
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
