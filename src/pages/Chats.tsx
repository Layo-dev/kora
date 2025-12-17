import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type MatchRow = Tables<"matches">;
type ProfileRow = Tables<"profiles">;
type MessageRow = Tables<"messages">;

type ChatItem = {
  matchId: string;
  otherUserId: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  isUnread: boolean;
};

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString();
}

const Chats = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadChats = async () => {
      setLoading(true);

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setCurrentUserId(null);
        setChatItems([]);
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      setCurrentUserId(userId);

      // Fetch matches involving current user
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1.eq.${userId},user2.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (matchesError || !matchesData || matchesData.length === 0) {
        if (!cancelled) {
          setChatItems([]);
          setLoading(false);
        }
        return;
      }

      const matches = matchesData as MatchRow[];
      const matchIds = matches.map((m) => m.id);
      const otherUserIds = matches.map((m) => (m.user1 === userId ? m.user2! : m.user1!));

      // Fetch other users' profiles (avatar_url = primary photo)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", otherUserIds);

      if (profilesError || !profilesData) {
        console.error("Failed to load profiles:", profilesError);
        if (!cancelled) {
          setChatItems([]);
          setLoading(false);
        }
        return;
      }

      const profilesMap = new Map<string, ProfileRow>();
      (profilesData as ProfileRow[]).forEach((p) => profilesMap.set(p.id, p));

      // Fetch latest messages per match (newest first, then pick first per match)
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false });

      if (messagesError) {
        console.error("Failed to load messages:", messagesError);
      }

      const latestMessageByMatch = new Map<string, MessageRow>();
      (messagesData as MessageRow[] | null | undefined)?.forEach((msg) => {
        if (!msg.match_id) return;
        if (!latestMessageByMatch.has(msg.match_id)) {
          latestMessageByMatch.set(msg.match_id, msg);
        }
      });

      const items: ChatItem[] = matches.map((match) => {
        const otherId = match.user1 === userId ? match.user2! : match.user1!;
        const profile = profilesMap.get(otherId);
        const latest = latestMessageByMatch.get(match.id);

        const name = profile?.full_name ?? "Someone";
        const avatarUrl = profile?.avatar_url ?? null;
        const lastMessage = latest?.content ?? null;
        const lastMessageAt = latest?.created_at ?? null;
        const isUnread = latest ? latest.sender_id !== userId : false;

        return {
          matchId: match.id,
          otherUserId: otherId,
          name,
          avatarUrl,
          lastMessage,
          lastMessageAt,
          isUnread,
        };
      });

      if (!cancelled) {
        setChatItems(items);
        setLoading(false);
      }
    };

    loadChats();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedChats = useMemo(() => {
    return [...chatItems].sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [chatItems]);

  const handleOpenChat = (matchId: string) => {
    // TODO: navigate to chat detail route once implemented
    console.log("Open chat for match:", matchId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Chats</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedChats.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedChats.map((chat) => (
              <button
                key={chat.matchId}
                onClick={() => handleOpenChat(chat.matchId)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-accent/60 transition-colors text-left"
              >
                <Avatar className="w-12 h-12">
                  {chat.avatarUrl ? (
                    <AvatarImage src={chat.avatarUrl} alt={chat.name} />
                  ) : (
                    <AvatarFallback>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate ${
                        chat.isUnread ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {chat.name}
                    </p>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(chat.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`text-xs text-muted-foreground truncate ${
                        chat.isUnread ? "font-semibold text-foreground" : ""
                      }`}
                    >
                      {chat.lastMessage || "Say hi 👋"}
                    </p>
                    {chat.isUnread && (
                      <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Chats;
