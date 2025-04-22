CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'author', 'user')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'banned', 'pending')) DEFAULT 'active',
    avatarurl VARCHAR(255),
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastlogin TIMESTAMP,
    resetpasswordtoken VARCHAR(255),
    resetpasswordexpiry TIMESTAMP
);

-- Tài khoản admin mẫu (pass: AdminN5!)
INSERT INTO users (username, email, passwordhash, role)
VALUES (
    'admin',
    'admin@gmail.com',
    '$2b$08$rpP.pWsocWo8rNMFgCSE5OxyErX5OyNE8gWclXMnVHYPZxMWwR2DC',
    'admin'
);
select * from users
update users set role='author' where userid=2
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index tối ưu truy vấn category con
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featuredimage VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('pending', 'published', 'trash')),
    views INTEGER NOT NULL DEFAULT 0,
    authorid INTEGER REFERENCES users(userid) ON DELETE SET NULL ON UPDATE CASCADE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP,
    publishedat TIMESTAMP
);

-- Index hỗ trợ lọc bài viết
CREATE INDEX idx_posts_authorid ON posts(authorid);
CREATE INDEX idx_posts_status ON posts(status);

CREATE TABLE post_categories (
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    categoryid INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (postid, categoryid)
);
CREATE TABLE comments_clone (
    cmtid SERIAL PRIMARY KEY,
    content VARCHAR(1000),
    status VARCHAR(20) DEFAULT 'pending',
    authorip VARCHAR(50),
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
    parentid INTEGER,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hashtags (
    tagid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE post_hashtags (
    postid INTEGER REFERENCES posts(postid) ON DELETE CASCADE,
    tagid INTEGER REFERENCES hashtags(tagid) ON DELETE CASCADE,
    PRIMARY KEY (postid, tagid)
);
