// src/app/page.tsx - Homepage (App Router)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Trophy, Users, BookOpen, Calendar, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
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
          <div className="ornate-divider w-64 mx-auto mt-8"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              Championships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Participate in our prestigious annual championships, where tradition meets 
              competitive excellence in the finest sporting spirit.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-amber-500" />
              Laws & Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Discover the comprehensive laws of Stichts Croquet, carefully developed 
              to preserve tradition whilst ensuring fair and engaging play.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-500" />
              Member Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Join our distinguished network of member clubs across the Netherlands, 
              each committed to upholding the highest standards of the game.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-amber-500" />
              Events Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Stay informed about upcoming tournaments, social gatherings, and 
              important dates in the Dutch croquet calendar.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-amber-500" />
              Court Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Find croquet courts and clubs throughout the Netherlands, from 
              historic grounds to modern facilities.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-500" />
              Heritage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-emerald-700">
              Explore our rich heritage dating back to 1898, celebrating over a 
              century of croquet excellence in the Netherlands.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-emerald-100 to-amber-100 border-emerald-300">
          <CardContent className="p-8">
            <h2 className="font-display text-3xl font-bold text-emerald-900 mb-4">
              Join the Tradition
            </h2>
            <p className="font-body text-lg text-emerald-700 mb-6 max-w-2xl mx-auto">
              Become part of our distinguished community and experience the noble sport 
              of croquet as it was meant to be played.
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-body font-semibold transition-colors">
              Learn More
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}