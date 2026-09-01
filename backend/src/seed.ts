import { query, end } from './db';

// Demo data per Demo Data State Rules.md:
// - Demo User: user_001
// - Demo Activity: AI大模型前沿讲座：从理论到产业实践 (activity_ai_001)
// - Initial state: NO favorites, NO registrations for user_001
//   (only explicit user actions create relationship records)
// Idempotent: uses ON CONFLICT upsert, never deletes anything.

const DEMO_USER = {
  user_id: 'user_001',
  name: 'Alex',
  avatar_url: '/images/avatar.svg',
  school: 'School of Computer Science',
  department: 'Computer Science',
  created_at: '2026-08-01T10:00:00Z',
};

interface DemoActivity {
  activity_id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  target_audience: string[];
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  registration_deadline: string;
  capacity: number;
  image_url: string;
  ai_summary: string;
}

const DEMO_ACTIVITIES: DemoActivity[] = [
  {
    activity_id: 'activity_ai_001',
    title: 'AI大模型前沿讲座：从理论到产业实践',
    category: 'Lecture',
    description:
      '本次讲座由腾讯AI专家团队主讲，深入探讨大语言模型的最新发展趋势。内容涵盖Transformer架构演进、预训练技术、微调方法（LoRA、QLoRA）、以及在实际业务场景中的落地案例。适合对AI技术感兴趣的学生和研究人员参加。',
    tags: ['AI', '大模型', '讲座', '技术'],
    target_audience: ['研究生', '本科生'],
    start_time: '2026-09-15T14:00:00+08:00',
    end_time: '2026-09-15T16:30:00+08:00',
    location: '3号楼201教室',
    organizer: '计算机学院',
    registration_deadline: '2026-09-14T18:00:00+08:00',
    capacity: 200,
    image_url: '/images/ai_lecture.svg',
    ai_summary:
      '由腾讯专家分享大模型实践经验，涵盖 Transformer、预训练、微调及产业应用案例，适合 AI 方向学生。',
  },
  {
    activity_id: 'activity_career_001',
    title: '互联网大厂产品经理职业规划与求职分享',
    category: 'Career',
    description:
      '本次分享邀请了来自腾讯、字节跳动的资深产品经理，分享产品经理岗位的核心能力模型、求职面试技巧、以及职业发展路径。适合希望从事互联网产品工作的同学。',
    tags: ['职业', '产品经理', '求职', '互联网'],
    target_audience: ['本科生', '研究生'],
    start_time: '2026-09-20T19:00:00+08:00',
    end_time: '2026-09-20T21:00:00+08:00',
    location: '学生活动中心报告厅',
    organizer: '职业发展中心',
    registration_deadline: '2026-09-19T18:00:00+08:00',
    capacity: 300,
    image_url: '/images/career_share.svg',
    ai_summary: '来自腾讯和字节的产品经理分享职业规划与求职技巧，适合想进入互联网产品领域的学生。',
  },
  {
    activity_id: 'activity_volunteer_001',
    title: '校园环保志愿服务日',
    category: 'Volunteer',
    description:
      '参与校园环保活动，包括垃圾分类宣传、校园清洁、植树造林等。所有志愿者将获得志愿服务证书和积分。欢迎全校师生积极参与。',
    tags: ['志愿', '环保', '公益', '校园'],
    target_audience: ['本科生'],
    start_time: '2026-09-22T09:00:00+08:00',
    end_time: '2026-09-22T17:00:00+08:00',
    location: '校园东门广场集合',
    organizer: '青年志愿者协会',
    registration_deadline: '2026-09-21T18:00:00+08:00',
    capacity: 100,
    image_url: '/images/volunteer.svg',
    ai_summary: '校园环保志愿服务，涵盖垃圾分类、清洁、植树，参与者可获志愿服务证书。',
  },
  {
    activity_id: 'activity_sports_001',
    title: '校园篮球联赛2026赛季',
    category: 'Sports',
    description:
      '一年一度的校园篮球联赛即将开赛！面向全校师生开放报名，分本科生组和研究生组。欢迎篮球爱好者踊跃报名，展现团队风采。',
    tags: ['体育', '篮球', '比赛', '校园'],
    target_audience: ['本科生', '研究生'],
    start_time: '2026-09-25T09:00:00+08:00',
    end_time: '2026-10-30T18:00:00+08:00',
    location: '校体育馆',
    organizer: '体育部',
    registration_deadline: '2026-09-23T18:00:00+08:00',
    capacity: 200,
    image_url: '/images/basketball.svg',
    ai_summary: '校园篮球联赛，面向全校师生，分本科组和研究生组。',
  },
  {
    activity_id: 'activity_competition_001',
    title: '第五届大学生创新创业大赛',
    category: 'Competition',
    description:
      '面向全校大学生的创新创业大赛，分为初赛、复赛和决赛三个阶段。设有丰厚奖金和创业孵化支持。欢迎有想法的同学组队参加。',
    tags: ['比赛', '创业', '创新', '竞赛'],
    target_audience: ['本科生', '研究生'],
    start_time: '2026-10-01T09:00:00+08:00',
    end_time: '2026-11-30T18:00:00+08:00',
    location: '线上+线下结合',
    organizer: '创新创业学院',
    registration_deadline: '2026-09-30T18:00:00+08:00',
    capacity: 500,
    image_url: '/images/competition.svg',
    ai_summary: '大学生创新创业大赛，分三阶段进行，设丰厚奖金与孵化支持。',
  },
  {
    activity_id: 'activity_culture_001',
    title: '中秋月圆——校园诗词朗诵会',
    category: 'Culture',
    description:
      '在中秋佳节来临之际，举办传统诗词朗诵会，邀请校内外朗诵名家与同学们同台演出。现场还有汉服体验、茶艺表演等传统文化活动。',
    tags: ['文化', '诗词', '朗诵', '传统'],
    target_audience: ['本科生', '研究生'],
    start_time: '2026-09-28T19:00:00+08:00',
    end_time: '2026-09-28T21:30:00+08:00',
    location: '图书馆报告厅',
    organizer: '文学院',
    registration_deadline: '2026-09-27T18:00:00+08:00',
    capacity: 150,
    image_url: '/images/poetry.svg',
    ai_summary: '中秋诗词朗诵会，含汉服体验、茶艺表演，弘扬传统文化。',
  },
];

async function main() {
  console.log('Starting PostgreSQL seed...');

  // Demo user (idempotent, do not overwrite an existing row)
  await query(
    `INSERT INTO users (user_id, name, avatar_url, school, department, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO NOTHING`,
    [
      DEMO_USER.user_id,
      DEMO_USER.name,
      DEMO_USER.avatar_url,
      DEMO_USER.school,
      DEMO_USER.department,
      DEMO_USER.created_at,
    ]
  );
  console.log('✓ demo user ready (user_001)');

  // Demo activities (idempotent upsert)
  for (const a of DEMO_ACTIVITIES) {
    await query(
      `INSERT INTO activities (
         activity_id, title, category, description, tags, target_audience,
         start_time, end_time, location, organizer, registration_deadline,
         capacity, image_url, ai_summary, created_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, $14, $15
       )
       ON CONFLICT (activity_id) DO UPDATE SET
         title = EXCLUDED.title,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         tags = EXCLUDED.tags,
         target_audience = EXCLUDED.target_audience,
         start_time = EXCLUDED.start_time,
         end_time = EXCLUDED.end_time,
         location = EXCLUDED.location,
         organizer = EXCLUDED.organizer,
         registration_deadline = EXCLUDED.registration_deadline,
         capacity = EXCLUDED.capacity,
         image_url = EXCLUDED.image_url,
         ai_summary = EXCLUDED.ai_summary`,
      [
        a.activity_id,
        a.title,
        a.category,
        a.description,
        a.tags,
        a.target_audience,
        a.start_time,
        a.end_time,
        a.location,
        a.organizer,
        a.registration_deadline,
        a.capacity,
        a.image_url,
        a.ai_summary,
        '2026-08-01T10:00:00Z',
      ]
    );
  }
  console.log(`✓ ${DEMO_ACTIVITIES.length} demo activities ready`);

  // Per Demo Data State Rules: no favorites / registrations are seeded.
  // Initial user state must remain Favorite = false, Registration = false.

  const counts = await query(`
    SELECT
      (SELECT count(*) FROM users) AS users,
      (SELECT count(*) FROM activities) AS activities,
      (SELECT count(*) FROM favorites) AS favorites,
      (SELECT count(*) FROM registrations) AS registrations
  `);
  const row = counts.rows[0];
  console.log(
    `✓ current counts -> users: ${row.users}, activities: ${row.activities}, favorites: ${row.favorites}, registrations: ${row.registrations}`
  );
  console.log('\n✅ Seed completed successfully!');

  await end();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
