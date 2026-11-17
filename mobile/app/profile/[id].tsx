import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Connection, ProfileWithRelations } from "@/lib/types";
import { colors } from "@/lib/theme";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Loading,
  Muted,
  Screen,
  Subtitle,
  Title,
} from "@/components/ui";

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, profile: me } = useAuth();
  const [profile, setProfile] = useState<ProfileWithRelations | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!token || !id) return;
    try {
      const data = await api<{
        profile: ProfileWithRelations;
        connection: Connection | null;
      }>(`/profiles/${id}`, { token });
      setProfile(data.profile);
      setConnection(data.connection);
    } catch (e) {
      Alert.alert("Profile", e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function connect() {
    if (!token || !id) return;
    setBusy(true);
    try {
      await api("/connections", {
        method: "POST",
        token,
        body: { action: "request", recipient_id: id },
      });
      await load();
    } catch (e) {
      Alert.alert("Connect", e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function respond(decision: "accepted" | "rejected") {
    if (!token || !connection) return;
    setBusy(true);
    try {
      await api("/connections", {
        method: "POST",
        token,
        body: {
          action: "respond",
          connection_id: connection.id,
          decision,
        },
      });
      await load();
    } catch (e) {
      Alert.alert("Request", e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !profile) return <Loading />;

  const isSelf = me?.id === profile.id;
  const isIncoming =
    connection?.status === "pending" && connection.recipient_id === me?.id;
  const isOutgoing =
    connection?.status === "pending" && connection.requester_id === me?.id;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
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
      >
        <View style={styles.hero}>
          <Avatar
            uri={profile.avatar_url}
            name={profile.full_name}
            size={84}
          />
          <Title>{profile.full_name}</Title>
          <Subtitle>{profile.headline || "Art Link member"}</Subtitle>
        </View>

        {!isSelf && (
          <View style={styles.actions}>
            {!connection && (
              <Button
                label={busy ? "…" : "Connect"}
                onPress={connect}
                disabled={busy}
              />
            )}
            {isOutgoing && <Chip label="Request pending" tone="sun" />}
            {isIncoming && (
              <>
                <Button
                  label="Accept"
                  onPress={() => respond("accepted")}
                  variant="mint"
                  disabled={busy}
                />
                <Button
                  label="Decline"
                  onPress={() => respond("rejected")}
                  variant="danger"
                  disabled={busy}
                />
              </>
            )}
            {connection?.status === "accepted" && (
              <Chip label="Connected" tone="mint" />
            )}
          </View>
        )}

        {profile.description ? (
          <Card>
            <Text style={styles.body}>{profile.description}</Text>
          </Card>
        ) : null}

        <Card style={styles.block}>
          <Text style={styles.section}>Skills</Text>
          <View style={styles.skills}>
            {profile.skills.map((s) => (
              <Chip key={s.id} label={s.name} />
            ))}
          </View>
        </Card>

        <Card style={styles.block}>
          <Text style={styles.section}>Education</Text>
          {profile.education.length ? (
            profile.education.map((e) => (
              <View key={e.id}>
                <Text style={styles.itemTitle}>{e.university}</Text>
                <Muted>
                  {[e.degree_or_program, e.field_of_study]
                    .filter(Boolean)
                    .join(" · ")}
                </Muted>
              </View>
            ))
          ) : (
            <Muted>No education listed.</Muted>
          )}
        </Card>

        {profile.portfolio_images.length > 0 && (
          <Card style={styles.block}>
            <Text style={styles.section}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.portfolio}>
                {profile.portfolio_images.map((img) => (
                  <Image
                    key={img.id}
                    source={{ uri: img.image_url }}
                    style={styles.portfolioImg}
                  />
                ))}
              </View>
            </ScrollView>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  hero: { alignItems: "center", gap: 8 },
  actions: { gap: 8 },
  body: { color: colors.inkSoft, lineHeight: 22, fontSize: 15 },
  block: { gap: 10 },
  section: { fontWeight: "900", fontSize: 16, color: colors.ink },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  itemTitle: { fontWeight: "700", color: colors.ink },
  portfolio: { flexDirection: "row", gap: 10 },
  portfolioImg: {
    width: 140,
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.ink,
  },
});
