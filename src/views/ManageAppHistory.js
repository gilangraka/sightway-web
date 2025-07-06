import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState } from 'react'
// 1. Ganti import CrudModal menjadi AppHistoryCrudModal
import AppHistoryCrudModal from '../components/modals/AppHistoryCrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'

const ManageAppHistory = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store') // 'store', 'edit', 'delete'
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)

  const Toast = useToast()

  const openModal = (mode, id = null) => {
    setModalMode(mode)
    setSelectedId(id)
    setModalVisible(true)
  }

  const handleAdd = () => openModal('store')
  const handleEdit = (id) => openModal('edit', id)
  const handleDelete = (id) => openModal('delete', id)

  const handleSuccess = () => {
    const message =
      modalMode === 'edit'
        ? `App History berhasil diupdate`
        : modalMode === 'delete'
          ? `App History berhasil dihapus`
          : `App History berhasil ditambahkan`

    setModalVisible(false)
    setSelectedId(null)
    Toast.success(message)
    setReload((prev) => !prev) // Trigger table reload
  }

  const handleError = (message) => {
    Toast.error(message)
  }

  const columns = [
    { key: 'name', label: 'Nama Versi' },
    { key: 'description', label: 'Deskripsi' },
    {
      key: 'file_apk',
      label: 'File APK',
      render: (item) =>
        item.file_apk ? (
          <a href={item.file_apk} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        ) : (
          '-'
        ),
    },
    {
      key: 'file_ipa',
      label: 'File IPA',
      render: (item) =>
        item.file_ipa ? (
          <a href={item.file_ipa} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        ) : (
          '-'
        ),
    },
  ]

  // 3. Ganti endpoint dan definisikan fields untuk form
  const endpoint = '/dashboard/manage-app-history'
  const section = 'App History'
  const fields = [
    { name: 'name', label: 'Nama Versi (cth: 1.0.0)', type: 'text', required: true },
    {
      name: 'description',
      label: 'Deskripsi / Catatan Perubahan',
      type: 'textarea',
      required: true,
    },
    { name: 'file_apk', label: 'File APK (Android)', type: 'file', accept: '.apk' },
    { name: 'file_ipa', label: 'File IPA (iOS)', type: 'file', accept: '.ipa' },
  ]

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage App History</h4>
            <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
              Tambah App History
            </CButton>
          </div>

          <PaginatedTable columns={columns} endpoint={endpoint} reload={reload} />
        </CCardBody>
      </CCard>

      {/* 4. Gunakan AppHistoryCrudModal */}
      <AppHistoryCrudModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedId(null)
        }}
        mode={modalMode}
        id={selectedId}
        endpoint={endpoint}
        fields={fields} // Kirim fields ke modal
        titleMap={{
          store: `Tambah ${section}`,
          edit: `Edit ${section}`,
          delete: `Hapus ${section}`,
        }}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  )
}

export default ManageAppHistory
