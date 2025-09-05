import React, { useState } from "react";
import { NewsArticle } from "@/entities/NewsArticle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar, Save, X } from "lucide-react";
import { format } from "date-fns";

export default function NewsForm({ article, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(article || {
    title: "",
    content: "",
    author: "",
    category: "announcements",
    featured: false,
    publish_date: format(new Date(), "yyyy-MM-dd")
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await NewsArticle.update(article.id, formData);
      } else {
        await NewsArticle.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-amber-50">
        <CardTitle className="font-display text-xl text-emerald-900">
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Article title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Author</Label>
              <Input
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tournament_results">Tournament Results</SelectItem>
                  <SelectItem value="club_news">Club News</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Publish Date
              </Label>
              <Input
                type="date"
                value={formData.publish_date}
                onChange={(e) => handleChange('publish_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Featured Article</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange('featured', checked)}
                />
                <span className="font-body text-emerald-700">
                  {formData.featured ? 'Featured' : 'Regular'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write your article content here..."
              rows={12}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Article' : 'Create Article')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}