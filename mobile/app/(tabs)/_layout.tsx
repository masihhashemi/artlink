import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";
import { colors } from "@/lib/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accentDeep,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.paperElevated,
          borderTopColor: colors.line,
        },
        headerStyle: { backgroundColor: colors.paper },
        headerTitleStyle: { fontWeight: "800", color: colors.ink },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "house.fill", android: "home", web: "home" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "sparkles", android: "star", web: "star" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: "Network",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "person.2.fill",
                android: "group",
                web: "group",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Me",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "person.crop.circle",
                android: "person",
                web: "person",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
