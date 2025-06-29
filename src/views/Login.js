import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axiosInstance from '../core/axiosInstance'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState([])
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError([])
    try {
      const data = { email, password }
      const response = await axiosInstance.post('/dashboard/auth/login', data)

      localStorage.setItem('token', response.data.access_token)

      localStorage.setItem('user', JSON.stringify(response.data.user))

      const roleNames = response.data.user.roles.map((role) => role.name)
      localStorage.setItem('roles', JSON.stringify(roleNames))

      navigate('/dashboard')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail
        if (Array.isArray(detail)) {
          const messages = detail.map((item) => item.msg)
          setError(messages)
        } else {
          setError([detail])
        }
      } else {
        setError(['Login failed'])
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {error.length > 0 && (
                      <div
                        className="p-2 mb-4"
                        style={{
                          backgroundColor: 'rgba(220, 53, 69, 0.1)',
                          borderRadius: '4px',
                        }}
                      >
                        <ul className="m-0 text-danger">
                          {error.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CButton type="submit" color="primary" className="px-4 w-100">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
