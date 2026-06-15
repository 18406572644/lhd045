import * as THREE from 'three';

export interface OrbitControlsOptions {
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  enableRotate?: boolean;
  rotateSpeed?: number;
  enablePan?: boolean;
  panSpeed?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export class OrbitControls {
  object: THREE.Camera;
  domElement: HTMLElement;
  target: THREE.Vector3;

  enableDamping: boolean;
  dampingFactor: number;
  enableZoom: boolean;
  zoomSpeed: number;
  minDistance: number;
  maxDistance: number;
  enableRotate: boolean;
  rotateSpeed: number;
  enablePan: boolean;
  panSpeed: number;
  minPolarAngle: number;
  maxPolarAngle: number;

  private spherical: THREE.Spherical;
  private sphericalDelta: THREE.Spherical;
  private scale: number;
  private panOffset: THREE.Vector3;
  private isDragging: boolean;
  private isPanning: boolean;
  private lastPosition: THREE.Vector3;
  private lastQuaternion: THREE.Quaternion;
  private rotateStart: { x: number; y: number };
  private panStart: { x: number; y: number };

  private onMouseDownBound: (event: MouseEvent) => void;
  private onMouseMoveBound: (event: MouseEvent) => void;
  private onMouseUpBound: (event: MouseEvent) => void;
  private onWheelBound: (event: WheelEvent) => void;
  private onContextMenuBound: (event: Event) => void;

  constructor(object: THREE.Camera, domElement: HTMLElement, options: OrbitControlsOptions = {}) {
    this.object = object;
    this.domElement = domElement;
    this.target = new THREE.Vector3();

    this.enableDamping = options.enableDamping ?? true;
    this.dampingFactor = options.dampingFactor ?? 0.08;
    this.enableZoom = options.enableZoom ?? true;
    this.zoomSpeed = options.zoomSpeed ?? 1.0;
    this.minDistance = options.minDistance ?? 2;
    this.maxDistance = options.maxDistance ?? 30;
    this.enableRotate = options.enableRotate ?? true;
    this.rotateSpeed = options.rotateSpeed ?? 1.0;
    this.enablePan = options.enablePan ?? true;
    this.panSpeed = options.panSpeed ?? 1.0;
    this.minPolarAngle = options.minPolarAngle ?? 0;
    this.maxPolarAngle = options.maxPolarAngle ?? Math.PI / 2.1;

    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();
    this.scale = 1;
    this.panOffset = new THREE.Vector3();
    this.isDragging = false;
    this.isPanning = false;
    this.lastPosition = new THREE.Vector3();
    this.lastQuaternion = new THREE.Quaternion();
    this.rotateStart = { x: 0, y: 0 };
    this.panStart = { x: 0, y: 0 };

    this.onMouseDownBound = this.onMouseDown.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.onWheelBound = this.onWheel.bind(this);
    this.onContextMenuBound = this.onContextMenu.bind(this);

    this.connect();
    this.update();
  }

  private connect(): void {
    this.domElement.addEventListener('mousedown', this.onMouseDownBound);
    this.domElement.addEventListener('wheel', this.onWheelBound, { passive: false });
    this.domElement.addEventListener('contextmenu', this.onContextMenuBound);
    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('mouseup', this.onMouseUpBound);
  }

  dispose(): void {
    this.domElement.removeEventListener('mousedown', this.onMouseDownBound);
    this.domElement.removeEventListener('wheel', this.onWheelBound);
    this.domElement.removeEventListener('contextmenu', this.onContextMenuBound);
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    document.removeEventListener('mouseup', this.onMouseUpBound);
  }

  private onContextMenu(event: Event): void {
    event.preventDefault();
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (event.button === 0) {
      this.isDragging = true;
      this.rotateStart.x = event.clientX;
      this.rotateStart.y = event.clientY;
    } else if (event.button === 2) {
      this.isPanning = true;
      this.panStart.x = event.clientX;
      this.panStart.y = event.clientY;
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.enableRotate) {
      const deltaX = event.clientX - this.rotateStart.x;
      const deltaY = event.clientY - this.rotateStart.y;
      this.rotateStart.x = event.clientX;
      this.rotateStart.y = event.clientY;

      const element = this.domElement;
      this.sphericalDelta.theta -= (2 * Math.PI * deltaX) / element.clientHeight * this.rotateSpeed;
      this.sphericalDelta.phi -= (2 * Math.PI * deltaY) / element.clientHeight * this.rotateSpeed;
    }

    if (this.isPanning && this.enablePan) {
      const deltaX = event.clientX - this.panStart.x;
      const deltaY = event.clientY - this.panStart.y;
      this.panStart.x = event.clientX;
      this.panStart.y = event.clientY;
      this.pan(deltaX, deltaY);
    }
  }

  private onMouseUp(): void {
    this.isDragging = false;
    this.isPanning = false;
  }

  private onWheel(event: WheelEvent): void {
    if (!this.enableZoom) return;
    event.preventDefault();
    if (event.deltaY < 0) {
      this.scale /= Math.pow(0.95, this.zoomSpeed);
    } else {
      this.scale *= Math.pow(0.95, this.zoomSpeed);
    }
  }

  private pan(deltaX: number, deltaY: number): void {
    const offset = new THREE.Vector3();
    const te = this.object.matrix.elements;
    offset.set(te[0], te[1], te[2]);
    const targetDistance = offset.copy(this.object.position).sub(this.target).length();
    const target = this.target;

    const panLeft = (distance: number) => {
      const te2 = this.object.matrix.elements;
      const v = new THREE.Vector3(te2[0], te2[1], te2[2]);
      v.multiplyScalar(-distance);
      this.panOffset.add(v);
    };

    const panUp = (distance: number) => {
      const te2 = this.object.matrix.elements;
      const v = new THREE.Vector3(te2[4], te2[5], te2[6]);
      v.multiplyScalar(distance);
      this.panOffset.add(v);
    };

    const element = this.domElement;
    panLeft((2 * deltaX * targetDistance) / element.clientHeight * this.panSpeed);
    panUp((2 * deltaY * targetDistance) / element.clientHeight * this.panSpeed);
    void target;
  }

  setTarget(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
  }

  update(): boolean {
    const offset = new THREE.Vector3();
    const quat = new THREE.Quaternion().setFromUnitVectors(this.object.up, new THREE.Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();

    const position = this.object.position;
    offset.copy(position).sub(this.target);
    offset.applyQuaternion(quat);
    this.spherical.setFromVector3(offset);

    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;
    this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
    this.spherical.makeSafe();
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

    this.target.add(this.panOffset);
    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(quatInverse);
    position.copy(this.target).add(offset);
    this.object.lookAt(this.target);

    if (this.enableDamping) {
      this.sphericalDelta.theta *= 1 - this.dampingFactor;
      this.sphericalDelta.phi *= 1 - this.dampingFactor;
      this.panOffset.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
      this.panOffset.set(0, 0, 0);
    }

    this.scale = 1;

    const updated =
      !this.lastPosition.equals(this.object.position) ||
      !this.lastQuaternion.equals(this.object.quaternion);

    this.lastPosition.copy(this.object.position);
    this.lastQuaternion.copy(this.object.quaternion);

    return updated;
  }

  smoothMoveTo(position: THREE.Vector3, target: THREE.Vector3, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const startPosition = this.object.position.clone();
      const startTarget = this.target.clone();
      const startTime = performance.now();

      const easeInOutCubic = (t: number): number =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);

        this.object.position.lerpVectors(startPosition, position, eased);
        this.target.lerpVectors(startTarget, target, eased);
        this.update();

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }
}
