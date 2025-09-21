"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Mail, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/layout";

interface TeamMember {
  _id: string;
  name: string;
  photo: string;
  designation: string;
  bio?: string;
  email?: string;
  phone?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  order: number;
  isActive: boolean;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; memberId: string | null }>({
    open: false,
    memberId: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(data.data || []);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: `Failed to fetch team members: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async (memberData: Partial<TeamMember>) => {
    try {
      const token = localStorage.getItem("auth-token");
      const url = editingMember ? `/api/team/${editingMember._id}` : "/api/team";
      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save team member");
      }

      toast({
        title: "Success",
        description: `Team member ${editingMember ? "updated" : "added"} successfully`,
      });
      fetchTeamMembers();
      setShowForm(false);
      setEditingMember(null);
    } catch (error: any) {
      console.error("Error saving team member:", error);
      toast({
        title: "Error",
        description: `Failed to save team member: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteDialog.memberId) return;
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/team/${deleteDialog.memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete team member");
      
      toast({ title: "Success", description: "Team member deleted successfully" });
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: `Failed to delete team member: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, memberId: null });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-background">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-background">
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border p-8 shadow-sm flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground text-lg mt-1">Manage your school's team members and staff.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="p-6">
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
              {teamMembers.map((member, index) => (
                <div key={member._id} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <Card className="relative bg-card border-border rounded-2xl shadow-lg p-0 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      <Image
                        src={member.photo || "https://placehold.co/400x400/000000/FFFFFF?text=No+Photo"}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/000000/FFFFFF?text=Error'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex space-x-2 z-10">
                        <Button size="icon" variant="secondary" onClick={() => { setEditingMember(member); setShowForm(true); }} className="rounded-full h-9 w-9">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => setDeleteDialog({ open: true, memberId: member._id })} className="rounded-full h-9 w-9">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {!member.isActive && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                          <span className="text-foreground font-semibold text-lg px-4 py-2 bg-secondary rounded-lg border border-border">Inactive</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-bold text-xl text-foreground">{member.name}</h3>
                      <p className="text-primary font-medium">{member.designation}</p>
                      {member.bio && <p className="text-muted-foreground text-sm line-clamp-2">{member.bio}</p>}
                      <div className="space-y-2 pt-3 border-t border-border">
                        {member.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 text-primary/80" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 text-primary/80" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex space-x-3">
                          {/* Social links can be added here if needed */}
                        </div>
                        <Badge variant={member.isActive ? "default" : "secondary"}>
                          {member.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 animate-fade-in-up">
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Team Members Yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first team member to showcase your school's staff.</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {showForm && (
          <TeamMemberForm
            member={editingMember}
            onSave={handleSaveMember}
            onCancel={() => { setShowForm(false); setEditingMember(null); }}
          />
        )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Team Member"
          description="Are you sure you want to delete this team member? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteMember}
          variant="destructive"
        />
      </div>
      <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </AdminLayout>
  );
}
