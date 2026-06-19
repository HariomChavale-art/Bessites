
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Heart, Bookmark, Settings, Grid, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const savedWebsites = MOCK_WEBSITES.slice(0, 4);
  const likedWebsites = MOCK_WEBSITES.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* User Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-4 group">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary/20 shadow-2xl">
              <AvatarImage src="https://picsum.photos/seed/user123/200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg border-2 border-background">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-headline font-bold text-white mb-1">Jane Discoverer</h1>
          <p className="text-muted-foreground text-sm mb-6">@janedoe • Curating the web's best flows</p>
          
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white/5">
              Edit Profile
            </Button>
            <Link href="/submit">
              <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white glow-primary">
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="saved" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/5 border border-white/5 rounded-full p-1 h-auto">
              <TabsTrigger 
                value="saved" 
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all"
              >
                <Heart className="w-4 h-4 mr-2" />
                Liked
              </TabsTrigger>
              <TabsTrigger 
                value="uploads" 
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all"
              >
                <Grid className="w-4 h-4 mr-2" />
                Uploads
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="saved">
            {savedWebsites.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
                {savedWebsites.map((app) => (
                  <WebsiteCard key={app.id} website={app} />
                ))}
              </div>
            ) : (
              <EmptyState title="No saved websites yet" description="Explore the feed and bookmark your favorites." />
            )}
          </TabsContent>

          <TabsContent value="liked">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
              {likedWebsites.map((app) => (
                <WebsiteCard key={app.id} website={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="uploads">
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 text-center px-4">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Share your creation</h3>
              <p className="text-muted-foreground max-w-xs mb-8">Got a cool web tool? Submit it to our community for review and discovery.</p>
              <Link href="/submit">
                <Button className="rounded-full px-10 bg-white text-background hover:bg-white/90">
                  Submit Now
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="text-center py-20">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
