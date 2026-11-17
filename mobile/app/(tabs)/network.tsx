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
import type { NetworkPerson } from "@/lib/types";
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

type NetworkData = {
  incoming: NetworkPerson[];
  outgoing: NetworkPerson[];
  accepted: NetworkPerson[];
};

export default function NetworkScreen() {
  const { token } = useAuth();
  const [data, setData] = useState<NetworkData>({
    incoming: [],
    outgoing: [],
    accepted: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api<NetworkData>("/network", { token });
      setData(res);
    } catch (e) {
      Alert.alert("Network", e instanceof Error ? e.message : "Failed");
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

  async function respond(connectionId: string, decision: "accepted" | "rejected") {
    if (!token) return;
    try {
      await api("/connections", {
        method: "POST",
        token,
        body: { action: "respond", connection_id: connectionId, decision },
      });
      load();
    } catch (e) {
      Alert.alert("Request", e instanceof Error ? e.message : "Failed");
    }
  }

  if (loading) return <Loading />;

  const sections = [
    { title: "Incoming requests", items: data.incoming, kind: "incoming" as const },
    { title: "Pending sent", items: data.outgoing, kind: "outgoing" as const },
    { title: "Connections", items: data.accepted, kind: "accepted" as const },
  ];

  return (
    <Screen>
      <FlatList
        data={sections}
        keyExtractor={(s) => s.title}
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
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Title>{section.title}</Title>
            {section.items.length === 0 ? (
              <Muted>None right now.</Muted>
            ) : (
              section.items.map((row) => (
                <Card key={row.connection.id} style={styles.card}>
                  <Link href={`/profile/${row.profile.id}`} asChild>
                    <Pressable style={styles.row}>
                      <Avatar
                        uri={row.profile.avatar_url}
                        name={row.profile.full_name}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{row.profile.full_name}</Text>
                        <Text style={styles.headline} numberOfLines={1}>
                          {row.profile.headline || "Art Link member"}
                        </Text>
                      </View>
                      {section.kind === "outgoing" && (
                        <Chip label="Pending" tone="sun" />
                      )}
                    </Pressable>
                  </Link>
                  {section.kind === "incoming" && (
                    <View style={styles.actions}>
                      <View style={{ flex: 1 }}>
                        <Button
                          label="Accept"
                          onPress={() =>
                            respond(row.connection.id, "accepted")
                          }
                          variant="mint"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          label="Decline"
                          onPress={() =>
                            respond(row.connection.id, "rejected")
                          }
                          variant="danger"
                        />
                      </View>
                    </View>
                  )}
                </Card>
              ))
            )}
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 20 },
  section: { gap: 10 },
  card: { gap: 12, marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  headline: { color: colors.muted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
});
