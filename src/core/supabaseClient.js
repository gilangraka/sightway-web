import { createClient } from '@supabase/supabase-js'

// Ambil environment variable
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON
const supabaseBucket = process.env.SUPABASE_BUCKET

if (!supabaseUrl || !supabaseAnonKey || !supabaseBucket) {
  throw new Error('SUPABASE_URL, SUPABASE_ANON, dan SUPABASE_BUCKET harus diset di .env file')
}

// Inisialisasi Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fungsi untuk upload file ke bucket
export async function uploadFile(filePath, file) {
  const { data, error } = await supabase.storage.from(supabaseBucket).upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  return data
}

// Fungsi untuk mendapatkan URL publik file
export function getPublicUrl(filePath) {
  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath)

  return data.publicUrl
}

// Fungsi untuk download file dari bucket
export async function downloadFile(filePath) {
  const { data, error } = await supabase.storage.from(supabaseBucket).download(filePath)

  if (error) {
    console.error('Download error:', error)
    throw error
  }

  return data
}

export default supabase
