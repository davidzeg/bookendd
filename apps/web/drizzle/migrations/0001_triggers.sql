-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Helper to build rating distribution JSON
CREATE OR REPLACE FUNCTION build_rating_distribution(
  count_1 INTEGER,
  count_2 INTEGER,
  count_3 INTEGER,
  count_4 INTEGER,
  count_5 INTEGER
) RETURNS TEXT AS $$
BEGIN
  RETURN json_build_object(
    '1', COALESCE(count_1, 0),
    '2', COALESCE(count_2, 0),
    '3', COALESCE(count_3, 0),
    '4', COALESCE(count_4, 0),
    '5', COALESCE(count_5, 0)
  )::TEXT;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 1. USER LIBRARY TRIGGERS
-- Updates: works stats, users stats, authors stats
-- ============================================================================

-- Recalculate work stats (ratings + reader counts)
CREATE OR REPLACE FUNCTION update_work_stats() RETURNS TRIGGER AS $$
DECLARE
  target_work_id UUID;
BEGIN
  -- Determine which work_id to update
  IF TG_OP = 'DELETE' THEN
    target_work_id := OLD.work_id;
  ELSE
    target_work_id := NEW.work_id;
  END IF;

  -- Update all stats in one query
  UPDATE works SET
    ratings_count = (
      SELECT COUNT(*) FROM user_library
      WHERE work_id = target_work_id AND rating IS NOT NULL
    ),
    average_rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM user_library
      WHERE work_id = target_work_id AND rating IS NOT NULL
    ),
    rating_distribution = (
      SELECT build_rating_distribution(
        COUNT(*) FILTER (WHERE FLOOR(rating) = 1),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 2),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 3),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 4),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 5)
      )
      FROM user_library
      WHERE work_id = target_work_id AND rating IS NOT NULL
    ),
    readers_count = (
      SELECT COUNT(*) FROM user_library WHERE work_id = target_work_id
    ),
    currently_reading_count = (
      SELECT COUNT(*) FROM user_library
      WHERE work_id = target_work_id AND status = 'currently_reading'
    )
  WHERE id = target_work_id;

  -- If work changed (edge case), update old work too
  IF TG_OP = 'UPDATE' AND OLD.work_id != NEW.work_id THEN
    UPDATE works SET
      ratings_count = (
        SELECT COUNT(*) FROM user_library
        WHERE work_id = OLD.work_id AND rating IS NOT NULL
      ),
      average_rating = (
        SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM user_library
        WHERE work_id = OLD.work_id AND rating IS NOT NULL
      ),
      rating_distribution = (
        SELECT build_rating_distribution(
          COUNT(*) FILTER (WHERE FLOOR(rating) = 1),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 2),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 3),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 4),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 5)
        )
        FROM user_library
        WHERE work_id = OLD.work_id AND rating IS NOT NULL
      ),
      readers_count = (
        SELECT COUNT(*) FROM user_library WHERE work_id = OLD.work_id
      ),
      currently_reading_count = (
        SELECT COUNT(*) FROM user_library
        WHERE work_id = OLD.work_id AND status = 'currently_reading'
      )
    WHERE id = OLD.work_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_library_work_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_library
FOR EACH ROW EXECUTE FUNCTION update_work_stats();


-- Recalculate user stats (book counts + rating distribution) - includes DNF
CREATE OR REPLACE FUNCTION update_user_stats() RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.user_id;
  ELSE
    target_user_id := NEW.user_id;
  END IF;

  UPDATE users SET
    books_read_count = (
      SELECT COUNT(*) FROM user_library
      WHERE user_id = target_user_id AND status = 'read'
    ),
    to_read_count = (
      SELECT COUNT(*) FROM user_library
      WHERE user_id = target_user_id AND status = 'to_read'
    ),
    currently_reading_count = (
      SELECT COUNT(*) FROM user_library
      WHERE user_id = target_user_id AND status = 'currently_reading'
    ),
    dnf_count = (
      SELECT COUNT(*) FROM user_library
      WHERE user_id = target_user_id AND status = 'did_not_finish'
    ),
    average_rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM user_library
      WHERE user_id = target_user_id AND rating IS NOT NULL
    ),
    rating_distribution = (
      SELECT build_rating_distribution(
        COUNT(*) FILTER (WHERE FLOOR(rating) = 1),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 2),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 3),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 4),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 5)
      )
      FROM user_library
      WHERE user_id = target_user_id AND rating IS NOT NULL
    )
  WHERE id = target_user_id;

  -- Handle user change (edge case)
  IF TG_OP = 'UPDATE' AND OLD.user_id != NEW.user_id THEN
    UPDATE users SET
      books_read_count = (
        SELECT COUNT(*) FROM user_library
        WHERE user_id = OLD.user_id AND status = 'read'
      ),
      to_read_count = (
        SELECT COUNT(*) FROM user_library
        WHERE user_id = OLD.user_id AND status = 'to_read'
      ),
      currently_reading_count = (
        SELECT COUNT(*) FROM user_library
        WHERE user_id = OLD.user_id AND status = 'currently_reading'
      ),
      dnf_count = (
        SELECT COUNT(*) FROM user_library
        WHERE user_id = OLD.user_id AND status = 'did_not_finish'
      ),
      average_rating = (
        SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM user_library
        WHERE user_id = OLD.user_id AND rating IS NOT NULL
      ),
      rating_distribution = (
        SELECT build_rating_distribution(
          COUNT(*) FILTER (WHERE FLOOR(rating) = 1),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 2),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 3),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 4),
          COUNT(*) FILTER (WHERE FLOOR(rating) = 5)
        )
        FROM user_library
        WHERE user_id = OLD.user_id AND rating IS NOT NULL
      )
    WHERE id = OLD.user_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_library_user_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_library
FOR EACH ROW EXECUTE FUNCTION update_user_stats();


-- Recalculate author stats when user_library changes
CREATE OR REPLACE FUNCTION update_author_stats_from_library() RETURNS TRIGGER AS $$
DECLARE
  target_work_id UUID;
  author_record RECORD;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_work_id := OLD.work_id;
  ELSE
    target_work_id := NEW.work_id;
  END IF;

  -- Update all authors of this work
  FOR author_record IN
    SELECT author_id FROM work_authors WHERE work_id = target_work_id
  LOOP
    UPDATE authors SET
      ratings_count = (
        SELECT COUNT(*)
        FROM user_library ul
        JOIN work_authors wa ON wa.work_id = ul.work_id
        WHERE wa.author_id = author_record.author_id AND ul.rating IS NOT NULL
      ),
      average_rating = (
        SELECT ROUND(AVG(ul.rating)::NUMERIC, 2)
        FROM user_library ul
        JOIN work_authors wa ON wa.work_id = ul.work_id
        WHERE wa.author_id = author_record.author_id AND ul.rating IS NOT NULL
      )
    WHERE id = author_record.author_id;
  END LOOP;

  -- Handle work change
  IF TG_OP = 'UPDATE' AND OLD.work_id != NEW.work_id THEN
    FOR author_record IN
      SELECT author_id FROM work_authors WHERE work_id = OLD.work_id
    LOOP
      UPDATE authors SET
        ratings_count = (
          SELECT COUNT(*)
          FROM user_library ul
          JOIN work_authors wa ON wa.work_id = ul.work_id
          WHERE wa.author_id = author_record.author_id AND ul.rating IS NOT NULL
        ),
        average_rating = (
          SELECT ROUND(AVG(ul.rating)::NUMERIC, 2)
          FROM user_library ul
          JOIN work_authors wa ON wa.work_id = ul.work_id
          WHERE wa.author_id = author_record.author_id AND ul.rating IS NOT NULL
        )
      WHERE id = author_record.author_id;
    END LOOP;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_library_author_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_library
FOR EACH ROW EXECUTE FUNCTION update_author_stats_from_library();


-- ============================================================================
-- 2. READING LOGS TRIGGERS
-- Updates: works.reviews_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_work_reviews_count() RETURNS TRIGGER AS $$
DECLARE
  target_work_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_work_id := OLD.work_id;
  ELSE
    target_work_id := NEW.work_id;
  END IF;

  UPDATE works SET
    reviews_count = (
      SELECT COUNT(*) FROM reading_logs
      WHERE work_id = target_work_id
      AND review_text IS NOT NULL
      AND review_text != ''
    )
  WHERE id = target_work_id;

  -- Handle work change
  IF TG_OP = 'UPDATE' AND OLD.work_id != NEW.work_id THEN
    UPDATE works SET
      reviews_count = (
        SELECT COUNT(*) FROM reading_logs
        WHERE work_id = OLD.work_id
        AND review_text IS NOT NULL
        AND review_text != ''
      )
    WHERE id = OLD.work_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER reading_logs_reviews_trigger
AFTER INSERT OR UPDATE OR DELETE ON reading_logs
FOR EACH ROW EXECUTE FUNCTION update_work_reviews_count();


-- ============================================================================
-- 3. FOLLOWS TRIGGERS
-- Updates: users.followers_count, users.following_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_follow_counts() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;

    UPDATE users SET following_count = following_count + 1
    WHERE id = NEW.follower_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.following_id;

    UPDATE users SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER follows_count_trigger
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();


-- ============================================================================
-- 4. WORK AUTHORS TRIGGERS
-- Updates: authors.works_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_author_works_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE authors SET works_count = works_count + 1
    WHERE id = NEW.author_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE authors SET works_count = GREATEST(0, works_count - 1)
    WHERE id = OLD.author_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER work_authors_count_trigger
AFTER INSERT OR DELETE ON work_authors
FOR EACH ROW EXECUTE FUNCTION update_author_works_count();


-- ============================================================================
-- 5. BOOK CLUB MEMBERS TRIGGERS
-- Updates: book_clubs.member_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_club_member_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE book_clubs SET member_count = member_count + 1
    WHERE id = NEW.club_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE book_clubs SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.club_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_club_members_count_trigger
AFTER INSERT OR DELETE ON book_club_members
FOR EACH ROW EXECUTE FUNCTION update_club_member_count();


-- ============================================================================
-- 6. BOOK CLUB BOOKS TRIGGERS
-- Updates: book_clubs.books_finished_count when status changes to 'finished'
-- ============================================================================

CREATE OR REPLACE FUNCTION update_club_books_finished_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'finished' THEN
    UPDATE book_clubs SET books_finished_count = books_finished_count + 1
    WHERE id = NEW.club_id;

  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'finished' AND NEW.status = 'finished' THEN
      UPDATE book_clubs SET books_finished_count = books_finished_count + 1
      WHERE id = NEW.club_id;
    ELSIF OLD.status = 'finished' AND NEW.status != 'finished' THEN
      UPDATE book_clubs SET books_finished_count = GREATEST(0, books_finished_count - 1)
      WHERE id = NEW.club_id;
    END IF;

  ELSIF TG_OP = 'DELETE' AND OLD.status = 'finished' THEN
    UPDATE book_clubs SET books_finished_count = GREATEST(0, books_finished_count - 1)
    WHERE id = OLD.club_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_club_books_finished_trigger
AFTER INSERT OR UPDATE OR DELETE ON book_club_books
FOR EACH ROW EXECUTE FUNCTION update_club_books_finished_count();


-- ============================================================================
-- 7. BOOK CLUB BOOK RATINGS TRIGGERS
-- Updates: book_club_books rating stats
-- ============================================================================

CREATE OR REPLACE FUNCTION update_club_book_rating_stats() RETURNS TRIGGER AS $$
DECLARE
  target_book_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_book_id := OLD.book_club_book_id;
  ELSE
    target_book_id := NEW.book_club_book_id;
  END IF;

  UPDATE book_club_books SET
    ratings_count = (
      SELECT COUNT(*) FROM book_club_book_ratings
      WHERE book_club_book_id = target_book_id
    ),
    average_rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM book_club_book_ratings
      WHERE book_club_book_id = target_book_id
    ),
    rating_distribution = (
      SELECT build_rating_distribution(
        COUNT(*) FILTER (WHERE FLOOR(rating) = 1),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 2),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 3),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 4),
        COUNT(*) FILTER (WHERE FLOOR(rating) = 5)
      )
      FROM book_club_book_ratings
      WHERE book_club_book_id = target_book_id
    ),
    reviews_count = (
      SELECT COUNT(*) FROM book_club_book_ratings
      WHERE book_club_book_id = target_book_id
      AND review_text IS NOT NULL
      AND review_text != ''
    )
  WHERE id = target_book_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_club_book_ratings_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON book_club_book_ratings
FOR EACH ROW EXECUTE FUNCTION update_club_book_rating_stats();


-- ============================================================================
-- 8. BOOK CLUB VOTES TRIGGERS
-- Updates: book_club_books.vote_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_club_book_vote_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE book_club_books SET vote_count = vote_count + 1
    WHERE id = NEW.book_club_book_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE book_club_books SET vote_count = GREATEST(0, vote_count - 1)
    WHERE id = OLD.book_club_book_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_club_votes_count_trigger
AFTER INSERT OR DELETE ON book_club_votes
FOR EACH ROW EXECUTE FUNCTION update_club_book_vote_count();


-- ============================================================================
-- 9. LIST ITEMS TRIGGERS
-- Updates: lists.items_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_list_items_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE lists SET items_count = items_count + 1
    WHERE id = NEW.list_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE lists SET items_count = GREATEST(0, items_count - 1)
    WHERE id = OLD.list_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER list_items_count_trigger
AFTER INSERT OR DELETE ON list_items
FOR EACH ROW EXECUTE FUNCTION update_list_items_count();


-- ============================================================================
-- 10. BOOK CLUB POSTS & COMMENTS TRIGGERS
-- Updates: book_club_posts.comments_count
-- ============================================================================

CREATE OR REPLACE FUNCTION update_post_comments_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE book_club_posts SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE book_club_posts SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_club_comments_count_trigger
AFTER INSERT OR DELETE ON book_club_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();


-- ============================================================================
-- SUPABASE AUTH TRIGGER
-- Creates user profile when auth user is created
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9]', '', 'g'));
  final_username := base_username;

  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO public.users (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger on Supabase auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
