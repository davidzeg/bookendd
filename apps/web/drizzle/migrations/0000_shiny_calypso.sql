CREATE TYPE "public"."book_club_book_status" AS ENUM('suggested', 'nominated', 'queued', 'current', 'finished', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."book_club_invite_status" AS ENUM('pending', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."book_club_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."reading_status" AS ENUM('to_read', 'currently_reading', 'read', 'did_not_finish');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"subject_type" varchar(50) NOT NULL,
	"subject_id" uuid NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"bio" text,
	"photo_url" text,
	"open_library_key" varchar(50),
	"works_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"ratings_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_open_library_key_unique" UNIQUE("open_library_key")
);
--> statement-breakpoint
CREATE TABLE "book_club_book_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_club_book_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"review_text" text,
	"contains_spoilers" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_club_books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"status" "book_club_book_status" DEFAULT 'suggested' NOT NULL,
	"suggested_by_id" uuid NOT NULL,
	"position" integer,
	"vote_count" integer DEFAULT 0 NOT NULL,
	"ratings_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"rating_distribution" text,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_club_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"contains_spoilers" boolean DEFAULT false NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_club_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"invitee_id" uuid NOT NULL,
	"inviter_id" uuid NOT NULL,
	"status" "book_club_invite_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "book_club_join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "book_club_invite_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"reviewed_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "book_club_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "book_club_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_club_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"book_club_book_id" uuid,
	"content" text NOT NULL,
	"contains_spoilers" boolean DEFAULT false NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_club_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_club_book_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"profile_image_url" text,
	"cover_image_url" text,
	"owner_id" uuid NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"books_finished_count" integer DEFAULT 0 NOT NULL,
	"member_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_clubs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"isbn_10" varchar(10),
	"isbn_13" varchar(13),
	"publisher" varchar(255),
	"published_date" timestamp with time zone,
	"page_count" integer,
	"format" varchar(50),
	"language" varchar(10),
	"cover_image_url" text,
	"open_library_key" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "editions_open_library_key_unique" UNIQUE("open_library_key")
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"edition_id" uuid,
	"position" integer NOT NULL,
	"notes" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(100) NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_ranked" boolean DEFAULT false NOT NULL,
	"items_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"user_library_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"progress_percent" integer,
	"progress_page" integer,
	"pages_total" integer,
	"content" text,
	"quote" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"edition_id" uuid,
	"status" "reading_status" NOT NULL,
	"rating" numeric(2, 1),
	"review_text" text,
	"contains_spoilers" boolean DEFAULT false NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"is_reread" boolean DEFAULT false NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"edition_id" uuid,
	"status" "reading_status" DEFAULT 'to_read' NOT NULL,
	"rating" numeric(2, 1),
	"notes" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mutes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"muter_id" uuid NOT NULL,
	"muted_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"display_name" varchar(100),
	"bio" text,
	"avatar_url" text,
	"is_private" boolean DEFAULT false NOT NULL,
	"books_read_count" integer DEFAULT 0 NOT NULL,
	"to_read_count" integer DEFAULT 0 NOT NULL,
	"currently_reading_count" integer DEFAULT 0 NOT NULL,
	"dnf_count" integer DEFAULT 0 NOT NULL,
	"followers_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"rating_distribution" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "work_authors" (
	"work_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "work_authors_work_id_author_id_pk" PRIMARY KEY("work_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"original_title" varchar(500),
	"description" text,
	"first_published_year" integer,
	"subjects" text[],
	"cover_image_url" text,
	"open_library_key" varchar(50),
	"ratings_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"rating_distribution" text,
	"readers_count" integer DEFAULT 0 NOT NULL,
	"currently_reading_count" integer DEFAULT 0 NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "works_open_library_key_unique" UNIQUE("open_library_key")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_book_ratings" ADD CONSTRAINT "book_club_book_ratings_book_club_book_id_book_club_books_id_fk" FOREIGN KEY ("book_club_book_id") REFERENCES "public"."book_club_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_book_ratings" ADD CONSTRAINT "book_club_book_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_books" ADD CONSTRAINT "book_club_books_club_id_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."book_clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_books" ADD CONSTRAINT "book_club_books_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_books" ADD CONSTRAINT "book_club_books_suggested_by_id_users_id_fk" FOREIGN KEY ("suggested_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_comments" ADD CONSTRAINT "book_club_comments_post_id_book_club_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."book_club_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_comments" ADD CONSTRAINT "book_club_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_invites" ADD CONSTRAINT "book_club_invites_club_id_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."book_clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_invites" ADD CONSTRAINT "book_club_invites_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_invites" ADD CONSTRAINT "book_club_invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_join_requests" ADD CONSTRAINT "book_club_join_requests_club_id_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."book_clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_join_requests" ADD CONSTRAINT "book_club_join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_join_requests" ADD CONSTRAINT "book_club_join_requests_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_members" ADD CONSTRAINT "book_club_members_club_id_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."book_clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_members" ADD CONSTRAINT "book_club_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_posts" ADD CONSTRAINT "book_club_posts_club_id_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."book_clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_posts" ADD CONSTRAINT "book_club_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_posts" ADD CONSTRAINT "book_club_posts_book_club_book_id_book_club_books_id_fk" FOREIGN KEY ("book_club_book_id") REFERENCES "public"."book_club_books"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_votes" ADD CONSTRAINT "book_club_votes_book_club_book_id_book_club_books_id_fk" FOREIGN KEY ("book_club_book_id") REFERENCES "public"."book_club_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_club_votes" ADD CONSTRAINT "book_club_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_clubs" ADD CONSTRAINT "book_clubs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editions" ADD CONSTRAINT "editions_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_edition_id_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."editions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_checkins" ADD CONSTRAINT "reading_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_checkins" ADD CONSTRAINT "reading_checkins_user_library_id_user_library_id_fk" FOREIGN KEY ("user_library_id") REFERENCES "public"."user_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_checkins" ADD CONSTRAINT "reading_checkins_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_logs" ADD CONSTRAINT "reading_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_logs" ADD CONSTRAINT "reading_logs_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_logs" ADD CONSTRAINT "reading_logs_edition_id_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."editions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_library" ADD CONSTRAINT "user_library_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_library" ADD CONSTRAINT "user_library_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_library" ADD CONSTRAINT "user_library_edition_id_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."editions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mutes" ADD CONSTRAINT "user_mutes_muter_id_users_id_fk" FOREIGN KEY ("muter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mutes" ADD CONSTRAINT "user_mutes_muted_id_users_id_fk" FOREIGN KEY ("muted_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_authors" ADD CONSTRAINT "work_authors_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_authors" ADD CONSTRAINT "work_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_actor_idx" ON "activities" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "activities_feed_idx" ON "activities" USING btree ("actor_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "activities_cursor_idx" ON "activities" USING btree ("created_at" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "book_club_book_ratings_book_idx" ON "book_club_book_ratings" USING btree ("book_club_book_id");--> statement-breakpoint
CREATE INDEX "book_club_book_ratings_user_idx" ON "book_club_book_ratings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_book_ratings_unique_idx" ON "book_club_book_ratings" USING btree ("book_club_book_id","user_id");--> statement-breakpoint
CREATE INDEX "book_club_book_ratings_rating_idx" ON "book_club_book_ratings" USING btree ("book_club_book_id","rating");--> statement-breakpoint
CREATE INDEX "book_club_books_club_idx" ON "book_club_books" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "book_club_books_status_idx" ON "book_club_books" USING btree ("club_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_books_unique_idx" ON "book_club_books" USING btree ("club_id","work_id");--> statement-breakpoint
CREATE INDEX "book_club_comments_post_idx" ON "book_club_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "book_club_comments_user_idx" ON "book_club_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "book_club_invites_club_idx" ON "book_club_invites" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "book_club_invites_invitee_idx" ON "book_club_invites" USING btree ("invitee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_invites_pending_idx" ON "book_club_invites" USING btree ("club_id","invitee_id");--> statement-breakpoint
CREATE INDEX "book_club_join_requests_club_idx" ON "book_club_join_requests" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "book_club_join_requests_user_idx" ON "book_club_join_requests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_join_requests_pending_idx" ON "book_club_join_requests" USING btree ("club_id","user_id");--> statement-breakpoint
CREATE INDEX "book_club_members_club_idx" ON "book_club_members" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "book_club_members_user_idx" ON "book_club_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_members_unique_idx" ON "book_club_members" USING btree ("club_id","user_id");--> statement-breakpoint
CREATE INDEX "book_club_posts_club_idx" ON "book_club_posts" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "book_club_posts_user_idx" ON "book_club_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "book_club_posts_book_idx" ON "book_club_posts" USING btree ("book_club_book_id");--> statement-breakpoint
CREATE INDEX "book_club_posts_feed_idx" ON "book_club_posts" USING btree ("club_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "book_club_posts_cursor_idx" ON "book_club_posts" USING btree ("created_at" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "book_club_votes_book_idx" ON "book_club_votes" USING btree ("book_club_book_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_club_votes_unique_idx" ON "book_club_votes" USING btree ("book_club_book_id","user_id");--> statement-breakpoint
CREATE INDEX "book_clubs_owner_idx" ON "book_clubs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "book_clubs_slug_idx" ON "book_clubs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "book_clubs_name_idx" ON "book_clubs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "editions_work_idx" ON "editions" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "editions_isbn13_idx" ON "editions" USING btree ("isbn_13");--> statement-breakpoint
CREATE INDEX "editions_isbn10_idx" ON "editions" USING btree ("isbn_10");--> statement-breakpoint
CREATE INDEX "follows_follower_idx" ON "follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "follows_following_idx" ON "follows" USING btree ("following_id");--> statement-breakpoint
CREATE UNIQUE INDEX "follows_unique_idx" ON "follows" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE INDEX "list_items_list_idx" ON "list_items" USING btree ("list_id");--> statement-breakpoint
CREATE UNIQUE INDEX "list_items_unique_idx" ON "list_items" USING btree ("list_id","work_id");--> statement-breakpoint
CREATE INDEX "lists_user_idx" ON "lists" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lists_user_slug_idx" ON "lists" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX "reading_checkins_user_idx" ON "reading_checkins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reading_checkins_library_idx" ON "reading_checkins" USING btree ("user_library_id");--> statement-breakpoint
CREATE INDEX "reading_checkins_work_idx" ON "reading_checkins" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "reading_checkins_user_created_idx" ON "reading_checkins" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "reading_checkins_cursor_idx" ON "reading_checkins" USING btree ("created_at" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "reading_logs_user_idx" ON "reading_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reading_logs_work_idx" ON "reading_logs" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "reading_logs_user_created_idx" ON "reading_logs" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "reading_logs_user_work_idx" ON "reading_logs" USING btree ("user_id","work_id");--> statement-breakpoint
CREATE INDEX "reading_logs_cursor_idx" ON "reading_logs" USING btree ("created_at" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "user_blocks_blocker_idx" ON "user_blocks" USING btree ("blocker_id");--> statement-breakpoint
CREATE INDEX "user_blocks_blocked_idx" ON "user_blocks" USING btree ("blocked_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_blocks_unique_idx" ON "user_blocks" USING btree ("blocker_id","blocked_id");--> statement-breakpoint
CREATE INDEX "user_library_user_idx" ON "user_library" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_library_status_idx" ON "user_library" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_library_user_work_idx" ON "user_library" USING btree ("user_id","work_id");--> statement-breakpoint
CREATE INDEX "user_mutes_muter_idx" ON "user_mutes" USING btree ("muter_id");--> statement-breakpoint
CREATE INDEX "user_mutes_muted_idx" ON "user_mutes" USING btree ("muted_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_mutes_unique_idx" ON "user_mutes" USING btree ("muter_id","muted_id");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "works_title_idx" ON "works" USING btree ("title");--> statement-breakpoint
CREATE INDEX "works_ol_key_idx" ON "works" USING btree ("open_library_key");