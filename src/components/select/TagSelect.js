import { AsyncPaginate } from 'react-select-async-paginate'
import axiosInstance from '../../core/axiosInstance'

const TagSelect = ({ value, onChange }) => {
  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const res = await axiosInstance.get('/dashboard/manage-tag', {
        params: {
          page,
          q: search || '',
        },
      })
      const data = res.data.data
      return {
        options: data.map((tag) => ({
          value: tag.id,
          label: tag.name,
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
      isMulti // Karena biasanya tag bisa multi select
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      additional={{ page: 1 }}
      placeholder="Select tags"
    />
  )
}

export default TagSelect
