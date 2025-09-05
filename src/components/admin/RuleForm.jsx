import React, { useState } from "react";
import { Rule } from "@/entities/Rule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, BookOpen } from "lucide-react";

export default function RuleForm({ rule, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(rule || {
    part_title: "",
    part_order: 1,
    section_title: "",
    section_order: 1,
    content: "",
    language: "en"
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await Rule.update(rule.id, formData);
      } else {
        await Rule.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving rule:", error);
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
        <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          {isEditing ? 'Edit Rule' : 'Add New Rule'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Part Title *</Label>
              <Input
                value={formData.part_title}
                onChange={(e) => handleChange('part_title', e.target.value)}
                placeholder="e.g., Part I: Introduction"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Section Title *</Label>
              <Input
                value={formData.section_title}
                onChange={(e) => handleChange('section_title', e.target.value)}
                placeholder="e.g., 1. Objective of the Game"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Part Order</Label>
              <Input
                type="number"
                min="1"
                value={formData.part_order}
                onChange={(e) => handleChange('part_order', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Section Order</Label>
              <Input
                type="number"
                min="1"
                value={formData.section_order}
                onChange={(e) => handleChange('section_order', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Language</Label>
              <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Content *</Label>
            <p className="text-sm text-emerald-600">You can use Markdown formatting (## for headings, **bold**, etc.)</p>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Rule content here... You can use Markdown formatting."
              rows={15}
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
              {saving ? 'Saving...' : (isEditing ? 'Update Rule' : 'Add Rule')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}