import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://instagram.com/gilangraka_r" target="_blank" rel="noopener noreferrer">
          Sightway - Solusi Disabilitas Netra
        </a>
        <span className="ms-1">&copy; 2025.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://instagram.com/gilangraka_r" target="_blank" rel="noopener noreferrer">
          Sightway Team
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
