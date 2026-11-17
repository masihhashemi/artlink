import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Loading } from "@/components/ui";
import { colors } from "@/lib/theme";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === "login";
    if (!token && !onLogin) {
      router.replace("/login");
    } else if (token && onLogin) {
      router.replace("/(tabs)");
    }
  }, [token, loading, segments, router]);

  if (loading) return <Loading />;
  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AuthGate>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.paper },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: colors.paper },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile/[id]"
            options={{ title: "Profile" }}
          />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}
