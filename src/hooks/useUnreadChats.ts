import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type MatchRow = Tables<"matches">;
type MessageRow = Tables<"messages">;

export function useUnreadChats() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadUnreadCount = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setUnreadCount(0);
        return;
      }

      const userId = userData.user.id;

      // Fetch matches
      const { data: matchesData } = await supabase
        .from("matches")
        .select("id, user1, user2")
        .or(`user1.eq.${userId},user2.eq.${userId}`);

      if (!matchesData || matchesData.length === 0) {
        if (!cancelled) setUnreadCount(0);
        return;
      }

      const matchIds = matchesData.map((m) => m.id);

      // Fetch latest message per match
      const { data: messagesData } = await supabase
        .from("messages")
        .select("match_id, sender_id, created_at")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false });

      if (!messagesData) {
        if (!cancelled) setUnreadCount(0);
        return;
      }

      // Group by match_id and get latest
      const latestByMatch = new Map<string, MessageRow>();
      (messagesData as MessageRow[]).forEach((msg) => {
        if (!msg.match_id) return;
        if (!latestByMatch.has(msg.match_id)) {
          latestByMatch.set(msg.match_id, msg);
        }
      });

      // Count unread: latest message from other user
      let count = 0;
      latestByMatch.forEach((msg) => {
        if (msg.sender_id !== userId) {
          count++;
        }
      });

      if (!cancelled) setUnreadCount(count);
    };

    loadUnreadCount();

    // Subscribe to new messages for real-time updates
    const channel = supabase
      .channel("unread-chats-count")
      .on<MessageRow>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          // Reload count when new message arrives
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return unreadCount;
}

