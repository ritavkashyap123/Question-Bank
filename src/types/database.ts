export interface Admin {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
}

export interface QuestionBank {
  id: string
  title: string
  description?: string
  subject: string
  year: number
  district?: string
  set?: string
  url: string
  downloads: number
  uploaded_by?: string
  created_at: string
}

export interface QuestionBankWithAdmin extends QuestionBank {
  admin?: {
    name: string
    email: string
  }
}
