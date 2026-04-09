-- 创建课程表
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建章节表
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建课时表
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_sections_course_id ON sections(course_id);
CREATE INDEX idx_lessons_section_id ON lessons(section_id);

-- 插入示例数据
INSERT INTO courses (title, description, thumbnail_url)
VALUES 
  ('Python基础', 'Python编程语言的基础知识，包括语法、数据类型、控制流等', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20basics%20course%20thumbnail%20with%20code%20and%20python%20logo&image_size=square_hd'),
  ('数据分析库', '学习Python数据分析库，如NumPy、Pandas等', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20libraries%20course%20thumbnail%20with%20charts%20and%20data&image_size=square_hd'),
  ('数据可视化', '学习如何使用Python进行数据可视化，包括Matplotlib、Seaborn等', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20course%20thumbnail%20with%20colorful%20charts%20and%20graphs&image_size=square_hd');

-- 为Python基础课程添加章节和课时
INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Python语法基础', 1 FROM courses WHERE title = 'Python基础';

INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Python数据类型', 2 FROM courses WHERE title = 'Python基础';

INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Python控制流', 3 FROM courses WHERE title = 'Python基础';

-- 为数据分析库课程添加章节和课时
INSERT INTO sections (course_id, title, order_index)
SELECT id, 'NumPy基础', 1 FROM courses WHERE title = '数据分析库';

INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Pandas基础', 2 FROM courses WHERE title = '数据分析库';

INSERT INTO sections (course_id, title, order_index)
SELECT id, '数据处理技巧', 3 FROM courses WHERE title = '数据分析库';

-- 为数据可视化课程添加章节和课时
INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Matplotlib基础', 1 FROM courses WHERE title = '数据可视化';

INSERT INTO sections (course_id, title, order_index)
SELECT id, 'Seaborn高级图表', 2 FROM courses WHERE title = '数据可视化';

INSERT INTO sections (course_id, title, order_index)
SELECT id, '交互式可视化', 3 FROM courses WHERE title = '数据可视化';

-- 为Python基础课程的章节添加课时
-- 章节1: Python语法基础
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Python简介', 'Python是一种高级编程语言，具有简单易学的特点。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python语法基础';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Python安装', '如何在不同操作系统上安装Python。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python语法基础';

-- 章节2: Python数据类型
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '基本数据类型', 'Python的基本数据类型，包括整数、浮点数、字符串等。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python数据类型';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '复合数据类型', 'Python的复合数据类型，包括列表、元组、字典等。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python数据类型';

-- 章节3: Python控制流
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '条件语句', 'Python的条件语句，包括if、elif、else等。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python控制流';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '循环语句', 'Python的循环语句，包括for、while等。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = 'Python基础' AND s.title = 'Python控制流';

-- 为数据分析库课程的章节添加课时
-- 章节1: NumPy基础
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'NumPy简介', 'NumPy是Python中用于科学计算的核心库。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = 'NumPy基础';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'NumPy数组', 'NumPy数组的创建和操作。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = 'NumPy基础';

-- 章节2: Pandas基础
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Pandas简介', 'Pandas是Python中用于数据分析的库。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = 'Pandas基础';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'DataFrame操作', 'Pandas DataFrame的创建和操作。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = 'Pandas基础';

-- 章节3: 数据处理技巧
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '数据清洗', '如何清洗和预处理数据。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = '数据处理技巧';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '数据转换', '如何转换和重塑数据。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据分析库' AND s.title = '数据处理技巧';

-- 为数据可视化课程的章节添加课时
-- 章节1: Matplotlib基础
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Matplotlib简介', 'Matplotlib是Python中用于创建可视化的库。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = 'Matplotlib基础';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '基本图表', '如何创建基本的图表，如折线图、柱状图等。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = 'Matplotlib基础';

-- 章节2: Seaborn高级图表
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Seaborn简介', 'Seaborn是基于Matplotlib的高级可视化库。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = 'Seaborn高级图表';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '高级图表类型', '如何创建高级图表，如热力图、小提琴图等。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = 'Seaborn高级图表';

-- 章节3: 交互式可视化
INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, 'Plotly简介', 'Plotly是用于创建交互式可视化的库。', 1
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = '交互式可视化';

INSERT INTO lessons (section_id, title, content, order_index)
SELECT s.id, '创建交互式图表', '如何创建交互式图表，如可缩放的图表、悬停效果等。', 2
FROM sections s
JOIN courses c ON s.course_id = c.id
WHERE c.title = '数据可视化' AND s.title = '交互式可视化';

-- 创建用户进度表
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  last_accessed TIMESTAMP DEFAULT now(),
  code_submission TEXT,
  test_results BOOLEAN,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE UNIQUE INDEX idx_user_progress_unique ON user_progress(user_id, course_id, lesson_id);

-- 创建徽章表
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  condition_type TEXT NOT NULL CHECK (condition_type IN ('lessons_completed', 'courses_completed', 'streak_days')),
  condition_value INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建用户徽章表
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- 创建成就表
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建用户成就表
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 创建用户积分表（用于排行榜）
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  points INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_points_points ON user_points(points DESC);

-- 插入示例徽章数据
INSERT INTO badges (name, description, icon, level, condition_type, condition_value)
VALUES
  ('初出茅庐', '完成10个课时', '🎯', 'bronze', 'lessons_completed', 10),
  ('学习达人', '完成50个课时', '📚', 'silver', 'lessons_completed', 50),
  ('知识大师', '完成100个课时', '🏆', 'gold', 'lessons_completed', 100),
  ('课程初学者', '完成1个课程', '🌱', 'bronze', 'courses_completed', 1),
  ('课程进阶者', '完成3个课程', '🌿', 'silver', 'courses_completed', 3),
  ('课程专家', '完成5个课程', '🌳', 'gold', 'courses_completed', 5),
  ('连续学习1天', '连续学习1天', '🔥', 'bronze', 'streak_days', 1),
  ('连续学习7天', '连续学习7天', '🌟', 'silver', 'streak_days', 7),
  ('连续学习30天', '连续学习30天', '💎', 'gold', 'streak_days', 30),
  ('连续学习100天', '连续学习100天', '💫', 'platinum', 'streak_days', 100);

-- 插入示例成就数据
INSERT INTO achievements (name, description, points)
VALUES
  ('第一个课时', '完成第一个课时', 10),
  ('第一个课程', '完成第一个课程', 50),
  ('学习里程碑', '完成50个课时', 100),
  ('课程收集者', '完成3个课程', 150),
  ('连续学习一周', '连续学习7天', 200),
  ('知识渊博', '完成100个课时', 250),
  ('课程大师', '完成5个课程', 300),
  ('学习习惯', '连续学习30天', 350),
  ('学习专家', '完成200个课时', 400),
  ('终身学习者', '连续学习100天', 500);
