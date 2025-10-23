import QuestionBankTable from '@/components/QuestionBankTable'
import { BookOpen, User, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/login"
                className="inline-flex items-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Access Question Papers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find and download question papers from various subjects, years, and districts. 
              Filter by your requirements and get instant access to educational resources.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionBankTable />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Question Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
