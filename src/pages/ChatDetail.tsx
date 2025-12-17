import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type ProfileRow = Tables<"profiles">;

const ChatDetail = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState<ProfileRow | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sending, hasMore, sendMessage, loadMore } =
    useRealtimeChat(matchId || null);

  // Get current user and other user info
  useEffect(() => {
    const loadUserInfo = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user || !matchId) return;

      const userId = userData.user.id;
      setCurrentUserId(userId);

      // Get match to find other user
      const { data: matchData } = await supabase
        .from("matches")
        .select("user1, user2")
        .eq("id", matchId)
        .maybeSingle();

      if (!matchData) return;

      const otherId = matchData.user1 === userId ? matchData.user2 : matchData.user1;
      if (!otherId) return;

      // Get other user's profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", otherId)
        .maybeSingle();

      if (profileData) {
        setOtherUser(profileData);
      }
    };

    loadUserInfo();
  }, [matchId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !matchId) return;

    try {
      await sendMessage(input);
      setInput("");
    } catch (error: any) {
      toast({
        title: "Failed to send",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!matchId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Invalid chat</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            {otherUser && (
              <>
                <Avatar className="w-8 h-8">
                  {otherUser.avatar_url ? (
                    <AvatarImage src={otherUser.avatar_url} alt={otherUser.full_name || ""} />
                  ) : (
                    <AvatarFallback>
                      {(otherUser.full_name || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h1 className="text-lg font-semibold text-foreground">
                  {otherUser.full_name || "Chat"}
                </h1>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No messages yet. Say hi! 👋
            </p>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load older messages"}
                </Button>
              </div>
            )}

            {messages.map((msg) => {
              const isOwn = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {/* Input */}
      <div className="border-t bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            size="icon"
            className="rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatDetail;

