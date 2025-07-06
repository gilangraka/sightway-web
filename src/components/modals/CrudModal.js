import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

/**
 * Helper function to get a nested value from an object using a dot-notation path.
 * e.g., getNestedValue({ user: { name: 'John' } }, 'user.name') returns 'John'.
 * @param {object} obj The object to retrieve the value from.
 * @param {string} path The dot-notation path to the value.
 * @returns The value found at the path, or an empty string if not found.
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
}

/**
 * A reusable modal component for CRUD operations that handles complex data structures.
 * This version correctly builds a flat payload for the API from form state that uses dot-notation keys.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.visible - Whether the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} [props.mode='store'] - The current mode ('store', 'edit', 'delete', 'resetPassword').
 * @param {string|number|null} [props.id=null] - The ID of the item for 'edit', 'delete', or 'resetPassword' modes.
 * @param {function} [props.onSuccess] - Callback function on successful submission.
 * @param {object} [props.titleMap] - A map of titles for each mode.
 * @param {string} props.endpoint - The API endpoint for the CRUD operations.
 * @param {Array<object>} [props.fields=[]] - An array of field configuration objects for the form.
 * @param {function} [props.onError] - Callback function on submission error.
 */
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

  // Effect to fetch data for edit/delete/reset mode or initialize form for store mode
  useEffect(() => {
    // Reset form state when modal is closed
    if (!visible) {
      setFormData({})
      return
    }

    if ((isEdit || isDelete || isReset) && id) {
      setLoading(true)
      axiosInstance
        .get(`${endpoint}/${id}`)
        .then((res) => {
          const data = {}
          // Populate form data using dot-notation paths from the fields config
          fields.forEach((field) => {
            data[field.name] = getNestedValue(res.data, field.name)
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
  }, [visible, isEdit, isDelete, isReset, id, fields, endpoint, onError])

  /**
   * Builds the payload for the API. It transforms the flat form state with
   * dot-notation keys (e.g., { 'blindstick.mac_address': 'value' }) into
   * a flat object with the final key (e.g., { mac_address: 'value' }),
   * which matches the API's expectation.
   * @param {object} flatObj - The form data state.
   * @returns {object} A flat object ready to be sent to the API.
   */
  const buildPayload = (flatObj) => {
    const payload = {}
    Object.keys(flatObj).forEach((path) => {
      const keyParts = path.split('.')
      const finalKey = keyParts[keyParts.length - 1] // e.g., 'mac_address' from 'blindstick.mac_address'
      payload[finalKey] = flatObj[path]
    })
    return payload
  }

  // Handle form submission
  const handleSubmit = () => {
    setSubmitting(true)

    let api
    // Build the payload only for modes that send data
    const payload = isEdit || mode === 'store' ? buildPayload(formData) : {}

    // Determine the API call based on the mode
    if (isReset) {
      api = axiosInstance.post(`${endpoint}/${id}/reset_password`)
    } else if (isDelete) {
      api = axiosInstance.delete(`${endpoint}/${id}`)
    } else if (isEdit) {
      api = axiosInstance.put(`${endpoint}/${id}`, payload)
    } else {
      api = axiosInstance.post(endpoint, payload)
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
          Apakah Anda yakin ingin me-reset password user{' '}
          {/* The key in formData is the full path, so this remains correct */}
          <strong>{formData['blindstick.mac_address'] || ''}</strong> ke <code>password</code>?
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
                  value={formData[name] ?? ''}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Pilih {label}</option>
                  {options?.map((option) => (
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
                  value={formData[name] ?? ''}
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
