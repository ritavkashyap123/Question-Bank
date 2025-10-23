'use client'

import { useState, useEffect } from 'react'
import { QuestionBankWithAdmin } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Download, Search, Filter, Calendar, MapPin, BookOpen, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterState {
  search: string
  subject: string
  year: string
  district: string
  set: string
}

export default function QuestionBankTable() {
  const [questionBanks, setQuestionBanks] = useState<QuestionBankWithAdmin[]>([])
  const [filteredBanks, setFilteredBanks] = useState<QuestionBankWithAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    subject: '',
    year: '',
    district: '',
    set: ''
  })

  // Fetch question banks
  useEffect(() => {
    fetchQuestionBanks()
  }, [])

  // Filter question banks
  useEffect(() => {
    let filtered = questionBanks

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(bank => 
        bank.title.toLowerCase().includes(searchLower) ||
        bank.description?.toLowerCase().includes(searchLower) ||
        bank.subject.toLowerCase().includes(searchLower)
      )
    }

    if (filters.subject) {
      filtered = filtered.filter(bank => bank.subject === filters.subject)
    }

    if (filters.year) {
      filtered = filtered.filter(bank => bank.year.toString() === filters.year)
    }

    if (filters.district) {
      filtered = filtered.filter(bank => bank.district === filters.district)
    }

    if (filters.set) {
      filtered = filtered.filter(bank => bank.set === filters.set)
    }

    setFilteredBanks(filtered)
  }, [questionBanks, filters])

  const fetchQuestionBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('question_banks')
        .select(`
          *,
          admin:uploaded_by (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestionBanks(data || [])
    } catch (error) {
      console.error('Error fetching question banks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (questionBank: QuestionBankWithAdmin) => {
    try {
      // Increment download count
      await supabase
        .from('question_banks')
        .update({ downloads: questionBank.downloads + 1 })
        .eq('id', questionBank.id)

      // Download the file
      window.open(questionBank.url, '_blank')
      
      // Update local state
      setQuestionBanks(prev => 
        prev.map(bank => 
          bank.id === questionBank.id 
            ? { ...bank, downloads: bank.downloads + 1 }
            : bank
        )
      )
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const uniqueSubjects = [...new Set(questionBanks.map(bank => bank.subject))]
  const uniqueYears = [...new Set(questionBanks.map(bank => bank.year))].sort((a, b) => b - a)
  const uniqueDistricts = [...new Set(questionBanks.map(bank => bank.district).filter(Boolean))]
  const uniqueSets = [...new Set(questionBanks.map(bank => bank.set).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Question Papers</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Subject */}
          <select
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Year */}
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Years</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* District */}
          <select
            value={filters.district}
            onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Districts</option>
            {uniqueDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          {/* Set */}
          <select
            value={filters.set}
            onChange={(e) => setFilters(prev => ({ ...prev, set: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Sets</option>
            {uniqueSets.map(set => (
              <option key={set} value={set}>{set}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredBanks.length} of {questionBanks.length} question papers
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question Paper
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanks.map((questionBank) => (
                <tr key={questionBank.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {questionBank.title}
                        </div>
                        {questionBank.description && (
                          <div className="text-sm text-gray-500">
                            {questionBank.description}
                          </div>
                        )}
                        {questionBank.set && (
                          <div className="text-xs text-emerald-600 font-medium">
                            Set: {questionBank.set}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{questionBank.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{questionBank.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{questionBank.district || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {questionBank.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDownload(questionBank)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBanks.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No question papers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later for new uploads.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
