import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

const ShowBlindstickModal = ({ visible, onClose, id }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (visible && id) {
      setLoading(true)
      axiosInstance
        .get(`/dashboard/manage-blindstick/${id}?page=1&log_days=7`)
        .then((res) => {
          setData(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [visible, id])

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={onClose}
      aria-labelledby="ShowBlindstickModalTitle"
      size="lg" // gunakan ukuran bawaan modal (xl, lg, sm)
    >
      <CModalHeader>
        <CModalTitle id="ShowBlindstickModalTitle">Detail Blindstick</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <CSpinner />
          </div>
        ) : data ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-bordered table-striped text-center">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">MAC ADDRESS</th>
                    <th className="text-center">STATUS</th>
                    <th className="text-center">DIGUNAKAN OLEH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">{data.blindstick.id}</td>
                    <td className="text-center">{data.blindstick.mac_address}</td>
                    <td className="text-center">
                      {data.blindstick.is_used ? 'SUDAH DIGUNAKAN' : 'BELUM DIGUNAKAN'}
                    </td>
                    <td className="text-center">
                      {data.blindstick.is_used ? data.penyandang.name : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ overflowX: 'auto' }} className="mt-4">
              <h6 className="mb-3 fw-bold">Log Blindstick</h6>

              <div style={{ overflowX: 'auto' }} className="mt-4">
                <table className="table table-bordered table-striped text-center">
                  <thead>
                    <tr>
                      <th className="text-center">TANGGAL</th>
                      <th className="text-center">STATUS</th>
                      <th className="text-center">DESKRIPSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.logs.data.length > 0 ? (
                      data.logs.data.map((log) => (
                        <tr key={log.id}>
                          <td className="text-center">
                            {new Date(log.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            })}
                          </td>

                          <td
                            className={`text-center ${
                              log.status.toLowerCase() === 'danger' ? 'text-danger' : 'text-success'
                            }`}
                          >
                            {log.status.toUpperCase()}
                          </td>

                          <td className="text-center">{log.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Belum ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p>Tidak ada data.</p>
        )}
      </CModalBody>
    </CModal>
  )
}

export default ShowBlindstickModal
