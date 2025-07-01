import { CRow, CCol, CCard, CCardBody, CCardTitle, CListGroup, CListGroupItem } from '@coreui/react'
import { cilTag, cilUser, cilNotes, cilList } from '@coreui/icons'
import { StatCard, QuickLink } from '../components'
import { useState, useEffect } from 'react'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'
import CrudModal from '../components/modals/CrudModal'
import formatTimeAgo from '../core/formatTimeAgo'

const Dashboard = () => {
  const Toast = useToast()
  const [totalPost, setTotalPost] = useState(0)
  const [totalCategory, setTotalCategory] = useState(0)
  const [totalTag, setTotalTag] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [logs, setLogs] = useState([])

  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store')
  const [selectedId, setSelectedId] = useState(null)
  const [currentSection, setCurrentSection] = useState(null)

  const crudConfigs = {
    Category: {
      endpoint: '/dashboard/manage-category',
      fields: [{ name: 'name', label: 'Nama Category', type: 'text' }],
    },
    Tag: {
      endpoint: '/dashboard/manage-tag',
      fields: [{ name: 'name', label: 'Nama Tag', type: 'text' }],
    },
  }
  const openModal = (section, mode = 'store', id = null) => {
    setCurrentSection(section)
    setModalMode(mode)
    setSelectedId(id)
    setModalVisible(true)
  }

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
                    onClick={() => openModal('Category', 'store')}
                  />
                </CCol>
                <CCol xs={12}>
                  <QuickLink
                    icon={cilTag}
                    title="Tambah Tag"
                    desc="Buat tag untuk mempermudah pencarian"
                    onClick={() => openModal('Tag', 'store')}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CrudModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedId(null)
          setCurrentSection(null)
        }}
        mode={modalMode}
        id={selectedId}
        endpoint={currentSection ? crudConfigs[currentSection]?.endpoint : ''}
        fields={currentSection ? crudConfigs[currentSection]?.fields : []}
        titleMap={{
          store: currentSection ? `Tambah ${currentSection}` : '',
          edit: currentSection ? `Edit ${currentSection}` : '',
          delete: currentSection ? `Hapus ${currentSection}` : '',
        }}
        onSuccess={() => {
          const msg =
            modalMode === 'edit'
              ? `${currentSection} berhasil diupdate`
              : modalMode === 'delete'
                ? `${currentSection} berhasil dihapus`
                : `${currentSection} berhasil ditambahkan`
          Toast.success(msg)
          setModalVisible(false)
          setSelectedId(null)
          setCurrentSection(null)
        }}
        onError={(msg) => Toast.error(msg)}
      />
    </div>
  )
}

export default Dashboard
