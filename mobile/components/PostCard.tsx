import { Alert, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";
import type { PostWithRelations } from "@/lib/types";
import { Avatar, Button, Card, Chip } from "@/components/ui";

const typeLabel: Record<PostWithRelations["type"], string> = {
  looking_for: "Looking for",
  offering: "Offering",
  update: "Update",
};

export function PostCard({
  post,
  onApplied,
}: {
  post: PostWithRelations;
  onApplied?: () => void;
}) {
  const { token } = useAuth();
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(post.applied_by_me);

  const canApply =
    !post.is_own &&
    post.type !== "update" &&
    post.matches_me &&
    !applied;

  async function apply() {
    if (!token) return;
    setBusy(true);
    try {
      await api(`/posts/${post.id}/apply`, {
        method: "POST",
        token,
        body: { note: "" },
      });
      setApplied(true);
      onApplied?.();
      Alert.alert("Applied!", "Connection + intro message sent.");
    } catch (e) {
      Alert.alert("Could not apply", e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={post.author.avatar_url} name={post.author.full_name} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{post.author.full_name}</Text>
          <Text style={styles.headline} numberOfLines={1}>
            {post.author.headline || "Art Link member"}
          </Text>
        </View>
        <Chip
          label={typeLabel[post.type]}
          tone={
            post.type === "looking_for"
              ? "accent"
              : post.type === "offering"
                ? "mint"
                : "sky"
          }
        />
      </View>

      <Text style={styles.body}>{post.body}</Text>

      {post.skills.length > 0 && (
        <View style={styles.skills}>
          {post.skills.map((s) => (
            <Chip key={s.id} label={s.name} tone="peach" />
          ))}
        </View>
      )}

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          ♥ {post.like_count} · 💬 {post.comment_count}
        </Text>
        {post.matches_me && !post.is_own && (
          <Chip label="Skill match" tone="sun" />
        )}
      </View>

      {canApply && (
        <Button
          label={busy ? "Applying…" : "Apply"}
          onPress={apply}
          variant="mint"
          disabled={busy}
        />
      )}
      {applied && !post.is_own && post.type !== "update" && (
        <Text style={styles.applied}>You applied ✓</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  headline: { color: colors.muted, fontSize: 13, marginTop: 2 },
  body: { color: colors.inkSoft, fontSize: 15, lineHeight: 22 },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaText: { color: colors.muted, fontWeight: "600" },
  applied: { color: colors.mintDeep, fontWeight: "700" },
});
