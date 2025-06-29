import { CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'

const ManagePenyandang = () => {
  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Nama' },
  ]
  const endpoint = '/dashboard/manage-penyandang/'

  return (
    <CCard className="mb-4 p-4">
      <CCardBody className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Manage Penyandang</h4>
        </div>

        <PaginatedTable columns={columns} endpoint={endpoint} />
      </CCardBody>
    </CCard>
  )
}

export default ManagePenyandang
