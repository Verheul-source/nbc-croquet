// src/app/page.tsx - Homepage (App Router)
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Trophy, Users, BookOpen, Calendar, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <Layout currentPageName="Welcome">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="w-16 h-16 text-amber-500" />
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-emerald-900 leading-tight">
                Welcome to Nederlandse Bond der Clubs
              </h1>
              <p className="font-body text-xl md:text-2xl text-emerald-700 mt-2">
                The Premier Croquet Organisation of the Netherlands
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="font-body text-lg text-emerald-700 leading-relaxed">
              Since 1898, the Nederlandse Bond der Clubs has been the distinguished governing body 
              for croquet in the Netherlands, upholding the finest traditions of this noble sport 
              whilst fostering excellence across our member clubs throughout the nation.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">500+</h3>
              <p className="font-body text-emerald-700">Active Members</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">24</h3>
              <p className="font-body text-emerald-700">Annual Tournaments</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-6">
              <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">125</h3>
              <p className="font-body text-emerald-700">Years of Tradition</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">12</h3>
              <p className="font-body text-emerald-700">Member Clubs</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* About Section */}
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-emerald-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-emerald-600" />
                Our Heritage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-emerald-700 leading-relaxed">
                Founded in the golden age of Dutch sporting excellence, our organisation has been 
                the custodian of croquet's finest traditions for over a century. We maintain the 
                highest standards of play, sportsmanship, and club governance.
              </p>
              <p className="font-body text-emerald-700 leading-relaxed">
                From our headquarters, we coordinate championships, maintain official laws, 
                and ensure the continued prosperity of croquet across the Netherlands.
              </p>
            </CardContent>
          </Card>

          {/* Latest News */}
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-emerald-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-emerald-600" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-display text-lg font-semibold text-emerald-900 mb-1">
                  2025 Championship Season Opens
                </h4>
                <p className="font-body text-sm text-emerald-600 mb-2">March 15, 2025</p>
                <p className="font-body text-emerald-700">
                  Registration is now open for the prestigious 2025 championship series.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-display text-lg font-semibold text-emerald-900 mb-1">
                  New Laws Published
                </h4>
                <p className="font-body text-sm text-emerald-600 mb-2">February 28, 2025</p>
                <p className="font-body text-emerald-700">
                  Updated regulations now available in the Laws section.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl p-8 md:p-12 text-white">
          <Crown className="w-16 h-16 text-amber-300 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Join Our Distinguished Community
          </h2>
          <p className="font-body text-lg md:text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Whether you're a seasoned player or new to the sport, discover the elegance 
            and strategy of croquet with the Nederland's finest clubs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/members" 
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-lg transition-colors"
            >
              View Members
            </a>
            <a 
              href="/tournaments" 
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-amber-100 font-semibold rounded-lg transition-colors border-2 border-emerald-600"
            >
              Upcoming Tournaments
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}