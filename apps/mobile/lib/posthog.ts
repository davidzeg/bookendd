import PostHog from "posthog-react-native";
import { env } from "./env";

export const posthog = new PostHog(env.EXPO_PUBLIC_POSTHOG_API_KEY, {
  host: "https://eu.i.posthog.com",
  captureAppLifecycleEvents: true,
});

type EventProperties = Record<string, string | number | boolean | null>;

export const analytics = {
  bookSearched: (query: string, resultCount: number) => {
    posthog.capture("book_searched", { query, result_count: resultCount });
  },

  bookLogged: (
    status: "finished" | "dnf",
    hasRating: boolean,
    hasWord: boolean,
  ) => {
    posthog.capture("book_logged", {
      status,
      has_rating: hasRating,
      has_word: hasWord,
    });
  },

  favoritesUpdated: (count: number) => {
    posthog.capture("favorites_updated", { count });
  },

  profileEdited: (changedFields: string[]) => {
    posthog.capture("profile_edited", { changed_fields: changedFields });
  },

  screenViewed: (screenName: string, params?: EventProperties) => {
    posthog.screen(screenName, params);
  },

  identify: (userId: string, traits?: EventProperties) => {
    posthog.identify(userId, traits);
  },

  reset: () => {
    posthog.reset();
  },
};
