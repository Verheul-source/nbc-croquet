// src/app/administration/page.tsx - Admin Dashboard (App Router)
'use client'

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, BookOpen, Trophy, Shield, Plus, Settings, 
  BarChart3, Calendar, Mail, Crown 
} from 'lucide-react'

export default function AdministrationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    laws: 0,
    members: 0,
    clubs: 0,
    tournaments: 0
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        if (data.user.role !== 'admin') {
          window.location.href = '/'
        }
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Load various statistics
      const responses = await Promise.all([
        fetch('/api/rules'),
        fetch('/api/members'),
        fetch('/api/clubs'),
        fetch('/api/tournaments')
      ])

      const [rulesData, membersData, clubsData, tournamentsData] = await Promise.all(
        responses.map(r => r.ok ? r.json() : [])
      )

      setStats({
        laws: rulesData.length || 0,
        members: membersData.length || 0,
        clubs: clubsData.length || 0,
        tournaments: tournamentsData.length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (loading) {
    return (
      <Layout currentPageName="Administration">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="font-body text-emerald-600 mt-4">Loading Dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <Layout currentPageName="Access Denied">
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
              Administrator Access Required
            </h3>
            <p className="font-body text-emerald-600 mb-6">
              Please log in with an administrator account to access the admin panel.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-body font-semibold">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout currentPageName="Administration Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-amber-500" />
            <div>
              <h1 className="font-display text-4xl font-bold text-emerald-900">
                Administration Dashboard
              </h1>
              <p className="font-body text-lg text-emerald-700">
                Welcome back, {user.name || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                {stats.laws}
              </h3>
              <p className="font-body text-emerald-700">Laws & Rules</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                {stats.members}
              </h3>
              <p className="font-body text-emerald-700">Active Members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                {stats.tournaments}
              </h3>
              <p className="font-body text-emerald-700">Tournaments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                {stats.clubs}
              </h3>
              <p className="font-body text-emerald-700">Member Clubs</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Members Management */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-600" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Manage member registrations, club affiliations, and membership status.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/members'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Members
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Member
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Laws Management */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Laws & Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Maintain and update official croquet laws and regulations.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/laws'}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Laws
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Law
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tournaments Management */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-emerald-600" />
                Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Organise competitions and manage tournament schedules.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/tournaments'}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Manage Tournaments
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Championships */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-600" />
                Championships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Track rankings and championship standings across seasons.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/championships'}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Championships
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Rankings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clubs Management */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <Crown className="w-6 h-6 text-emerald-600" />
                Clubs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Manage affiliated clubs and their administrative details.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/clubs'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Manage Clubs
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Club
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700">
                Configure system preferences and administrative settings.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = '/administration/settings'}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Newsletter Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 text-amber-300 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4">
              Administrative Excellence
            </h2>
            <p className="font-body text-emerald-100 mb-6 max-w-2xl mx-auto">
              Efficiently manage all aspects of the Nederlandse Bond der Clubs with our comprehensive 
              administrative tools, maintaining the highest standards of organisation and governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-amber-400 hover:bg-amber-500 text-emerald-900 px-6 py-3"
                onClick={() => window.location.href = '/administration/reports'}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-100 hover:bg-amber-400/10 px-6 py-3"
                onClick={() => window.location.href = '/administration/backup'}
              >
                <Calendar className="w-4 h-4 mr-2" />
                System Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}