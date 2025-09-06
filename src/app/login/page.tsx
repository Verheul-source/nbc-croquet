// src/app/login/page.tsx - Login Page (App Router)
'use client'

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/'
      }
    } catch (error) {
      // User not logged in, stay on login page
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Successful login, redirect to home page
        window.location.href = '/'
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout currentPageName="Member Login">
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl text-emerald-900 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              Member Login
            </CardTitle>
            <p className="font-body text-emerald-700 mt-2">
              Access your Nederlandse Bond der Clubs account
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-body">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-emerald-800">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="font-body border-emerald-200 focus:border-emerald-400"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-emerald-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="font-body border-emerald-200 focus:border-emerald-400 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-body font-semibold py-3"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="font-body text-sm text-emerald-600">
                Forgot your password?{' '}
                <a
                  href="/forgot-password"
                  className="text-emerald-800 hover:text-emerald-900 font-semibold"
                >
                  Reset it here
                </a>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="font-body text-xs text-emerald-500">
                For membership inquiries, please contact your club secretary
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}