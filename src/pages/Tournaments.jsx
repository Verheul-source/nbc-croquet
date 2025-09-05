import React, { useState, useEffect } from "react";
import { Tournament, Registration, Club } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Euro, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [user, setUser] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    partner_name: "",
    special_requirements: ""
  });
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tournamentsData, registrationsData, clubsData, userData] = await Promise.all([
        Tournament.list("-date"),
        Registration.list(),
        Club.list(),
        User.me().catch(() => null)
      ]);

      // Enrich tournaments with club information
      const enrichedTournaments = tournamentsData.map(tournament => {
        const club = clubsData.find(c => c.id === tournament.host_club_id);
        return {
          ...tournament,
          host_club: club?.name || "Unknown Club",
          location: tournament.location || club?.location || "Location TBD"
        };
      });

      setTournaments(enrichedTournaments);
      setRegistrations(registrationsData);
      setClubs(clubsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading tournament data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (tournament) => {
    if (!user) {
      await User.login();
      return;
    }

    setSelectedTournament(tournament);
    setShowRegistration(true);
  };

  const submitRegistration = async () => {
    if (!selectedTournament || !user) return;

    setRegistering(true);
    try {
      await Registration.create({
        tournament_id: selectedTournament.id,
        member_id: user.id,
        ...registrationForm
      });
      
      setShowRegistration(false);
      setRegistrationForm({ partner_name: "", special_requirements: "" });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = (tournamentId) => {
    return user && registrations.some(reg =>
      reg.tournament_id === tournamentId && reg.member_id === user.id
    );
  };

  const getStatusBadge = (tournament) => {
    const isDeadlinePassed = new Date(tournament.registration_deadline) < new Date();
    const registrationCount = registrations.filter(reg => reg.tournament_id === tournament.id).length;
    
    if (tournament.status === 'completed') {
      return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
    }
    if (isDeadlinePassed || tournament.status === 'closed') {
      return <Badge className="bg-red-100 text-red-800">Registration Closed</Badge>;
    }
    if (registrationCount >= tournament.max_participants) {
      return <Badge className="bg-orange-100 text-orange-800">Full</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Open</Badge>;
  };

  const canRegister = (tournament) => {
    if (!user) return true; // Will trigger login
    if (isRegistered(tournament.id)) return false;
    if (tournament.status !== 'open') return false;
    if (new Date(tournament.registration_deadline) < new Date()) return false;
    const registrationCount = registrations.filter(reg => reg.tournament_id === tournament.id).length;
    return registrationCount < tournament.max_participants;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading tournaments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">
          Tournament Calendar
        </h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700 max-w-2xl mx-auto">
          Join fellow croquet enthusiasts in tournaments across the Netherlands.
          Test your skills and enjoy the camaraderie of competitive play.
        </p>
      </div>

      <div className="grid gap-8">
        {tournaments.map((tournament) => {
          const registrationCount = registrations.filter(reg => reg.tournament_id === tournament.id).length;
          
          return (
            <Card key={tournament.id} className="border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-amber-50">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <CardTitle className="font-display text-2xl text-emerald-900">
                          {tournament.name}
                        </CardTitle>
                        <p className="font-body text-emerald-600 mt-1">
                          Hosted by {tournament.host_club}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {getStatusBadge(tournament)}
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {tournament.tournament_type || 'Singles'}
                      </Badge>
                      {isRegistered(tournament.id) && (
                        <Badge className="bg-blue-100 text-blue-800">
                          You're Registered
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="flex items-center lg:justify-end gap-2 text-emerald-700">
                      <Calendar className="w-4 h-4" />
                      <span className="font-body font-semibold">
                        {format(new Date(tournament.date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-2 text-emerald-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-body text-sm">
                        Register by {format(new Date(tournament.registration_deadline), "MMM d")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {tournament.description && (
                      <p className="font-body text-emerald-700 leading-relaxed">
                        {tournament.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <span className="font-body text-emerald-700">
                          {tournament.location}
                        </span>
                      </div>
                      
                      {tournament.handicap_range && (
                        <div className="flex items-center gap-3">
                          <Trophy className="w-5 h-5 text-emerald-500" />
                          <span className="font-body text-emerald-700">
                            Handicap: {tournament.handicap_range}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Euro className="w-5 h-5 text-emerald-500" />
                        <span className="font-body text-emerald-700">
                          Entry Fee: €{tournament.entry_fee || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body font-semibold text-emerald-800">
                          Registration
                        </span>
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-sm font-body text-emerald-700">
                        {registrationCount} / {tournament.max_participants || 50} registered
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((registrationCount / (tournament.max_participants || 50)) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleRegister(tournament)}
                        disabled={!canRegister(tournament)}
                        className={`px-8 py-3 font-body font-semibold ${
                          isRegistered(tournament.id)
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                        } text-amber-100`}
                      >
                        {isRegistered(tournament.id)
                          ? 'Already Registered'
                          : canRegister(tournament)
                            ? (user ? 'Register Now' : 'Login to Register')
                            : 'Registration Closed'
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {tournaments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                No Tournaments Scheduled
              </h3>
              <p className="font-body text-emerald-600">
                Check back soon for upcoming tournament announcements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-emerald-900">
              Tournament Registration
            </DialogTitle>
          </DialogHeader>
          
          {selectedTournament && (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-display font-semibold text-emerald-900">
                  {selectedTournament.name}
                </h4>
                <p className="font-body text-emerald-700 text-sm mt-1">
                  {format(new Date(selectedTournament.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>

              <div className="space-y-4">
                {selectedTournament.tournament_type === 'doubles' && (
                  <div>
                    <Label className="font-body font-semibold text-emerald-800">
                      Partner Name
                    </Label>
                    <Input
                      value={registrationForm.partner_name}
                      onChange={(e) => setRegistrationForm(prev => ({
                        ...prev,
                        partner_name: e.target.value
                      }))}
                      placeholder="Enter your partner's name"
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="font-body font-semibold text-emerald-800">
                    Special Requirements
                  </Label>
                  <Textarea
                    value={registrationForm.special_requirements}
                    onChange={(e) => setRegistrationForm(prev => ({
                      ...prev,
                      special_requirements: e.target.value
                    }))}
                    placeholder="Any dietary needs, accessibility requirements, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1"
                  disabled={registering}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitRegistration}
                  disabled={registering}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-amber-100"
                >
                  {registering ? 'Registering...' : 'Confirm Registration'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}