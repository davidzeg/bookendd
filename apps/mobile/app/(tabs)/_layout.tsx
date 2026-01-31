import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
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
