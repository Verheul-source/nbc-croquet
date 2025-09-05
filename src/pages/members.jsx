import React, { useState, useEffect } from "react";
import { User } from "@/lib/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Phone, MapPin, Calendar, Crown } from "lucide-react";
import { format } from "date-fns";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [canViewMembers, setCanViewMembers] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setUser({ role: "admin" }); // Mock admin user for testing
    setCanViewMembers(true);
    
    // Fetch members from API route instead of direct database call
    const response = await fetch('/api/members');
    const membersData = await response.json();
    
    setMembers(membersData);
  } catch (error) {
    console.error("Error loading members:", error);
    setCanViewMembers(false);
    setMembers([]);
  } finally {
    setLoading(false);
  }
};

  const filteredMembers = members.filter(member =>
    searchTerm === "" ||
    (member.full_name && member.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.club_name && member.club_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.membership_number && member.membership_number.includes(searchTerm))
  );

  const groupedByClub = filteredMembers.reduce((acc, member) => {
    const club = member.club_name || "Unknown Club";
    if (!acc[club]) acc[club] = [];
    acc[club].push(member);
    return acc;
  }, {});

  const membershipTypeColors = {
    full: "bg-emerald-100 text-emerald-800 border-emerald-300",
    senior: "bg-blue-100 text-blue-800 border-blue-300",
    junior: "bg-orange-100 text-orange-800 border-orange-300",
    honorary: "bg-purple-100 text-purple-800 border-purple-300"
  };

  const membershipTypeIcons = {
    full: "👤",
    senior: "👴",
    junior: "👶", 
    honorary: "👑"
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading members...</p>
      </div>
    );
  }

  // Show access restricted message for non-admin users
  if (!canViewMembers) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-emerald-900">
            Member Directory
          </h1>
          <div className="ornate-divider w-64 mx-auto"></div>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
              Access Restricted
            </h3>
            <p className="font-body text-emerald-600 mb-6">
              Member information is restricted to administrators only. 
              Please log in with an administrator account to view the member directory.
            </p>
            {!user && (
              <Button onClick={() => User.login()} className="bg-emerald-700 hover:bg-emerald-800">
                Log In
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">
          Member Directory
        </h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700 max-w-2xl mx-auto">
          Connect with fellow croquet enthusiasts across our distinguished clubs throughout the Netherlands.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-emerald-400" />
          <Input
            placeholder="Search by name, club, or membership number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 font-body border-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold text-emerald-900 mb-1">
              Total Members
            </h3>
            <p className="font-body text-2xl font-bold text-emerald-800">
              {members.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold text-emerald-900 mb-1">
              Active Clubs
            </h3>
            <p className="font-body text-2xl font-bold text-emerald-800">
              {Object.keys(groupedByClub).length}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-3">👶</div>
            <h3 className="font-display text-lg font-semibold text-emerald-900 mb-1">
              Junior Members
            </h3>
            <p className="font-body text-2xl font-bold text-emerald-800">
              {members.filter(m => m.membership_type === 'junior').length}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-3">👑</div>
            <h3 className="font-display text-lg font-semibold text-emerald-900 mb-1">
              Honorary Members
            </h3>
            <p className="font-body text-2xl font-bold text-emerald-800">
              {members.filter(m => m.membership_type === 'honorary').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members by Club */}
      <div className="space-y-8">
        {Object.entries(groupedByClub).map(([clubName, clubMembers]) => (
          <Card key={clubName} className="border-2 border-emerald-100">
            <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-transparent">
              <CardTitle className="font-display text-2xl text-emerald-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                {clubName}
                <Badge variant="outline" className="ml-auto border-emerald-300 text-emerald-700">
                  {clubMembers.length} members
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubMembers.map((member) => (
                  <Card key={member.id} className="border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="font-body font-semibold text-emerald-700">
                              {member.full_name ? member.full_name.split(' ').map(n => n[0]).join('') : '?'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-semibold text-emerald-900">
                              {member.full_name || 'Unknown Member'}
                            </h3>
                            <p className="font-body text-sm text-emerald-600">
                              #{member.membership_number || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <Badge className={membershipTypeColors[member.membership_type] || membershipTypeColors.full}>
                          <span className="mr-1">{membershipTypeIcons[member.membership_type] || membershipTypeIcons.full}</span>
                          {member.membership_type || 'full'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span className="font-body text-emerald-700">{member.phone}</span>
                          </div>
                        )}
                        
                        {member.address && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="font-body text-emerald-700">{member.address}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-emerald-400" />
                          <span className="font-body text-emerald-700">
                            Joined {format(new Date(member.date_joined || member.created_date), "MMMM yyyy")}
                          </span>
                        </div>

                        {member.handicap && (
                          <div className="flex items-center gap-2 text-sm">
                            <Crown className="w-4 h-4 text-emerald-400" />
                            <span className="font-body text-emerald-700">
                              Handicap: {member.handicap}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
              No Members Found
            </h3>
            <p className="font-body text-emerald-600">
              {searchTerm 
                ? "No members match your search criteria. Try adjusting your search terms."
                : "No members have been registered yet."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-emerald-900 mb-4">
              Member Administration
            </h2>
            <p className="font-body text-emerald-700 mb-6">
              As an administrator, you can manage member records, update contact information, 
              and handle membership renewals through the admin dashboard.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-body font-semibold">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}