import React, { useState, useEffect } from "react";
import { Ranking, Member } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RankingForm({ ranking, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(ranking || {
    member_id: "",
    season: "2026",
    current_position: 1,
    previous_position: 1,
    points: 0,
    tournaments_played: 0,
    wins: 0,
    handicap: 0
  });
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Member.list().then(setMembers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSave = { ...formData, handicap: members.find(m => m.id === formData.member_id)?.handicap || 0 };
      if (isEditing) {
        await Ranking.update(ranking.id, dataToSave);
      } else {
        await Ranking.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving ranking:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericChange = (field, value) => {
    const num = value === "" ? "" : parseInt(value, 10);
    if (!isNaN(num) || value === "") {
      handleChange(field, num);
    }
  };

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-amber-50">
        <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          {isEditing ? 'Edit Ranking' : 'Create New Ranking'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Member *</Label>
              <Select value={formData.member_id} onValueChange={(value) => handleChange('member_id', value)} required disabled={isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>{member.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Season *</Label>
              <Input
                value={formData.season}
                onChange={(e) => handleChange('season', e.target.value)}
                placeholder="e.g., 2026"
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Current Position</Label>
              <Input type="number" value={formData.current_position} onChange={(e) => handleNumericChange('current_position', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Points</Label>
              <Input type="number" value={formData.points} onChange={(e) => handleNumericChange('points', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Previous Position</Label>
              <Input type="number" value={formData.previous_position} onChange={(e) => handleNumericChange('previous_position', e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Games Won</Label>
              <Input type="number" value={formData.wins} onChange={(e) => handleNumericChange('wins', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Games Played</Label>
              <Input type="number" value={formData.tournaments_played} onChange={(e) => handleNumericChange('tournaments_played', e.target.value)} />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Ranking' : 'Create Ranking')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}