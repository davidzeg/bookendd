import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { trpc } from "@/lib/trpc";
import { ProfileView } from "./ProfileView";

type Props = {
  params: Promise<{ username: string }>;
};

const getProfile = cache((username: string) =>
  trpc.user.byUsername.query({ username })
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  try {
    const data = await getProfile(username);

    if (!data) {
      return {
        title: "User not found | Antilogos",
      };
    }

    const displayName = data.user.name || data.user.username;

    return {
      title: `${displayName} | Antilogos`,
      description:
        data.user.bio ||
        `Check out ${displayName}'s reading journey on Antilogos`,
      openGraph: {
        title: `${displayName} | Antilogos`,
        description:
          data.user.bio ||
          `Check out ${displayName}'s reading journey on Antilogos`,
        type: "profile",
        images: data.user.avatarUrl ? [data.user.avatarUrl] : [],
      },
      twitter: {
        card: "summary",
        title: `${displayName} | Antilogos`,
        description:
          data.user.bio ||
          `Check out ${displayName}'s reading journey on Antilogos`,
      },
    };
  } catch {
    return {
      title: "Antilogos",
    };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  try {
    const data = await getProfile(username);

    if (!data) {
      notFound();
    }

    return <ProfileView data={data} />;
  } catch {
    notFound();
  }
}
