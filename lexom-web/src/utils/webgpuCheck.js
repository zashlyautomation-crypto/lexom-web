// LEXOM — WebGPU Support Detection Utility
// Section: Global
// Dependencies: None (Web API only)

/**
 * Async check for WebGPU API availability.
 * Returns true if WebGPU adapter is obtainable.
 * Returns false if navigator.gpu is unavailable or adapter request fails.
 */
export async function checkWebGPU() {
  if (!navigator.gpu) {
    console.info(
      'LEXOM: WebGPU not supported on this device.',
      'Spline will use WebGL fallback renderer.',
      'This is expected behavior.'
    )
    return false
  }
  
  try {
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) {
      console.info('LEXOM: WebGPU adapter unavailable.')
      return false
    }
    console.info('LEXOM: WebGPU supported and active.')
    return true
  } catch (err) {
    console.info('LEXOM: WebGPU check failed.', err)
    return false
  }
}
