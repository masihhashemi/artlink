import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { PostWithRelations } from "@/lib/types";
import { colors } from "@/lib/theme";
import { Loading, Muted, Screen } from "@/components/ui";
import { PostCard } from "@/components/PostCard";

const filters: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Looking", value: "looking_for" },
  { label: "Offering", value: "offering" },
  { label: "Updates", value: "update" },
];

export default function FeedScreen() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const qs = filter ? `?type=${filter}` : "";
      const data = await api<{ posts: PostWithRelations[] }>(`/feed${qs}`, {
        token,
      });
      setPosts(data.posts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, filter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  if (loading) return <Loading />;

  return (
    <Screen>
      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => {
              setFilter(f.value);
              setLoading(true);
            }}
            style={[
              styles.filterChip,
              filter === f.value && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.value && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? (
        <View style={styles.center}>
          <Muted>{error}</Muted>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <Muted>No posts yet — check Discover for matches.</Muted>
          }
          renderItem={({ item }) => (
            <PostCard post={item} onApplied={load} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.paperElevated,
  },
  filterChipActive: { backgroundColor: colors.sun },
  filterText: { fontWeight: "700", color: colors.inkSoft, fontSize: 13 },
  filterTextActive: { color: colors.ink },
  list: { padding: 16, gap: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
