import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        FAMI
        <span className="ms-1">&copy; 2023</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://desainera.com" target="_blank" rel="noopener noreferrer">
          Desainera Digital Kreatif
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
