import React, { useState, useEffect } from "react";
import { NewsArticle } from "@/entities/NewsArticle";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Trophy, Crown, BookOpen, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const articles = await NewsArticle.list("-created_date", 10);
      setNews(articles);
      const featured = articles.find(article => article.featured);
      setFeaturedNews(featured || articles[0]);
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
      title: "Browse Tournaments",
      description: "Find and register for upcoming tournaments",
      icon: Trophy,
      url: createPageUrl("Tournaments"),
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "View Rankings", 
      description: "Check current season standings",
      icon: Crown,
      url: createPageUrl("Rankings"),
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Rules Reference",
      description: "Quick access to Stichts Croquet rules",
      icon: BookOpen,
      url: createPageUrl("Rules"),
      color: "from-rose-500 to-rose-600"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-6">
        <div className="inline-block">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Welcome to Our Distinguished Club
          </h1>
          <div className="ornate-divider w-full"></div>
        </div>
        <p className="font-body text-xl text-emerald-700 max-w-3xl mx-auto leading-relaxed">
          Since 1898, the Nederlandse Bond der Croquet has been the home of fine croquet tradition in the Netherlands. 
          Join us in the pursuit of precision, strategy, and sporting excellence.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.url}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-emerald-200/50 hover:border-emerald-300">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-emerald-900">
                  {action.title}
                </h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-body text-emerald-700 mb-4">{action.description}</p>
                <div className="flex items-center justify-center text-emerald-600 group-hover:text-emerald-800">
                  <span className="font-body font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured News */}
      {featuredNews && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-emerald-900 text-center mb-8">
            Latest Club News
          </h2>
          
          <Card className="border-2 border-amber-200 shadow-xl bg-gradient-to-br from-amber-50 to-cream-bg">
            <CardHeader className="border-b border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Badge className={categoryColors[featuredNews.category] || categoryColors.announcements}>
                    {featuredNews.category?.replace('_', ' ')}
                  </Badge>
                  <h3 className="font-display text-2xl font-bold text-emerald-900 mt-2">
                    {featuredNews.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-body text-emerald-600">By {featuredNews.author}</p>
                  <p className="font-body text-sm text-emerald-500">
                    {format(new Date(featuredNews.created_date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="font-body text-emerald-800 leading-relaxed">
                {featuredNews.content.length > 300 
                  ? `${featuredNews.content.substring(0, 300)}...`
                  : featuredNews.content
                }
              </div>
              {featuredNews.content.length > 300 && (
                <Link to={createPageUrl("Newsletter")} className="inline-block mt-4">
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    Read Full Article
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent News Grid */}
      {news.length > 1 && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
              Recent Updates
            </h3>
            <div className="ornate-divider w-64 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(featuredNews ? 1 : 0, 7).map((article) => (
              <Card key={article.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={categoryColors[article.category] || categoryColors.announcements}>
                      {article.category?.replace('_', ' ')}
                    </Badge>
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-emerald-900 group-hover:text-emerald-700 line-clamp-2">
                    {article.title}
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-emerald-600 text-sm mb-3 line-clamp-3">
                    {article.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-emerald-500">
                    <span>By {article.author}</span>
                    <span>{format(new Date(article.created_date), "MMM d")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Newsletter")}>
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-amber-100 px-8 py-3 rounded-lg font-body font-semibold">
                View All News & Newsletter
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Club Information */}
      <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-emerald-200">
        <CardContent className="p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-emerald-900 mb-4">
            About Our Noble Sport
          </h3>
          <p className="font-body text-emerald-700 leading-relaxed max-w-4xl mx-auto">
            Croquet is a sport of precision, strategy, and tradition. Our association maintains the highest 
            standards of play while fostering a warm community of enthusiasts. Whether you're a seasoned 
            player or new to the mallet, you'll find a welcoming home in our distinguished clubs across 
            the Netherlands.
          </p>
          <div className="ornate-divider w-48 mx-auto mt-6"></div>
          <p className="font-body text-emerald-600 italic mt-4">
            "Excellence through tradition, community through sport"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}