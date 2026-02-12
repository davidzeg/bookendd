import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { useTheme } from "tamagui";
import { Tabs } from "expo-router";
import { Home, Search, User } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const theme = useTheme();
  const activeColor = theme.accent10.get();
  const inactiveColor = theme.color11.get();
  const backgroundColor = theme.background.get();
  const shadowColor = theme.shadowColor.get();

  if (Platform.OS === "ios") {
    return (
      <NativeTabs
        tintColor={activeColor}
        iconColor={{ default: inactiveColor, selected: activeColor }}
        labelStyle={{
          default: { color: inactiveColor },
          selected: { color: activeColor },
        }}
        backgroundColor={Platform.OS === "ios" ? null : backgroundColor}
        blurEffect={Platform.OS === "ios" ? "systemChromeMaterial" : undefined}
        shadowColor={shadowColor}
      >
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon
            sf={{ default: "house", selected: "house.fill" }}
            drawable="ic_home"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon
            sf={{ default: "person", selected: "person.fill" }}
            drawable="ic_person"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search" role="search">
          <Label>Search</Label>
          <Icon
            sf={{ default: "magnifyingglass", selected: "magnifyingglass" }}
            drawable="ic_search"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: theme.color3.get(),
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color as any} />,
        }}
      />
    </Tabs>
  );
}
