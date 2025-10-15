const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "Blog", "posts");
const OUT_JSON = path.join(ROOT, "Blog", "posts.json");

function read(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith(".md"))
    .map(d => d.name);
}

function parseFrontMatter(src) {
  const m = src.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!m) return { fm: {}, body: src };

  const yaml = m[1];
  const fm = {};
  yaml.split(/\r?\n/).forEach(line => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) return;
    let k = kv[1].trim();
    let v = kv[2].trim();
    v = v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    if (v.startsWith("[") && v.endsWith("]")) {
      const arr = v.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean);
      fm[k] = arr;
    } else {
      fm[k] = v;
    }
  });

  const body = src.slice(m[0].length);
  return { fm, body };
}

function firstParagraph(md) {
  const s = md.replace(/\r/g, "")
    .split("\n\n")
    .map(x => x.trim())
    .find(x => x && !x.startsWith("!["));
  if (!s) return "";
  return s.replace(/\n/g, " ").slice(0, 220);
}

function inferDateFromName(name) {
  const m = name.match(/^(\d{4})[-_](\d{2})[-_](\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return String(tags).split(",").map(s => s.trim()).filter(Boolean);
}

function toPostObj(file, src) {
  const { fm, body } = parseFrontMatter(src);
  const title = fm.title || path.basename(file, path.extname(file)).replace(/[-_]+/g, " ");
  const date = fm.date || inferDateFromName(file) || "";
  const summary = fm.summary || firstParagraph(body);
  const tags = normalizeTags(fm.tags);
  const cover = fm.cover || "";
  return { file, title, date, summary, tags, cover };
}

(function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("Missing Blog/posts/ directory");
    process.exit(1);
  }

  const files = read(POSTS_DIR);
  const posts = files.map(fname => {
    const full = path.join(POSTS_DIR, fname);
    const txt = fs.readFileSync(full, "utf8");
    return toPostObj(fname, txt);
  });

  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  fs.writeFileSync(OUT_JSON, JSON.stringify(posts, null, 2) + "\n", "utf8");
  console.log(`✅ Wrote ${OUT_JSON} with ${posts.length} posts.`);
})();
