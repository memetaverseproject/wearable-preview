import { ArcRotateCamera } from '@babylonjs/core'
import { PreviewConfig } from '@beland/schemas'

export function startAutoRotateBehavior(camera: ArcRotateCamera, config: PreviewConfig) {
  if (camera) {
    camera.useAutoRotationBehavior = true
    if (camera.autoRotationBehavior) {
      camera.autoRotationBehavior.idleRotationSpeed = config.autoRotateSpeed
    }
  }
}
