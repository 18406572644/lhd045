import * as THREE from 'three';

interface EquipmentOptions {
  liquidColor?: string;
  liquidLevel?: number;
  showBubbles?: boolean;
  bubbleColor?: string;
  isHeating?: boolean;
  flameIntensity?: number;
  tilted?: boolean;
}

const createGlassMaterial = (): THREE.MeshPhysicalMaterial => {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.35,
    thickness: 0.5,
    ior: 1.5,
    side: THREE.DoubleSide
  });
};

const createLiquidMaterial = (color: string): THREE.MeshPhysicalMaterial => {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.0,
    roughness: 0.2,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
};

export const createBeaker3D = (options: EquipmentOptions = {}): THREE.Group => {
  const {
    liquidColor = '#60A5FA',
    liquidLevel = 60,
    showBubbles = false,
    bubbleColor = '#FFFFFF'
  } = options;

  const group = new THREE.Group();
  group.name = 'beaker';
  const glassMaterial = createGlassMaterial();

  const bodyHeight = 2.0;
  const bodyTopRadius = 0.8;
  const bodyBottomRadius = 0.7;
  const wallThickness = 0.03;

  const outerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(bodyTopRadius, bodyBottomRadius, bodyHeight, 32, 1, true),
    glassMaterial
  );
  outerBody.position.y = bodyHeight / 2;
  group.add(outerBody);

  const bottom = new THREE.Mesh(
    new THREE.CylinderGeometry(bodyBottomRadius - wallThickness, bodyBottomRadius - wallThickness, wallThickness, 32),
    glassMaterial
  );
  bottom.position.y = wallThickness / 2;
  group.add(bottom);

  const rimGeometry = new THREE.TorusGeometry(bodyTopRadius, 0.04, 16, 32);
  const rim = new THREE.Mesh(rimGeometry, glassMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = bodyHeight;
  group.add(rim);

  if (liquidLevel > 0) {
    const liquidHeight = (bodyHeight * 0.85) * (liquidLevel / 100);
    const liquidGeometry = new THREE.CylinderGeometry(
      bodyTopRadius - wallThickness * 2,
      bodyBottomRadius - wallThickness * 2,
      liquidHeight,
      32
    );
    const liquid = new THREE.Mesh(liquidGeometry, createLiquidMaterial(liquidColor));
    liquid.position.y = wallThickness + liquidHeight / 2;
    liquid.name = 'liquid';
    group.add(liquid);
  }

  if (showBubbles) {
    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'bubbles';
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(bubbleColor),
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 15; i++) {
      const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.02 + Math.random() * 0.04, 8, 8),
        bubbleMaterial
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (bodyBottomRadius - wallThickness * 3);
      bubble.position.set(
        Math.cos(angle) * radius,
        0.1 + Math.random() * (bodyHeight * 0.5),
        Math.sin(angle) * radius
      );
      bubble.userData.bubbleSpeed = 0.5 + Math.random() * 0.5;
      bubble.userData.originalY = bubble.position.y;
      bubble.userData.offset = Math.random() * Math.PI * 2;
      bubbleGroup.add(bubble);
    }
    group.add(bubbleGroup);
  }

  for (let i = 1; i <= 3; i++) {
    const y = bodyHeight * 0.3 * i;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(bodyTopRadius - wallThickness * 1.5, 0.008, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  }

  return group;
};

export const createTestTube3D = (options: EquipmentOptions = {}): THREE.Group => {
  const {
    liquidColor = '#7C3AED',
    liquidLevel = 50,
    showBubbles = false,
    bubbleColor = '#FFFFFF',
    tilted = false
  } = options;

  const group = new THREE.Group();
  group.name = 'testTube';
  const glassMaterial = createGlassMaterial();

  const tubeHeight = 2.5;
  const tubeRadius = 0.25;
  const wallThickness = 0.02;

  const bodyGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeHeight - tubeRadius, 24, 1, true);
  const body = new THREE.Mesh(bodyGeometry, glassMaterial);
  body.position.y = (tubeHeight - tubeRadius) / 2 + tubeRadius;
  group.add(body);

  const bottomGeometry = new THREE.SphereGeometry(tubeRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
  bottom.position.y = tubeRadius;
  group.add(bottom);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(tubeRadius, 0.025, 12, 24),
    glassMaterial
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = tubeHeight;
  group.add(rim);

  if (liquidLevel > 0) {
    const maxLiquidHeight = tubeHeight * 0.7;
    const liquidHeight = maxLiquidHeight * (liquidLevel / 100);

    const liquidBodyGeometry = new THREE.CylinderGeometry(
      tubeRadius - wallThickness,
      tubeRadius - wallThickness,
      liquidHeight - tubeRadius * 0.5,
      24
    );
    const liquidBody = new THREE.Mesh(liquidBodyGeometry, createLiquidMaterial(liquidColor));
    liquidBody.position.y = tubeRadius + (liquidHeight - tubeRadius * 0.5) / 2;
    liquidBody.name = 'liquid';
    group.add(liquidBody);

    const liquidBottomGeometry = new THREE.SphereGeometry(
      tubeRadius - wallThickness,
      24, 16, 0, Math.PI * 2, 0, Math.PI / 2
    );
    const liquidBottom = new THREE.Mesh(liquidBottomGeometry, createLiquidMaterial(liquidColor));
    liquidBottom.position.y = tubeRadius;
    group.add(liquidBottom);
  }

  if (showBubbles) {
    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'bubbles';
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(bubbleColor),
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 12; i++) {
      const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.015 + Math.random() * 0.025, 8, 8),
        bubbleMaterial
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (tubeRadius - wallThickness * 2);
      bubble.position.set(
        Math.cos(angle) * radius,
        tubeRadius + 0.1 + Math.random() * (tubeHeight * 0.4),
        Math.sin(angle) * radius
      );
      bubble.userData.bubbleSpeed = 0.6 + Math.random() * 0.4;
      bubble.userData.originalY = bubble.position.y;
      bubble.userData.offset = Math.random() * Math.PI * 2;
      bubbleGroup.add(bubble);
    }
    group.add(bubbleGroup);
  }

  if (tilted) {
    group.rotation.z = Math.PI / 12;
  }

  return group;
};

export const createAlcoholLamp3D = (options: EquipmentOptions = {}): THREE.Group => {
  const {
    isHeating = false,
    flameIntensity = 0.8
  } = options;

  const group = new THREE.Group();
  group.name = 'alcoholLamp';
  const glassMaterial = createGlassMaterial();

  const lampHeight = 1.2;
  const baseRadius = 0.6;
  const topRadius = 0.35;

  const bodyPoints: THREE.Vector2[] = [];
  bodyPoints.push(new THREE.Vector2(0, 0));
  bodyPoints.push(new THREE.Vector2(baseRadius, 0));
  bodyPoints.push(new THREE.Vector2(baseRadius * 0.95, lampHeight * 0.15));
  bodyPoints.push(new THREE.Vector2(topRadius * 1.2, lampHeight * 0.5));
  bodyPoints.push(new THREE.Vector2(topRadius, lampHeight * 0.75));
  bodyPoints.push(new THREE.Vector2(topRadius, lampHeight * 0.85));
  bodyPoints.push(new THREE.Vector2(topRadius * 0.9, lampHeight));
  bodyPoints.push(new THREE.Vector2(0, lampHeight));

  const bodyGeometry = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeometry, glassMaterial);
  group.add(body);

  const alcoholMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    metalness: 0.0,
    roughness: 0.2,
    transmission: 0.5,
    transparent: true,
    opacity: 0.7
  });
  const alcoholPoints: THREE.Vector2[] = [];
  alcoholPoints.push(new THREE.Vector2(0, 0.02));
  alcoholPoints.push(new THREE.Vector2(baseRadius * 0.85, 0.02));
  alcoholPoints.push(new THREE.Vector2(baseRadius * 0.8, lampHeight * 0.12));
  alcoholPoints.push(new THREE.Vector2(topRadius * 1.1, lampHeight * 0.45));
  alcoholPoints.push(new THREE.Vector2(0, lampHeight * 0.45));

  const alcohol = new THREE.Mesh(new THREE.LatheGeometry(alcoholPoints, 32), alcoholMaterial);
  group.add(alcohol);

  const neckMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    roughness: 0.7,
    metalness: 0.1
  });
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16),
    neckMaterial
  );
  neck.position.y = lampHeight + 0.1;
  group.add(neck);

  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.8,
    metalness: 0.2
  });
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16),
    capMaterial
  );
  cap.position.y = lampHeight + 0.24;
  group.add(cap);

  if (isHeating) {
    const flameGroup = new THREE.Group();
    flameGroup.name = 'flame';

    const flameHeight = 1.2 * flameIntensity;
    const outerFlameGeometry = new THREE.ConeGeometry(0.2 * flameIntensity, flameHeight, 16);
    const outerFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.6
    });
    const outerFlame = new THREE.Mesh(outerFlameGeometry, outerFlameMaterial);
    outerFlame.position.y = lampHeight + 0.3 + flameHeight / 2;
    flameGroup.add(outerFlame);

    const innerFlameGeometry = new THREE.ConeGeometry(0.12 * flameIntensity, flameHeight * 0.7, 16);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.9
    });
    const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    innerFlame.position.y = lampHeight + 0.3 + flameHeight * 0.35;
    flameGroup.add(innerFlame);

    const coreFlameGeometry = new THREE.ConeGeometry(0.06 * flameIntensity, flameHeight * 0.4, 16);
    const coreFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 1
    });
    const coreFlame = new THREE.Mesh(coreFlameGeometry, coreFlameMaterial);
    coreFlame.position.y = lampHeight + 0.3 + flameHeight * 0.2;
    flameGroup.add(coreFlame);

    const light = new THREE.PointLight(0xfbbf24, 2 * flameIntensity, 8);
    light.position.y = lampHeight + 0.8;
    flameGroup.add(light);

    group.add(flameGroup);
  }

  return group;
};

export const createConicalFlask3D = (options: EquipmentOptions = {}): THREE.Group => {
  const {
    liquidColor = '#10B981',
    liquidLevel = 55,
    showBubbles = false,
    bubbleColor = '#FFFFFF'
  } = options;

  const group = new THREE.Group();
  group.name = 'conicalFlask';
  const glassMaterial = createGlassMaterial();

  const flaskHeight = 2.2;
  const baseRadius = 0.9;
  const neckRadius = 0.2;
  const neckHeight = 0.6;
  const wallThickness = 0.025;

  const bodyPoints: THREE.Vector2[] = [];
  bodyPoints.push(new THREE.Vector2(0, 0));
  bodyPoints.push(new THREE.Vector2(baseRadius, 0));
  bodyPoints.push(new THREE.Vector2(baseRadius, 0.05));
  bodyPoints.push(new THREE.Vector2(baseRadius * 0.95, flaskHeight * 0.1));
  bodyPoints.push(new THREE.Vector2(neckRadius * 1.5, flaskHeight - neckHeight));
  bodyPoints.push(new THREE.Vector2(neckRadius, flaskHeight - neckHeight + 0.05));
  bodyPoints.push(new THREE.Vector2(neckRadius, flaskHeight));
  bodyPoints.push(new THREE.Vector2(neckRadius * 1.1, flaskHeight + 0.05));
  bodyPoints.push(new THREE.Vector2(0, flaskHeight + 0.05));

  const bodyGeometry = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeometry, glassMaterial);
  group.add(body);

  if (liquidLevel > 0) {
    const maxLiquidHeight = (flaskHeight - neckHeight) * 0.9;
    const liquidHeight = maxLiquidHeight * (liquidLevel / 100);

    const t = liquidHeight / (flaskHeight - neckHeight);
    const liquidRadius = baseRadius * (1 - t) + neckRadius * 1.5 * t;

    const liquidPoints: THREE.Vector2[] = [];
    liquidPoints.push(new THREE.Vector2(0, wallThickness));
    liquidPoints.push(new THREE.Vector2(liquidRadius - wallThickness, wallThickness));
    const segments = 8;
    for (let i = 1; i <= segments; i++) {
      const lt = i / segments;
      const lh = wallThickness + (liquidHeight - wallThickness * 2) * lt;
      const t2 = lh / (flaskHeight - neckHeight);
      const lr = baseRadius * (1 - t2) + neckRadius * 1.5 * t2 - wallThickness;
      liquidPoints.push(new THREE.Vector2(Math.max(0.05, lr), lh));
    }
    liquidPoints.push(new THREE.Vector2(0, liquidHeight));

    const liquid = new THREE.Mesh(
      new THREE.LatheGeometry(liquidPoints, 32),
      createLiquidMaterial(liquidColor)
    );
    liquid.name = 'liquid';
    group.add(liquid);
  }

  if (showBubbles) {
    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'bubbles';
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(bubbleColor),
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 18; i++) {
      const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.018 + Math.random() * 0.035, 8, 8),
        bubbleMaterial
      );
      const height = 0.1 + Math.random() * (flaskHeight * 0.45);
      const t = height / (flaskHeight - neckHeight);
      const maxRadius = (baseRadius * (1 - t) + neckRadius * 1.5 * t - wallThickness * 2) * 0.9;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.max(0.05, maxRadius);
      bubble.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      bubble.userData.bubbleSpeed = 0.5 + Math.random() * 0.5;
      bubble.userData.originalY = bubble.position.y;
      bubble.userData.offset = Math.random() * Math.PI * 2;
      bubbleGroup.add(bubble);
    }
    group.add(bubbleGroup);
  }

  return group;
};

export const createEquipment3D = (
  type: 'beaker' | 'testTube' | 'alcoholLamp' | 'conicalFlask',
  options: EquipmentOptions = {}
): THREE.Group => {
  switch (type) {
    case 'beaker':
      return createBeaker3D(options);
    case 'testTube':
      return createTestTube3D(options);
    case 'alcoholLamp':
      return createAlcoholLamp3D(options);
    case 'conicalFlask':
      return createConicalFlask3D(options);
    default:
      return createBeaker3D(options);
  }
};

export const animateBubbles = (group: THREE.Group, time: number): void => {
  const bubbles = group.getObjectByName('bubbles');
  if (!bubbles) return;

  bubbles.children.forEach((bubble) => {
    const speed = bubble.userData.bubbleSpeed || 0.5;
    const originalY = bubble.userData.originalY || 0.5;
    const offset = bubble.userData.offset || 0;
    const t = (time * speed + offset) % 2;
    const parent = bubble.parent;
    if (parent) {
      const bbox = new THREE.Box3().setFromObject(parent);
      const height = bbox.max.y - bbox.min.y;
      bubble.position.y = originalY + (t * height * 0.4) % (height * 0.5);
      (bubble as THREE.Mesh).material = (bubble as THREE.Mesh).material as THREE.Material;
      const mat = ((bubble as THREE.Mesh).material as THREE.MeshBasicMaterial);
      if (t > 1.5) {
        mat.opacity = 0.7 * (2 - t) * 2;
      } else {
        mat.opacity = 0.7;
      }
    }
  });
};

export const animateFlame = (group: THREE.Group, time: number): void => {
  const flame = group.getObjectByName('flame');
  if (!flame) return;

  flame.children.forEach((child, index) => {
    if (child instanceof THREE.Mesh) {
      const flicker = 1 + Math.sin(time * 8 + index) * 0.08 + Math.sin(time * 12 + index * 2) * 0.04;
      child.scale.set(flicker, flicker * (1 + Math.sin(time * 6) * 0.05), flicker);
    } else if (child instanceof THREE.PointLight) {
      child.intensity = (child.userData.baseIntensity || 1.6) * (1 + Math.sin(time * 10) * 0.15);
    }
  });
};

export const animateLiquid = (group: THREE.Group, time: number): void => {
  const liquid = group.getObjectByName('liquid');
  if (!liquid) return;

  const wave = Math.sin(time * 2) * 0.015;
  liquid.position.y = (liquid.userData.baseY || liquid.position.y) + wave;
};
