import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import { colors } from "@/lib/theme";
import { Button, Input, Muted, Subtitle, Title } from "@/components/ui";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("maya@artlink.demo");
  const [password, setPassword] = useState("demo1234");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        await signUp(fullName.trim(), email.trim(), password);
      }
    } catch (e) {
      Alert.alert(
        "Could not sign in",
        `${e instanceof Error ? e.message : "Error"}\n\nAPI: ${API_BASE}\nMake sure Next.js is running (npm run dev).`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Art Link</Text>
        </View>
        <Title>{mode === "login" ? "Welcome back" : "Join the studio"}</Title>
        <Subtitle>
          Art alumni network — skills, collabs, and connections on the go.
        </Subtitle>

        <View style={styles.form}>
          {mode === "signup" && (
            <Input
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          )}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            label={busy ? "…" : mode === "login" ? "Sign in" : "Create account"}
            onPress={submit}
            disabled={busy}
          />
          <Button
            label={
              mode === "login"
                ? "Need an account? Sign up"
                : "Have an account? Sign in"
            }
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            variant="secondary"
          />
        </View>

        <Muted>Demo: maya@artlink.demo / demo1234</Muted>
        <Muted>API {API_BASE}</Muted>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.sun,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontWeight: "900",
    fontSize: 18,
    color: colors.ink,
  },
  form: { gap: 12, marginTop: 12, marginBottom: 8 },
});
