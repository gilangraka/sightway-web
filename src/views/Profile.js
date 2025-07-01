import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'

const UserSettings = () => {
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const dataUser = JSON.parse(localStorage.getItem('user'))

  const [user, setUser] = useState({
    email: dataUser.email,
    name: dataUser.name,
    role: 'Admin',
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(user.name)

  const handleNameSave = () => {
    setUser((prev) => ({ ...prev, name: editedName }))
    setIsEditingName(false)
  }

  const handleResetPassword = () => {
    alert(`Reset password link sent to ${user.email}`)
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={6}>
        <CCard>
          <CCardHeader>
            <h5>User Settings</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput type="email" value={user.email} disabled />
              </div>

              <div className="mb-3">
                <CFormLabel>Nama</CFormLabel>
                <div className="d-flex gap-2">
                  <CFormInput
                    type="text"
                    value={editedName}
                    disabled={!isEditingName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  {isEditingName ? (
                    <CButton color="primary" onClick={handleNameSave}>
                      Simpan
                    </CButton>
                  ) : (
                    <CButton color="primary" onClick={() => setIsEditingName(true)}>
                      Edit
                    </CButton>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel>Role</CFormLabel>
                <CFormInput type="text" value={roles.join(', ')} disabled />{' '}
              </div>

              <div className="mt-4">
                <CButton color="primary" className="w-100" onClick={handleResetPassword}>
                  Reset Password
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserSettings
