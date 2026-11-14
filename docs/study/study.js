const byId = (id) => document.getElementById(id);
const storageKey = "chenyu-interview-study-v1";
const topicMap = new Map(topics.map((item) => [item.id, item]));
const labels = { new: "还不会", review: "待复习", known: "已掌握" };
const blankRecord = { mastery: "", favorite: false, answer: "", note: "", question: "" };
const fields = ["answer", "note", "question"];

function normalize(backup) {
  if (backup?.version !== 1 || !backup.records || typeof backup.records !== "object" || Array.isArray(backup.records)) {
    throw new Error("请选择从本站导出的 JSON 备份。");
  }
  const records = {};
  for (const item of topics) {
    const record = backup.records[item.id];
    if (record === undefined) continue;
    if (!record || typeof record !== "object" || Array.isArray(record) ||
        Object.keys(blankRecord).some((key) => typeof record[key] !== typeof blankRecord[key]) ||
        (record.mastery !== "" && !Object.hasOwn(labels, record.mastery))) {
      throw new Error("备份中的学习记录格式有误。");
    }
    records[item.id] = Object.fromEntries(Object.keys(blankRecord).map((key) => [key, record[key]]));
  }
  return { version: 1, last: topicMap.has(backup.last) ? backup.last : "", records };
}

let state = { version: 1, last: "", records: {} };
try {
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) state = normalize(JSON.parse(saved));
} catch {
  byId("storage-status").textContent = "无法读取原有记录。你仍可阅读课程或从已有备份导入。";
}

let current = null;
let filter = "all";
let mode = "learn";
const recordFor = (id) => state.records[id] || blankRecord;
const hashId = () => location.hash.slice(1);

function persist(message = "") {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    byId("storage-status").textContent = message;
  } catch {
    byId("storage-status").textContent = "当前浏览器无法保存记录。请在离开前导出备份。";
  }
}

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function link(text, href, className) {
  const node = element("a", text, className);
  node.href = href;
  return node;
}

function list(items, ordered = false, className) {
  const node = element(ordered ? "ol" : "ul", "", className);
  for (const item of items) node.append(element("li", item));
  return node;
}

function updateButtons(container, key, value) {
  for (const button of byId(container).querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset[key] === value));
  }
}

function renderDirectory() {
  const box = byId("topics");
  const query = byId("search").value.trim().toLowerCase().split(/\s+/u);
  const visible = topics.filter((item) => {
    const record = recordFor(item.id);
    if (filter === "review" && !["new", "review"].includes(record.mastery)) return false;
    if (filter === "saved" && !record.favorite) return false;
    const searchable = [groups[item.group], item.title, item.question, item.concept, item.implementation].join(" ").toLowerCase();
    return query.every((part) => searchable.includes(part));
  });
  const sections = [];
  for (const [group, title] of Object.entries(groups)) {
    const items = visible.filter((item) => item.group === group);
    if (!items.length) continue;
    const ul = element("ul", "", "topic-list");
    for (const item of items) {
      const record = recordFor(item.id);
      const anchor = link(item.title, "#" + item.id, "topic-link");
      if (item === current) anchor.setAttribute("aria-current", "location");
      if (record.mastery) anchor.append(element("span", labels[record.mastery], "topic-state"));
      const row = element("li");
      row.append(anchor);
      ul.append(row);
    }
    sections.push(element("h2", title, "topic-group"), ul);
  }
  const empty = { all: "没有符合搜索条件的知识点。", review: "没有匹配的待复习知识点。", saved: "没有匹配的收藏。" };
  box.replaceChildren(...(sections.length ? sections : [element("p", empty[filter], "muted")]));
}

function renderProgress() {
  const known = topics.filter((item) => recordFor(item.id).mastery === "known").length;
  byId("progress-label").textContent = `${known} / ${topics.length}`;
  byId("progress-bar").max = topics.length;
  byId("progress-bar").value = known;
  const resume = byId("resume");
  resume.hidden = !state.last;
  if (state.last) {
    resume.href = "#" + state.last;
    resume.textContent = "继续上次学习 · " + topicMap.get(state.last).title;
  }
}

function renderFavorite() {
  const saved = recordFor(current.id).favorite;
  byId("favorite").textContent = saved ? "已收藏" : "收藏本节";
  byId("favorite").setAttribute("aria-pressed", String(saved));
}

function disclosure(title, content, open = false) {
  const details = element("details");
  details.open = open;
  details.append(element("summary", title), content);
  return details;
}

function section(title, text) {
  return [element("h3", title), element("p", text)];
}

function renderLesson() {
  const item = current;
  const parts = [element("p", groups[item.group], "crumb"), element("h2", item.title)];
  if (mode === "learn") {
    parts.push(...section("理解原理", item.concept), ...section("在项目里怎么做", item.implementation));
    if (item.flow.length) parts.push(list(item.flow, true, "flow"));
    if (item.example) {
      const pre = element("pre");
      pre.append(element("code", item.example));
      parts.push(pre);
    }
    if (item.sources.length) {
      const sources = element("div", "", "sources");
      sources.append(element("span", "源码与记录"));
      for (const source of item.sources) {
        const anchor = link(source.path.split("/").at(-1), source.url);
        anchor.title = source.path;
        sources.append(anchor);
      }
      parts.push(sources);
    }
  }
  const practice = element("section", "", "question-box");
  practice.append(
    ...section("面试题", item.question),
    disclosure("展开参考要点", list(item.points)),
    ...section("动手想一想", item.exercise),
    disclosure("查看练习解析", element("p", item.solution)),
  );
  parts.push(practice);
  byId("lesson").replaceChildren(...parts);
  byId("practice").hidden = false;
}

function renderNotes() {
  const record = recordFor(current.id);
  for (const field of fields) byId(field).value = record[field];
  byId("mastery").value = record.mastery;
  byId("copy-status").textContent = "";
  byId("manual-copy").hidden = true;
}

function updateRecord(patch) {
  state.records[current.id] = { ...recordFor(current.id), ...patch };
  persist();
}

function showTopic(id, focus = false) {
  current = topicMap.get(id) || topics[0];
  if (state.last !== current.id) {
    state.last = current.id;
    persist();
  }
  renderProgress();
  renderFavorite();
  renderDirectory();
  renderLesson();
  renderNotes();
  const index = topics.indexOf(current);
  const previous = topics[index - 1];
  const next = topics[index + 1];
  const neighbors = byId("neighbors");
  neighbors.replaceChildren();
  neighbors.hidden = !previous && !next;
  if (previous) neighbors.append(link("上一节 · " + previous.title, "#" + previous.id));
  if (next) neighbors.append(link("下一节 · " + next.title, "#" + next.id));
  if (focus) {
    setDirectory(false);
    byId("lesson").focus({ preventScroll: true });
    byId("lesson").scrollIntoView({ block: "start" });
  }
}

function setDirectory(open) {
  const toggle = byId("toggle-directory");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "收起学习目录" : "展开学习目录";
}

function followTopicLink(event) {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const id = anchor.getAttribute("href").slice(1);
  if (!topicMap.has(id)) return;
  event.preventDefault();
  if (hashId() !== id) history.pushState(null, "", "#" + id);
  showTopic(id, true);
}

byId("toggle-directory").addEventListener("click", (event) => {
  setDirectory(event.currentTarget.getAttribute("aria-expanded") !== "true");
});
for (const container of ["topics", "neighbors", "resume"]) {
  byId(container).addEventListener("click", followTopicLink);
}
window.addEventListener("hashchange", () => {
  if (location.hash === "#lesson") return;
  showTopic(hashId() || state.last, true);
});
byId("search").addEventListener("input", renderDirectory);
byId("filters").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  filter = button.dataset.filter;
  updateButtons("filters", "filter", filter);
  renderDirectory();
});
byId("modes").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  mode = button.dataset.mode;
  updateButtons("modes", "mode", mode);
  renderLesson();
});
byId("favorite").addEventListener("click", () => {
  updateRecord({ favorite: !recordFor(current.id).favorite });
  renderFavorite();
  renderDirectory();
});
byId("mastery").addEventListener("change", (event) => {
  updateRecord({ mastery: event.currentTarget.value });
  renderProgress();
  renderDirectory();
});
byId("notes").addEventListener("submit", (event) => event.preventDefault());
for (const field of fields) {
  byId(field).addEventListener("input", (event) => updateRecord({ [field]: event.currentTarget.value }));
}

byId("copy").addEventListener("click", async () => {
  const item = current;
  const record = recordFor(item.id);
  const context = [
    "我在准备实习面试。请根据下面的项目上下文解释我的疑问，先讲原理，再用一个小例子检查我的理解。",
    `知识点：${groups[item.group]} / ${item.title}`,
    `面试题：${item.question}`,
    `基本原理：${item.concept}`,
    `项目做法：${item.implementation}`,
    item.example && "示例：\n" + item.example,
    item.sources.length && "源码与记录：\n" + item.sources.map((source) => source.url).join("\n"),
    record.answer.trim() && "我试着这样回答：\n" + record.answer.trim(),
    "我的疑问：\n" + (record.question.trim() || "请帮我拆解这道题，并指出回答时容易混淆的地方。"),
  ].filter(Boolean).join("\n\n");
  try {
    await navigator.clipboard.writeText(context);
    if (current !== item) return;
    byId("manual-copy").hidden = true;
    byId("copy-status").textContent = "已复制，可粘贴到另一个聊天窗口。";
  } catch {
    if (current !== item) return;
    byId("copy-status").textContent = "浏览器未开放剪贴板，可手动复制。";
    byId("manual-copy").hidden = false;
    byId("copy-text").value = context;
    byId("copy-text").select();
  }
});

byId("export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const download = link("", url);
  download.download = "面试学习记录.json";
  download.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
byId("import").addEventListener("click", () => byId("backup-file").click());
byId("backup-file").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files[0];
  if (!file) return;
  try {
    const imported = normalize(JSON.parse(await file.text()));
    const collisions = Object.keys(imported.records).some((id) => Object.hasOwn(state.records, id));
    if (collisions && !window.confirm("备份包含本机已有的知识点记录。用备份中的这些记录覆盖本机版本？")) {
      byId("storage-status").textContent = "已取消导入。";
      return;
    }
    state = { ...state, last: imported.last || state.last, records: { ...state.records, ...imported.records } };
    showTopic(hashId() || state.last);
    persist("备份已导入。");
  } catch {
    byId("storage-status").textContent = "无法导入，请使用从本站导出的 JSON 备份。";
  } finally {
    input.value = "";
  }
});

showTopic(hashId() || state.last);
if (!location.hash) history.replaceState(null, "", "#" + current.id);
