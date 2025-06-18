import React, { useEffect, useState } from 'react'
import { CTable } from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../core/axiosInstance'

const PaginatedTable = ({ columns, endpoint, perPage = 10, showSearch = true }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const getQueryParam = (key) => {
    const params = new URLSearchParams(location.search)
    return params.get(key)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(getQueryParam('q') || '')

  const fetchData = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(endpoint, {
        params: {
          page,
          q: getQueryParam('q') || '',
          is_used: getQueryParam('is_used') || undefined,
        },
      })
      const itemsWithNumber = (res.data.data || []).map((item, index) => ({
        ...item,
        nomor: (page - 1) * perPage + index + 1,
        is_used: (
          <span className={item.is_used ? 'text-black' : 'text-success'}>
            {item.is_used ? 'Belum Digunakan' : 'Sudah Digunakan'}
          </span>
        ),
      }))
      setData(itemsWithNumber)
      setTotalPages(res.data.last_page || 1)
    } catch (err) {
      setError('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const page = parseInt(getQueryParam('page')) || 1
    setCurrentPage(page)
  }, [location.search])

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, location.search, endpoint])

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(location.search)
      params.set('page', page)
      navigate({ search: params.toString() })
    }
  }

  const getPaginationItems = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div>
      {/* Optional Search Form */}
      {showSearch && (
        <form
          className="mb-3"
          onSubmit={(e) => {
            e.preventDefault()
            const params = new URLSearchParams(location.search)
            if (searchTerm) {
              params.set('q', searchTerm)
            } else {
              params.delete('q')
            }
            params.set('page', 1)
            navigate({ search: params.toString() })
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      {/* Table and Pagination */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <CTable bordered columns={columns} items={data} className="table-spaced" />
          <ul className="pagination justify-content-end mt-4">
            {/* Previous */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link custom-page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </button>
            </li>

            {/* Pages */}
            {getPaginationItems().map((item, idx) => (
              <li
                key={idx}
                className={`page-item ${item === currentPage ? 'active' : ''} ${item === '...' ? 'disabled' : ''}`}
              >
                <button
                  className="page-link custom-page-link"
                  onClick={() => handlePageChange(item)}
                  disabled={item === '...'}
                >
                  {item}
                </button>
              </li>
            ))}

            {/* Next */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link custom-page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

export default PaginatedTable
