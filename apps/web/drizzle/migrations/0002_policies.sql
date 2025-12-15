-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mutes ENABLE ROW LEVEL SECURITY;
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
-- HELPER FUNCTIONS FOR MODERATION
-- ============================================================================

CREATE OR REPLACE FUNCTION is_blocked(blocker_id UUID, blocked_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_blocks
    WHERE user_blocks.blocker_id = $1
    AND user_blocks.blocked_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_muted(muter_id UUID, muted_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_mutes
    WHERE user_mutes.muter_id = $1
    AND user_mutes.muted_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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


-- ============================================================================
-- USERS POLICIES
-- ============================================================================

CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (is_private = false);

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can view profiles they follow"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = users.id
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());


-- ============================================================================
-- WORKS, AUTHORS, EDITIONS (Public Catalog Data)
-- ============================================================================

CREATE POLICY "Works are viewable by everyone"
  ON works FOR SELECT USING (true);

CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT USING (true);

CREATE POLICY "Work authors are viewable by everyone"
  ON work_authors FOR SELECT USING (true);

CREATE POLICY "Editions are viewable by everyone"
  ON editions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert works"
  ON works FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert authors"
  ON authors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert editions"
  ON editions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert work_authors"
  ON work_authors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================================================
-- USER_LIBRARY POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own library"
  ON user_library FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Public libraries are viewable"
  ON user_library FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_library.user_id
      AND users.is_private = false
    )
  );

CREATE POLICY "Followers can view library"
  ON user_library FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = user_library.user_id
    )
  );

CREATE POLICY "Users can add to their library"
  ON user_library FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their library"
  ON user_library FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can remove from their library"
  ON user_library FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- READING_LOGS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own reading logs"
  ON reading_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Public reading logs are viewable"
  ON reading_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = reading_logs.user_id
      AND users.is_private = false
    )
  );

CREATE POLICY "Followers can view reading logs"
  ON reading_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = reading_logs.user_id
    )
  );

CREATE POLICY "Blocked users cannot view reading logs"
  ON reading_logs FOR SELECT
  USING (
    NOT EXISTS (
      SELECT 1 FROM user_blocks
      WHERE user_blocks.blocker_id = reading_logs.user_id
      AND user_blocks.blocked_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reading logs"
  ON reading_logs FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reading logs"
  ON reading_logs FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their reading logs"
  ON reading_logs FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- READING_CHECKINS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own check-ins"
  ON reading_checkins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Public check-ins are viewable"
  ON reading_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = reading_checkins.user_id
      AND users.is_private = false
    )
  );

CREATE POLICY "Followers can view check-ins"
  ON reading_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = reading_checkins.user_id
    )
  );

CREATE POLICY "Blocked users cannot view check-ins"
  ON reading_checkins FOR SELECT
  USING (
    NOT EXISTS (
      SELECT 1 FROM user_blocks
      WHERE user_blocks.blocker_id = reading_checkins.user_id
      AND user_blocks.blocked_id = auth.uid()
    )
  );

CREATE POLICY "Users can create check-ins"
  ON reading_checkins FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their check-ins"
  ON reading_checkins FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their check-ins"
  ON reading_checkins FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- FOLLOWS POLICIES
-- ============================================================================

CREATE POLICY "Follows are viewable"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE USING (follower_id = auth.uid());


-- ============================================================================
-- USER_BLOCKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their blocks"
  ON user_blocks FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks"
  ON user_blocks FOR INSERT WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can remove blocks"
  ON user_blocks FOR DELETE USING (blocker_id = auth.uid());


-- ============================================================================
-- USER_MUTES POLICIES
-- ============================================================================

CREATE POLICY "Users can view their mutes"
  ON user_mutes FOR SELECT
  USING (muter_id = auth.uid());

CREATE POLICY "Users can create mutes"
  ON user_mutes FOR INSERT WITH CHECK (muter_id = auth.uid());

CREATE POLICY "Users can remove mutes"
  ON user_mutes FOR DELETE USING (muter_id = auth.uid());


-- ============================================================================
-- LISTS POLICIES
-- ============================================================================

CREATE POLICY "Public lists are viewable"
  ON lists FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own lists"
  ON lists FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Followers can view lists"
  ON lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = lists.user_id
    )
  );

CREATE POLICY "Users can create lists"
  ON lists FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lists"
  ON lists FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own lists"
  ON lists FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- LIST_ITEMS POLICIES
-- ============================================================================

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

CREATE POLICY "Public activities are viewable"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = activities.actor_id
      AND users.is_private = false
    )
  );

CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (actor_id = auth.uid());

CREATE POLICY "Followers can view activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = activities.actor_id
    )
  );

CREATE POLICY "Blocked users cannot view activities"
  ON activities FOR SELECT
  USING (
    NOT EXISTS (
      SELECT 1 FROM user_blocks
      WHERE user_blocks.blocker_id = activities.actor_id
      AND user_blocks.blocked_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own activities"
  ON activities FOR INSERT WITH CHECK (actor_id = auth.uid());


-- ============================================================================
-- BOOK CLUBS POLICIES
-- ============================================================================

CREATE POLICY "Public clubs are viewable"
  ON book_clubs FOR SELECT USING (is_private = false);

CREATE POLICY "Members can view their clubs"
  ON book_clubs FOR SELECT
  USING (is_club_member(id, auth.uid()));

CREATE POLICY "Users can create clubs"
  ON book_clubs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Owner can update club"
  ON book_clubs FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owner can delete club"
  ON book_clubs FOR DELETE USING (owner_id = auth.uid());


-- ============================================================================
-- BOOK CLUB MEMBERS POLICIES
-- ============================================================================

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

CREATE POLICY "Admins can add members"
  ON book_club_members FOR INSERT
  WITH CHECK (is_club_admin(club_id, auth.uid()));

CREATE POLICY "Users can join clubs"
  ON book_club_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM book_clubs
        WHERE book_clubs.id = club_id
        AND book_clubs.is_private = false
      )
      OR EXISTS (
        SELECT 1 FROM book_club_invites
        WHERE book_club_invites.club_id = book_club_members.club_id
        AND book_club_invites.invitee_id = auth.uid()
        AND book_club_invites.status = 'accepted'
      )
    )
  );

CREATE POLICY "Admins can update members"
  ON book_club_members FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

CREATE POLICY "Members can leave club"
  ON book_club_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR is_club_admin(club_id, auth.uid())
  );


-- ============================================================================
-- BOOK CLUB BOOKS POLICIES
-- ============================================================================

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

CREATE POLICY "Members can suggest books"
  ON book_club_books FOR INSERT
  WITH CHECK (
    is_club_member(club_id, auth.uid())
    AND suggested_by_id = auth.uid()
  );

CREATE POLICY "Admins can update club books"
  ON book_club_books FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

CREATE POLICY "Admins can remove club books"
  ON book_club_books FOR DELETE
  USING (is_club_admin(club_id, auth.uid()));


-- ============================================================================
-- BOOK CLUB VOTES POLICIES
-- ============================================================================

CREATE POLICY "Votes viewable by members"
  ON book_club_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_votes.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

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

CREATE POLICY "Members can remove their vote"
  ON book_club_votes FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- BOOK CLUB BOOK RATINGS POLICIES
-- ============================================================================

CREATE POLICY "Ratings viewable by members"
  ON book_club_book_ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM book_club_books bcb
      WHERE bcb.id = book_club_book_ratings.book_club_book_id
      AND is_club_member(bcb.club_id, auth.uid())
    )
  );

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

CREATE POLICY "Members can update their rating"
  ON book_club_book_ratings FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Members can delete their rating"
  ON book_club_book_ratings FOR DELETE
  USING (user_id = auth.uid());


-- ============================================================================
-- BOOK CLUB POSTS POLICIES
-- ============================================================================

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

CREATE POLICY "Members can create posts"
  ON book_club_posts FOR INSERT
  WITH CHECK (
    is_club_member(club_id, auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update their posts"
  ON book_club_posts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their posts"
  ON book_club_posts FOR DELETE
  USING (
    user_id = auth.uid()
    OR is_club_admin(club_id, auth.uid())
  );


-- ============================================================================
-- BOOK CLUB COMMENTS POLICIES
-- ============================================================================

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

CREATE POLICY "Users can update their comments"
  ON book_club_comments FOR UPDATE
  USING (user_id = auth.uid());

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

CREATE POLICY "Users can see their invites"
  ON book_club_invites FOR SELECT
  USING (invitee_id = auth.uid());

CREATE POLICY "Users can see invites they sent"
  ON book_club_invites FOR SELECT
  USING (inviter_id = auth.uid());

CREATE POLICY "Admins can see club invites"
  ON book_club_invites FOR SELECT
  USING (is_club_admin(club_id, auth.uid()));

CREATE POLICY "Admins can create invites"
  ON book_club_invites FOR INSERT
  WITH CHECK (
    is_club_admin(club_id, auth.uid())
    AND inviter_id = auth.uid()
  );

CREATE POLICY "Invitee can respond to invite"
  ON book_club_invites FOR UPDATE
  USING (invitee_id = auth.uid());

CREATE POLICY "Admins can cancel invites"
  ON book_club_invites FOR DELETE
  USING (is_club_admin(club_id, auth.uid()));


-- ============================================================================
-- BOOK CLUB JOIN REQUESTS POLICIES
-- ============================================================================

CREATE POLICY "Users can see their requests"
  ON book_club_join_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can see join requests"
  ON book_club_join_requests FOR SELECT
  USING (is_club_admin(club_id, auth.uid()));

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

CREATE POLICY "Admins can respond to requests"
  ON book_club_join_requests FOR UPDATE
  USING (is_club_admin(club_id, auth.uid()));

CREATE POLICY "Users can cancel their request"
  ON book_club_join_requests FOR DELETE
  USING (user_id = auth.uid() AND status = 'pending');
