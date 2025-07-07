import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShowButton from '../components/buttons/ShowButton'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'

const ManagePost = () => {
  const [reload, setReload] = useState(false)
  const [showData, setShowData] = useState(null)
  const [showLoading, setShowLoading] = useState(false)
  const [modalShowVisible, setModalShowVisible] = useState(false)

  const Toast = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const order = params.get('order') || ''

  const handleFilterChange = (e) => {
    const value = e.target.value
    const newParams = new URLSearchParams(location.search)
    if (value === '') {
      newParams.delete('order')
    } else {
      newParams.set('order', value)
    }
    newParams.set('page', 1)
    navigate({ search: newParams.toString() })
  }

  const handleAdd = () => {
    navigate('/manage-post/add')
  }

  const handleShow = async (id) => {
    setShowLoading(true)
    setModalShowVisible(true)
    try {
      const res = await axiosInstance.get(`/dashboard/manage-post/${id}`)
      setShowData(res.data)
    } catch (err) {
      console.error('Gagal ambil detail:', err)
      Toast.error('Gagal mengambil data detail')
      setModalShowVisible(false)
    } finally {
      setShowLoading(false)
    }
  }

  const handleDeletePost = async (id) => {
    try {
      await axiosInstance.delete(`/dashboard/manage-post/${id}`)
      Toast.success('Postingan berhasil dihapus')
      setModalShowVisible(false)
      setReload((prev) => !prev)
    } catch (err) {
      console.error('Gagal hapus:', err)
      const msg = err.response?.data?.message || err.message || 'Terjadi kesalahan'
      Toast.error(`Gagal hapus: ${msg}`)
    }
  }

  const columns = [
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (item) => (
        <img width="300px" src={item.thumbnail} className="rounded" alt="Thumbnail" />
      ),
    },
    { key: 'title', label: 'Judul Post' },
    { key: 'count_view', label: 'Jumlah Penonton' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          <ShowButton onClick={() => handleShow(item.id)} />
        </div>
      ),
    },
  ]

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4>Manage Post</h4>
            <div className="d-flex align-items-center gap-2">
              <select
                id="filterPost"
                className="form-select p-2 px-3"
                style={{ width: '200px' }}
                value={order}
                onChange={handleFilterChange}
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </select>
              <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
                Tambah Post
              </CButton>
            </div>
          </div>

          <PaginatedTable columns={columns} endpoint="/dashboard/manage-post" reload={reload} />
        </CCardBody>
      </CCard>

      {/* Modal Detail */}
      {modalShowVisible && <div className="modal-backdrop fade show"></div>}

      {modalShowVisible && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setModalShowVisible(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow rounded">
              <div className="modal-header rounded-top-4">
                <h5 className="modal-title">Detail Post</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalShowVisible(false)}
                ></button>

                <div className="d-flex gap-2">
                  <CButton
                    className="px-4 p-2"
                    color="primary"
                    onClick={() => setModalShowVisible(false)}
                  >
                    Tutup
                  </CButton>
                </div>
              </div>
              <div className="modal-body p-4">
                {showLoading ? (
                  <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : showData ? (
                  <div className="d-flex flex-column gap-4">
                    <img
                      src={showData.thumbnail}
                      alt="Thumbnail"
                      className="w-100 rounded shadow-sm"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th scope="row">Title</th>
                          <td>{showData.title}</td>
                        </tr>
                        <tr>
                          <th scope="row">Slug</th>
                          <td>{showData.slug}</td>
                        </tr>
                        <tr>
                          <th scope="row">View Count</th>
                          <td>{showData.count_view}</td>
                        </tr>
                        <tr>
                          <th scope="row">Category</th>
                          <td>
                            <span className="badge bg-info">{showData.category?.name || '-'}</span>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Tags</th>
                          <td>
                            {showData.tags && showData.tags.length > 0 ? (
                              showData.tags.map((tag) => (
                                <span key={tag.id} className="badge bg-secondary me-1">
                                  {tag.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Content</th>
                          <td>{showData.content || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted">Data tidak tersedia</div>
                )}
              </div>
              <div className="modal-footer rounded-bottom-4 d-flex justify-content-end">
                {showData && (
                  <CButton
                    className="px-4 p-2 text-white w-100"
                    color="danger"
                    onClick={() => handleDeletePost(showData.id)}
                  >
                    Hapus Postingan
                  </CButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ManagePost
