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
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'

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

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const Toast = useToast()

  const handleNameSave = () => {
    // misal: simpan nama ke server
    setUser({ ...user, name: editedName })
    setIsEditingName(false)
    Toast.success('Nama berhasil disimpan')
  }

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !newPasswordConfirmation) {
      Toast.error('Semua kolom password harus diisi!')
      return
    }

    if (newPassword !== newPasswordConfirmation) {
      Toast.error('Password baru dan konfirmasi tidak cocok!')
      return
    }

    try {
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          oldPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Toast.error(`Gagal: ${errorData.message || 'Terjadi kesalahan'}`)
        return
      }

      Toast.success('Password berhasil diubah!')
      // Reset form
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch (err) {
      console.error(err)
      Toast.error('Terjadi kesalahan saat mengubah password!')
    }
  }

  return (
    <>
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
                  <CFormInput type="text" value={roles.join(', ')} disabled />
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-4">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Password Lama</CFormLabel>
                  <CFormInput
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Password Baru</CFormLabel>
                  <CFormInput
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Konfirmasi Password Baru</CFormLabel>
                  <CFormInput
                    type="password"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <CButton color="primary" className="w-100" onClick={handleResetPassword}>
                    Ubah Password
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UserSettings
