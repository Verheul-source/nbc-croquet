// NEW COMPONENT: UserRoleManagement.jsx
// For managing user roles including rules committee

import React, { useState, useEffect } from "react";
import { User, Member } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Shield, Search, UserCheck, Settings, BookOpen } from "lucide-react";

export default function UserRoleManagement() {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Role definitions with permissions
  const roleDefinitions = {
    admin: {
      name: "Administrator",
      description: "Full system access",
      permissions: ["all"],
      icon: Shield,
      color: "bg-red-100 text-red-800"
    },
    rules_committee: {
      name: "Rules Committee",
      description: "Can manage rules but not members",
      permissions: ["rules_read", "rules_write", "rules_delete"],
      icon: BookOpen,
      color: "bg-blue-100 text-blue-800"
    },
    member: {
      name: "Member",
      description: "Basic member access",
      permissions: ["basic_read"],
      icon: UserCheck,
      color: "bg-green-100 text-green-800"
    },
    guest: {
      name: "Guest",
      description: "Limited read-only access",
      permissions: ["public_read"],
      icon: Users,
      color: "bg-gray-100 text-gray-800"
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, usersData, membersData] = await Promise.all([
        User.me(),
        User.list().catch(() => []), // May not exist yet
        Member.list()
      ]);
      
      setCurrentUser(userData);
      setUsers(usersData);
      setMembers(membersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await User.update(userId, { role: newRole });
      setShowRoleDialog(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const getRoleInfo = (role) => {
    return roleDefinitions[role] || roleDefinitions.guest;
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading users...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">
            Administrator Access Required
          </h2>
          <p className="font-body text-emerald-600">
            Only administrators can manage user roles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900">
            User Role Management
          </h1>
          <p className="font-body text-emerald-600 mt-1">
            Manage user roles and permissions for the croquet association
          </p>
        </div>
      </div>

      {/* Role Definitions */}
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="font-display text-xl text-emerald-900">
            Available Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(roleDefinitions).map(([roleKey, role]) => {
              const IconComponent = role.icon;
              return (
                <div key={roleKey} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="w-5 h-5 text-emerald-600" />
                    <Badge className={role.color}>
                      {role.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-600 mb-2">
                    {role.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Permissions: {role.permissions.join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-emerald-400" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 font-body border-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Users List */}
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="font-display text-xl text-emerald-900">
            System Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map(user => {
              const roleInfo = getRoleInfo(user.role);
              const IconComponent = roleInfo.icon;
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="font-body font-semibold text-emerald-700">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.email[0].toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-display font-semibold text-emerald-900">
                        {user.name || 'Unnamed User'}
                      </h3>
                      <p className="text-sm text-emerald-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-emerald-600" />
                      <Badge className={roleInfo.color}>
                        {roleInfo.name}
                      </Badge>
                    </div>
                    
                    {user.id !== currentUser.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleDialog(true);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Change Role
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-emerald-900 mb-1">
                  No users found
                </h3>
                <p className="font-body text-emerald-600 text-sm">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No users have been registered yet.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-emerald-900">
              Change User Role
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-display font-semibold text-emerald-900">
                  {selectedUser.name || 'Unnamed User'}
                </h4>
                <p className="font-body text-emerald-700 text-sm">
                  {selectedUser.email}
                </p>
                <p className="font-body text-emerald-600 text-sm mt-1">
                  Current role: {getRoleInfo(selectedUser.role).name}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="font-body font-semibold text-emerald-800">
                  Select New Role
                </Label>
                {Object.entries(roleDefinitions).map(([roleKey, role]) => {
                  const IconComponent = role.icon;
                  return (
                    <div 
                      key={roleKey}
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-emerald-300 ${
                        selectedUser.role === roleKey ? 'border-emerald-300 bg-emerald-50' : ''
                      }`}
                      onClick={() => updateUserRole(selectedUser.id, roleKey)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-body font-semibold text-emerald-900">
                            {role.name}
                          </div>
                          <div className="text-sm text-emerald-600">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRoleDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}