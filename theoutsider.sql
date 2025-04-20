-- Bảng Người Dùng (Users)
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('admin', 'editor', 'author', 'user')),
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('active', 'banned', 'pending')) DEFAULT 'active',
    AvatarURL VARCHAR(255),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP,
    ResetPasswordToken VARCHAR(255),
    ResetPasswordExpiry TIMESTAMP
);
select * from users
INSERT INTO Users (
    Username, 
    Email, 
    PasswordHash, 
    Role, 
    Status, 
    AvatarURL, 
    LastLogin,
    ResetPasswordToken,
    ResetPasswordExpiry
) VALUES (
    'vngclinh',
    'linh@example.com',
    '$2a$10$xJwL5v5Jz5TZ9fQbY4wXe.9t8Jk7JZ5v0rL8Xx2v3bN1cV7yH6dS', -- Mật khẩu đã băm (ví dụ: "password123")
    'admin',
    'active',
    'https://example.com/avatars/linh.jpg',
    CURRENT_TIMESTAMP,
    NULL,
    NULL
);

-- Bảng Danh Mục (Categories)
CREATE TABLE Categories (
    CategoryID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    ParentID INT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP,
    FOREIGN KEY (ParentID) REFERENCES Categories(CategoryID) ON DELETE NO ACTION
);

-- Bảng Bài Viết (Posts)
CREATE TABLE Posts (
    PostID SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Slug VARCHAR(255) NOT NULL UNIQUE,
    Content TEXT NOT NULL,
    Excerpt VARCHAR(500),
    FeaturedImage VARCHAR(255),
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('draft', 'pending', 'published', 'trash')) DEFAULT 'draft',
    Views INT NOT NULL DEFAULT 0,
    AuthorID INT NOT NULL,
    CategoryID INT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP,
    PublishedAt TIMESTAMP,
    
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL
);

-- Bảng Bình Luận (Comments)
CREATE TABLE Comments (
    CommentID SERIAL PRIMARY KEY,
    Content VARCHAR(1000) NOT NULL,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('approved', 'pending', 'spam', 'trash')) DEFAULT 'pending',
    AuthorName VARCHAR(100) NOT NULL,
    AuthorEmail VARCHAR(100),
    AuthorIP VARCHAR(50),
    PostID INT NOT NULL,
    UserID INT NULL,
    ParentID INT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (ParentID) REFERENCES Comments(CommentID) ON DELETE NO ACTION
);

-- Bảng Hoạt Động (Activities)
CREATE TABLE Activities (
    ActivityID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    ActivityType VARCHAR(50) NOT NULL CHECK (ActivityType IN ('post', 'user', 'comment', 'system', 'login')),
    Action VARCHAR(50) NOT NULL,
    Description VARCHAR(500) NOT NULL,
    IPAddress VARCHAR(50),
    UserAgent VARCHAR(255),
    ReferenceID INT,
    ReferenceType VARCHAR(50),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng Cài Đặt (Settings)
CREATE TABLE Settings (
    SettingID SERIAL PRIMARY KEY,
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue TEXT,
    SettingGroup VARCHAR(50) NOT NULL CHECK (SettingGroup IN ('general', 'appearance', 'notification', 'security')),
    IsPublic BOOLEAN NOT NULL DEFAULT FALSE,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT NOT NULL,
    
    FOREIGN KEY (UpdatedBy) REFERENCES Users(UserID)
);

-- Bảng Media (Media)
CREATE TABLE Media (
    MediaID SERIAL PRIMARY KEY,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(500) NOT NULL,
    FileType VARCHAR(50) NOT NULL,
    FileSize INT NOT NULL,
    AltText VARCHAR(255),
    UploadedBy INT NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UploadedBy) REFERENCES Users(UserID)
);

-- Bảng Phân Quyền (Permissions)
CREATE TABLE Permissions (
    PermissionID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    KeyName VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng Phân Quyền Người Dùng (UserPermissions)
CREATE TABLE UserPermissions (
    UserID INT NOT NULL,
    PermissionID INT NOT NULL,
    GrantedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    GrantedBy INT NOT NULL,
    
    PRIMARY KEY (UserID, PermissionID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID) ON DELETE CASCADE,
    FOREIGN KEY (GrantedBy) REFERENCES Users(UserID)
);

-- Bảng Thẻ (Tags)
CREATE TABLE Tags (
    TagID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Bài Viết - Thẻ (PostTags)
CREATE TABLE PostTags (
    PostID INT NOT NULL,
    TagID INT NOT NULL,
    
    PRIMARY KEY (PostID, TagID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES Tags(TagID) ON DELETE CASCADE
);

-- Hàm tạo slug từ tiêu đề
CREATE OR REPLACE FUNCTION fn_generate_slug(p_title VARCHAR(255))
RETURNS VARCHAR(255) AS $$
DECLARE
    v_slug VARCHAR(255);
    v_i INT := 1;
    v_len INT;
    v_result VARCHAR(255) := '';
    v_c CHAR(1);
BEGIN
    -- Chuyển thành chữ thường
    v_slug := LOWER(p_title);
    
    -- Thay thế ký tự đặc biệt và dấu tiếng Việt
    v_slug := REPLACE(v_slug, 'á', 'a');
    v_slug := REPLACE(v_slug, 'à', 'a');
    v_slug := REPLACE(v_slug, 'ả', 'a');
    v_slug := REPLACE(v_slug, 'ã', 'a');
    v_slug := REPLACE(v_slug, 'ạ', 'a');
    v_slug := REPLACE(v_slug, 'ă', 'a');
    v_slug := REPLACE(v_slug, 'ắ', 'a');
    v_slug := REPLACE(v_slug, 'ằ', 'a');
    v_slug := REPLACE(v_slug, 'ẳ', 'a');
    v_slug := REPLACE(v_slug, 'ẵ', 'a');
    v_slug := REPLACE(v_slug, 'ặ', 'a');
    v_slug := REPLACE(v_slug, 'â', 'a');
    v_slug := REPLACE(v_slug, 'ấ', 'a');
    v_slug := REPLACE(v_slug, 'ầ', 'a');
    v_slug := REPLACE(v_slug, 'ẩ', 'a');
    v_slug := REPLACE(v_slug, 'ẫ', 'a');
    v_slug := REPLACE(v_slug, 'ậ', 'a');
    v_slug := REPLACE(v_slug, 'đ', 'd');
    v_slug := REPLACE(v_slug, 'é', 'e');
    v_slug := REPLACE(v_slug, 'è', 'e');
    v_slug := REPLACE(v_slug, 'ẻ', 'e');
    v_slug := REPLACE(v_slug, 'ẽ', 'e');
    v_slug := REPLACE(v_slug, 'ẹ', 'e');
    v_slug := REPLACE(v_slug, 'ê', 'e');
    v_slug := REPLACE(v_slug, 'ế', 'e');
    v_slug := REPLACE(v_slug, 'ề', 'e');
    v_slug := REPLACE(v_slug, 'ể', 'e');
    v_slug := REPLACE(v_slug, 'ễ', 'e');
    v_slug := REPLACE(v_slug, 'ệ', 'e');
    v_slug := REPLACE(v_slug, 'í', 'i');
    v_slug := REPLACE(v_slug, 'ì', 'i');
    v_slug := REPLACE(v_slug, 'ỉ', 'i');
    v_slug := REPLACE(v_slug, 'ĩ', 'i');
    v_slug := REPLACE(v_slug, 'ị', 'i');
    v_slug := REPLACE(v_slug, 'ó', 'o');
    v_slug := REPLACE(v_slug, 'ò', 'o');
    v_slug := REPLACE(v_slug, 'ỏ', 'o');
    v_slug := REPLACE(v_slug, 'õ', 'o');
    v_slug := REPLACE(v_slug, 'ọ', 'o');
    v_slug := REPLACE(v_slug, 'ô', 'o');
    v_slug := REPLACE(v_slug, 'ố', 'o');
    v_slug := REPLACE(v_slug, 'ồ', 'o');
    v_slug := REPLACE(v_slug, 'ổ', 'o');
    v_slug := REPLACE(v_slug, 'ỗ', 'o');
    v_slug := REPLACE(v_slug, 'ộ', 'o');
    v_slug := REPLACE(v_slug, 'ơ', 'o');
    v_slug := REPLACE(v_slug, 'ớ', 'o');
    v_slug := REPLACE(v_slug, 'ờ', 'o');
    v_slug := REPLACE(v_slug, 'ở', 'o');
    v_slug := REPLACE(v_slug, 'ỡ', 'o');
    v_slug := REPLACE(v_slug, 'ợ', 'o');
    v_slug := REPLACE(v_slug, 'ú', 'u');
    v_slug := REPLACE(v_slug, 'ù', 'u');
    v_slug := REPLACE(v_slug, 'ủ', 'u');
    v_slug := REPLACE(v_slug, 'ũ', 'u');
    v_slug := REPLACE(v_slug, 'ụ', 'u');
    v_slug := REPLACE(v_slug, 'ư', 'u');
    v_slug := REPLACE(v_slug, 'ứ', 'u');
    v_slug := REPLACE(v_slug, 'ừ', 'u');
    v_slug := REPLACE(v_slug, 'ử', 'u');
    v_slug := REPLACE(v_slug, 'ữ', 'u');
    v_slug := REPLACE(v_slug, 'ự', 'u');
    v_slug := REPLACE(v_slug, 'ý', 'y');
    v_slug := REPLACE(v_slug, 'ỳ', 'y');
    v_slug := REPLACE(v_slug, 'ỷ', 'y');
    v_slug := REPLACE(v_slug, 'ỹ', 'y');
    v_slug := REPLACE(v_slug, 'ỵ', 'y');
    
    -- Thay thế khoảng trắng bằng dấu gạch ngang
    v_slug := REPLACE(v_slug, ' ', '-');
    
    -- Loại bỏ các ký tự không phải chữ cái, số hoặc gạch ngang
    v_len := CHAR_LENGTH(v_slug);
    
    WHILE v_i <= v_len LOOP
        v_c := SUBSTRING(v_slug FROM v_i FOR 1);
        
        IF (v_c ~ '[a-z0-9-]') THEN
            v_result := CONCAT(v_result, v_c);
        END IF;
        
        v_i := v_i + 1;
    END LOOP;
    
    -- Loại bỏ các dấu gạch ngang liên tiếp
    WHILE v_result LIKE '%--%' LOOP
        v_result := REPLACE(v_result, '--', '-');
    END LOOP;
    
    -- Loại bỏ dấu gạch ngang ở đầu và cuối
    IF LEFT(v_result, 1) = '-' THEN
        v_result := SUBSTRING(v_result FROM 2);
    END IF;
    
    IF RIGHT(v_result, 1) = '-' THEN
        v_result := SUBSTRING(v_result FROM 1 FOR CHAR_LENGTH(v_result) - 1);
    END IF;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Hàm kiểm tra vai trò người dùng
CREATE OR REPLACE FUNCTION fn_check_user_role(p_userid INT, p_role VARCHAR(20))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM Users WHERE UserID = p_userid AND Role = p_role);
END;
$$ LANGUAGE plpgsql;

-- Thủ tục thêm người dùng mới
CREATE OR REPLACE FUNCTION sp_adduser(
    p_username VARCHAR(50),
    p_email VARCHAR(100),
    p_passwordhash VARCHAR(255),
    p_role VARCHAR(20),
    p_avatarurl VARCHAR(255)
)
RETURNS INT AS $$
DECLARE
    v_userid INT;
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, Role, AvatarURL)
    VALUES (p_username, p_email, p_passwordhash, p_role, p_avatarurl)
    RETURNING UserID INTO v_userid;
    
    RETURN v_userid;
END;
$$ LANGUAGE plpgsql;

-- Thủ tục thêm bài viết mới
CREATE OR REPLACE FUNCTION sp_addpost(
    p_title VARCHAR(255),
    p_content TEXT,
    p_authorid INT,
    p_categoryid INT,
    p_status VARCHAR(20),
    p_featuredimage VARCHAR(255),
    p_excerpt VARCHAR(500)
)
RETURNS INT AS $$
DECLARE
    v_slug VARCHAR(255);
    v_postid INT;
BEGIN
    -- Tạo slug từ tiêu đề
    v_slug := fn_generate_slug(p_title);
    
    INSERT INTO Posts (Title, Slug, Content, AuthorID, CategoryID, Status, FeaturedImage, Excerpt, PublishedAt)
    VALUES (p_title, v_slug, p_content, p_authorid, p_categoryid, p_status, p_featuredimage, p_excerpt, 
           CASE WHEN p_status = 'published' THEN NOW() ELSE NULL END)
    RETURNING PostID INTO v_postid;
    
    RETURN v_postid;
END;
$$ LANGUAGE plpgsql;

-- Thủ tục lấy danh sách bài viết với phân trang
CREATE OR REPLACE FUNCTION sp_getposts(
    p_page INT,
    p_pagesize INT,
    p_status VARCHAR(20),
    p_categoryid INT,
    p_searchterm VARCHAR(100)
)
RETURNS TABLE (
    postid INT,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt VARCHAR(500),
    featuredimage VARCHAR(255),
    status VARCHAR(20),
    views INT,
    createdat TIMESTAMP,
    publishedat TIMESTAMP,
    authorid INT,
    authorname VARCHAR(50),
    authoravatar VARCHAR(255),
    categoryid INT,
    categoryname VARCHAR(100),
    commentcount BIGINT
) AS $$
DECLARE
    v_offset INT := (p_page - 1) * p_pagesize;
BEGIN
    RETURN QUERY
    SELECT 
        p.PostID,
        p.Title,
        p.Slug,
        p.Excerpt,
        p.FeaturedImage,
        p.Status,
        p.Views,
        p.CreatedAt,
        p.PublishedAt,
        u.UserID AS AuthorID,
        u.Username AS AuthorName,
        u.AvatarURL AS AuthorAvatar,
        c.CategoryID,
        c.Name AS CategoryName,
        (SELECT COUNT(*) FROM Comments cm WHERE cm.PostID = p.PostID AND cm.Status = 'approved') AS CommentCount
    FROM 
        Posts p
        INNER JOIN Users u ON p.AuthorID = u.UserID
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE 
        (p_status IS NULL OR p.Status = p_status)
        AND (p_categoryid IS NULL OR p.CategoryID = p_categoryid)
        AND (p_searchterm IS NULL OR p.Title LIKE '%' || p_searchterm || '%' OR p.Content LIKE '%' || p_searchterm || '%')
    ORDER BY 
        CASE WHEN p.Status = 'published' THEN p.PublishedAt ELSE p.CreatedAt END DESC
    LIMIT p_pagesize OFFSET v_offset;
END;
$$ LANGUAGE plpgsql;

-- Thủ tục cập nhật trạng thái người dùng
CREATE OR REPLACE FUNCTION sp_updateuserstatus(
    p_userid INT,
    p_status VARCHAR(20),
    p_updatedby INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE Users
    SET Status = p_status
    WHERE UserID = p_userid;
    
    -- Ghi log hoạt động
    INSERT INTO Activities (UserID, ActivityType, Action, Description, IPAddress, UserAgent, ReferenceID, ReferenceType)
    VALUES (p_updatedby, 'user', 'update_status', 
           'Cập nhật trạng thái người dùng ID ' || p_userid || ' thành ' || p_status,
           NULL, NULL, p_userid, 'user');
END;
$$ LANGUAGE plpgsql;

-- View thống kê tổng quan
CREATE OR REPLACE VIEW vw_dashboardstats AS
SELECT 
    (SELECT COUNT(*) FROM Users) AS TotalUsers,
    (SELECT COUNT(*) FROM Users WHERE Status = 'active') AS ActiveUsers,
    (SELECT COUNT(*) FROM Posts) AS TotalPosts,
    (SELECT COUNT(*) FROM Posts WHERE Status = 'published') AS PublishedPosts,
    (SELECT COUNT(*) FROM Comments) AS TotalComments,
    (SELECT COUNT(*) FROM Comments WHERE Status = 'approved') AS ApprovedComments,
    (SELECT COUNT(*) FROM Categories) AS TotalCategories;

-- View bài viết với thông tin đầy đủ
CREATE OR REPLACE VIEW vw_postdetails AS
SELECT 
    p.PostID,
    p.Title,
    p.Slug,
    p.Content,
    p.Excerpt,
    p.FeaturedImage,
    p.Status,
    p.Views,
    p.CreatedAt,
    p.UpdatedAt,
    p.PublishedAt,
    u.UserID AS AuthorID,
    u.Username AS AuthorName,
    u.AvatarURL AS AuthorAvatar,
    c.CategoryID,
    c.Name AS CategoryName,
    c.Slug AS CategorySlug,
    (SELECT STRING_AGG(t.Name, ',')
    FROM Tags t
    INNER JOIN PostTags pt ON t.TagID = pt.TagID
    WHERE pt.PostID = p.PostID) AS Tags
FROM 
    Posts p
    INNER JOIN Users u ON p.AuthorID = u.UserID
    LEFT JOIN Categories c ON p.CategoryID = c.CategoryID;

-- Trigger cập nhật thời gian khi sửa bài viết
CREATE OR REPLACE FUNCTION tr_posts_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_posts_update
BEFORE UPDATE ON Posts
FOR EACH ROW
EXECUTE FUNCTION tr_posts_update();

-- Trigger ghi log khi xóa người dùng
CREATE OR REPLACE FUNCTION tr_users_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Activities (UserID, ActivityType, Action, Description, ReferenceID, ReferenceType)
    VALUES 
        (OLD.UserID, 
        'user', 
        'delete', 
        'Người dùng ' || OLD.Username || ' đã bị xóa',
        OLD.UserID,
        'user');
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_delete
AFTER DELETE ON Users
FOR EACH ROW
EXECUTE FUNCTION tr_users_delete();