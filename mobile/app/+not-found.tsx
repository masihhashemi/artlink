import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.paper,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  link: { marginTop: 16, paddingVertical: 12 },
  linkText: { fontSize: 16, color: colors.accentDeep, fontWeight: "700" },
});
