import { notFound } from "next/navigation";
import { Metadata } from "next";
import { trpc } from "@/lib/trpc";
import { ProfileView } from "./ProfileView";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await trpc.user.byUsername.query({ username });

  if (!data) {
    return {
      title: "User not found | Bookendd",
    };
  }

  const displayName = data.user.name || data.user.username;

  return {
    title: `${displayName} | Bookendd`,
    description:
      data.user.bio || `Check out ${displayName}'s reading journey on Bookendd`,
    openGraph: {
      title: `${displayName} | Bookendd`,
      description:
        data.user.bio ||
        `Check out ${displayName}'s reading journey on Bookendd`,
      type: "profile",
      images: data.user.avatarUrl ? [data.user.avatarUrl] : [],
    },
    twitter: {
      card: "summary",
      title: `${displayName} | Bookendd`,
      description:
        data.user.bio ||
        `Check out ${displayName}'s reading journey on Bookendd`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await trpc.user.byUsername.query({ username });

  if (!data) {
    notFound();
  }

  return <ProfileView data={data} />;
}
