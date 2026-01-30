import { View } from "react-native";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { FloatingSearchButton } from "../../components/FloatingSearchButton";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
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
      </NativeTabs>
      <FloatingSearchButton />
    </View>
  );
}
