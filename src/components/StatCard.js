// StatCard.jsx
import React from 'react'
import { CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const StatCard = ({ icon, title, value, iconColor = 'primary' }) => {
  return (
    <CCol md={3}>
      <CCard className="text-center">
        <CCardBody>
          <CIcon icon={icon} size="xxl" className={`text-${iconColor} mb-2`} />
          <CCardTitle className="h5">{title}</CCardTitle>
          <CCardText className="fs-3 fw-bold">{value}</CCardText>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default StatCard
