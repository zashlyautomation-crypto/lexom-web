import React from 'react'
import MobileVideoFallback from './MobileVideoFallback'

/**
 * Catches WebGL/Spline-specific crashes and shows the mobile fallback UI
 * to prevent the entire page from going blank.
 */
class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('LEXOM Spline Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Return the high-quality video fallback if the 3D scene crashes
      return (
        <div className="spline-container flex items-center justify-center bg-primary">
          <MobileVideoFallback />
        </div>
      )
    }

    return this.props.children
  }
}

export default SplineErrorBoundary
