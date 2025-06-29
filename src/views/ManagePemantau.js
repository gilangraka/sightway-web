import { CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import ShowButton from '../components/buttons/ShowButton'

const ManagePemantau = () => {
  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Nama' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          <ShowButton />
        </div>
      ),
    },
  ]
  const endpoint = '/dashboard/manage-pemantau/'

  return (
    <CCard className="mb-4 p-4">
      <CCardBody className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Manage Pemantau</h4>
        </div>

        <PaginatedTable columns={columns} endpoint={endpoint} />
      </CCardBody>
    </CCard>
  )
}

export default ManagePemantau
