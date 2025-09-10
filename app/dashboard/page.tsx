"use client";
  
  import { useAuth } from "@/contexts/AuthContext";

  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

  export default function DashboardPage() {
    const { user, loading, signOut } = useAuth();

    // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
    // If not authenticated, show a message (this should be rare due to middleware)
    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-900">
          {/* <div className="text-white">Not authenticated</div> */}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-neutral-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <Button 
              onClick={signOut}
              variant="outline"
              className="text-white border-neutral-600 hover:bg-neutral-700"
            >
              Sign Out
            </Button>
          </div>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-white">Welcome to Nabula.Ai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-neutral-300">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                {user.user_metadata?.full_name && (
                  <p><strong>Name:</strong> {user.user_metadata.full_name}</p>
                )}
              </div>
              <div className="text-neutral-400 text-sm">
                <p>Your second brain hub is ready!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }