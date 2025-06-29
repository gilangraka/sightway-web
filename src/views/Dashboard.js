import { CRow, CCol, CCard, CCardBody, CCardTitle, CListGroup, CListGroupItem } from '@coreui/react'
import { cilTag, cilUser, cilNotes, cilList } from '@coreui/icons'
import { StatCard, QuickLink } from '../components'
import { useState, useEffect } from 'react'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'

const formatTimeAgo = (isoString) => {
  const date = new Date(isoString)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`
  return date.toLocaleDateString()
}

const Dashboard = () => {
  const Toast = useToast()
  const [totalPost, setTotalPost] = useState(0)
  const [totalCategory, setTotalCategory] = useState(0)
  const [totalTag, setTotalTag] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/manage-dashboard')
        const data = response.data
        setTotalPost(data.total_posts || 0)
        setTotalCategory(data.total_categories || 0)
        setTotalTag(data.total_tags || 0)
        setTotalUser(data.total_users || 0)
        setLogs(data.total_logs || [])
      } catch (error) {
        console.error('Failed to fetch dashboard statistics', error)
        Toast.error(error)
      }
    }

    getData()
  }, [])

  return (
    <div className="p-4">
      <CRow className="mb-4">
        <StatCard icon={cilNotes} title="Total Post" value={totalPost} />
        <StatCard icon={cilList} title="Total Category" value={totalCategory} />
        <StatCard icon={cilTag} title="Total Tag" value={totalTag} />
        <StatCard icon={cilUser} title="User Terdaftar" value={totalUser} />
      </CRow>

      <CRow>
        <CCol md={6} className="d-flex">
          <CCard className="flex-fill">
            <CCardBody className="p-4">
              <CCardTitle className="h5 mb-3">Recent Activity</CCardTitle>
              <CListGroup flush>
                {logs.length === 0 ? (
                  <CListGroupItem>No recent activity</CListGroupItem>
                ) : (
                  logs.map((log) => (
                    <CListGroupItem key={log.id} className="mb-2">
                      {log.description}
                      <div className="text-body-secondary small">
                        {formatTimeAgo(log.created_at)}
                      </div>
                    </CListGroupItem>
                  ))
                )}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} className="d-flex">
          <CCard className="flex-fill">
            <CCardBody className="p-4">
              <CCardTitle className="h5 mb-4">Quick Links</CCardTitle>
              <CRow className="g-3">
                <CCol xs={12}>
                  <QuickLink
                    icon={cilNotes}
                    title="Tulis Postingan"
                    desc="Buat dan publikasikan artikel baru"
                  />
                </CCol>
                <CCol xs={12}>
                  <QuickLink
                    icon={cilList}
                    title="Tambah Kategori"
                    desc="Buat kategori untuk mengelompokkan konten"
                  />
                </CCol>
                <CCol xs={12}>
                  <QuickLink
                    icon={cilTag}
                    title="Tambah Tag"
                    desc="Buat tag untuk mempermudah pencarian"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
