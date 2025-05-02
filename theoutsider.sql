-- Tạo hàm xóa tất cả bảng
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;


-- Bảng users
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'author', 'user')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'banned', 'exprired')) DEFAULT 'active',
    avatarurl VARCHAR(255),
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastlogin TIMESTAMP,
    resetpasswordtoken VARCHAR(255),
    resetpasswordexpiry TIMESTAMP
);

-- Bảng categories 
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng posts 
CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featuredimage VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'reject')),
    views INTEGER NOT NULL DEFAULT 0,
    authorid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP,
    publishedat TIMESTAMP,
	is_featured BOOLEAN DEFAULT FALSE
);
-- Bảng post_categories (giữ nguyên như cũ)
CREATE TABLE post_categories (
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    categoryid INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (postid, categoryid)
);

-- Bảng comments
CREATE TABLE comments (
    cmtid SERIAL PRIMARY KEY,
    content VARCHAR(1000),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'reject')),
    authorip VARCHAR(50),
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
    parentid INTEGER,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng hashtags (giữ nguyên như cũ)
CREATE TABLE hashtags (
    tagid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng post_hashtags (giữ nguyên như cũ)
CREATE TABLE post_hashtags (
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    tagid INTEGER REFERENCES hashtags(tagid) ON DELETE CASCADE,
    PRIMARY KEY (postid, tagid)
);

-- Bảng notifications (giữ nguyên như cũ)
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng author_registrations (giữ nguyên status như cũ)
CREATE TABLE author_registrations (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    experience TEXT,
    portfolio TEXT,
    front_id_card_url TEXT,
    back_id_card_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Bảng author_registration_topics (giữ nguyên như cũ)
CREATE TABLE author_registration_topics (
    author_registration_id INTEGER REFERENCES author_registrations(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (author_registration_id, category_id)
);

CREATE TABLE saved_posts (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (userid, postid)
);
CREATE TABLE viewed_posts (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (userid, postid)
);


-- Tạo indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_posts_authorid ON posts(authorid);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_comments_postid ON comments(postid);
CREATE INDEX idx_comments_userid ON comments(userid);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_author_registrations_userid ON author_registrations(userid);
CREATE INDEX idx_author_registrations_status ON author_registrations(status);





-- Tài khoản admin mẫu (pass: AdminN5!)
INSERT INTO users (username, email, passwordhash, role)
VALUES (
    'admin',
    'admin@gmail.com',
    '$2b$08$rpP.pWsocWo8rNMFgCSE5OxyErX5OyNE8gWclXMnVHYPZxMWwR2DC',
    'admin'
);
--Tài khoản author mẫu
INSERT INTO users (username, email, passwordhash, role)
VALUES (
    'author',
    'author@gmail.com',
    '$2b$08$rpP.pWsocWo8rNMFgCSE5OxyErX5OyNE8gWclXMnVHYPZxMWwR2DC',
    'author'
);
-- Insert các danh mục cha
INSERT INTO categories (name, slug, description, parent_id)
VALUES 
  ('Phim ảnh', 'phim-anh', 'Chuyên mục phim ảnh', NULL),
  ('Âm nhạc', 'am-nhac', 'Chuyên mục âm nhạc', NULL),
  ('Beauty & Fashion', 'beauty-fashion', 'Chuyên mục thời trang và làm đẹp', NULL),
  ('Đời sống', 'doi-song', 'Chuyên mục đời sống', NULL),
  ('Xã hội', 'xa-hoi', 'Chuyên mục xã hội', NULL),
  ('Sức khỏe', 'suc-khoe', 'Chuyên mục sức khỏe', NULL);
-- Insert sub-categories (danh mục con)

INSERT INTO categories (name, slug, description, parent_id)
VALUES
  -- Sub của Phim ảnh (parent_id = 1)
  ('Phim chiếu rạp', 'phim-chieu-rap', 'Chuyên mục phim chiếu rạp', 1),
  ('Phim Việt Nam', 'phim-viet-nam', 'Chuyên mục phim Việt Nam', 1),
  ('Phim truyền hình', 'phim-truyen-hinh', 'Chuyên mục phim truyền hình', 1),
  ('Phim quốc tế', 'phim-quoc-te', 'Chuyên mục phim quốc tế', 1),

  -- Sub của Âm nhạc (parent_id = 2)
  ('US-UK', 'us-uk', 'Chuyên mục âm nhạc US-UK', 2),
  ('Châu Á', 'chau-a', 'Chuyên mục âm nhạc Châu Á', 2),
  ('Việt Nam', 'am-nhac-viet-nam', 'Chuyên mục âm nhạc Việt Nam', 2),

  -- Sub của Beauty & Fashion (parent_id = 3)
  ('Trending', 'trending', 'Xu hướng thời trang', 3),
  ('Thời trang', 'thoi-trang', 'Thời trang hot', 3),
  ('Làm đẹp', 'lam-dep', 'Chuyên mục làm đẹp', 3),
  ('Phong cách', 'phong-cach', 'Phong cách sống', 3),

  -- Sub của Đời sống (parent_id = 4)
  ('Soi sao', 'soi-sao', 'Chuyên mục soi sao', 4),
  ('Sống xanh', 'song-xanh', 'Chuyên mục sống xanh', 4),

  -- Sub của Xã hội (parent_id = 5)
  ('Điểm nóng', 'diem-nong', 'Điểm nóng xã hội', 5),
  ('Pháp luật', 'phap-luat', 'Pháp luật và xã hội', 5),
  ('Thế giới đó đây', 'the-gioi-do-day', 'Tin tức thế giới', 5),

  -- Sub của Sức khỏe (parent_id = 6)
  ('Dinh dưỡng', 'dinh-duong', 'Chuyên mục dinh dưỡng', 6),
  ('Khỏe đẹp', 'khoe-dep', 'Chuyên mục khỏe đẹp', 6),
  ('Giới tính', 'gioi-tinh', 'Chuyên mục giới tính', 6),
  ('Các bệnh', 'cac-benh', 'Thông tin về các bệnh', 6);

select * from categories
update users set role='author' where username='author'
update posts set status = 'published' where postid=7
select * from posts 
select * from hashtags
select * from post_hashtags
select * from author_registrations
select * from post_categories
select * from users
select * from saved_posts
select * from viewed_posts