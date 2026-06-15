export interface DeviceCapability {
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  gpuMemory: number;
  isLowEndDevice: boolean;
  isMobile: boolean;
  pixelRatio: number;
  maxTextureSize: number;
}

export const detectDeviceCapability = (): DeviceCapability => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  let supportsWebGL = false;
  let supportsWebGL2 = false;
  let gpuMemory = 0;
  let maxTextureSize = 0;

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    supportsWebGL = !!gl;

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        if (renderer) {
          if (/Intel/i.test(renderer) && /HD/i.test(renderer)) {
            gpuMemory = 1024;
          } else if (/NVIDIA|AMD|Radeon|GeForce/i.test(renderer)) {
            gpuMemory = 4096;
          } else {
            gpuMemory = 512;
          }
        }
      }
      maxTextureSize = (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 1024;
    }

    const gl2 = canvas.getContext('webgl2');
    supportsWebGL2 = !!gl2;
  } catch {
    supportsWebGL = false;
    supportsWebGL2 = false;
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 2;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  const isLowEndDevice =
    !supportsWebGL ||
    !supportsWebGL2 ||
    isMobile ||
    cores <= 2 ||
    memory <= 2 ||
    gpuMemory <= 512 ||
    pixelRatio > 2;

  return {
    supportsWebGL,
    supportsWebGL2,
    gpuMemory,
    isLowEndDevice,
    isMobile,
    pixelRatio,
    maxTextureSize
  };
};

export const shouldUse3D = (autoDetect: boolean, userPreference?: '2d' | '3d'): boolean => {
  if (userPreference) {
    return userPreference === '3d';
  }
  if (!autoDetect) {
    return true;
  }
  const capability = detectDeviceCapability();
  return !capability.isLowEndDevice && capability.supportsWebGL2;
};
