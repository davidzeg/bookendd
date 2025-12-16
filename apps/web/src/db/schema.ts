import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const readingStatusEnum = pgEnum('reading_status', [
  'to_read', // to read pile
  'currently_reading', // actively reading (optional)
  'read', // finished
  'did_not_finish', // started but abandoned
])

export const bookClubRoleEnum = pgEnum('book_club_role', ['owner', 'admin', 'member'])

export const bookClubBookStatusEnum = pgEnum('book_club_book_status', [
  'suggested',
  'nominated',
  'queued',
  'current',
  'finished',
  'rejected',
])

export const bookClubInviteStatusEnum = pgEnum('book_club_invite_status', [
  'pending',
  'accepted',
  'declined',
  'expired',
])

export const users = pgTable(
  'users',
  {
    // Primary key - ID from Supabase Auth
    id: uuid('id').primaryKey(),

    // unique username
    username: varchar('username', { length: 50 }).unique().notNull(),

    // display name
    displayName: varchar('display_name', { length: 100 }),

    // bio
    bio: text('bio'),

    // profile picture url (storage)
    avatarUrl: text('avatar_url'),

    // private
    isPrivate: boolean('is_private').default(false).notNull(),

    booksReadCount: integer('books_read_count').default(0).notNull(),
    toReadCount: integer('to_read_count').default(0).notNull(),
    currentlyReadingCount: integer('currently_reading_count').default(0).notNull(),
    // DNF is a valid reading outcome, not a failure - track it equally
    dnfCount: integer('dnf_count').default(0).notNull(),
    followersCount: integer('followers_count').default(0).notNull(),
    followingCount: integer('following_count').default(0).notNull(),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
    ratingDistribution: text('rating_distribution'),

    // timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // usernames index (profiles, @mentions)
    index('users_username_idx').on(table.username),
  ],
)

export const works = pgTable(
  'works',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // canonical title
    title: varchar('title', { length: 500 }).notNull(),

    // Original title if translated
    originalTitle: varchar('original_title', { length: 500 }),

    // description / summary
    description: text('description'),

    // first published year
    firstPublishedYear: integer('first_published_year'),

    // genres / subjects
    subjects: text('subjects').array(),

    // cover image
    coverImageUrl: text('cover_image_url'),

    // open library identifier
    openLibraryKey: varchar('open_library_key', { length: 50 }).unique(),

    ratingsCount: integer('ratings_count').default(0).notNull(),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
    ratingDistribution: text('rating_distribution'),

    readersCount: integer('readers_count').default(0).notNull(),
    currentlyReadingCount: integer('currently_reading_count').default(0).notNull(),
    reviewsCount: integer('reviews_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // text search on title
    index('works_title_idx').on(table.title),
    // lookup by open library key
    index('works_ol_key_idx').on(table.openLibraryKey),
  ],
)

export const authors = pgTable(
  'authors',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // author name
    name: varchar('name', { length: 255 }).notNull(),

    // biography
    bio: text('bio'),

    // author photo
    photoUrl: text('photo_url'),

    // open library identifier
    openLibraryKey: varchar('open_library_key', { length: 50 }).unique(),

    worksCount: integer('works_count').default(0).notNull(),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
    ratingsCount: integer('ratings_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('authors_name_idx').on(table.name)],
)

export const workAuthors = pgTable(
  'work_authors',
  {
    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'cascade' }),

    order: integer('order').default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.workId, table.authorId] })],
)

export const editions = pgTable(
  'editions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // which work is this an edition of
    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    // edition-specific title
    title: varchar('title', { length: 500 }).notNull(),

    // isbn-10 and isbn-13
    isbn10: varchar('isbn_10', { length: 10 }),
    isbn13: varchar('isbn_13', { length: 13 }),

    // publisher information
    publisher: varchar('publisher', { length: 255 }),
    publishedDate: timestamp('published_date', { withTimezone: true }),

    // physical details
    pageCount: integer('page_count'),
    format: varchar('format', { length: 50 }), // hardcover / paperback / ebook
    language: varchar('language', { length: 10 }),

    // cover for this edition
    coverImageUrl: text('cover_image_url'),

    // open library identifier
    openLibraryKey: varchar('open_library_key', { length: 50 }).unique(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('editions_work_idx').on(table.workId),
    index('editions_isbn13_idx').on(table.isbn13),
    index('editions_isbn10_idx').on(table.isbn10),
  ],
)

export const userLibrary = pgTable(
  'user_library',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Track at WORK level - no edition needed
    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    // Optional: if user wants to note which edition
    editionId: uuid('edition_id').references(() => editions.id, {
      onDelete: 'set null',
    }),

    status: readingStatusEnum('status').notNull().default('to_read'),

    // Allow rating without a full log
    rating: decimal('rating', { precision: 2, scale: 1 }),

    // Private notes (never in feed)
    notes: text('notes'),

    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('user_library_user_idx').on(table.userId),
    index('user_library_status_idx').on(table.userId, table.status),
    // One entry per work per user
    uniqueIndex('user_library_user_work_idx').on(table.userId, table.workId),
  ],
)

export const readingLogs = pgTable(
  'reading_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    editionId: uuid('edition_id').references(() => editions.id, {
      onDelete: 'set null',
    }),

    status: readingStatusEnum('status').notNull(),

    rating: decimal('rating', { precision: 2, scale: 1 }),

    reviewText: text('review_text'),
    containsSpoilers: boolean('contains_spoilers').default(false).notNull(),

    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),

    isReread: boolean('is_reread').default(false).notNull(),

    likesCount: integer('likes_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('reading_logs_user_idx').on(table.userId),
    index('reading_logs_work_idx').on(table.workId),
    // Feed queries: user's diary sorted by date
    index('reading_logs_user_created_idx').on(table.userId, table.createdAt.desc()),
    // For finding logs of a specific work by a user
    index('reading_logs_user_work_idx').on(table.userId, table.workId),
    // Stable cursor pagination: (createdAt, id) prevents duplicates/missing items
    index('reading_logs_cursor_idx').on(table.createdAt.desc(), table.id),
  ],
)

// Reading check-ins: ritual/progress updates while reading a book
// Allows users to post updates, track progress, save memorable passages
export const readingCheckins = pgTable(
  'reading_checkins',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Reference to the user_library entry (must be currently_reading)
    userLibraryId: uuid('user_library_id')
      .notNull()
      .references(() => userLibrary.id, { onDelete: 'cascade' }),

    // Also store workId for easier querying
    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    // Progress tracking (optional) - either percentage or page-based
    progressPercent: integer('progress_percent'), // 0-100
    progressPage: integer('progress_page'), // current page
    pagesTotal: integer('pages_total'), // for page-based progress

    // Unstructured update content
    content: text('content'),

    // A passage/quote that stuck with the reader during this session
    quote: text('quote'),

    // Engagement
    likesCount: integer('likes_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('reading_checkins_user_idx').on(table.userId),
    index('reading_checkins_library_idx').on(table.userLibraryId),
    index('reading_checkins_work_idx').on(table.workId),
    // Feed queries: user's check-ins sorted by date
    index('reading_checkins_user_created_idx').on(table.userId, table.createdAt.desc()),
    // Stable cursor pagination
    index('reading_checkins_cursor_idx').on(table.createdAt.desc(), table.id),
  ],
)

export const follows = pgTable(
  'follows',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('follows_follower_idx').on(table.followerId),
    index('follows_following_idx').on(table.followingId),
    uniqueIndex('follows_unique_idx').on(table.followerId, table.followingId),
  ],
)

// User blocks: blocker cannot see blocked's content, blocked cannot interact with blocker
export const userBlocks = pgTable(
  'user_blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    blockerId: uuid('blocker_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    blockedId: uuid('blocked_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('user_blocks_blocker_idx').on(table.blockerId),
    index('user_blocks_blocked_idx').on(table.blockedId),
    uniqueIndex('user_blocks_unique_idx').on(table.blockerId, table.blockedId),
  ],
)

// User mutes: muter doesn't see muted's content in feed, but muted can still interact
export const userMutes = pgTable(
  'user_mutes',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    muterId: uuid('muter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    mutedId: uuid('muted_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('user_mutes_muter_idx').on(table.muterId),
    index('user_mutes_muted_idx').on(table.mutedId),
    uniqueIndex('user_mutes_unique_idx').on(table.muterId, table.mutedId),
  ],
)

export const lists = pgTable(
  'lists',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // title
    name: varchar('name', { length: 255 }).notNull(),

    // description of the list
    description: text('description'),

    slug: varchar('slug', { length: 100 }).notNull(),

    isPublic: boolean('is_public').default(true).notNull(),

    isRanked: boolean('is_ranked').default(false).notNull(),

    itemsCount: integer('items_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('lists_user_idx').on(table.userId),
    uniqueIndex('lists_user_slug_idx').on(table.userId, table.slug),
  ],
)

export const listItems = pgTable(
  'list_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    listId: uuid('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),

    // Primary reference is the WORK
    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    // Optional: specify edition if the list is edition-specific
    // (e.g., "my hardcover collection", "first editions I own")
    editionId: uuid('edition_id').references(() => editions.id, {
      onDelete: 'set null',
    }),

    position: integer('position').notNull(),

    notes: text('notes'),

    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('list_items_list_idx').on(table.listId),
    uniqueIndex('list_items_unique_idx').on(table.listId, table.workId),
  ],
)

export const activities = pgTable(
  'activities',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // who performed action
    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // what type of activity
    activityType: varchar('activity_type', { length: 50 }).notNull(),

    // what the activity is about
    subjectType: varchar('subject_type', { length: 50 }).notNull(),

    subjectId: uuid('subject_id').notNull(),

    // additional context - use jsonb for safety, indexability, no parse costs
    metadata: jsonb('metadata'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('activities_actor_idx').on(table.actorId),
    // building the feed
    index('activities_feed_idx').on(table.actorId, table.createdAt.desc()),
    // Stable cursor pagination: (createdAt, id) prevents duplicates/missing items
    index('activities_cursor_idx').on(table.createdAt.desc(), table.id),
  ],
)

export const bookClubs = pgTable(
  'book_clubs',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    description: text('description'),
    profileImageUrl: text('profile_image_url'),
    coverImageUrl: text('cover_image_url'),

    // creator
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    isPrivate: boolean('is_private').default(true).notNull(),
    booksFinishedCount: integer('books_finished_count').default(0).notNull(),

    memberCount: integer('member_count').default(1).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_clubs_owner_idx').on(table.ownerId),
    index('book_clubs_slug_idx').on(table.slug),
    index('book_clubs_name_idx').on(table.name),
  ],
)

export const bookClubMembers = pgTable(
  'book_club_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clubId: uuid('club_id')
      .notNull()
      .references(() => bookClubs.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    role: bookClubRoleEnum('role').default('member').notNull(),

    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_members_club_idx').on(table.clubId),
    index('book_club_members_user_idx').on(table.userId),
    uniqueIndex('book_club_members_unique_idx').on(table.clubId, table.userId),
  ],
)

export const bookClubBooks = pgTable(
  'book_club_books',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    clubId: uuid('club_id')
      .notNull()
      .references(() => bookClubs.id, { onDelete: 'cascade' }),

    workId: uuid('work_id')
      .notNull()
      .references(() => works.id, { onDelete: 'cascade' }),

    status: bookClubBookStatusEnum('status').default('suggested').notNull(),

    suggestedById: uuid('suggested_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    position: integer('position'),

    voteCount: integer('vote_count').default(0).notNull(),

    ratingsCount: integer('ratings_count').default(0).notNull(),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
    ratingDistribution: text('rating_distribution'),
    reviewsCount: integer('reviews_count').default(0).notNull(),

    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_books_club_idx').on(table.clubId),
    index('book_club_books_status_idx').on(table.clubId, table.status),
    uniqueIndex('book_club_books_unique_idx').on(table.clubId, table.workId),
  ],
)

export const bookClubBookRatings = pgTable(
  'book_club_book_ratings',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    bookClubBookId: uuid('book_club_book_id')
      .notNull()
      .references(() => bookClubBooks.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    rating: decimal('rating', { precision: 2, scale: 1 }).notNull(),

    reviewText: text('review_text'),
    containsSpoilers: boolean('contains_spoilers').default(false).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_book_ratings_book_idx').on(table.bookClubBookId),
    index('book_club_book_ratings_user_idx').on(table.userId),
    // One rating per user per club book
    uniqueIndex('book_club_book_ratings_unique_idx').on(table.bookClubBookId, table.userId),
    // For finding highest/lowest raters
    index('book_club_book_ratings_rating_idx').on(table.bookClubBookId, table.rating),
  ],
)

export const bookClubVotes = pgTable(
  'book_club_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    bookClubBookId: uuid('book_club_book_id')
      .notNull()
      .references(() => bookClubBooks.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_votes_book_idx').on(table.bookClubBookId),
    uniqueIndex('book_club_votes_unique_idx').on(table.bookClubBookId, table.userId),
  ],
)

export const bookClubPosts = pgTable(
  'book_club_posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    clubId: uuid('club_id')
      .notNull()
      .references(() => bookClubs.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // optional: tie post to a specific book discussion
    bookClubBookId: uuid('book_club_book_id').references(() => bookClubBooks.id, {
      onDelete: 'set null',
    }),

    content: text('content').notNull(),
    containsSpoilers: boolean('contains_spoilers').default(false).notNull(),

    // engagement
    likesCount: integer('likes_count').default(0).notNull(),
    commentsCount: integer('comments_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_posts_club_idx').on(table.clubId),
    index('book_club_posts_user_idx').on(table.userId),
    index('book_club_posts_book_idx').on(table.bookClubBookId),
    // feed within a club
    index('book_club_posts_feed_idx').on(table.clubId, table.createdAt.desc()),
    // Stable cursor pagination
    index('book_club_posts_cursor_idx').on(table.createdAt.desc(), table.id),
  ],
)

export const bookClubComments = pgTable(
  'book_club_comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    postId: uuid('post_id')
      .notNull()
      .references(() => bookClubPosts.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),
    containsSpoilers: boolean('contains_spoilers').default(false).notNull(),

    likesCount: integer('likes_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('book_club_comments_post_idx').on(table.postId),
    index('book_club_comments_user_idx').on(table.userId),
  ],
)

export const bookClubInvites = pgTable(
  'book_club_invites',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    clubId: uuid('club_id')
      .notNull()
      .references(() => bookClubs.id, { onDelete: 'cascade' }),

    // who's being invited
    inviteeId: uuid('invitee_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // who sent the invite
    inviterId: uuid('inviter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    status: bookClubInviteStatusEnum('status').default('pending').notNull(),

    message: text('message'), // "Hey, join our horror book club!"

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => [
    index('book_club_invites_club_idx').on(table.clubId),
    index('book_club_invites_invitee_idx').on(table.inviteeId),
    // prevent duplicate pending invites
    uniqueIndex('book_club_invites_pending_idx').on(table.clubId, table.inviteeId),
  ],
)

export const bookClubJoinRequests = pgTable(
  'book_club_join_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    clubId: uuid('club_id')
      .notNull()
      .references(() => bookClubs.id, { onDelete: 'cascade' }),

    // who's requesting to join
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    status: bookClubInviteStatusEnum('status').default('pending').notNull(),

    message: text('message'), // "I'd love to join, I'm a huge Lovecraft fan"

    // who handled the request
    reviewedById: uuid('reviewed_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  (table) => [
    index('book_club_join_requests_club_idx').on(table.clubId),
    index('book_club_join_requests_user_idx').on(table.userId),
    uniqueIndex('book_club_join_requests_pending_idx').on(table.clubId, table.userId),
  ],
)
