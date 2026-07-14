
'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  Loader2, 
  Globe, 
  User as UserIcon,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), orderBy("timestamp", "desc"));
  }, [db]);

  const { data: submissions, loading: subLoading } = useCollection(submissionsRef);

  const handleStatusUpdate = (subId: string, status: 'approved' | 'rejected') => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);

    updateDoc(subRef, { status })
      .then(() => {
        toast({
          title: status === 'approved' ? "Approved" : "Rejected",
          description: `Submission is now ${status}.`,
        });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'update',
          requestResourceData: { status }
        }));
      });
  };

  const handleDelete = (subId: string) => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);

    deleteDoc(subRef)
      .then(() => {
        toast({
          title: "Deleted",
          description: "Submission removed permanently.",
        });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'delete'
        }));
      });
  };

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Simplified admin check for MVP: Any logged in user for now, or use profile.isAdmin
  // If you want strict admin access, uncomment the block below:
  /*
  if (!profile?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have administrative privileges.</p>
        </main>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
              Control <span className="text-primary">Center</span>
            </h1>
            <p className="text-muted-foreground font-medium">Manage community project submissions and discovery flow.</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 h-fit py-1 px-4 text-xs font-black uppercase italic">
            {submissions?.length || 0} Total Submissions
          </Badge>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submitter</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categories</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions && submissions.length > 0 ? (
                  submissions.map((sub: any) => (
                    <tr key={sub.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {sub.logoUrl ? (
                              <img src={sub.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <Globe className="w-5 h-5 text-muted-foreground opacity-20" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <a href={sub.url} target="_blank" rel="noreferrer" className="text-white font-bold hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                              {sub.url.replace('https://', '')}
                              <ExternalLink className="w-3 h-3 opacity-30" />
                            </a>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                              {sub.timestamp ? new Date(sub.timestamp.toDate()).toLocaleDateString() : 'Recent'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-white/80">{sub.userEmail}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1">
                          {sub.categories?.slice(0, 2).map((cat: string) => (
                            <Badge key={cat} variant="secondary" className="bg-white/5 text-[8px] font-black uppercase tracking-widest px-2 py-0">
                              {cat}
                            </Badge>
                          ))}
                          {sub.categories?.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{sub.categories.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge className={cn(
                          "uppercase font-black tracking-widest text-[9px] px-2.5 py-0.5 rounded-full border-none",
                          sub.status === 'approved' ? "bg-green-500/10 text-green-500" :
                          sub.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                          "bg-amber-500/10 text-amber-500"
                        )}>
                          {sub.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status !== 'approved' && (
                            <Button 
                              size="icon" 
                              onClick={() => handleStatusUpdate(sub.id, 'approved')}
                              className="w-9 h-9 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-none shadow-none"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {sub.status !== 'rejected' && (
                            <Button 
                              size="icon" 
                              onClick={() => handleStatusUpdate(sub.id, 'rejected')}
                              className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none shadow-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            onClick={() => handleDelete(sub.id)}
                            className="w-9 h-9 rounded-xl bg-white/5 text-muted-foreground hover:bg-destructive hover:text-white border-none shadow-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <Globe className="w-16 h-16 text-muted-foreground mx-auto opacity-10 mb-4" />
                      <p className="text-muted-foreground font-medium italic text-lg">No submissions yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
