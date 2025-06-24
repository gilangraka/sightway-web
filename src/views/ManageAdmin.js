import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState } from 'react'
import CrudModal from '../components/modals/CrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import ResetPasswordButton from '../components/buttons/ResetPasswordButton'

const ManageAdmin = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store') // 'store', 'edit', 'delete'
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)

  const openModal = (mode, id = null) => {
    setModalMode(mode)
    setSelectedId(id)
    setModalVisible(true)
  }

  const handleAdd = () => openModal('store')
  const handleResetPass = (id) => openModal('resetPassword', id)
  const handleDelete = (id) => openModal('delete', id)

  const handleSuccess = (message) => {
    setModalVisible(false)
    setSelectedId(null)
    console.log(message)
    setReload((prev) => !prev)
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          <ResetPasswordButton onClick={() => handleResetPass(item.id)} />
          <DeleteButton onClick={() => handleDelete(item.id)} />
        </div>
      ),
    },
  ]

  const endpoint = '/dashboard/manage-admin'
  const section = 'Admin'
  const fields = [
    { name: 'name', label: 'Nama Admin', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'password_confirmation', label: 'Konfirmasi Password', type: 'password' },
  ]

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage Admin</h4>
            <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
              Tambah Admin
            </CButton>
          </div>

          <PaginatedTable columns={columns} endpoint={endpoint} reload={reload} />
        </CCardBody>
      </CCard>

      <CrudModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedId(null)
        }}
        mode={modalMode}
        id={selectedId}
        endpoint={endpoint}
        fields={fields}
        titleMap={{
          store: `Tambah ${section}`,
          edit: `Edit ${section}`,
          delete: `Hapus ${section}`,
          resetPassword: `Reset ${section}`,
        }}
        onSuccess={() => {
          const message =
            modalMode === 'edit'
              ? `${section} berhasil diupdate`
              : modalMode === 'delete'
                ? `${section} berhasil dihapus`
                : `${section} berhasil ditambahkan`
          handleSuccess(message)
        }}
      />
    </>
  )
}

export default ManageAdmin
