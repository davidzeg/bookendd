import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Input,
  ScrollView,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import { trpc } from "@/lib/trpc";
import { uploadAvatar } from "@/lib/cloudinary";
import { analytics } from "@/lib/posthog";

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const utils = trpc.useUtils();

  const userQuery = trpc.user.me.useQuery();
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

  const [name, setName] = useState(userQuery.data?.name ?? "");
  const [bio, setBio] = useState(userQuery.data?.bio ?? "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const hasChanges =
    name !== (userQuery.data?.name ?? "") ||
    bio !== (userQuery.data?.bio ?? "") ||
    avatarUri !== null;

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
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
        }}
      >
        <YStack gap="$6">
          <XStack justifyContent="space-between" alignItems="center">
            <Button
              chromeless
              onPress={() => router.back()}
              disabled={isSaving}
            >
              <Text color="$accent10">Cancel</Text>
            </Button>
            <Text fontSize="$6" fontWeight="700" color="$color12">
              Edit Profile
            </Text>
            <Button
              chromeless
              onPress={handleSave}
              disabled={!canSave}
              width={80}
            >
              {isSaving ? (
                <Spinner size="small" color="$accent10" />
              ) : (
                <Text
                  color={canSave ? "$accent10" : "$color8"}
                  fontWeight="600"
                >
                  Save
                </Text>
              )}
            </Button>
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
            <Button size="$3" chromeless onPress={pickImage}>
              <Text color="$accent10">Change Photo</Text>
            </Button>
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
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
