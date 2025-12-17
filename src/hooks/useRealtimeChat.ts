import { useEffect, useRef, useState, useCallback } from "react";
import { subscribeToMessages, sendChatMessage, fetchMessagesPage, type PaginatedMessages } from "@/lib/chat";
import type { Tables } from "@/integrations/supabase/types";

type MessageRow = Tables<"messages">;

export function useRealtimeChat(matchId: string | null, pageSize = 20) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Load initial messages
  const loadMessages = useCallback(async (page = 0) => {
    if (!matchId) return;

    try {
      setLoading(true);
      const result: PaginatedMessages = await fetchMessagesPage(matchId, page, pageSize);
      
      // Deduplicate against already loaded messages
      const newMessages = result.messages.filter((msg) => !seenIdsRef.current.has(msg.id));
      
      newMessages.forEach((msg) => seenIdsRef.current.add(msg.id));

      setMessages((prev) => {
        // Combine and deduplicate
        const combined = [...prev, ...newMessages];
        const unique = Array.from(
          new Map(combined.map((msg) => [msg.id, msg])).values()
        );
        // Sort by created_at ascending (oldest first)
        return unique.sort(
          (a, b) =>
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
        );
      });

      setHasMore(result.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, [matchId, pageSize]);

  // Setup realtime subscription
  useEffect(() => {
    if (!matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Load initial page
    loadMessages(0);

    // Subscribe to new messages
    const cleanup = subscribeToMessages(
      matchId,
      (newMessage) => {
        // Deduplication check
        if (seenIdsRef.current.has(newMessage.id)) {
          return;
        }

        seenIdsRef.current.add(newMessage.id);
        
        setMessages((prev) => {
          // Check if message already exists
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }

          // Insert in correct position (maintain chronological order)
          const updated = [...prev, newMessage];
          return updated.sort(
            (a, b) =>
              new Date(a.created_at || 0).getTime() -
              new Date(b.created_at || 0).getTime()
          );
        });
      },
      (error) => {
        console.error("Realtime subscription error:", error);
      }
    );

    unsubscribeRef.current = cleanup;

    // Cleanup on unmount or matchId change
    return () => {
      cleanup();
      seenIdsRef.current.clear();
    };
  }, [matchId, loadMessages]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!matchId || !content.trim() || sending) return;

      try {
        setSending(true);
        const sentMessage = await sendChatMessage(matchId, content.trim());
        
        // Message will arrive via realtime, but we can optimistically add it
        // (realtime will deduplicate if it's already there)
        if (!seenIdsRef.current.has(sentMessage.id)) {
          seenIdsRef.current.add(sentMessage.id);
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === sentMessage.id)) {
              return prev;
            }
            const updated = [...prev, sentMessage];
            return updated.sort(
              (a, b) =>
                new Date(a.created_at || 0).getTime() -
                new Date(b.created_at || 0).getTime()
            );
          });
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [matchId, sending]
  );

  // Load more (older messages)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadMessages(currentPage + 1);
  }, [hasMore, loading, currentPage, loadMessages]);

  return {
    messages,
    loading,
    sending,
    hasMore,
    sendMessage,
    loadMore,
  };
}

