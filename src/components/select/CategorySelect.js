import { AsyncPaginate } from 'react-select-async-paginate'
import axiosInstance from '../../core/axiosInstance'

const CategorySelect = ({ value, onChange }) => {
  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const res = await axiosInstance.get('/dashboard/manage-category', {
        params: {
          page,
          q: search || '', // tambahkan q untuk search
        },
      })
      const data = res.data.data
      return {
        options: data.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
        hasMore: data.length > 0,
        additional: { page: page + 1 },
      }
    } catch (err) {
      console.error(err)
      return {
        options: [],
        hasMore: false,
        additional: { page },
      }
    }
  }

  return (
    <AsyncPaginate
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      additional={{ page: 1 }}
      placeholder="Select category"
    />
  )
}

export default CategorySelect
