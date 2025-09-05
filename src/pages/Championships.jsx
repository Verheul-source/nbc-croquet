import React, { useState, useEffect } from "react";
import { Ranking, Member, AppSetting } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, TrendingDown, Minus, Shield, Users, Target, Trophy, Gamepad2 } from "lucide-react";

export default function Championships() {
  const [rankings, setRankings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState("2026");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const settings = await AppSetting.list();
        const seasonSetting = settings.find(s => s.key === 'current_season');
        const season = seasonSetting ? seasonSetting.value : "2026";
        setCurrentSeason(season);

        const [rankingsData, membersData] = await Promise.all([
          Ranking.filter({ season: season }, "current_position"),
          Member.list()
        ]);
        setRankings(rankingsData);
        setMembers(membersData);
      } catch (error) {
        console.error("Error loading championship data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getMemberInfo = (memberId) => {
    return members.find(m => m.id === memberId) || { full_name: "Unknown Player" };
  };
  
  const getPositionChangeIcon = (current, previous) => {
    if (!previous || previous === current) return <Minus className="w-4 h-4 text-gray-400" />;
    if (previous > current) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getPositionBadge = (position) => {
    if (position === 1) return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white";
    if (position === 2) return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    if (position === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    if (position <= 10) return "bg-emerald-100 text-emerald-800";
    return "bg-gray-100 text-gray-600";
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading Season {currentSeason} Championships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">
          Seasonal Championship {currentSeason}
        </h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700 max-w-2xl mx-auto">
          The official standings for the {currentSeason} Stichts Croquet seasonal championship.
        </p>
      </div>

      <Card className="border-2 border-emerald-100">
        <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-transparent">
          <CardTitle className="font-display text-2xl text-emerald-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            Official Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50 border-b border-emerald-100">
                <tr>
                  <th className="text-left font-body font-semibold text-emerald-800 py-4 px-6">Rank</th>
                  <th className="text-left font-body font-semibold text-emerald-800 py-4 px-6">Player</th>
                  <th className="text-center font-body font-semibold text-emerald-800 py-4 px-6">Wins</th>
                  <th className="text-center font-body font-semibold text-emerald-800 py-4 px-6">Played</th>
                  <th className="text-center font-body font-semibold text-emerald-800 py-4 px-6">Points</th>
                  <th className="text-center font-body font-semibold text-emerald-800 py-4 px-6">Handicap</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((player, index) => {
                  const member = getMemberInfo(player.member_id);
                  const isFirst = player.current_position === 1;

                  return (
                    <tr key={player.id} className={`border-b border-emerald-50 hover:bg-emerald-25 transition-colors ${isFirst ? 'bg-amber-50' : ''}`}>
                      <td className="py-4 px-6">
                        <Badge className={`flex items-center gap-2 ${getPositionBadge(player.current_position)}`}>
                          {isFirst && <Crown className="w-4 h-4 text-amber-800" />}
                          #{player.current_position}
                          {getPositionChangeIcon(player.current_position, player.previous_position)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-body font-semibold text-emerald-900">
                          {member.full_name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-600" />
                          <span className="font-body font-bold text-emerald-900">
                            {player.wins || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                         <div className="flex items-center justify-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-gray-500" />
                          <span className="font-body text-emerald-800">
                            {player.tournaments_played || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-body text-emerald-800">
                          {player.points}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                          {player.handicap}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {rankings.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                No Rankings for this Season
              </h3>
              <p className="font-body text-emerald-600">
                Championship rankings for the {currentSeason} season have not been recorded yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}