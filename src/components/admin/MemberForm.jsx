import React, { useState } from "react";
import { Member } from "@/entities/Member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Users } from "lucide-react";
import { format } from "date-fns";

export default function MemberForm({ member, clubs, onSave, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState(member || {
    full_name: "",
    club_id: "",
    membership_number: "",
    phone: "",
    address: "",
    date_joined: format(new Date(), "yyyy-MM-dd"),
    membership_type: "full",
    handicap: 0
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await Member.update(member.id, formData);
      } else {
        await Member.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving member:", error);
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
          {isEditing ? 'Edit Member' : 'Add New Member'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Full Name *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Member's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Club Name *</Label>
              <Select value={formData.club_id} onValueChange={(value) => handleChange('club_id', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map(club => (
                    <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Membership Number *</Label>
              <Input
                value={formData.membership_number}
                onChange={(e) => handleChange('membership_number', e.target.value)}
                placeholder="e.g., A001, U015"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Membership Type</Label>
              <Select value={formData.membership_type} onValueChange={(value) => handleChange('membership_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Member</SelectItem>
                  <SelectItem value="senior">Senior Member</SelectItem>
                  <SelectItem value="junior">Junior Member</SelectItem>
                  <SelectItem value="honorary">Honorary Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Handicap</Label>
              <Input
                type="number"
                min="-5"
                max="24"
                value={formData.handicap}
                onChange={(e) => handleChange('handicap', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+31 20 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">Date Joined</Label>
              <Input
                type="date"
                value={formData.date_joined}
                onChange={(e) => handleChange('date_joined', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-emerald-800">Address</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Full address"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Member' : 'Add Member')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}