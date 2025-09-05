import React, { useState, useEffect } from "react";
import { NewsArticle } from "@/entities/NewsArticle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, FileText, Star } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Newsletter() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await NewsArticle.list("-created_date");
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
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

  const categoryIcons = {
    tournament_results: "🏆",
    club_news: "📰",
    announcements: "📢",
    newsletter: "📧"
  };

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticles = articles.filter(article => article.featured).slice(0, 2);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading newsletter...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">
          News & Newsletter
        </h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700 max-w-2xl mx-auto">
          Stay informed with the latest news, tournament results, and announcements 
          from the Nederlandse Bond der Croquet community.
        </p>
      </div>

      {/* Newsletter Subscription */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-8 text-center">
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="font-body text-emerald-700 mb-6 max-w-2xl mx-auto">
            Receive monthly updates with tournament schedules, results, rule clarifications, 
            and exclusive insights from the world of Dutch croquet.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-body font-semibold">
            Subscribe Now
          </Button>
        </CardContent>
      </Card>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-emerald-900 text-center flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-amber-500" />
            Featured Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className={categoryColors[article.category] || categoryColors.announcements}>
                        <span className="mr-1">{categoryIcons[article.category]}</span>
                        {article.category?.replace('_', ' ')}
                      </Badge>
                      <CardTitle className="font-display text-xl font-bold text-emerald-900 mt-2">
                        {article.title}
                      </CardTitle>
                    </div>
                    <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-emerald-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(article.created_date), "MMMM d, yyyy")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="font-body text-emerald-800 leading-relaxed">
                    {article.content.length > 200 
                      ? `${article.content.substring(0, 200)}...`
                      : article.content
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Article Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-emerald-100 border-emerald-200 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="font-body">All News</TabsTrigger>
          <TabsTrigger value="tournament_results" className="font-body">
            🏆 Tournament Results
          </TabsTrigger>
          <TabsTrigger value="club_news" className="font-body">
            📰 Club News
          </TabsTrigger>
          <TabsTrigger value="announcements" className="font-body">
            📢 Announcements
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="font-body">
            📧 Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          <div className="grid gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="border-b border-emerald-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className={categoryColors[article.category] || categoryColors.announcements}>
                          <span className="mr-1">{categoryIcons[article.category]}</span>
                          {article.category?.replace('_', ' ')}
                        </Badge>
                        {article.featured && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="font-display text-2xl text-emerald-900">
                        {article.title}
                      </CardTitle>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center md:justify-end gap-1 text-emerald-600">
                        <User className="w-4 h-4" />
                        <span className="font-body font-semibold">{article.author}</span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1 text-emerald-500">
                        <Calendar className="w-4 h-4" />
                        <span className="font-body text-sm">
                          {format(new Date(article.created_date), "MMMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="font-body text-emerald-800 leading-relaxed whitespace-pre-line">
                    {article.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                  No Articles Found
                </h3>
                <p className="font-body text-emerald-600">
                  {selectedCategory === "all" 
                    ? "No articles have been published yet. Check back soon for updates!"
                    : `No articles found in the ${selectedCategory.replace('_', ' ')} category.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}