import React, { useState } from "react";
import { Club } from "@/entities/Club";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Users } from "lucide-react";

export default function ClubForm({ club, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(club || {
    name: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await Club.update(club.id, formData);
      } else {
        await Club.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving club:", error);
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
          <Users className="w-6 h-6" />
          {isEditing ? 'Edit Club' : 'Add New Club'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Club Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Official name of the club"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City or area"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Club' : 'Add Club')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}