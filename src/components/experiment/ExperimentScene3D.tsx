import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../../utils/OrbitControls';
import {
  createEquipment3D,
  animateBubbles,
  animateFlame,
  animateLiquid
} from '../../utils/threeEquipment';
import { getExperimentViewAngle, VIEW_PRESETS } from '../../utils/viewAngles';
import { useExperimentStore } from '../../store/useExperimentStore';
import type { AnimationConfig, Equipment3DConfig, ViewAngle, ViewPreset } from '../../types';

interface ExperimentScene3DProps {
  experimentId?: string;
  experiment?: { id: string };
  currentStep?: number;
  animationData: AnimationConfig;
  animationType?: string;
  viewPreset?: ViewPreset;
}

interface EquipmentItem {
  id: string;
  group: THREE.Group;
  config: Equipment3DConfig;
}

export const ExperimentScene3D: React.FC<ExperimentScene3DProps> = ({
  experimentId,
  experiment,
  currentStep = 0,
  animationData,
  animationType = 'idle',
  viewPreset
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const equipmentRef = useRef<Map<string, EquipmentItem>>(new Map());
  const animationFrameRef = useRef<number>(0);
  const selectedIdRef = useRef<string | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const isDraggingRef = useRef<boolean>(false);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [highlightRing, setHighlightRing] = useState<THREE.Mesh | null>(null);

  const id = experiment?.id || experimentId || 'default';
  const { settings } = useExperimentStore();

  const getEquipmentLayout = useCallback((): Equipment3DConfig[] => {
    const rawType = animationData.type as unknown as string;
    const isHeating = rawType === 'heating';
    const isBubbling = rawType === 'bubbling';
    const isReaction = rawType === 'reaction';
    const isPouring = rawType === 'pouring';
    const { liquidColor, bubbleColor, flameIntensity } = animationData;
    void animationType;

    switch (id) {
      case 'kmno4-oxygen':
        if (isHeating) {
          return [
            {
              id: 'test-tube-1',
              type: 'testTube',
              position: { x: -1.5, y: 0, z: 0 },
              liquidColor: liquidColor || '#7C3AED',
              liquidLevel: isPouring ? 40 : 60,
              showBubbles: isBubbling,
              bubbleColor: bubbleColor || '#60A5FA',
              tilted: true
            },
            {
              id: 'lamp-1',
              type: 'alcoholLamp',
              position: { x: -1.5, y: 0, z: -1.2 },
              isHeating: true,
              flameIntensity: flameIntensity || 0.8
            }
          ];
        }
        if (isBubbling) {
          return [
            {
              id: 'test-tube-1',
              type: 'testTube',
              position: { x: -1.5, y: 0, z: 0 },
              liquidColor: liquidColor || '#7C3AED',
              liquidLevel: 60,
              showBubbles: true,
              bubbleColor: bubbleColor || '#60A5FA'
            },
            {
              id: 'beaker-1',
              type: 'beaker',
              position: { x: 1.5, y: 0, z: 0 },
              liquidColor: '#3B82F6',
              liquidLevel: 70,
              showBubbles: true,
              bubbleColor: '#FFFFFF'
            }
          ];
        }
        return [
          {
            id: 'test-tube-1',
            type: 'testTube',
            position: { x: 0, y: 0, z: 0 },
            liquidColor: liquidColor || '#7C3AED',
            liquidLevel: 60
          }
        ];

      case 'acid-base-neutralization':
        if (isHeating) {
          return [
            {
              id: 'beaker-1',
              type: 'beaker',
              position: { x: 0, y: 0, z: 0 },
              liquidColor: isReaction ? '#10B981' : liquidColor || '#EC4899',
              liquidLevel: isPouring ? 40 : 65,
              showBubbles: isBubbling || isReaction,
              bubbleColor: bubbleColor || '#FFFFFF'
            },
            {
              id: 'lamp-1',
              type: 'alcoholLamp',
              position: { x: 0, y: 0, z: -1.2 },
              isHeating: true,
              flameIntensity: flameIntensity || 0.6
            }
          ];
        }
        return [
          {
            id: 'beaker-1',
            type: 'beaker',
            position: { x: 0, y: 0, z: 0 },
            liquidColor: isReaction ? '#10B981' : liquidColor || '#EC4899',
            liquidLevel: isPouring ? 40 : 65,
            showBubbles: isBubbling || isReaction,
            bubbleColor: bubbleColor || '#FFFFFF'
          }
        ];

      case 'caco3-co2':
        if (isReaction) {
          return [
            {
              id: 'flask-1',
              type: 'conicalFlask',
              position: { x: -1.2, y: 0, z: 0 },
              liquidColor: liquidColor || '#60A5FA',
              liquidLevel: 55,
              showBubbles: isBubbling || isReaction,
              bubbleColor: bubbleColor || '#9CA3AF'
            },
            {
              id: 'test-tube-1',
              type: 'testTube',
              position: { x: 1.5, y: 0, z: 0 },
              liquidColor: liquidColor || '#D1D5DB',
              liquidLevel: 50,
              showBubbles: true,
              bubbleColor: '#F3F4F6'
            }
          ];
        }
        return [
          {
            id: 'flask-1',
            type: 'conicalFlask',
            position: { x: 0, y: 0, z: 0 },
            liquidColor: liquidColor || '#60A5FA',
            liquidLevel: 55,
            showBubbles: isBubbling || isReaction,
            bubbleColor: bubbleColor || '#9CA3AF'
          }
        ];

      case 'cuso4-h2o':
        if (isHeating) {
          return [
            {
              id: 'test-tube-1',
              type: 'testTube',
              position: { x: 0, y: 0, z: 0 },
              liquidColor: '#F59E0B',
              liquidLevel: 45,
              showBubbles: isBubbling,
              bubbleColor: bubbleColor || '#60A5FA',
              tilted: true
            },
            {
              id: 'lamp-1',
              type: 'alcoholLamp',
              position: { x: 0, y: 0, z: -1.2 },
              isHeating: true,
              flameIntensity: flameIntensity || 0.7
            }
          ];
        }
        return [
          {
            id: 'test-tube-1',
            type: 'testTube',
            position: { x: 0, y: 0, z: 0 },
            liquidColor: liquidColor || '#3B82F6',
            liquidLevel: 45
          }
        ];

      case 'electrolysis-water':
        return [
          {
            id: 'test-tube-1',
            type: 'testTube',
            position: { x: -1.0, y: 0, z: 0 },
            liquidColor: liquidColor || '#6366F1',
            liquidLevel: isBubbling ? 60 : 75,
            showBubbles: isBubbling,
            bubbleColor: '#10B981'
          },
          {
            id: 'test-tube-2',
            type: 'testTube',
            position: { x: 1.0, y: 0, z: 0 },
            liquidColor: liquidColor || '#6366F1',
            liquidLevel: isBubbling ? 70 : 75,
            showBubbles: isBubbling,
            bubbleColor: '#60A5FA'
          }
        ];

      default:
        return [
          {
            id: 'beaker-1',
            type: 'beaker',
            position: { x: 0, y: 0, z: 0 },
            liquidColor: liquidColor || '#60A5FA',
            liquidLevel: 60,
            showBubbles: isBubbling || isReaction,
            bubbleColor: bubbleColor || '#FFFFFF'
          }
        ];
    }
  }, [id, animationData, animationType]);

  const updateEquipment = useCallback(() => {
    if (!sceneRef.current) return;

    const newLayout = getEquipmentLayout();
    const existingIds = new Set(equipmentRef.current.keys());
    const newIds = new Set(newLayout.map(e => e.id));

    existingIds.forEach((oldId) => {
      if (!newIds.has(oldId)) {
        const item = equipmentRef.current.get(oldId);
        if (item) {
          sceneRef.current?.remove(item.group);
          item.group.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose();
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });
          equipmentRef.current.delete(oldId);
        }
      }
    });

    newLayout.forEach((config) => {
      const existing = equipmentRef.current.get(config.id);

      if (existing) {
        const posChanged =
          existing.config.position.x !== config.position.x ||
          existing.config.position.y !== config.position.y ||
          existing.config.position.z !== config.position.z;

        if (posChanged) {
          existing.group.position.set(
            config.position.x,
            config.position.y,
            config.position.z
          );
        }

        const hasBubbles = existing.group.getObjectByName('bubbles');
        if (config.showBubbles && !hasBubbles) {
          const newGroup = createEquipment3D(config.type, config);
          const bubblePart = newGroup.getObjectByName('bubbles');
          if (bubblePart) {
            existing.group.add(bubblePart);
          }
        } else if (!config.showBubbles && hasBubbles) {
          const bubblePart = existing.group.getObjectByName('bubbles');
          if (bubblePart) {
            existing.group.remove(bubblePart);
          }
        }

        const hasFlame = existing.group.getObjectByName('flame');
        if (config.isHeating && !hasFlame) {
          const newGroup = createEquipment3D(config.type, config);
          const flamePart = newGroup.getObjectByName('flame');
          if (flamePart) {
            existing.group.add(flamePart);
          }
        } else if (!config.isHeating && hasFlame) {
          const flamePart = existing.group.getObjectByName('flame');
          if (flamePart) {
            existing.group.remove(flamePart);
          }
        }

        existing.config = config;
      } else {
        const group = createEquipment3D(config.type, config);
        group.position.set(config.position.x, config.position.y, config.position.z);
        if (config.scale) {
          group.scale.setScalar(config.scale);
        }
        if (config.rotation) {
          group.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
        }
        group.userData.equipmentId = config.id;

        const liquid = group.getObjectByName('liquid');
        if (liquid) {
          liquid.userData.baseY = liquid.position.y;
        }

        sceneRef.current?.add(group);
        equipmentRef.current.set(config.id, { id: config.id, group, config });
      }
    });
  }, [getEquipmentLayout]);

  const autoAdjustView = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current || !settings.autoAdjustViewAngle) return;

    const viewAngle: ViewAngle = getExperimentViewAngle(
      id,
      currentStep,
      animationData.type
    );

    controlsRef.current.smoothMoveTo(
      new THREE.Vector3(viewAngle.position.x, viewAngle.position.y, viewAngle.position.z),
      new THREE.Vector3(viewAngle.target.x, viewAngle.target.y, viewAngle.target.z),
      800
    );
  }, [id, currentStep, animationData, settings.autoAdjustViewAngle]);

  const createLabTable = useCallback((scene: THREE.Scene, isLight: boolean) => {
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe2e8f0 : 0x334155,
      roughness: 0.8,
      metalness: 0.1
    });

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.3, 6),
      tableMaterial
    );
    table.position.y = -0.15;
    table.receiveShadow = true;
    scene.add(table);

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: isLight ? 0x94a3b8 : 0x475569,
      roughness: 0.6,
      metalness: 0.2
    });

    const edges = [
      { w: 10, h: 0.05, d: 0.05, x: 0, y: 0, z: 3 },
      { w: 10, h: 0.05, d: 0.05, x: 0, y: 0, z: -3 },
      { w: 0.05, h: 0.05, d: 6, x: 5, y: 0, z: 0 },
      { w: 0.05, h: 0.05, d: 6, x: -5, y: 0, z: 0 }
    ];

    edges.forEach((e) => {
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(e.w, e.h, e.d),
        edgeMaterial
      );
      edge.position.set(e.x, e.y, e.z);
      scene.add(edge);
    });
  }, []);

  const createHighlightRing = useCallback((scene: THREE.Scene) => {
    const ringGeometry = new THREE.RingGeometry(0.8, 0.95, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e6fba,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.visible = false;
    scene.add(ring);
    setHighlightRing(ring);
    return ring;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const isLightTheme = settings.theme === 'light';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isLightTheme ? 0xf0f4f8 : 0x1e293b);
    scene.fog = new THREE.Fog(isLightTheme ? 0xe2e8f0 : 0x334155, 15, 30);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement, {
      enableDamping: true,
      dampingFactor: 0.08,
      minDistance: 3,
      maxDistance: 20,
      minPolarAngle: 0.1,
      maxPolarAngle: Math.PI / 2.05
    });
    controls.setTarget(0, 0.5, 0);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(
      isLightTheme ? 0xffffff : 0x64748b,
      isLightTheme ? 0.6 : 0.5
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(
      isLightTheme ? 0x93c5fd : 0x3b82f6,
      0.3
    );
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(
      isLightTheme ? 0xfbbf24 : 0xf59e0b,
      0.2
    );
    rimLight.position.set(0, 5, -8);
    scene.add(rimLight);

    createLabTable(scene, isLightTheme);
    createHighlightRing(scene);

    const onPointerDown = (event: PointerEvent) => {
      if (!renderer.domElement || !cameraRef.current || !sceneRef.current) return;
      if (!settings.enable3DInteraction) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const allMeshes: THREE.Object3D[] = [];
      equipmentRef.current.forEach((item) => {
        item.group.traverse((obj) => {
          if (obj instanceof THREE.Mesh) allMeshes.push(obj);
        });
      });

      const intersects = raycasterRef.current.intersectObjects(allMeshes, false);

      if (intersects.length > 0 && event.button === 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData.equipmentId) {
          obj = obj.parent;
        }
        if (obj && obj.userData.equipmentId) {
          isDraggingRef.current = true;
          selectedIdRef.current = obj.userData.equipmentId;
          setSelectedEquipmentId(obj.userData.equipmentId);

          if (cameraRef.current) {
            dragPlaneRef.current.setFromNormalAndCoplanarPoint(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(obj.position.x, 0, obj.position.z)
            );

            const intersection = new THREE.Vector3();
            raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersection);
            dragOffsetRef.current.copy(obj.position).sub(intersection);
          }

          if (controlsRef.current) {
            controlsRef.current.enableRotate = false;
            controlsRef.current.enablePan = false;
          }
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || !renderer.domElement || !cameraRef.current) return;
      if (!selectedIdRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersection = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersection);

      const item = equipmentRef.current.get(selectedIdRef.current);
      if (item) {
        const newPos = intersection.add(dragOffsetRef.current);
        item.group.position.x = Math.max(-4, Math.min(4, newPos.x));
        item.group.position.z = Math.max(-2.5, Math.min(2.5, newPos.z));
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime();

      equipmentRef.current.forEach((item) => {
        animateBubbles(item.group, elapsedTime);
        animateFlame(item.group, elapsedTime);
        animateLiquid(item.group, elapsedTime);
      });

      if (selectedIdRef.current && highlightRing) {
        const item = equipmentRef.current.get(selectedIdRef.current);
        if (item) {
          highlightRing.visible = true;
          highlightRing.position.x = item.group.position.x;
          highlightRing.position.z = item.group.position.z;
          highlightRing.rotation.z = elapsedTime * 0.5;
          const scale = 1 + Math.sin(elapsedTime * 3) * 0.03;
          highlightRing.scale.set(scale, scale, scale);
        }
      } else if (highlightRing) {
        highlightRing.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerUp);

      controls.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [settings.theme, settings.enable3DInteraction, createLabTable, createHighlightRing, highlightRing]);

  useEffect(() => {
    updateEquipment();
  }, [updateEquipment]);

  useEffect(() => {
    if (sceneRef.current) {
      const isLightTheme = settings.theme === 'light';
      sceneRef.current.background = new THREE.Color(isLightTheme ? 0xf0f4f8 : 0x1e293b);
      if (sceneRef.current.fog) {
        (sceneRef.current.fog as THREE.Fog).color.set(isLightTheme ? 0xe2e8f0 : 0x334155);
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    autoAdjustView();
  }, [autoAdjustView, currentStep]);

  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current || !viewPreset || viewPreset === 'default') return;

    const preset = VIEW_PRESETS[viewPreset];
    if (preset) {
      controlsRef.current.smoothMoveTo(
        new THREE.Vector3(preset.position.x, preset.position.y, preset.position.z),
        new THREE.Vector3(preset.target.x, preset.target.y, preset.target.z),
        600
      );
    }
  }, [viewPreset]);

  useEffect(() => {
    if (!settings.enable3DInteraction) {
      setSelectedEquipmentId(null);
      selectedIdRef.current = null;
    }
  }, [settings.enable3DInteraction]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        cursor: settings.enable3DInteraction ? 'grab' : 'default'
      }}
      onMouseDown={(e) => {
        if (settings.enable3DInteraction && e.button === 0) {
          (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing';
        }
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLDivElement).style.cursor = settings.enable3DInteraction ? 'grab' : 'default';
        void e;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.cursor = settings.enable3DInteraction ? 'grab' : 'default';
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: settings.theme === 'light' ? '#64748B' : '#94A3B8',
          fontFamily: '"JetBrains Mono", monospace',
          pointerEvents: 'none',
          textShadow: settings.theme === 'light' ? '0 1px 2px rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.5)',
          zIndex: 10
        }}
      >
        3D 实验台 · 左键旋转 · 右键平移 · 滚轮缩放
        {selectedEquipmentId ? ` · 已选中: ${selectedEquipmentId}` : ''}
      </div>
    </div>
  );
};
