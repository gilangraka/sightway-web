import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

const CrudModal = ({
  visible,
  onClose,
  mode = 'store',
  id = null,
  onSuccess,
  titleMap = {
    store: 'Tambah Data',
    edit: 'Edit Data',
    delete: 'Hapus Data',
    resetPassword: 'Reset Password',
  },
  endpoint,
  fields = [],
  onError,
}) => {
  const isEdit = mode === 'edit'
  const isDelete = mode === 'delete'
  const isReset = mode === 'resetPassword'

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Effect to fetch data for edit/delete mode or initialize form for store mode
  useEffect(() => {
    if (visible) {
      if ((isEdit || isDelete) && id) {
        setLoading(true)
        axiosInstance
          .get(`${endpoint}/${id}`)
          .then((res) => {
            const data = {}
            // Populate form data with fetched values
            fields.forEach((field) => {
              data[field.name] = res.data[field.name] || ''
            })
            setFormData(data)
          })
          .catch((err) => {
            console.error('Failed to fetch data:', err)
            onError?.('Gagal memuat data. Silakan coba lagi.')
          })
          .finally(() => setLoading(false))
      } else {
        // Initialize an empty form for 'store' mode
        const initial = {}
        fields.forEach((field) => {
          initial[field.name] = ''
        })
        setFormData(initial)
      }
    }
  }, [visible, isEdit, isDelete, id, fields, endpoint, onError])

  // Handle form submission
  const handleSubmit = () => {
    setSubmitting(true)

    let api

    // Determine the API call based on the mode
    if (isReset) {
      api = axiosInstance.post(`${endpoint}/${id}/reset_password`)
    } else if (isDelete) {
      api = axiosInstance.delete(`${endpoint}/${id}`)
    } else if (isEdit) {
      // For edit, send a PUT request with the form data as JSON
      api = axiosInstance.put(`${endpoint}/${id}`, formData)
    } else {
      // For store, send a POST request with the form data as JSON
      api = axiosInstance.post(endpoint, formData)
    }

    api
      .then(() => {
        onSuccess?.() // Trigger success callback
        onClose() // Close the modal
      })
      .catch((err) => {
        console.error('Submission failed:', err)
        const errorMsg = err?.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.'
        onError?.(errorMsg) // Trigger error callback
      })
      .finally(() => setSubmitting(false))
  }

  // Generic change handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <CenteredModal
      visible={visible}
      onClose={onClose}
      title={titleMap[mode]}
      onSave={handleSubmit}
      loading={submitting || loading}
      saveButtonText={isDelete ? 'Hapus' : isReset ? 'Reset' : undefined}
      saveButtonColor={isDelete ? 'danger' : isReset ? 'warning' : undefined}
    >
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : isDelete ? (
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
      ) : isReset ? (
        <p>
          Apakah Anda yakin ingin me-reset password user <strong>{formData.name || ''}</strong> ke{' '}
          <code>password</code>?
        </p>
      ) : (
        // Render form fields for 'store' and 'edit' modes
        <div>
          {fields.map(({ name, label, type = 'text', placeholder, options }) => (
            <div className="mb-3" key={name}>
              <label htmlFor={name} className="form-label">
                {label}
              </label>
              {type === 'select' ? (
                <select
                  name={name}
                  id={name}
                  value={formData[name] || ''}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Pilih {label}</option>
                  {options &&
                    options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name] || ''}
                  placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
                  className="form-control"
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </CenteredModal>
  )
}

export default CrudModal
