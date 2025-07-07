import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
} from '@coreui/react'
import { useState } from 'react'
import { CategorySelect, TagSelect } from '../components'
import supabaseService from '../core/supabaseService'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'

const ManagePostAdd = () => {
  const [form, setForm] = useState({
    title: '',
    category: null,
    tags: [],
    content: '',
    thumbnail: null,
  })
  const Toast = useToast()
  const [loading, setLoading] = useState(false)

  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setForm({ ...form, thumbnail: file })
    if (file) setThumbnailPreview(URL.createObjectURL(file))
    else setThumbnailPreview(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let thumbnailUrl = null
      if (form.thumbnail) {
        const filePath = await supabaseService.upload('post', form.thumbnail)
        thumbnailUrl = supabaseService.getPublicUrl(filePath)
      }

      const postData = {
        title: form.title,
        category: form.category?.value || null,
        tags: form.tags.map((tag) => tag.value),
        content: form.content,
        thumbnail: thumbnailUrl,
      }

      const endpoint = '/dashboard/manage-post'
      await axiosInstance.post(endpoint, postData)

      Toast.success('Berhasil menambah post')

      setForm({
        title: '',
        category: null,
        tags: [],
        content: '',
        thumbnail: null,
      })
      setThumbnailPreview(null)

      window.location.hash = '#/manage-post'
    } catch (err) {
      console.error('Post submission failed:', err)
      const message = err.response?.data?.message || err.message || 'Terjadi kesalahan'
      Toast.error(`Gagal menambah post: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard className="p-4">
      <CCardHeader>
        <h4>Tambah Post</h4>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-2"
              onChange={handleFileChange}
            />

            {thumbnailPreview && (
              <div className="my-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          <CFormInput
            className="mb-3"
            label="Judul"
            placeholder="Enter post title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />

          <div className="mb-3">
            <label className="form-label">Category</label>
            <CategorySelect
              value={form.category}
              onChange={(selected) => setForm({ ...form, category: selected })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tags</label>
            <TagSelect
              value={form.tags}
              onChange={(selected) => setForm({ ...form, tags: selected })}
            />
          </div>

          <CFormTextarea
            className="mb-3"
            label="Content"
            placeholder="Start writing your amazing blog post here..."
            rows={5}
            name="content"
            value={form.content}
            onChange={handleInputChange}
          />

          <div className="d-flex justify-content-between">
            <CButton
              type="button"
              color="light"
              className="p-2"
              onClick={() => {
                window.location.hash = '#/manage-post'
              }}
            >
              Kembali
            </CButton>

            <CButton type="submit" color="primary" className="p-2 px-5" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ManagePostAdd
