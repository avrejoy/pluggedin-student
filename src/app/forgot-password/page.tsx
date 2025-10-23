'use client'

import { useState } from 'react'
import { supabase } from "@/app/lib/supabase";
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setMessage('Check your email for the password reset link!')
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-navy-600 mb-2">Forgot Password</h1>
          <p className="text-navy-500">Enter your email to reset your password</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl p-8 border-2 border-brown-200">
          <div className="mb-6">
            <label className="block text-navy-600 font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
              placeholder="your.email@uic.edu"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-navy-600 text-cream-50 rounded-lg font-semibold hover:bg-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-navy-500">
            Remember your password?{' '}
            <Link href="/login" className="text-brown-500 hover:text-brown-400 font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}