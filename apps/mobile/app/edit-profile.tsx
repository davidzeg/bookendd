import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Share } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  Input,
  ScrollView,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import { trpc } from "@/lib/trpc";
import { TextButton } from "@/components/ui/TextButton";
import { uploadAvatar } from "@/lib/cloudinary";
import { analytics } from "@/lib/posthog";

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const utils = trpc.useUtils();

  const { signOut } = useAuth();

  const userQuery = trpc.user.me.useQuery();
  const exportQuery = trpc.user.exportMyData.useQuery(undefined, {
    enabled: false,
  });
  const deleteMutation = trpc.user.deleteMyAccount.useMutation({
    onSuccess: async () => {
      await signOut();
      router.replace("/(auth)/sign-in");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to delete account.");
    },
  });
  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      const changedFields: string[] = [];
      if (name !== (userQuery.data?.name ?? "")) changedFields.push("name");
      if (bio !== (userQuery.data?.bio ?? "")) changedFields.push("bio");
      if (avatarUri) changedFields.push("avatar");
      analytics.profileEdited(changedFields);
      utils.user.myProfile.invalidate();
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (userQuery.data && !isInitialized) {
      setName(userQuery.data.name ?? "");
      setBio(userQuery.data.bio ?? "");
      setIsInitialized(true);
    }
  }, [userQuery.data, isInitialized]);

  const currentAvatarUrl = userQuery.data?.avatarUrl;
  const displayAvatar = avatarUri ?? currentAvatarUrl;
  const initial = (name || userQuery.data?.username || "U")
    .charAt(0)
    .toUpperCase();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      let newAvatarUrl: string | undefined;
      if (avatarUri) {
        newAvatarUrl = await uploadAvatar(avatarUri);
      }

      await updateMutation.mutateAsync({
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarUrl: newAvatarUrl,
      });
    } catch (error) {
      if (!updateMutation.isError) {
        Alert.alert(
          "Upload failed",
          "Could not upload image. Please try again.",
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportQuery.refetch();
      if (result.data) {
        await Share.share({
          message: JSON.stringify(result.data, null, 2),
          title: "My Antilogos Data",
        });
      }
    } catch {
      Alert.alert("Error", "Failed to export data. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you sure?",
              "All your reading logs, favorites, and profile data will be permanently deleted.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const hasChanges =
    isInitialized &&
    (name !== (userQuery.data?.name ?? "") ||
      bio !== (userQuery.data?.bio ?? "") ||
      avatarUri !== null);

  const isSaving = isUploading || updateMutation.isPending;
  const canSave = hasChanges && !isSaving;

  if (userQuery.isLoading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Spinner size="large" color="$accent10" />
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top + 16}>
        <ScrollView
          flex={1}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 16,
          }}
        >
          <YStack gap="$6">
          <XStack justifyContent="space-between" alignItems="center">
            <TextButton
              label="Cancel"
              onPress={() => router.back()}
              disabled={isSaving}
            />
            <Text fontSize="$6" fontWeight="700" color="$color12">
              Edit Profile
            </Text>
            <TextButton
              label="Save"
              onPress={handleSave}
              disabled={!canSave}
              loading={isSaving}
              fontWeight="600"
            />
          </XStack>

          <YStack alignItems="center" gap="$3">
            <Avatar
              circular
              size={120}
              borderWidth={3}
              borderColor="$accent6"
              onPress={pickImage}
              pressStyle={{ opacity: 0.8 }}
            >
              {displayAvatar ? (
                <Avatar.Image src={displayAvatar} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="$accent5"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="$accent12" fontSize="$9" fontWeight="700">
                    {initial}
                  </Text>
                </Avatar.Fallback>
              )}
            </Avatar>
            <TextButton label="Change Photo" onPress={pickImage} />
          </YStack>

          <YStack gap="$4">
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color11">
                Name
              </Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                maxLength={100}
                backgroundColor="$color2"
                borderColor="$color6"
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color11">
                Bio
              </Text>
              <TextArea
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                maxLength={500}
                numberOfLines={4}
                backgroundColor="$color2"
                borderColor="$color6"
              />
              <Text fontSize="$2" color="$color10" textAlign="right">
                {bio.length}/500
              </Text>
            </YStack>
          </YStack>

          <YStack
            gap="$3"
            marginTop="$6"
            paddingTop="$6"
            borderTopWidth={1}
            borderTopColor="$color4"
          >
            <Text fontSize="$3" fontWeight="600" color="$color11">
              Account
            </Text>
            <TextButton
              label={exportQuery.isFetching ? "Exporting..." : "Export My Data"}
              onPress={handleExport}
              disabled={exportQuery.isFetching}
              color="$color12"
            />
            <TextButton
              label={deleteMutation.isPending ? "Deleting..." : "Delete Account"}
              onPress={handleDeleteAccount}
              disabled={deleteMutation.isPending}
              color="$red10"
            />
          </YStack>
        </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
