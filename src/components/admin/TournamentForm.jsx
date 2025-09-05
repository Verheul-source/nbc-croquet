import React, { useState } from "react";
import { Tournament } from "@/entities/Tournament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Trophy } from "lucide-react";
import { format } from "date-fns";

export default function TournamentForm({ tournament, clubs, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(tournament || {
    name: "",
    description: "",
    host_club_id: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    registration_deadline: format(new Date(), "yyyy-MM-dd"),
    max_participants: 50,
    entry_fee: 0,
    tournament_type: "singles",
    handicap_range: "",
    status: "open"
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      max_participants: Number(formData.max_participants),
      entry_fee: Number(formData.entry_fee)
    };

    try {
      if (isEditing) {
        await Tournament.update(tournament.id, dataToSave);
      } else {
        await Tournament.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving tournament:", error);
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
          <Trophy className="w-6 h-6" />
          {isEditing ? 'Edit Tournament' : 'Create New Tournament'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Tournament Name *</Label>
              <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label className="font-body font-semibold text-emerald-800">Host Club *</Label>
                <Select value={formData.host_club_id} onValueChange={(value) => handleChange('host_club_id', value)} required>
                  <SelectTrigger><SelectValue placeholder="Select host club" /></SelectTrigger>
                  <SelectContent>
                    {clubs.map(club => <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Description</Label>
            <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Date *</Label>
              <Input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Registration Deadline *</Label>
              <Input type="date" value={formData.registration_deadline} onChange={(e) => handleChange('registration_deadline', e.target.value)} required />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Max Participants</Label>
              <Input type="number" value={formData.max_participants} onChange={(e) => handleChange('max_participants', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Entry Fee (€)</Label>
              <Input type="number" value={formData.entry_fee} onChange={(e) => handleChange('entry_fee', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Tournament Type</Label>
              <Select value={formData.tournament_type} onValueChange={(value) => handleChange('tournament_type', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="singles">Singles</SelectItem>
                  <SelectItem value="doubles">Doubles</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Handicap Range</Label>
              <Input value={formData.handicap_range} onChange={(e) => handleChange('handicap_range', e.target.value)} placeholder="e.g. 0-8" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : (isEditing ? 'Update Tournament' : 'Create Tournament')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}