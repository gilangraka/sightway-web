import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CrudModal from '../components/modals/CrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import ShowButton from '../components/buttons/ShowButton'
import { useToast } from '../components/ToastManager'

const ManageBlindstick = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store')
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)
  const [modalShowVisible, setModalShowVisible] = useState(false)
  const Toast = useToast()

  const openModal = (mode, id = null) => {
    setModalMode(mode)
    setSelectedId(id)
    setModalVisible(true)
  }

  const handleAdd = () => openModal('store')
  const handleEdit = (id) => openModal('edit', id)
  const handleDelete = (id) => openModal('delete', id)

  const handleSuccess = (message) => {
    setModalVisible(false)
    setSelectedId(null)
    Toast.success(message)
    setReload((prev) => !prev)
  }
  const handleError = (message) => {
    Toast.error(message)
  }
  const columns = [
    { key: 'mac_address', label: 'Mac Address' },
    {
      key: 'is_used',
      label: 'Status',
      render: (row) => (row.is_used ? 'Sudah digunakan' : 'Belum digunakan'),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          <ShowButton />
          <EditButton onClick={() => handleEdit(item.id)} />
          <DeleteButton onClick={() => handleDelete(item.id)} />
        </div>
      ),
    },
  ]

  const endpoint = '/dashboard/manage-blindstick'
  const section = 'Blindstick'
  const fields = [
    { name: 'blindstick.mac_address', form_name: 'blindstick', label: 'MAC Address', type: 'text' },
  ]

  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const isUsed = params.get('is_used') || ''

  const handleFilterChange = (e) => {
    const value = e.target.value
    const newParams = new URLSearchParams(location.search)
    if (value === '') {
      newParams.delete('is_used')
    } else {
      newParams.set('is_used', value)
    }
    newParams.set('page', 1)
    navigate({ search: newParams.toString() })
  }

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4>Manage Blindstick</h4>

            <div className="d-flex align-items-center gap-2">
              <select
                id="filterStatus"
                className="form-select p-2 px-3"
                style={{ width: '200px' }}
                value={isUsed}
                onChange={handleFilterChange}
              >
                <option value="">Semua Status</option>
                <option value="0">Sudah Digunakan</option>
                <option value="1">Belum Digunakan</option>
              </select>
              <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
                Tambah Blindstick
              </CButton>
            </div>
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
        }}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  )
}

export default ManageBlindstick
