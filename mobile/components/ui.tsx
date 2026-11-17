import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { colors, radii } from "@/lib/theme";

export function Screen({
  children,
  style,
  ...rest
}: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[styles.screen, style]} {...rest}>
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewProps["style"];
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "mint" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "mint" && styles.buttonMint,
        variant === "danger" && styles.buttonDanger,
        (pressed || disabled) && { opacity: 0.7 },
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function Chip({
  label,
  tone = "peach",
}: {
  label: string;
  tone?: "peach" | "mint" | "sky" | "sun" | "accent";
}) {
  return (
    <View
      style={[
        styles.chip,
        tone === "peach" && { backgroundColor: colors.peach },
        tone === "mint" && { backgroundColor: colors.mint },
        tone === "sky" && { backgroundColor: colors.sky },
        tone === "sun" && { backgroundColor: colors.sun },
        tone === "accent" && { backgroundColor: colors.accentSoft },
      ]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function Avatar({
  uri,
  name,
  size = 48,
}: {
  uri?: string | null;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: colors.ink,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.sun,
        borderWidth: 2,
        borderColor: colors.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "800", color: colors.ink }}>{initials}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
  },
  muted: {
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.paperElevated,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: 16,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
  },
  button: {
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: colors.ink,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 2 },
  },
  buttonPrimary: { backgroundColor: colors.accent },
  buttonSecondary: { backgroundColor: colors.sun },
  buttonMint: { backgroundColor: colors.mint },
  buttonDanger: { backgroundColor: colors.accentSoft },
  buttonText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.paperElevated,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
});
