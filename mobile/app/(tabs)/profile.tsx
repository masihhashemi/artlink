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
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ProfileWithRelations } from "@/lib/types";
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

export default function MeScreen() {
  const { token, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api<{ profile: ProfileWithRelations }>("/me", {
        token,
      });
      setProfile(data.profile);
    } catch (e) {
      Alert.alert("Profile", e instanceof Error ? e.message : "Failed");
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

  if (loading || !profile) return <Loading />;

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

        {profile.description ? (
          <Card>
            <Text style={styles.body}>{profile.description}</Text>
          </Card>
        ) : null}

        <Card style={styles.block}>
          <Text style={styles.section}>Skills</Text>
          <View style={styles.skills}>
            {profile.skills.length ? (
              profile.skills.map((s) => <Chip key={s.id} label={s.name} />)
            ) : (
              <Muted>No skills listed yet.</Muted>
            )}
          </View>
        </Card>

        <Card style={styles.block}>
          <Text style={styles.section}>Education</Text>
          {profile.education.length ? (
            profile.education.map((e) => (
              <View key={e.id} style={styles.item}>
                <Text style={styles.itemTitle}>{e.university}</Text>
                <Muted>
                  {[e.degree_or_program, e.field_of_study]
                    .filter(Boolean)
                    .join(" · ")}
                </Muted>
              </View>
            ))
          ) : (
            <Muted>No education yet.</Muted>
          )}
        </Card>

        <Card style={styles.block}>
          <Text style={styles.section}>Experience</Text>
          {profile.experiences.length ? (
            profile.experiences.map((e) => (
              <View key={e.id} style={styles.item}>
                <Text style={styles.itemTitle}>{e.title}</Text>
                <Muted>
                  {[e.organization, e.location].filter(Boolean).join(" · ")}
                </Muted>
              </View>
            ))
          ) : (
            <Muted>No experience yet.</Muted>
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

        <Button label="Sign out" onPress={() => signOut()} variant="danger" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  hero: { alignItems: "center", gap: 8, paddingVertical: 8 },
  body: { color: colors.inkSoft, lineHeight: 22, fontSize: 15 },
  block: { gap: 10 },
  section: { fontWeight: "900", fontSize: 16, color: colors.ink },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  item: { gap: 2 },
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
