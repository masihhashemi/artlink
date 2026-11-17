import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type {
  RecommendationOpportunity,
  RecommendationPerson,
} from "@/lib/types";
import { colors } from "@/lib/theme";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Loading,
  Muted,
  Screen,
  Title,
} from "@/components/ui";
import { PostCard } from "@/components/PostCard";

export default function DiscoverScreen() {
  const { token } = useAuth();
  const [people, setPeople] = useState<RecommendationPerson[]>([]);
  const [opportunities, setOpportunities] = useState<
    RecommendationOpportunity[]
  >([]);
  const [tab, setTab] = useState<"people" | "posts">("people");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api<{
        people: RecommendationPerson[];
        opportunities: RecommendationOpportunity[];
      }>("/discover", { token });
      setPeople(data.people);
      setOpportunities(data.opportunities);
    } catch (e) {
      Alert.alert("Discover", e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function connect(recipientId: string) {
    if (!token) return;
    try {
      await api("/connections", {
        method: "POST",
        token,
        body: { action: "request", recipient_id: recipientId },
      });
      Alert.alert("Request sent", "They'll see it in Network.");
      load();
    } catch (e) {
      Alert.alert("Connect", e instanceof Error ? e.message : "Failed");
    }
  }

  if (loading) return <Loading />;

  return (
    <Screen>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("people")}
          style={[styles.tab, tab === "people" && styles.tabActive]}
        >
          <Text style={styles.tabText}>People</Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("posts")}
          style={[styles.tab, tab === "posts" && styles.tabActive]}
        >
          <Text style={styles.tabText}>Opportunities</Text>
        </Pressable>
      </View>

      {tab === "people" ? (
        <FlatList
          data={people}
          keyExtractor={(item) => item.profile.id}
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
          ListEmptyComponent={<Muted>No recommendations yet.</Muted>}
          ListHeaderComponent={
            <Title>Skill matches</Title>
          }
          renderItem={({ item }) => (
            <Card style={styles.person}>
              <Link href={`/profile/${item.profile.id}`} asChild>
                <Pressable style={styles.personHeader}>
                  <Avatar
                    uri={item.profile.avatar_url}
                    name={item.profile.full_name}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.profile.full_name}</Text>
                    <Text style={styles.headline} numberOfLines={1}>
                      {item.profile.headline || "Art Link member"}
                    </Text>
                  </View>
                  <Chip label={`${item.score}`} tone="sun" />
                </Pressable>
              </Link>
              <View style={styles.skills}>
                {item.skills.slice(0, 4).map((s) => (
                  <Chip key={s.id} label={s.name} />
                ))}
              </View>
              {item.reasons.slice(0, 2).map((r) => (
                <Muted key={r}>{r}</Muted>
              ))}
              <Button
                label="Connect"
                onPress={() => connect(item.profile.id)}
                variant="secondary"
              />
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={(item) => item.post.id}
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
          ListEmptyComponent={<Muted>No matching posts right now.</Muted>}
          renderItem={({ item }) => (
            <PostCard post={item.post} onApplied={load} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.paperElevated,
  },
  tabActive: { backgroundColor: colors.peach },
  tabText: { fontWeight: "800", color: colors.ink },
  list: { padding: 16, gap: 14 },
  person: { gap: 10 },
  personHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  headline: { color: colors.muted, marginTop: 2 },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
});
