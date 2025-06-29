import React from 'react'
import { CButton, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const QuickLink = ({ icon, title, desc }) => {
  return (
    <CCol sm={12}>
      <CButton
        color="light"
        className="w-100 text-start border d-flex align-items-center gap-3 p-3"
      >
        <div className="me-2">
          <CIcon icon={icon} className="text-primary" size="lg" />
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold">{title}</div>
          <div className="small text-body-secondary">{desc}</div>
        </div>
      </CButton>
    </CCol>
  )
}

export default QuickLink
