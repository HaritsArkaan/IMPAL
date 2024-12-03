import React from 'react'

export default function GradientBackground() {
  return (
    <div className="gradient-background">
      <style jsx>{`
        .gradient-background {
          width: 100%;
          height: 100vh;
          background: radial-gradient(circle, #BED1BD 0%, #FFC3BE 150%);
        }
      `}</style>
    </div>
  )
}