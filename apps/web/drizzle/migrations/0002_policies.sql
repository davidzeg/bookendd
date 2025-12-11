-- First, enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_book_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_club_join_requests ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (is_private = false);

-- Users can view their own profile (even if private)
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Users can view profiles of people they follow
CREATE POLICY "Users can view profiles they follow"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follows.follower_id = auth.uid() 
      AND follows.following_id = users.id
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Insert handled by Supabase Auth trigger (on signup)


-- ============================================================================
-- WORKS, AUTHORS, EDITIONS (Public Catalog Data)
-- ============================================================================

-- Book data is readable by everyone (even logged out users)
CREATE POLICY "Works are viewable by everyone"
  ON works FOR SELECT
  USING (true);

CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT
  USING (true);

CREATE POLICY "Work authors are viewable by everyone"
  ON work_authors FOR SELECT
  USING (true);

CREATE POLICY "Editions are viewable by everyone"
  ON editions FOR SELECT
  USING (true);

-- Authenticated users can insert book data (when importing from Open Library)
CREATE POLICY "Authenticated users can insert works"
  ON works FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert authors"
  ON authors FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert editions"
  ON editions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert work_authors"
  ON work_authors FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================================================
-- USER_LIBRARY POLICIES
-- ============================================================================

-- Users can view their own library
CREATE POLICY "Users can view their own library"
  ON user_library FOR SELECT
  USING (user_id = auth.uid());

-- Users can view library of public profiles
CREATE POLICY "Public libraries are viewable"
  ON user_library FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_library.user_id 
      AND users.is_private = false
    )
  );

-- Users can view library of people they follow (even if private)
CREATE POLICY "Followers can view library"
  ON user_library FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follows.follower_id = auth.uid() 
      AND follows.following_id = user_library.user_id
    )
  );

-- Users can manage their own library
CREATE POLICY "Users can add to their library"
  ON user_library FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their library"
  ON user_library FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can remove from their library"
  ON user_library FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- READING_LOGS POLICIES (Public diary/feed entries)
-- ============================================================================

-- Users can view their own logs
CREATE POLICY "Users can view their own reading logs"
  ON reading_logs FOR SELECT
  USING (user_id = auth.uid());

-- Logs are viewable if user's profile is public
CREATE POLICY "Public reading logs are viewable"
  ON reading_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = reading_logs.user_id 
      AND users.is_private = false
    )
  );

-- Followers can view logs of private profiles
CREATE POLICY "Followers can view reading logs"
  ON reading_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follows.follower_id = auth.uid() 
      AND follows.following_id = reading_logs.user_id
    )
  );

-- Users can manage their own logs
CREATE POLICY "Users can create reading logs"
  ON reading_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reading logs"
  ON reading_logs FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their reading logs"
  ON reading_logs FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- FOLLOWS POLICIES
-- ============================================================================

-- Anyone can see follow relationships (for follower counts, etc.)
CREATE POLICY "Follows are viewable"
  ON follows FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (follower_id = auth.uid());


-- ============================================================================
-- LISTS POLICIES
-- ============================================================================

-- Public lists are viewable by everyone
CREATE POLICY "Public lists are viewable"
  ON lists FOR SELECT
  USING (is_public = true);

-- Users can view their own private lists
CREATE POLICY "Users can view their own lists"
  ON lists FOR SELECT
  USING (user_id = auth.uid());

-- Followers can view lists of people they follow
CREATE POLICY "Followers can view lists"
  ON lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follows.follower_id = auth.uid() 
      AND follows.following_id = lists.user_id
    )
  );

-- Users can manage their own lists
CREATE POLICY "Users can create lists"
  ON lists FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lists"
  ON lists FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own lists"
  ON lists FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- LIST_ITEMS POLICIES
-- ============================================================================

-- List items follow list visibility
CREATE POLICY "List items viewable if list is viewable"
  ON list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_items.list_id 
      AND (
        lists.is_public = true 
        OR lists.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM follows 
          WHERE follows.follower_id = auth.uid() 
          AND follows.following_id = lists.user_id
        )
      )
    )
  );

-- Users can manage items in their own lists
CREATE POLICY "Users can add to their lists"
  ON list_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their list items"
  ON list_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove from their lists"
  ON list_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_items.list_id 
      AND lists.user_id = auth.uid()
    )
  );


-- ============================================================================
-- ACTIVITIES POLICIES
-- ============================================================================

-- Activities are viewable if the actor's profile is public
CREATE POLICY "Public activities are viewable"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = activities.actor_id 
      AND users.is_private = false
    )
  );

-- Users can view their own activities
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (actor_id = auth.uid());

-- Followers can view activities of people they follow
CREATE POLICY "Followers can view activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follows.follower_id = auth.uid() 
      AND follows.following_id = activities.actor_id
    )
  );

-- Activities are typically created by triggers/server, but allow user insert
CREATE POLICY "Users can create their own activities"
  ON activities FOR INSERT
  WITH CHECK (actor_id = auth.uid());


-- ============================================================================
-- BOOK CLUBS POLICIES
-- ============================================================================

-- Helper function to check club membership
CREATE OR REPLACE FUNCTION is_club_member(club_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM book_club_members 
    WHERE book_club_members.club_id = $1 
    AND book_club_members.user_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check club admin/owner status
CREATE OR REPLACE FUNCTION is_club_admin(club_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM book_club_members 
    WHERE book_club_members.club_id = $1 
    AND book_club_members.user_id = $2
    AND book_club_members.role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public clubs are viewable by everyone
CREATE POLICY "Public clubs are viewable"
  ON book_clubs FOR SELECT
  USING (is_private = false);

-- Members can view their private clubs
CREATE POLICY "Members can view their clubs"
  ON book_clubs FOR SELECT
  USING (is_club_member(id, auth.uid()));

-- Authenticated users can create clubs
CREATE POLICY "Users can create clubs"
  ON book_clubs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Only owner can update club settings
CREATE POLICY "Owner can update club"
  ON book_clubs FOR UPDATE
  USING (owner_id = auth.uid());

-- Only owner can delete club
CREATE POLICY "Owner can delete club"
  ON book_clubs FOR DELETE
  USING (owner_id = auth.uid());


-- ============================================================================
-- BOOK CLUB MEMBERS POLICIES
-- ============================================================================

-- Members are viewable if club is public or user is a member
CREATE POLICY "Club members viewable for public clubs"
  ON book_club_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_clubs 
      WHERE book_clubs.id = book_club_members.club_id 
      AND book_clubs.is_private = false
    )
  );

CREATE POLICY "Club members viewable by members"
  ON book_club_members FOR SELECT
  USING (is_club_member(club_id, auth.uid()));

-- Admins/owners can add members (for direct adds, invites handled separately)
CREATE POLICY "Admins can add members"
  ON book_club_members FOR INSERT
  WITH CHECK (is_club_admin(club_id, auth.uid()));

-- Users can add themselves when joining public club or accepting invite
CREATE POLICY "Users can join clubs"
  ON book_club_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND (
      -- Public club
      EXISTS (
        SELECT 1 FROM book_clubs 
        WHERE book_clubs.id = club_id 
        AND book_clubs.is_private = false
      )
      -- Or has accepted invite (checked at app level)
      OR EXISTS (
        SELECT 1 FROM book_club_invites
        WHERE book_club_invites.club_id = book_club_members.club_id
        AND book_club_invites.invitee_id = auth.uid()
        AND book_club_invites.status = 'accepted'
      )
    )
  );

-- Admins can update member roles
CREATE POLICY "Admins can update members"
  ON book_club_members FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

-- Members can leave (delete themselves), admins can remove others
CREATE POLICY "Members can leave club"
  ON book_club_members FOR DELETE
  USING (
    user_id = auth.uid() 
    OR is_club_admin(club_id, auth.uid())
  );


-- ============================================================================
-- BOOK CLUB BOOKS POLICIES
-- ============================================================================

-- Viewable by members (or public club)
CREATE POLICY "Club books viewable for public clubs"
  ON book_club_books FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_clubs 
      WHERE book_clubs.id = book_club_books.club_id 
      AND book_clubs.is_private = false
    )
  );

CREATE POLICY "Club books viewable by members"
  ON book_club_books FOR SELECT
  USING (is_club_member(club_id, auth.uid()));

-- Members can suggest books
CREATE POLICY "Members can suggest books"
  ON book_club_books FOR INSERT
  WITH CHECK (
    is_club_member(club_id, auth.uid()) 
    AND suggested_by_id = auth.uid()
  );

-- Admins can update book status (nominate, queue, set current, etc.)
CREATE POLICY "Admins can update club books"
  ON book_club_books FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

-- Admins can remove books
CREATE POLICY "Admins can remove club books"
  ON book_club_books FOR DELETE
  USING (is_club_admin(club_id, auth.uid()));


-- ============================================================================
-- BOOK CLUB VOTES POLICIES
-- ============================================================================

-- Votes viewable by club members
CREATE POLICY "Votes viewable by members"
  ON book_club_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_votes.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

-- Members can vote
CREATE POLICY "Members can vote"
  ON book_club_votes FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_votes.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

-- Members can remove their vote
CREATE POLICY "Members can remove their vote"
  ON book_club_votes FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- BOOK CLUB BOOK RATINGS POLICIES
-- ============================================================================

-- Ratings viewable by club members
CREATE POLICY "Ratings viewable by members"
  ON book_club_book_ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_book_ratings.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

-- Members can rate books
CREATE POLICY "Members can rate books"
  ON book_club_book_ratings FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_book_ratings.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

-- Members can update their rating
CREATE POLICY "Members can update their rating"
  ON book_club_book_ratings FOR UPDATE
  USING (user_id = auth.uid());

-- Members can delete their rating
CREATE POLICY "Members can delete their rating"
  ON book_club_book_ratings FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- BOOK CLUB POSTS POLICIES
-- ============================================================================

-- Posts viewable by club members (or public club)
CREATE POLICY "Posts viewable for public clubs"
  ON book_club_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_clubs 
      WHERE book_clubs.id = book_club_posts.club_id 
      AND book_clubs.is_private = false
    )
  );

CREATE POLICY "Posts viewable by members"
  ON book_club_posts FOR SELECT
  USING (is_club_member(club_id, auth.uid()));

-- Members can create posts
CREATE POLICY "Members can create posts"
  ON book_club_posts FOR INSERT
  WITH CHECK (
    is_club_member(club_id, auth.uid()) 
    AND user_id = auth.uid()
  );

-- Users can update their own posts
CREATE POLICY "Users can update their posts"
  ON book_club_posts FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own posts, admins can delete any
CREATE POLICY "Users can delete their posts"
  ON book_club_posts FOR DELETE
  USING (
    user_id = auth.uid() 
    OR is_club_admin(club_id, auth.uid())
  );


-- ============================================================================
-- BOOK CLUB COMMENTS POLICIES
-- ============================================================================

-- Comments follow post visibility
CREATE POLICY "Comments viewable with posts"
  ON book_club_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_club_posts p
      JOIN book_clubs bc ON bc.id = p.club_id
      WHERE p.id = book_club_comments.post_id
      AND (bc.is_private = false OR is_club_member(bc.id, auth.uid()))
    )
  );

-- Members can comment on posts in their clubs
CREATE POLICY "Members can comment"
  ON book_club_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM book_club_posts p
      WHERE p.id = book_club_comments.post_id
      AND is_club_member(p.club_id, auth.uid())
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update their comments"
  ON book_club_comments FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own comments, admins can delete any in their club
CREATE POLICY "Users can delete their comments"
  ON book_club_comments FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM book_club_posts p
      WHERE p.id = book_club_comments.post_id
      AND is_club_admin(p.club_id, auth.uid())
    )
  );


-- ============================================================================
-- BOOK CLUB INVITES POLICIES
-- ============================================================================

-- Invitee can see their invites
CREATE POLICY "Users can see their invites"
  ON book_club_invites FOR SELECT
  USING (invitee_id = auth.uid());

-- Inviters can see invites they sent
CREATE POLICY "Users can see invites they sent"
  ON book_club_invites FOR SELECT
  USING (inviter_id = auth.uid());

-- Admins can see all invites for their club
CREATE POLICY "Admins can see club invites"
  ON book_club_invites FOR SELECT
  USING (is_club_admin(club_id, auth.uid()));

-- Admins can create invites
CREATE POLICY "Admins can create invites"
  ON book_club_invites FOR INSERT
  WITH CHECK (
    is_club_admin(club_id, auth.uid()) 
    AND inviter_id = auth.uid()
  );

-- Invitee can update (accept/decline) their invite
CREATE POLICY "Invitee can respond to invite"
  ON book_club_invites FOR UPDATE
  USING (invitee_id = auth.uid());

-- Admins can cancel invites
CREATE POLICY "Admins can cancel invites"
  ON book_club_invites FOR DELETE
  USING (is_club_admin(club_id, auth.uid()));


-- ============================================================================
-- BOOK CLUB JOIN REQUESTS POLICIES
-- ============================================================================

-- Users can see their own requests
CREATE POLICY "Users can see their requests"
  ON book_club_join_requests FOR SELECT
  USING (user_id = auth.uid());

-- Admins can see requests for their club
CREATE POLICY "Admins can see join requests"
  ON book_club_join_requests FOR SELECT
  USING (is_club_admin(club_id, auth.uid()));

-- Authenticated users can request to join private clubs
CREATE POLICY "Users can request to join"
  ON book_club_join_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM book_clubs 
      WHERE book_clubs.id = club_id 
      AND book_clubs.is_private = true
    )
  );

-- Admins can update (approve/reject) requests
CREATE POLICY "Admins can respond to requests"
  ON book_club_join_requests FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

-- Users can cancel their own pending request
CREATE POLICY "Users can cancel their request"
  ON book_club_join_requests FOR DELETE
  USING (user_id = auth.uid() AND status = 'pending');


-- ============================================================================
-- SERVICE ROLE BYPASS
-- For server-side operations (triggers, admin tasks)
-- ============================================================================

-- Note: The service_role key bypasses RLS by default in Supabase.
-- Use it only in server-side code (API routes, server actions).
-- Never expose it to the client.