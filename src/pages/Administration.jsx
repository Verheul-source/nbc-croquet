
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { NewsArticle, Member, Rule, Tournament, Ranking, Club, AppSetting } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, FileText, Users, BookOpen, Trophy, Plus, Pencil, Trash2, Shield, Save } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import NewsForm from "../components/admin/NewsForm";
import MemberForm from "../components/admin/MemberForm";
import RuleForm from "../components/admin/RuleForm";
import RankingForm from "../components/admin/RankingForm";
import ClubForm from "../components/admin/ClubForm";
import TournamentForm from "../components/admin/TournamentForm";

export default function Administration() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [savingSeason, setSavingSeason] = useState(false);
  
  // Data states
  const [data, setData] = useState({
    news: [],
    members: [],
    rules: [],
    tournaments: [],
    rankings: [],
    clubs: [],
    settings: [],
  });

  const loadData = useCallback(async () => {
    try {
      const [newsData, membersData, rulesData, tournamentsData, rankingsData, clubsData, settingsData] = await Promise.all([
        NewsArticle.list("-created_date"),
        Member.list("-created_date"),
        Rule.list(),
        Tournament.list("-date"),
        Ranking.list("-season"),
        Club.list(),
        AppSetting.list(),
      ]);
      
      const membersWithClub = await Promise.all(membersData.map(async m => {
          const club = clubsData.find(c => c.id === m.club_id);
          return {...m, club_name: club?.name || "N/A" };
      }));
      
      setData({
        news: newsData,
        members: membersWithClub,
        rules: rulesData,
        tournaments: tournamentsData,
        rankings: rankingsData,
        clubs: clubsData,
        settings: settingsData,
      });

      const seasonSetting = settingsData.find(s => s.key === 'current_season');
      setCurrentSeason(seasonSetting?.value || new Date().getFullYear().toString());
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      if (userData.role === 'admin') {
        await loadData();
      }
    } catch (error) {
      console.error("Not authenticated");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  const handleAdd = (type) => {
    setEditingItem(null);
    setFormType(type);
    setShowForm(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormType(type);
    setShowForm(true);
  };

  const handleDelete = async (entityType, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const Entity = {
        news: NewsArticle,
        member: Member,
        rule: Rule,
        tournament: Tournament,
        ranking: Ranking,
        club: Club
      }[entityType];

      if (Entity) {
        await Entity.delete(id);
      }
      await loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
  const onFormSave = async () => {
    setShowForm(false);
    setEditingItem(null);
    setFormType("");
    await loadData();
  };

  const onFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormType("");
  };

  const handleSaveSeason = async () => {
    setSavingSeason(true);
    try {
      const seasonSetting = data.settings.find(s => s.key === 'current_season');
      if (seasonSetting) {
        await AppSetting.update(seasonSetting.id, { value: currentSeason });
      } else {
        await AppSetting.create({ key: 'current_season', value: currentSeason });
      }
      await loadData(); // Reload data to ensure settings state is updated
    } catch (error) {
      console.error("Error saving season:", error);
    } finally {
      setSavingSeason(false);
    }
  };

  const renderForm = () => {
    switch (formType) {
      case 'news':
        return <NewsForm article={editingItem} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      case 'member':
        return <MemberForm member={editingItem} clubs={data.clubs} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      case 'rule':
        return <RuleForm rule={editingItem} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      case 'ranking':
        return <RankingForm ranking={editingItem} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      case 'club':
        return <ClubForm club={editingItem} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      case 'tournament':
        return <TournamentForm tournament={editingItem} clubs={data.clubs} onSave={onFormSave} onCancel={onFormCancel} isEditing={!!editingItem} />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Settings className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Authentication Required</h2>
          <p className="font-body text-emerald-600 mb-6">Please log in to access the administration panel.</p>
          <Button onClick={() => User.login()} className="bg-emerald-700 hover:bg-emerald-800">Log In</Button>
        </CardContent>
      </Card>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Settings className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Administrator Access Required</h2>
          <p className="font-body text-emerald-600">You need administrator privileges to access this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">Administration Panel</h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700">Manage content and data for the Nederlandse Bond der Croquet</p>
      </div>

      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); onFormCancel(); }}>
        <TabsList className="bg-emerald-100 border-emerald-200 w-full justify-start overflow-x-auto">
          <TabsTrigger value="news"><FileText className="w-4 h-4 mr-2" />News ({data.news.length})</TabsTrigger>
          <TabsTrigger value="members"><Users className="w-4 h-4 mr-2" />Members ({data.members.length})</TabsTrigger>
          <TabsTrigger value="clubs"><Users className="w-4 h-4 mr-2" />Clubs ({data.clubs.length})</TabsTrigger>
          <TabsTrigger value="rankings"><Shield className="w-4 h-4 mr-2" />Rankings ({data.rankings.length})</TabsTrigger>
          <TabsTrigger value="rules"><BookOpen className="w-4 h-4 mr-2" />Rules ({data.rules.length})</TabsTrigger>
          <TabsTrigger value="tournaments"><Trophy className="w-4 h-4 mr-2" />Tournaments ({data.tournaments.length})</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
        </TabsList>

        {showForm ? (
          <div className="mt-6">{renderForm()}</div>
        ) : (
          <>
            <TabsContent value="news" className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage News Articles</h2><Button onClick={() => handleAdd('news')}><Plus className="w-4 h-4 mr-2" />Add Article</Button></div>
              {data.news.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">By {item.author} | {format(new Date(item.publish_date || item.created_date), "MMM d, yyyy")}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'news')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('news', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage Members</h2><Button onClick={() => handleAdd('member')}><Plus className="w-4 h-4 mr-2" />Add Member</Button></div>
              {data.members.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{item.full_name}</h3><p className="text-sm text-gray-500">{item.club_name}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'member')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('member', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>

            <TabsContent value="clubs" className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage Clubs</h2><Button onClick={() => handleAdd('club')}><Plus className="w-4 h-4 mr-2" />Add Club</Button></div>
              {data.clubs.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{item.name}</h3><p className="text-sm text-gray-500">{item.location}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'club')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('club', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>

            <TabsContent value="rankings" className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage Rankings</h2><Button onClick={() => handleAdd('ranking')}><Plus className="w-4 h-4 mr-2" />Add Ranking</Button></div>
              {data.rankings.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{data.members.find(m => m.id === item.member_id)?.full_name || "Unknown"}</h3><p className="text-sm text-gray-500">Season: {item.season} | Position: {item.current_position}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'ranking')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('ranking', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage Rules</h2><Button onClick={() => handleAdd('rule')}><Plus className="w-4 h-4 mr-2" />Add Rule</Button></div>
              {data.rules.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{item.section_title}</h3><p className="text-sm text-gray-500">{item.part_title}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'rule')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('rule', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>
            
            <TabsContent value="tournaments" className="space-y-6">
               <div className="flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-emerald-900">Manage Tournaments</h2><Button onClick={() => handleAdd('tournament')}><Plus className="w-4 h-4 mr-2" />Add Tournament</Button></div>
               {data.tournaments.map((item) => <div key={item.id} className="border rounded p-4 flex justify-between items-start"><div><h3 className="font-bold">{item.name}</h3><p className="text-sm text-gray-500">{format(new Date(item.date), "MMM d, yyyy")}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleEdit(item, 'tournament')}><Pencil className="w-4 h-4"/></Button><Button variant="outline" size="icon" onClick={() => handleDelete('tournament', item.id)}><Trash2 className="w-4 h-4"/></Button></div></div>)}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-season" className="font-body font-semibold text-emerald-800">Current Season</Label>
                    <p className="text-sm text-emerald-600">This determines which season is shown on the Championships page.</p>
                    <div className="flex items-center gap-2">
                      <Input
                        id="current-season"
                        value={currentSeason}
                        onChange={(e) => setCurrentSeason(e.target.value)}
                        placeholder="e.g. 2026"
                        className="max-w-xs"
                      />
                      <Button onClick={handleSaveSeason} disabled={savingSeason}>
                        <Save className="w-4 h-4 mr-2" />
                        {savingSeason ? 'Saving...' : 'Save Season'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}