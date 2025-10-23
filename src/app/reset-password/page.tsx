'use client'

import { useState } from 'react'
import { supabase } from "@/app/lib/supabase";
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      alert('Password updated successfully!')
      router.push('/login')
    } catch (err) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-navy-600 mb-2">Reset Password</h1>
          <p className="text-navy-500">Enter your new password</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl p-8 border-2 border-brown-200">
          <div className="mb-6">
            <label className="block text-navy-600 font-semibold mb-2">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="mb-6">
            <label className="block text-navy-600 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-navy-600 text-cream-50 rounded-lg font-semibold hover:bg-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}