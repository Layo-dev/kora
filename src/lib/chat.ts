import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type MessageRow = Tables<"messages">;

export type PaginatedMessages = {
  messages: MessageRow[];
  hasMore: boolean;
};

/**
 * Send a chat message via the `send-message` Edge Function.
 * The Edge Function does validation, match membership checks, and inserts the row.
 */
export async function sendChatMessage(matchId: string, content: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to send messages");
  }

  if (!content.trim()) {
    throw new Error("Message cannot be empty");
  }

  // Direct insert using RLS (policy: "participants can send messages")
  const { data, error } = await supabase
    .from("messages")
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("send message error:", error);
    throw new Error(error.message ?? "Failed to send message");
  }

  return data as MessageRow;
}

/**
 * Fetch a page of messages for a given match via the `fetch-messages` Edge Function.
 * Messages are returned oldest → newest (created_at ascending).
 * Uses simple offset-based pagination with an extra record to detect `hasMore`.
 */
export async function fetchMessagesPage(
  matchId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedMessages> {
  const offset = page * pageSize;
  // Ask for one extra record to determine if another page exists
  const limit = pageSize + 1;

  // Direct query using RLS (policy: "participants can read messages")
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("fetch messages error:", error);
    throw new Error(error.message ?? "Failed to fetch messages");
  }

  const messages = (data ?? []) as MessageRow[];

  const hasMore = messages.length > pageSize;
  const pageMessages = hasMore ? messages.slice(0, pageSize) : messages;

  return { messages: pageMessages, hasMore };
}

/**
 * Subscribe to realtime messages for a match.
 * Returns a cleanup function to unsubscribe.
 * 
 * Features:
 * - Deduplicates messages by ID
 * - Only listens to INSERT events (new messages)
 * - Filters by match_id for security
 * - Automatically handles connection cleanup
 */
export function subscribeToMessages(
  matchId: string,
  onMessage: (message: MessageRow) => void,
  onError?: (error: Error) => void
): () => void {
  // Track seen message IDs to prevent duplicates
  const seenIds = new Set<string>();

  // Create a channel scoped to this match
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on<MessageRow>(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        const message = payload.new as MessageRow;

        // Deduplication: skip if we've already seen this message
        if (seenIds.has(message.id)) {
          return;
        }

        seenIds.add(message.id);
        onMessage(message);
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`Subscribed to messages for match ${matchId}`);
      } else if (status === "CHANNEL_ERROR") {
        const error = new Error("Failed to subscribe to messages");
        console.error("Realtime subscription error:", error);
        onError?.(error);
      }
    });

  // Return cleanup function
  return () => {
    console.log(`Unsubscribing from messages for match ${matchId}`);
    seenIds.clear();
    supabase.removeChannel(channel);
  };
}

