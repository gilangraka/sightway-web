import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CSpinner,
} from '@coreui/react'

const CenteredModal = ({ visible, onClose, title, children, onSave, loading = false }) => {
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={onClose}
      aria-labelledby="CenteredModalTitle"
    >
      <CModalHeader>
        <CModalTitle id="CenteredModalTitle" className="fw-bold">
          {title}
        </CModalTitle>
      </CModalHeader>

      <CModalBody>{children}</CModalBody>

      <CModalFooter>
        <CButton color="white" onClick={onClose} disabled={loading}>
          Close
        </CButton>
        <CButton color="primary" onClick={onSave} disabled={loading}>
          {loading ? <CSpinner size="sm" /> : 'Confirm'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CenteredModal
