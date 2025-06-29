import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

const ShowBlindstickModal = ({ visible, onClose, id }) => {
  const [loading, setLoading] = useState(false)

  if (visible) {
    setLoading(true)
    axiosInstance
      .get(`/dashboard/manage-blindstick/${id}?page=1&log_days=7`)
      .then((res) => {
        const data = {}
        fields.forEach((field) => {
          data[field.name] = res.data[field.name] || ''
        })
        setFormData(data)
        console.log(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
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
    ></CenteredModal>
  )
}
