import { Router } from 'express';
import { searchActivities, searchByTokens } from '../store';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;

    const results = await searchActivities({
      keywords: q ? String(q) : undefined,
      category: category ? String(category) : undefined,
    });

    res.json({ results, count: results.length });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.post('/ai', async (req, res) => {
  try {
    const { query, category: bodyCategory } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const tokens = extractKeywordTokens(query);
    const extractedCategory = extractCategory(query);
    const category = bodyCategory || extractedCategory;
    const keywords = tokens.join(' ');

    const results = await searchByTokens({ tokens, category });

    res.json({
      results,
      count: results.length,
      interpreted: { keywords, category, original_query: query },
    });
  } catch (err) {
    console.error('AI search error:', err);
    res.status(500).json({ error: 'AI search failed' });
  }
});

// Chinese stop words are removed as substrings (Chinese has no spaces, so
// word-level filtering alone does not work for natural-language input).
const CJK_STOP_SUBSTRINGS = [
  '有哪些', '有没有', '什么', '哪些', '推荐', '介绍', '关于',
  '适合', '可以', '能够', '想要', '我想', '参加', '活动',
  '本周', '今天', '明天', '最近', '最新', '请问', '帮我',
  '一下', '的', '了', '吗', '呢', '呀',
  '或者', '任一', '任意', '以及', '还是',
];
const CJK_STOP_CHARS = new Set(['或']);

// English stop words are filtered as whole tokens only (never as substrings,
// otherwise "AI" would be corrupted by removing "a").
const LATIN_STOP_WORDS = new Set([
  'what', 'which', 'who', 'when', 'where', 'how',
  'the', 'a', 'an', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'this', 'that', 'these', 'those', 'any', 'some',
]);

// Extract search tokens from a natural-language query.
// - Latin / digit runs are kept as tokens ("AI", "LoRA").
// - CJK runs are kept as tokens; runs of 4+ chars also contribute bigrams
//   (simple segmentation-free matching for contiguous Chinese text).
function extractKeywordTokens(raw: string): string[] {
  let cleaned = raw
    .replace(/[?？！!。,，、：:；;""''（）()【】\[\]\s]/g, ' ')
    .trim();

  for (const stop of CJK_STOP_SUBSTRINGS) {
    cleaned = cleaned.split(stop).join(' ');
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  const tokens = new Set<string>();

  // Latin / digit runs (whole-word stop word filtering, case preserved)
  for (const m of cleaned.matchAll(/[A-Za-z0-9]+/g)) {
    const word = m[0];
    if (LATIN_STOP_WORDS.has(word.toLowerCase())) continue;
    if (word.length === 1 && /[0-9]/.test(word)) continue;
    tokens.add(word);
  }

  // CJK runs (whole run, plus bigrams for runs of 4+ chars)
  for (const m of cleaned.matchAll(/[\u4e00-\u9fff]+/g)) {
    const run = m[0];
    tokens.add(run);
    if (run.length >= 4) {
      for (let i = 0; i + 2 <= run.length; i++) {
        tokens.add(run.slice(i, i + 2));
      }
    }
  }

  return Array.from(tokens);
}

function extractCategory(query: string): string | undefined {
  const categoryMap: Record<string, string> = {
    '讲座': 'Lecture',
    '学术': 'Lecture',
    '演讲': 'Lecture',
    '比赛': 'Competition',
    '竞赛': 'Competition',
    '志愿': 'Volunteer',
    '体育': 'Sports',
    '运动': 'Sports',
    '文化': 'Culture',
    '职业': 'Career',
    '就业': 'Career',
    '创业': 'Innovation',
    '创新': 'Innovation',
  };

  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (query.includes(keyword)) {
      return category;
    }
  }

  return undefined;
}

export default router;
