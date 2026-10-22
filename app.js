const STORAGE_KEY = "habitcircle.v2";
const THEME_KEY = "habitcircle_theme";

export function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function lastDays(n, filled) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const iso = todayISO(-i);
    if (filled.includes(iso) || (i % 3 !== 1 && i < n - 1)) dates.push(iso);
  }
  return dates;
}

function seed() {
  const read = lastDays(21, []);
  const sport = lastDays(14, []).filter((_, i) => i % 2 === 0);
  const water = lastDays(18, []).filter((_, i) => i % 3 !== 2);
  const med = lastDays(8, []).slice(-4);
  return {
    user: { name: "Анна", letter: "А", avatar: "", color: "#2e7d4f", city: "Алматы", goal: "Держать 4 привычки 30 дней" },
    habits: [
      { id: "h1", title: "Читать 30 минут", icon: "📚", category: "Учёба", cadence: "Каждый день", target: 7, dates: read, notes: {}, archived: false },
      { id: "h2", title: "Зарядка / спорт", icon: "🏃", category: "Здоровье", cadence: "3 раза в неделю", target: 3, dates: sport, notes: {}, archived: false },
      { id: "h3", title: "Медитация 10 мин", icon: "🧘", category: "Фокус", cadence: "Каждый день", target: 7, dates: med, notes: {}, archived: false },
      { id: "h4", title: "Пить 2 литра воды", icon: "💧", category: "Здоровье", cadence: "Каждый день", target: 7, dates: water, notes: {}, archived: false }
    ],
    challenges: [
      { id: "c1", title: "30 дней чтения", desc: "Минимум 20 страниц каждый день", emoji: "📚", color: "#2e7d4f", members: 8, total: 30, day: 12, joined: true, board: [["Анна", 12], ["Максим", 11], ["Катя", 9], ["Алина", 14]] },
      { id: "c2", title: "Утренняя зарядка", desc: "15 минут упражнений каждое утро", emoji: "🏃", color: "#3a7ca5", members: 5, total: 14, day: 5, joined: true, board: [["Дима", 6], ["Анна", 5], ["Игорь", 4]] },
      { id: "c3", title: "Гидратация", desc: "2 литра воды каждый день", emoji: "💧", color: "#e8a838", members: 23, total: 30, day: 0, joined: false, board: [["Оля", 4], ["Сергей", 3]] },
      { id: "c4", title: "Медитация 21 день", desc: "10 минут осознанности ежедневно", emoji: "🧘", color: "#7b5ea7", members: 14, total: 21, day: 7, joined: false, board: [["Катя", 8], ["Алина", 7]] },
      { id: "c5", title: "Digital Detox", desc: "1 час без телефона перед сном", emoji: "📵", color: "#c75050", members: 31, total: 10, day: 3, joined: false, board: [["Максим", 3], ["Дима", 2]] }
    ],
    friends: [
      { id: "f1", name: "Максим П.", letter: "М", color: "#3a7ca5", streak: 18, score: 240, status: "friend", note: "Отметил спорт" },
      { id: "f2", name: "Катя С.", letter: "К", color: "#7b5ea7", streak: 9, score: 160, status: "friend", note: "Поддержала streak" },
      { id: "f3", name: "Дима Р.", letter: "Д", color: "#e07a3d", streak: 4, score: 90, status: "friend", note: "Новый челлендж" },
      { id: "f4", name: "Алина М.", letter: "А", color: "#c75050", streak: 22, score: 310, status: "friend", note: "Вода + зарядка" },
      { id: "f5", name: "Сергей К.", letter: "С", color: "#2a9d8f", streak: 2, score: 20, status: "pending", note: "3 общих друга" },
      { id: "f6", name: "Оля В.", letter: "О", color: "#5c6bc0", streak: 6, score: 70, status: "pending", note: "1 общий друг" }
    ],
    feed: [
      { id: "a1", text: "Максим отметил «Спорт»", time: "2 мин назад", likes: 2 },
      { id: "a2", text: "Катя поддержала твой streak", time: "15 мин назад", likes: 1 },
      { id: "a3", text: "Дима вступил в «30 дней чтения»", time: "1 ч назад", likes: 0 }
    ]
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    if (!data.habits || !data.user) return seed();
    return data;
  } catch {
    return seed();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return seed();
}

export function streakOf(dates) {
  if (!dates || !dates.length) return 0;
  const set = new Set(dates);
  let n = 0;
  let cursor = set.has(todayISO()) ? 0 : -1;
  if (!set.has(todayISO()) && !set.has(todayISO(-1))) return 0;
  while (set.has(todayISO(cursor))) {
    n += 1;
    cursor -= 1;
  }
  return n;
}

export function weekCount(dates) {
  if (!dates) return 0;
  const set = new Set(dates);
  let n = 0;
  for (let i = 0; i < 7; i++) if (set.has(todayISO(-i))) n += 1;
  return n;
}

export function monthCount(dates) {
  if (!dates) return 0;
  const set = new Set(dates);
  let n = 0;
  for (let i = 0; i < 30; i++) if (set.has(todayISO(-i))) n += 1;
  return n;
}

export function xpOf(state) {
  const checks = state.habits.reduce((s, h) => s + (h.dates?.length || 0), 0);
  const joined = state.challenges.filter((c) => c.joined).length;
  return checks * 10 + joined * 25;
}

export function levelOf(xp) {
  return Math.floor(xp / 80) + 1;
}

/* --- APP LOGIC --- */

const app = { state: loadState(), screen: "landing", filter: "all", query: "" };
const $ = (s) => document.querySelector(s);

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.display = "none"; }, 2200);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark-theme");
    $("#theme-toggle").textContent = "☀️";
  } else {
    document.body.classList.remove("dark-theme");
    $("#theme-toggle").textContent = "🌙";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  $("#theme-toggle").textContent = isDark ? "☀️" : "🌙";
  toast(isDark ? "Тёмная тема включена" : "Светлая тема включена");
}

function persist() { saveState(app.state); render(); }
function activeHabits() { return app.state.habits.filter((h) => !h.archived); }
function archivedHabits() { return app.state.habits.filter((h) => h.archived); }
function doneToday(h) { return (h.dates || []).includes(todayISO()); }

function renderLanding() {
  const xp = xpOf(app.state);
  const bestStreak = activeHabits().length ? Math.max(0, ...activeHabits().map((h) => streakOf(h.dates))) : 0;
  $("#landing-stats").innerHTML = `
    <div class="stat"><strong>${activeHabits().length}</strong><span>активных привычек</span></div>
    <div class="stat"><strong>${levelOf(xp)}</strong><span>уровень · ${xp} XP</span></div>
    <div class="stat"><strong>${bestStreak}</strong><span>лучший текущий streak</span></div>`;
}

function habitCard(h) {
  const week = weekCount(h.dates);
  const pct = Math.min(100, Math.round((week / h.target) * 100));
  const hasNote = h.notes?.[todayISO()] ? " 📝" : "";
  return `<div class="habit">
    <input type="checkbox" data-check="${h.id}" ${doneToday(h) ? "checked" : ""} aria-label="Отметить ${h.title}">
    <div class="meta">
      <strong>${h.icon} ${h.title}${hasNote}</strong>
      <span>${h.category} · ${h.cadence} · 🔥 ${streakOf(h.dates)} дн.</span>
      <div class="progress"><div style="width:${pct}%"></div></div>
    </div>
    <span class="chip">${week}/${h.target}</span>
    <button class="ghost" data-note="${h.id}">Заметка</button>
    <button class="danger" data-archive="${h.id}" title="В архив">×</button>
  </div>`;
}

function renderDashboard() {
  const habits = activeHabits().filter((h) => {
    if (app.filter === "open") return !doneToday(h);
    if (app.filter === "done") return doneToday(h);
    if (app.filter === "health") return h.category === "Здоровье";
    return true;
  });
  const done = activeHabits().filter(doneToday).length;
  const total = activeHabits().length || 1;
  const xp = xpOf(app.state);

  $("#dash-hello").textContent = `Привет, ${app.state.user.name}`;
  $("#dash-kpis").innerHTML = `
    <div class="kpi"><b>ур. ${levelOf(xp)}</b><span>${xp} XP</span></div>
    <div class="kpi"><b>${done}/${activeHabits().length}</b><span>сегодня</span></div>
    <div class="kpi"><b>${Math.round((done / total) * 100)}%</b><span>день закрыт</span></div>`;

  $("#habit-list").innerHTML = habits.map(habitCard).join("") || `<p class="muted">Нет привычек в этом фильтре.</p>`;

  const labels = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const counts = [0,0,0,0,0,0,0];
  activeHabits().forEach((h) => {
    for (let i = 6; i >= 0; i--) if ((h.dates || []).includes(todayISO(-i))) counts[6 - i] += 1;
  });
  const max = Math.max(1, ...counts);
  $("#week-bars").innerHTML = counts.map((v, i) => `<div class="bar" style="height:${Math.max(10, Math.round(v / max * 100))}%;background:${i === 6 ? "var(--primary)" : "var(--soft)"}"><span>${labels[i]}</span></div>`).join("");

  const cells = [];
  for (let i = 27; i >= 0; i--) {
    const iso = todayISO(-i);
    const n = activeHabits().filter((h) => (h.dates || []).includes(iso)).length;
    const cls = n === 0 ? "" : n < 3 ? "mid" : "on";
    cells.push(`<i class="${cls}" title="${iso}: ${n}"></i>`);
  }
  $("#heat").innerHTML = cells.join("");

  const joinedChallenges = app.state.challenges.filter((c) => c.joined);
  $("#dash-challenges").innerHTML = joinedChallenges.length 
    ? joinedChallenges.map((c) => `
      <div class="list-item"><div style="flex:1"><strong>${c.emoji} ${c.title}</strong><div class="progress"><div style="width:${Math.round(c.day / c.total * 100)}%"></div></div><span class="muted">${c.day}/${c.total} дней</span></div></div>`).join("") 
    : `<p class="muted">Вы ещё не вступили ни в один челлендж.</p>`;

  $("#dash-feed").innerHTML = app.state.feed.length 
    ? app.state.feed.slice(0, 6).map((a) => `
      <div class="list-item"><div style="flex:1"><strong>${a.text}</strong><div class="muted">${a.time}</div></div><button class="ghost" data-like="${a.id}">♥ ${a.likes || 0}</button></div>`).join("")
    : `<p class="muted">Лента активности пуста.</p>`;
}

function renderChallenges() {
  $("#challenge-grid").innerHTML = app.state.challenges.map((c) => `
    <article class="card challenge">
      <div class="cover" style="background:${c.color}">${c.emoji}</div>
      <div class="body">
        <h3>${c.title}</h3>
        <p class="muted">${c.desc}</p>
        <div class="progress"><div style="width:${Math.round(c.day / c.total * 100)}%"></div></div>
        <p class="muted" style="margin-top:6px;font-size:12px">${c.members} участников · ${c.day}/${c.total} дней</p>
        <p style="font-size:13px;line-height:1.4">${(c.board || []).slice(0, 3).map((row, i) => `${i + 1}. ${row[0]} —${row[1]} дн.`).join("<br>")}</p>
        <button class="${c.joined ? "ghost" : "primary"}" data-join="${c.id}">${c.joined ? "Выйти" : "Присоединиться"}</button>
      </div>
    </article>`).join("");
}

function renderFriends() {
  const q = app.query.toLowerCase();
  const list = app.state.friends.filter((f) => f.name.toLowerCase().includes(q));
  const pending = list.filter((f) => f.status === "pending");
  const friends = list.filter((f) => f.status === "friend").sort((a, b) => b.score - a.score);

  $("#friend-count").textContent = `${friends.length} друзей · ${pending.length} заявок`;
  $("#pending-list").innerHTML = pending.map((f) => `
    <div class="card row"><div class="avatar" style="background:${f.color}">${f.letter}</div><div style="flex:1"><strong>${f.name}</strong><div class="muted">${f.note}</div></div><button class="primary" data-accept="${f.id}">✓</button><button class="danger" data-reject="${f.id}">✕</button></div>`).join("") || `<p class="muted">Входящих заявок нет.</p>`;

  $("#friend-list").innerHTML = friends.map((f, i) => `
    <div class="card row"><div class="avatar" style="background:${f.color}">${f.letter}</div><div style="flex:1"><strong>${i + 1}. ${f.name}</strong><div class="muted">🔥 ${f.streak} дн. · ${f.score} очков · ${f.note}</div></div><button class="ghost" data-cheer="${f.id}">Поддержать</button></div>`).join("") || `<p class="muted">Друзья не найдены.</p>`;
}

function renderStats() {
  const habits = activeHabits();
  const checks = habits.reduce((s, h) => s + (h.dates?.length || 0), 0);
  const xp = xpOf(app.state);
  const xpCurrent = xp % 80;

  const cats = {};
  habits.forEach((h) => { cats[h.category] = (cats[h.category] || 0) + monthCount(h.dates); });

  $("#stats-kpis").innerHTML = `
    <div class="kpi"><b>${checks}</b><span>всего чек-инов</span></div>
    <div class="kpi"><b>Ур. ${levelOf(xp)}</b><span>${xpCurrent}/80 XP до следующего</span></div>
    <div class="kpi"><b>${app.state.challenges.filter((c) => c.joined).length}</b><span>челленджей</span></div>
    <div class="kpi"><b>${app.state.friends.filter((f) => f.status === "friend").length}</b><span>друзей</span></div>`;

  $("#stats-table").innerHTML = habits.map((h) => `
    <div class="list-item"><div style="flex:1"><strong>${h.icon} ${h.title}</strong><div class="muted">серия ${streakOf(h.dates)} дн. · за неделю ${weekCount(h.dates)}/${h.target} · за 30 дней ${monthCount(h.dates)}</div></div></div>`).join("") || `<p class="muted">Нет активных привычек.</p>`;

  $("#stats-cats").innerHTML = Object.entries(cats).map(([name, n]) => `<div class="list-item"><strong>${name}</strong><span class="chip">${n} за 30 дней</span></div>`).join("") || `<p class="muted">Пока нет данных.</p>`;
}

function renderProfile() {
  const u = app.state.user;
  const xp = xpOf(app.state);
  const lvl = levelOf(xp);
  const currentLvlXp = xp % 80;
  const pct = Math.round((currentLvlXp / 80) * 100);

  $("#profile-name").value = u.name;
  $("#profile-avatar").value = u.avatar || "";
  $("#profile-color").value = u.color || "#2e7d4f";
  $("#profile-city").value = u.city || "";
  $("#profile-goal").value = u.goal || "";

  $("#profile-display-name").textContent = u.name;
  $("#profile-display-sub").textContent = `Уровень ${lvl} · ${xp} XP (${currentLvlXp}/80 XP)`;
  $("#profile-xp-bar").style.width = `${pct}%`;

  const avatarEl = $("#profile-letter");
  avatarEl.textContent = u.avatar || u.letter;
  avatarEl.style.background = u.color || "var(--primary)";

  $("#profile-xp").textContent = `${xp} XP · Уровень ${lvl}`;

  const totalChecks = app.state.habits.reduce((s, h) => s + (h.dates?.length || 0), 0);
  const bestStreak = activeHabits().length ? Math.max(0, ...activeHabits().map((h) => streakOf(h.dates))) : 0;
  const friendsCount = app.state.friends.filter((f) => f.status === "friend").length;

  const achievements = [
    { title: "Первый шаг", desc: "Сделать первый чек-ин", icon: "🌱", unlocked: totalChecks >= 1 },
    { title: "В ритме", desc: "Серия из 7 дней", icon: "🔥", unlocked: bestStreak >= 7 },
    { title: "Опытный", desc: "Достичь 2 уровня", icon: "⭐", unlocked: lvl >= 2 },
    { title: "Социальный", desc: "Добавить друга", icon: "👥", unlocked: friendsCount >= 1 },
  ];

  $("#profile-achievements").innerHTML = achievements.map((a) => `
    <div class="achievement ${a.unlocked ? "unlocked" : ""}">
      <div class="ach-icon">${a.icon}</div>
      <div>
        <strong>${a.title}</strong>
        <div class="muted">${a.desc}</div>
      </div>
    </div>`).join("");

  const archived = archivedHabits();
  $("#profile-archive-list").innerHTML = archived.length
    ? archived.map((h) => `
      <div class="list-item">
        <div style="flex:1"><strong>${h.icon} ${h.title}</strong><div class="muted">${h.category}</div></div>
        <button class="ghost" data-unarchive="${h.id}">Восстановить</button>
      </div>`).join("")
    : `<p class="muted">В архиве пока ничего нет.</p>`;
}

function render() {
  renderLanding();
  renderDashboard();
  renderChallenges();
  renderFriends();
  renderStats();
  renderProfile();

  const u = app.state.user;
  $("#user-name").textContent = u.name;
  
  const headerAvatar = $("#user-letter");
  headerAvatar.textContent = u.avatar || u.letter;
  headerAvatar.style.background = u.color || "var(--primary)";

  document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("on", b.dataset.filter === app.filter));
}

function show(screen) {
  app.screen = screen;
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("active", el.id === screen));
  document.querySelectorAll("[data-nav]").forEach((b) => b.classList.toggle("active", b.dataset.nav === screen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeModal() {
  $("#modal").classList.remove("open");
}

function addHabit(event) {
  event.preventDefault();
  const title = $("#habit-title").value.trim();
  if (!title) return;
  app.state.habits.unshift({
    id: uid("h"),
    title,
    icon: $("#habit-icon").value,
    category: $("#habit-category").value,
    cadence: $("#habit-cadence").value,
    target: Number($("#habit-target").value),
    dates: [],
    notes: {},
    archived: false
  });
  event.target.reset();
  closeModal();
  toast("Привычка добавлена!");
  persist();
  show("dashboard");
}

function saveProfile(event) {
  event.preventDefault();
  const name = $("#profile-name").value.trim() || "Анна";
  app.state.user.name = name;
  app.state.user.letter = name.slice(0, 1).toUpperCase();
  app.state.user.avatar = $("#profile-avatar").value.trim();
  app.state.user.color = $("#profile-color").value;
  app.state.user.city = $("#profile-city").value.trim();
  app.state.user.goal = $("#profile-goal").value.trim();
  toast("Профиль сохранён");
  persist();
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(app.state, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `habitcircle_backup_${todayISO()}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  toast("Файл с бэкапом скачан!");
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedState = JSON.parse(e.target.result);
      if (importedState.habits && importedState.user) {
        app.state = importedState;
        persist();
        toast("Данные успешно восстановлены!");
      } else {
        toast("Ошибка: Неверный формат файла");
      }
    } catch {
      toast("Ошибка при чтении файла");
    }
  };
  reader.readAsText(file);
}

function onClick(event) {
  if (event.target.id === "modal") {
    closeModal();
    return;
  }

  const t = event.target.closest("[data-nav],[data-check],[data-archive],[data-unarchive],[data-join],[data-accept],[data-reject],[data-cheer],[data-like],[data-note],[data-action],[data-filter]");
  if (!t) return;

  if (t.dataset.nav) show(t.dataset.nav);
  if (t.dataset.filter) { app.filter = t.dataset.filter; render(); }
  if (t.dataset.action === "add") $("#modal").classList.add("open");
  if (t.dataset.action === "close") closeModal();
  if (t.dataset.action === "reset") { app.state = resetState(); toast("Демо-данные восстановлены"); persist(); }

  if (t.dataset.check) {
    const h = app.state.habits.find((x) => x.id === t.dataset.check);
    const iso = todayISO();
    h.dates = h.dates || [];
    const joined = app.state.challenges.find((c) => c.joined && c.title.toLowerCase().includes(h.title.split(" ")[0].toLowerCase()));

    if (t.checked && !h.dates.includes(iso)) {
      h.dates.push(iso);
      if (joined) joined.day = Math.min(joined.total, joined.day + 1);
      toast(`Чек-ин: +10 XP, серия ${streakOf(h.dates)} дн.`);
    } else if (!t.checked) {
      h.dates = h.dates.filter((d) => d !== iso);
      if (joined) joined.day = Math.max(0, joined.day - 1);
      toast("Отметка снята");
    }
    if (navigator.vibrate) navigator.vibrate(30);
    persist();
  }

  if (t.dataset.archive) {
    if (confirm("Отправить эту привычку в архив?")) {
      const h = app.state.habits.find((x) => x.id === t.dataset.archive);
      h.archived = true;
      toast("Привычка перемещена в архив");
      persist();
    }
  }

  if (t.dataset.unarchive) {
    const h = app.state.habits.find((x) => x.id === t.dataset.unarchive);
    h.archived = false;
    toast("Привычка восстановлена");
    persist();
  }

  if (t.dataset.note) {
    const h = app.state.habits.find((x) => x.id === t.dataset.note);
    const text = window.prompt("Заметка к сегодняшнему чек-ину", h.notes?.[todayISO()] || "");
    if (text !== null) {
      h.notes = h.notes || {};
      if (text.trim()) {
        h.notes[todayISO()] = text.trim();
        toast("Заметка сохранена");
      } else {
        delete h.notes[todayISO()];
        toast("Заметка удалена");
      }
      persist();
    }
  }

  if (t.dataset.join) {
    const c = app.state.challenges.find((x) => x.id === t.dataset.join);
    c.joined = !c.joined;
    c.members += c.joined ? 1 : -1;
    if (c.joined && !c.board.find((row) => row[0] === app.state.user.name)) {
      c.board.push([app.state.user.name, c.day]);
    }
    toast(c.joined ? `Вы вступили в «${c.title}»` : "Вы вышли из челленджа");
    persist();
  }

  if (t.dataset.accept) {
    const f = app.state.friends.find((x) => x.id === t.dataset.accept);
    f.status = "friend";
    app.state.feed.unshift({ id: uid("a"), text: `${f.name} теперь в друзьях`, time: "только что", likes: 0 });
    toast(`Заявка от ${f.name} принята`);
    persist();
  }

  if (t.dataset.reject) {
    app.state.friends = app.state.friends.filter((x) => x.id !== t.dataset.reject);
    toast("Заявка отклонена");
    persist();
  }

  if (t.dataset.cheer) {
    const f = app.state.friends.find((x) => x.id === t.dataset.cheer);
    f.score += 5;
    app.state.feed.unshift({ id: uid("a"), text: `Вы поддержали ${f.name}`, time: "только что", likes: 0 });
    toast(`+5 очков для ${f.name}`);
    persist();
  }

  if (t.dataset.like) {
    const a = app.state.feed.find((x) => x.id === t.dataset.like);
    a.likes = (a.likes || 0) + 1;
    toast("Реакция отправлена");
    persist();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("#modal").classList.contains("open")) {
    closeModal();
  }
});

document.addEventListener("click", onClick);
$("#theme-toggle").addEventListener("click", toggleTheme);
$("#habit-form").addEventListener("submit", addHabit);
$("#profile-form").addEventListener("submit", saveProfile);
$("#friend-search").addEventListener("input", (e) => { app.query = e.target.value; renderFriends(); });

$("#btn-export").addEventListener("click", exportJSON);
$("#btn-import-trigger").addEventListener("click", () => $("#file-import").click());
$("#file-import").addEventListener("change", importJSON);

initTheme();
render();
show("landing");