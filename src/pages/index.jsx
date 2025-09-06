// src/pages/index.jsx - FIXED Next.js Homepage
import React, { useState, useEffect } from "react";
import Link from "next/link";  // FIXED: Proper Next.js import
import { Calendar, Trophy, Crown, BookOpen, ChevronRight, Clock, MapPin, Users } from "lucide-react";

export default function Home() {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      // Mock data for now - replace with actual API call when news system is built
      const mockNews = [
        {
          id: 1,
          title: "Spring Championship Registration Opens",
          content: "The distinguished Spring Championship shall commence registration on the first of March. We invite all members of good standing to participate in this celebration of sporting excellence.",
          author: "Tournament Committee",
          category: "announcements",
          created_date: "2025-01-10",
          featured: true
        },
        {
          id: 2,
          title: "New Member Initiation Ceremony",
          content: "Last Saturday witnessed the induction of twelve distinguished new members into our esteemed society. The ceremony upheld our finest traditions of sporting conduct and gentlemanly behaviour.",
          author: "Membership Secretary", 
          category: "club_news",
          created_date: "2025-01-08"
        },
        {
          id: 3,
          title: "Winter Championship Concludes",
          content: "Congratulations to Meneer Jan van der Berg for claiming victory in our Winter Championship. His demonstration of skill and sportsmanship exemplifies the finest traditions of our noble game.",
          author: "Championship Committee",
          category: "tournament_results", 
          created_date: "2025-01-05"
        }
      ];

      setNews(mockNews);
      const featured = mockNews.find(article => article.featured);
      setFeaturedNews(featured || mockNews[0]);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    tournament_results: "bg-amber-100 text-amber-800 border-amber-300",
    club_news: "bg-emerald-100 text-emerald-800 border-emerald-300",
    announcements: "bg-rose-100 text-rose-800 border-rose-300",
    newsletter: "bg-blue-100 text-blue-800 border-blue-300"
  };

  const quickActions = [
    {
      title: "Tournament Register",
      description: "Participate in distinguished competitions",
      icon: Trophy,
      url: "/tournaments",
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "Championship Rankings", 
      description: "View seasonal standings",
      icon: Crown,
      url: "/championships",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Laws of the Game",
      description: "Stichts Croquet regulations",
      icon: BookOpen,
      url: "/rules",
      color: "from-rose-500 to-rose-600"
    }
  ];

  const upcomingEvents = [
    {
      date: "15 March 2025",
      time: "14:00",
      title: "Spring Championship",
      location: "Hoofdveld",
      participants: "24 members registered"
    },
    {
      date: "22 March 2025", 
      time: "10:30",
      title: "New Member Orientation",
      location: "Clubhouse",
      participants: "8 prospective members"
    },
    {
      date: "5 April 2025",
      time: "15:00", 
      title: "Annual General Meeting",
      location: "Assembly Hall",
      participants: "All members invited"
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
        <p className="font-body text-emerald-700 mt-6 text-lg">Loading club intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Edwardian Welcome Section */}
      <div className="text-center space-y-8">
        <div className="inline-block">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-emerald-900 mb-6 heading-edwardian">
            Welcome to Our Distinguished Society
          </h1>
          <div className="ornate-divider"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-2xl text-emerald-700 leading-relaxed mb-4">
            Since eighteen hundred and ninety-eight, the Nederlandse Bond der Croquet has maintained 
            the finest traditions of sporting excellence in the Low Countries.
          </p>
          <p className="font-body text-lg text-emerald-600 italic">
            "In pursuit of precision, strategy, and the gentleman's code"
          </p>
        </div>
      </div>

      {/* Featured News - Edwardian Style */}
      {featuredNews && (
        <div className="card-edwardian p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[featuredNews.category]}`}>
              {featuredNews.category.replace('_', ' ').toUpperCase()}
            </div>
            <span className="text-emerald-600 text-sm font-body">
              Featured Announcement
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-emerald-900 mb-4">
            {featuredNews.title}
          </h2>
          <p className="font-body text-lg text-emerald-700 leading-relaxed mb-6">
            {featuredNews.content}
          </p>
          <div className="flex justify-between items-center text-sm text-emerald-600">
            <span className="font-body">— {featuredNews.author}</span>
            <span className="font-body">{new Date(featuredNews.created_date).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      )}

      {/* Quick Actions - Edwardian Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.url}>
            <div className="card-edwardian p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-900 mb-2">
                {action.title}
              </h3>
              <p className="font-body text-emerald-700">
                {action.description}
              </p>
              <div className="mt-4 flex items-center text-amber-600 group-hover:text-amber-700">
                <span className="font-body font-semibold">Proceed</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Events - Edwardian Schedule */}
      <div className="card-edwardian p-8">
        <h2 className="font-display text-3xl font-bold text-emerald-900 mb-6 text-center">
          Forthcoming Engagements
        </h2>
        <div className="ornate-divider w-64"></div>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="border-l-4 border-amber-400 pl-6 py-4 hover:bg-emerald-50/50 transition-colors">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <div className="flex items-center text-emerald-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-body font-semibold">{event.date}</span>
                </div>
                <div className="flex items-center text-emerald-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-body">{event.time}</span>
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-900 mb-1">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="font-body">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="font-body">{event.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Club Intelligence */}
      <div className="card-edwardian p-8">
        <h2 className="font-display text-3xl font-bold text-emerald-900 mb-6 text-center">
          Latest Club Intelligence
        </h2>
        <div className="ornate-divider w-64"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {news.slice(1).map((article) => (
            <div key={article.id} className="border border-emerald-200 rounded-lg p-6 hover:border-amber-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category]}`}>
                  {article.category.replace('_', ' ').toUpperCase()}
                </div>
                <span className="text-emerald-500 text-sm font-body">
                  {new Date(article.created_date).toLocaleDateString('en-GB')}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-emerald-900 mb-2">
                {article.title}
              </h3>
              <p className="font-body text-emerald-700 text-sm leading-relaxed">
                {article.content.substring(0, 120)}...
              </p>
              <div className="mt-3 text-xs text-emerald-600 font-body">
                — {article.author}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/newsletter">
            <button className="btn-edwardian px-8 py-3 rounded-lg">
              View All Announcements
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}