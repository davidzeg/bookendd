import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { useTheme } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();
  const activeColor = theme.accent10.get();
  const inactiveColor = theme.color11.get();
  const backgroundColor = theme.background.get();
  const shadowColor = theme.shadowColor.get();

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
