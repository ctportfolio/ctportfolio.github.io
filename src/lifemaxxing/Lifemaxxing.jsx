import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Award,
  BarChart3,
  Brain,
  Camera,
  ChevronDown,
  Dumbbell,
  Flame,
  Focus,
  GalleryHorizontal,
  Gem,
  HeartPulse,
  Import,
  KeyRound,
  Lock,
  Medal,
  NotebookPen,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Wallet,
  X,
} from 'lucide-react'
import './lifemaxxing.css'

const STORAGE_KEY = 'lifemaxxing:data:v1'
const PASSCODE_KEY = 'lifemaxxing:passcode:v1'
const UNLOCK_KEY = 'lifemaxxing:unlocked:v1'
const SYSTEM_START_DATE = '2026-04-28'
const DEFAULT_PASSCODE = 'lifemaxxing'

const navItems = [
  ['dashboard', 'Dashboard', Activity],
  ['daily', 'Daily Log', NotebookPen],
  ['stats', 'Stats', Sparkles],
  ['graphs', 'Graphs', BarChart3],
  ['streaks', 'Streaks', Flame],
  ['quests', 'Quests', Swords],
  ['shop', 'Shop / Rewards', ShoppingBag],
  ['achievements', 'Achievements', Trophy],
  ['reviews', 'Reviews', Medal],
  ['settings', 'Settings', Settings],
]

const dopamineStates = [
  'Brain fried',
  'Cooked',
  'Overstimmed',
  'Scattered',
  'Flat',
  'Normalizing',
  'Stable',
  'Clear',
  'Sharp',
  'Fresh mind',
]

const skillOptions = [
  'editing',
  'photography',
  'graphic design',
  'coding',
  'marketing',
  'trading',
  'content creation',
  'fashion / clothing',
  'sales / outreach',
]

const statTrees = {
  physique: ['strength', 'conditioning', 'leanness', 'consistency'],
  looks: ['face care', 'grooming', 'style', 'photo score'],
  discipline: ['habits', 'routine', 'NoFap', 'environment'],
  wealth: ['income', 'saving', 'investing', 'budgeting'],
  social: ['friends', 'family', 'networking', 'dating'],
  creativity: ['editing', 'photography', 'design', 'content'],
  tradingBusiness: ['trading', 'sales', 'marketing', 'systems'],
  mindFocus: ['deep work', 'sleep rhythm', 'journaling', 'dopamine'],
}

const emptyLooks = {
  face: {
    symmetry: 5,
    boneStructure: 5,
    harmony: 5,
    eyes: 5,
    nose: 5,
    lips: 5,
    brows: 5,
    teethSmile: 5,
    hairlineHair: 5,
    ears: 5,
    skinClarity: 5,
    eyeBrightness: 5,
    facialFat: 5,
    agingQuality: 5,
    stressSigns: 5,
  },
  body: {
    frame: 5,
    muscle: 5,
    leanness: 5,
    posture: 5,
  },
  presence: {
    grooming: 5,
    style: 5,
    confidence: 5,
    energy: 5,
  },
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0))
}

function round(value, places = 1) {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

function scoreRange(value, min, max) {
  if (value === '' || value === null || value === undefined) return 0
  return clamp(((Number(value) - min) / (max - min)) * 100)
}

function inverseScore(value, good, bad) {
  if (value === '' || value === null || value === undefined) return 50
  return clamp(100 - ((Number(value) - good) / (bad - good)) * 100)
}

function boolScore(value, yes = 100, no = 0) {
  return value ? yes : no
}

function baseDailyLog(date = todayKey()) {
  return {
    date,
    finalized: false,
    updates: [],
    photos: { front: '', back: '' },
    health: {
      weight: '',
      sleepDuration: '',
      sleepQuality: 5,
      wakeTime: '',
      bedtime: '',
      protein: '',
      water: '',
      steps: '',
      cardio: false,
      exercise: false,
      gymSessionsAdded: 0,
      nutritionQuality: 5,
      hydrationQuality: 5,
      recovery: 5,
      stress: 5,
      mood: 5,
      overthinking: 5,
      nicotine: false,
      alcoholWeed: false,
      substancesNotes: '',
      illnessInjury: false,
      illnessNotes: '',
      caloriesTracked: false,
      calories: '',
      creatine: false,
    },
    looks: {
      brushedTeeth: 0,
      removedContactsMorning: false,
      woreRetainerLastNight: false,
      cleanedRetainer: false,
      skincare: false,
      hairStyling: false,
      shavingGrooming: false,
      haircut: false,
      looksBreakdown: JSON.parse(JSON.stringify(emptyLooks)),
      autoLooksAnalysis: null,
    },
    discipline: {
      noFapClean: true,
      porn: false,
      masturbation: false,
      roomCleaned: false,
      budgeting: false,
      noSpendDay: false,
      journaling: false,
    },
    money: {
      earned: '',
      earnedFrom: '',
      spent: '',
      spentOn: '',
      spentCategory: 'personal',
      saved: '',
      invested: '',
      wasted: '',
      bankBalance: '',
      netWorth: '',
      budgetAdherence: 5,
    },
    productivity: {
      screenTime: '',
      scrolling: '',
      musicOverstimulation: false,
      deepWorkHours: '',
      skillsWorked: false,
      skills: [],
      skillNotes: '',
      skillQuality: 5,
      portfolioAdded: false,
      portfolioProject: '',
      portfolioNotes: '',
    },
    social: {
      wentOut: false,
      whoWith: '',
      where: '',
      what: '',
      substances: false,
      quality: 5,
      moneySpent: '',
      energyAfter: 5,
      friendsTime: false,
      familyTime: false,
      networking: false,
      girlfriendTime: false,
    },
    notes: {
      biggestWin: '',
      biggestFail: '',
      dailyNotes: '',
      biggestWeakness: '',
    },
    computed: {},
  }
}

function createInitialData() {
  const first = baseDailyLog(SYSTEM_START_DATE)
  first.health.gymSessionsAdded = 0
  first.computed = computeDay(first, null, 207)
  return {
    version: 1,
    owner: {
      name: 'Cole Timlin',
      dob: '',
      occupations: ['Creative operator', 'Portfolio builder'],
      startDate: SYSTEM_START_DATE,
    },
    settings: {
      focusModule: 'stats',
      keepUnlocked: false,
      graphRange: '30',
      graphMetric: 'lifeRating',
      graphOverlay: true,
      startingGymSessions: 207,
      reminders: false,
    },
    dailyLogs: { [SYSTEM_START_DATE]: first },
    rewards: [],
    customQuests: [],
  }
}

function calculateLooksScore(breakdown) {
  const face = breakdown.face || emptyLooks.face
  const body = breakdown.body || emptyLooks.body
  const presence = breakdown.presence || emptyLooks.presence
  const features =
    (Number(face.eyes) +
      Number(face.nose) +
      Number(face.lips) +
      Number(face.brows) +
      Number(face.teethSmile) +
      Number(face.hairlineHair) +
      Number(face.ears)) /
    7
  const skin =
    (Number(face.skinClarity) +
      Number(face.eyeBrightness) +
      Number(face.facialFat) +
      Number(face.agingQuality) +
      Number(face.stressSigns)) /
    5
  const faceScore =
    Number(face.symmetry) * 0.15 +
    Number(face.boneStructure) * 0.25 +
    Number(face.harmony) * 0.2 +
    features * 0.25 +
    skin * 0.15
  const bodyScore =
    Number(body.frame) * 0.3 +
    Number(body.muscle) * 0.35 +
    Number(body.leanness) * 0.2 +
    Number(body.posture) * 0.15
  const presenceScore =
    Number(presence.grooming) * 0.35 +
    Number(presence.style) * 0.25 +
    Number(presence.confidence) * 0.25 +
    Number(presence.energy) * 0.15
  const total = faceScore * 0.7 + bodyScore * 0.2 + presenceScore * 0.1
  return {
    face: round(faceScore),
    body: round(bodyScore),
    presence: round(presenceScore),
    overall: round(total),
    display100: Math.round(total * 10),
  }
}

function looksBand(score) {
  if (score <= 2) return 'extreme abnormalities / highly unsettling'
  if (score < 5) return 'clearly below average'
  if (score < 6) return 'true average'
  if (score < 7) return 'slightly above average'
  if (score < 8) return 'good looking'
  if (score < 9) return 'very attractive'
  if (score < 10) return 'exceptional / elite tier'
  return 'theoretical idealized human specimen'
}

function computeHp(log) {
  const h = log.health
  const sleep = scoreRange(h.sleepDuration, 4, 8.5) * 0.18 + scoreRange(h.sleepQuality, 1, 10) * 0.1
  const nutrition = scoreRange(h.nutritionQuality, 1, 10) * 0.12 + scoreRange(h.protein, 40, 180) * 0.08
  const hydration = scoreRange(h.water, 20, 120) * 0.1
  const exercise = (boolScore(h.exercise || h.gymSessionsAdded > 0) * 0.08 + scoreRange(h.steps, 1500, 10000) * 0.07 + boolScore(h.cardio) * 0.04)
  const recovery = scoreRange(h.recovery, 1, 10) * 0.1
  const stress = inverseScore(h.stress, 2, 10) * 0.09
  const substances = (h.nicotine ? -6 : 4) + (h.alcoholWeed ? -8 : 4)
  const illness = h.illnessInjury ? -12 : 4
  return Math.round(clamp(sleep + nutrition + hydration + exercise + recovery + stress + substances + illness))
}

function computeDopamine(log, previousScore = 55) {
  const h = log.health
  const p = log.productivity
  const d = log.discipline
  let score = previousScore * 0.25 + 52
  score += scoreRange(h.sleepDuration, 4, 8) * 0.08
  score += scoreRange(p.deepWorkHours, 0, 4) * 0.08
  score += scoreRange(h.steps, 1500, 10000) * 0.05
  score += boolScore(h.exercise || h.gymSessionsAdded > 0, 6, 0)
  score += boolScore(d.journaling, 3, 0)
  score -= scoreRange(p.screenTime, 2, 12) * 0.16
  score -= scoreRange(p.scrolling, 0, 4) * 0.12
  score -= d.porn ? 18 : 0
  score -= d.masturbation ? 10 : 0
  score -= h.nicotine ? 9 : 0
  score -= h.alcoholWeed ? 10 : 0
  score -= p.musicOverstimulation ? 5 : 0
  score -= scoreRange(h.stress, 1, 10) * 0.06
  const numeric = Math.round(clamp(score))
  return {
    score: numeric,
    state: dopamineStates[Math.min(9, Math.floor(numeric / 10))],
  }
}

function computeLifeRating(log, looksScore, hp, dopamineScore) {
  const h = log.health
  const l = log.looks
  const d = log.discipline
  const m = log.money
  const p = log.productivity
  const s = log.social
  const discipline = Math.round(
    (boolScore(d.noFapClean) +
      boolScore(d.roomCleaned) +
      boolScore(d.budgeting) +
      boolScore(d.journaling) +
      boolScore(l.woreRetainerLastNight) +
      scoreRange(l.brushedTeeth, 0, 2)) /
      6
  )
  const money = Math.round(
    (scoreRange(m.earned, 0, 250) +
      scoreRange(m.saved, 0, 150) +
      scoreRange(m.invested, 0, 150) +
      inverseScore(m.wasted, 0, 80) +
      scoreRange(m.budgetAdherence, 1, 10)) /
      5
  )
  const health = hp
  const productivity = Math.round(
    (scoreRange(p.deepWorkHours, 0, 5) +
      inverseScore(p.screenTime, 2, 11) +
      boolScore(p.skillsWorked) +
      boolScore(p.portfolioAdded) +
      scoreRange(p.skillQuality, 1, 10)) /
      5
  )
  const social = Math.round(
    (boolScore(s.wentOut, 75, 35) +
      boolScore(s.friendsTime) +
      boolScore(s.familyTime) +
      boolScore(s.networking) +
      scoreRange(s.quality, 1, 10)) /
      5
  )
  const skillGrowth = Math.round(
    (boolScore(p.skillsWorked) + scoreRange(p.deepWorkHours, 0, 5) + scoreRange(p.skillQuality, 1, 10)) / 3
  )
  const looks = Math.round(looksScore * 10)
  const categories = { discipline, money, looks, health, productivity, social, skillGrowth }
  const overall = Math.round(Object.values(categories).reduce((sum, item) => sum + item, 0) / 7)
  return { overall, categories }
}

function computeDailyGrade(log, life, hp, dopamine) {
  const p = log.productivity
  const d = log.discipline
  const l = log.looks
  let score = life.overall * 0.35 + hp * 0.2 + dopamine * 0.15
  score += boolScore(d.noFapClean, 8, -12)
  score += boolScore(d.roomCleaned, 4, 0)
  score += boolScore(p.portfolioAdded, 5, 0)
  score += boolScore(p.skillsWorked, 4, 0)
  score += boolScore(log.health.creatine, 3, 0)
  score += scoreRange(l.brushedTeeth, 0, 2) * 0.06
  const value = Math.round(clamp(score))
  if (value >= 92) return { value, letter: 'S' }
  if (value >= 84) return { value, letter: 'A' }
  if (value >= 74) return { value, letter: 'B' }
  if (value >= 64) return { value, letter: 'C' }
  if (value >= 50) return { value, letter: 'D' }
  return { value, letter: 'F' }
}

function computeXp(log, grade, streakPower = 1) {
  const h = log.health
  const p = log.productivity
  const d = log.discipline
  const quality = grade.value / 100
  const difficulty =
    1 +
    scoreRange(p.deepWorkHours, 0, 6) / 160 +
    scoreRange(h.steps, 0, 12000) / 260 +
    (h.gymSessionsAdded > 0 ? 0.16 : 0)
  let xp = Math.round(90 * quality * difficulty * streakPower)
  if (!d.noFapClean) xp -= 45
  if (!d.roomCleaned) xp -= 8
  if (Number(p.screenTime) > 9) xp -= 15
  return Math.max(-80, xp)
}

function computeDay(log, previous, startingGymSessions) {
  const looks = calculateLooksScore(log.looks.looksBreakdown)
  const hp = computeHp(log)
  const dopamine = computeDopamine(log, previous?.computed?.dopamine?.score || 55)
  const life = computeLifeRating(log, looks.overall, hp, dopamine.score)
  const grade = computeDailyGrade(log, life, hp, dopamine.score)
  const xp = computeXp(log, grade, 1 + Math.min(0.35, (previous?.computed?.cleanDayStreak || 0) * 0.03))
  const level = levelFromXp((previous?.computed?.totalXp || 0) + xp)
  const gymTotal = (previous?.computed?.gymTotal ?? startingGymSessions) + Number(log.health.gymSessionsAdded || 0)
  return {
    looks,
    hp,
    dopamine,
    life,
    grade,
    xpGained: xp,
    totalXp: Math.max(0, (previous?.computed?.totalXp || 0) + xp),
    level: level.level,
    xpIntoLevel: level.xpIntoLevel,
    xpForNext: level.xpForNext,
    gymTotal,
    cleanDayStreak: log.discipline.noFapClean ? (previous?.computed?.cleanDayStreak || 0) + 1 : 0,
  }
}

function levelFromXp(totalXp) {
  let remaining = Math.max(0, totalXp)
  let level = 1
  let needed = 160
  while (remaining >= needed) {
    remaining -= needed
    level += 1
    needed = Math.round(160 + level * 42 + level ** 1.6)
  }
  return { level, xpIntoLevel: remaining, xpForNext: needed }
}

function levelTitle(level, lifeRating) {
  if (level >= 50 && lifeRating >= 90) return 'Black Site Apex'
  if (level >= 35) return 'Ghost Captain'
  if (level >= 25) return 'Chrome Operator'
  if (level >= 15) return 'Night Regiment'
  if (level >= 8) return 'Underground Cadet'
  return 'Initiate'
}

function recomputeAll(data) {
  const next = migrateData(structuredClone(data))
  let previous = null
  Object.keys(next.dailyLogs)
    .sort()
    .forEach((date) => {
      next.dailyLogs[date].computed = computeDay(next.dailyLogs[date], previous, next.settings.startingGymSessions)
      previous = next.dailyLogs[date]
    })
  return next
}

function migrateData(data) {
  const fresh = createInitialData()
  const next = {
    ...fresh,
    ...data,
    owner: { ...fresh.owner, ...(data.owner || {}) },
    settings: { ...fresh.settings, ...(data.settings || {}) },
    dailyLogs: { ...(data.dailyLogs || fresh.dailyLogs) },
    rewards: data.rewards || [],
    customQuests: data.customQuests || [],
  }
  Object.entries(next.dailyLogs).forEach(([date, log]) => {
    next.dailyLogs[date] = mergeDailyLog(baseDailyLog(date), log)
  })
  if (next.settings.focusModule === 'photos') next.settings.focusModule = 'looks'
  return next
}

function mergeDailyLog(base, saved) {
  const merged = { ...base, ...saved }
  ;['photos', 'health', 'looks', 'discipline', 'money', 'productivity', 'social', 'notes', 'computed'].forEach((key) => {
    merged[key] = { ...(base[key] || {}), ...(saved?.[key] || {}) }
  })
  merged.looks.looksBreakdown = {
    face: { ...emptyLooks.face, ...(saved?.looks?.looksBreakdown?.face || {}) },
    body: { ...emptyLooks.body, ...(saved?.looks?.looksBreakdown?.body || {}) },
    presence: { ...emptyLooks.presence, ...(saved?.looks?.looksBreakdown?.presence || {}) },
  }
  merged.updates = Array.isArray(saved?.updates) ? saved.updates : []
  return merged
}

function hydrateData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return createInitialData()
    return recomputeAll(JSON.parse(stored))
  } catch {
    return createInitialData()
  }
}

function getLogs(data) {
  return Object.values(data.dailyLogs).sort((a, b) => a.date.localeCompare(b.date))
}

function latestLog(data) {
  return getLogs(data).at(-1) || baseDailyLog()
}

function metricValue(log, metric) {
  const map = {
    weight: log.health.weight,
    bankBalance: log.money.bankBalance,
    lifeRating: log.computed.life?.overall,
    looksRating: log.computed.looks?.overall,
    hp: log.computed.hp,
    dopamine: log.computed.dopamine?.score,
    screenTime: log.productivity.screenTime,
    sleepDuration: log.health.sleepDuration,
    calories: log.health.calories,
    protein: log.health.protein,
    moneyEarned: log.money.earned,
    moneySpent: log.money.spent,
    moneySaved: log.money.saved,
    gymTotal: log.computed.gymTotal,
    dailyGrade: log.computed.grade?.value,
    level: log.computed.level,
  }
  return Number(map[metric] || 0)
}

function useLifemaxxingData() {
  const [data, setData] = useState(hydrateData)
  const [saveState, setSaveState] = useState({ status: 'saved', message: 'Saved locally' })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setSaveState({ status: 'saved', message: `Saved locally ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` })
    } catch (error) {
      setSaveState({ status: 'error', message: error?.name === 'QuotaExceededError' ? 'Storage full. Export JSON before adding more images.' : 'Local save failed.' })
    }
  }, [data])

  const updateData = (producer) => {
    setData((current) => recomputeAll(producer(structuredClone(current))))
  }

  const resetData = () => setData(createInitialData())

  return [data, updateData, saveState, resetData]
}

function PasscodeGate({ onUnlock }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const stored = localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE
    if (code === stored) {
      sessionStorage.setItem(UNLOCK_KEY, 'true')
      onUnlock()
      return
    }
    setError('Denied')
  }

  return (
    <main className="lx-gate">
      <form className="lx-gate-card" onSubmit={submit}>
        <div className="lx-gate-mark">lifemaxxing</div>
        <label htmlFor="lx-passcode">Passcode</label>
        <input
          id="lx-passcode"
          autoFocus
          type="password"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter private code"
        />
        <button type="submit">Unlock</button>
        {error && <p>{error}</p>}
      </form>
    </main>
  )
}

export default function Lifemaxxing() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true')
  const [active, setActive] = useState('dashboard')
  const [data, updateData, saveState, resetData] = useLifemaxxingData()
  const log = latestLog(data)
  const title = levelTitle(log.computed.level || 1, log.computed.life?.overall || 0)

  useEffect(() => {
    if (!localStorage.getItem(PASSCODE_KEY)) localStorage.setItem(PASSCODE_KEY, DEFAULT_PASSCODE)
  }, [])

  if (!unlocked) return <PasscodeGate onUnlock={() => setUnlocked(true)} />

  const ActiveIcon = navItems.find(([id]) => id === active)?.[2] || Activity

  return (
    <div className="lx-shell">
      <aside className="lx-sidebar">
        <div className="lx-brand">
          <ShieldCheck size={22} />
          <div>
            <strong>lifemaxxing</strong>
            <span>private OS</span>
          </div>
        </div>
        <nav>
          {navItems.map(([id, label, Icon]) => (
            <button key={id} className={active === id ? 'is-active' : ''} onClick={() => setActive(id)}>
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="lx-main">
        <header className="lx-topbar">
          <div>
            <p className="lx-kicker">Cole Timlin / {SYSTEM_START_DATE}</p>
            <h1>
              <ActiveIcon size={26} />
              {navItems.find(([id]) => id === active)?.[1]}
            </h1>
          </div>
          <div className="lx-top-metrics">
            <Metric label="Rank" value={title} />
            <Metric label="Level" value={log.computed.level || 1} />
            <Metric label="Life" value={`${log.computed.life?.overall || 0}/100`} />
          </div>
        </header>

        {active === 'dashboard' && <Dashboard data={data} updateData={updateData} setActive={setActive} />}
        {active === 'daily' && <DailyLog data={data} updateData={updateData} saveState={saveState} />}
        {active === 'stats' && <Stats data={data} updateData={updateData} />}
        {active === 'graphs' && <Graphs data={data} updateData={updateData} />}
        {active === 'streaks' && <Streaks data={data} />}
        {active === 'quests' && <Quests data={data} updateData={updateData} />}
        {active === 'shop' && <Shop data={data} updateData={updateData} />}
        {active === 'achievements' && <Achievements data={data} />}
        {active === 'reviews' && <Reviews data={data} />}
        {active === 'settings' && <SettingsPage data={data} updateData={updateData} resetData={resetData} lock={() => setUnlocked(false)} />}
      </main>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="lx-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Panel({ title, icon: Icon, children, action, className = '' }) {
  return (
    <section className={`lx-panel ${className}`}>
      <div className="lx-panel-head">
        <h2>{Icon && <Icon size={18} />}{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function ProgressBar({ value, max = 100, tone = 'green' }) {
  const pct = clamp((Number(value || 0) / max) * 100)
  return (
    <div className={`lx-progress ${tone}`}>
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}

function Dashboard({ data, updateData, setActive }) {
  const log = latestLog(data)
  const computed = log.computed
  const focus = data.settings.focusModule
  const yesterday = getLogs(data).at(-2)

  return (
    <div className="lx-dashboard">
      <section className="lx-grid lx-grid-main">
        <Panel title="Command State" icon={Activity} className="lx-span-2">
          <div className="lx-command">
            <div>
              <p className="lx-kicker">Master level</p>
              <strong className="lx-big">{computed.level || 1}</strong>
              <span>{levelTitle(computed.level || 1, computed.life?.overall || 0)}</span>
            </div>
            <div>
              <p>XP {computed.xpIntoLevel || 0} / {computed.xpForNext || 160}</p>
              <ProgressBar value={computed.xpIntoLevel || 0} max={computed.xpForNext || 160} tone="cyan" />
              <p>Total XP {computed.totalXp || 0} | Today {computed.xpGained || 0}</p>
            </div>
          </div>
        </Panel>

        <Panel title="Profile" icon={User} className="lx-profile-card">
          <PhotoPreview src={log.photos.front || log.photos.back} label="Most recent pic" />
          <div className="lx-profile-lines">
            <strong>Cole Timlin</strong>
            <span>Current Look Rating: {computed.looks?.overall || 0}/10</span>
            <span>Current Life Rating: {computed.life?.overall || 0}/100</span>
            <span>Current Level: {computed.level || 1}</span>
            <span>DOB: {data.owner.dob || 'Set in Settings'}</span>
            <span>Age: {data.owner.dob ? calcAge(data.owner.dob) : 'Set DOB'}</span>
            <span>Bank Account Value: ${Number(log.money.bankBalance || 0).toLocaleString()}</span>
            <span>Occupation(s): {data.owner.occupations.join(', ')}</span>
          </div>
        </Panel>

        <Panel title="Vitals" icon={HeartPulse}>
          <ScoreRows
            rows={[
              ['Today grade', computed.grade?.letter || 'F', computed.grade?.value || 0],
              ['HP', `${computed.hp || 0}/100`, computed.hp || 0],
              ['Dopamine', computed.dopamine?.state || 'Flat', computed.dopamine?.score || 0],
              ['Life rating', `${computed.life?.overall || 0}/100`, computed.life?.overall || 0],
            ]}
          />
        </Panel>

        <Panel title="Today Delta" icon={TrendingUp}>
          <div className="lx-delta-grid">
            <Metric label="Money in" value={`$${Number(log.money.earned || 0)}`} />
            <Metric label="Money out" value={`$${Number(log.money.spent || 0)}`} />
            <Metric label="Gym count" value={computed.gymTotal || data.settings.startingGymSessions} />
            <Metric label="Yesterday" value={yesterday ? `${metricValue(log, 'lifeRating') - metricValue(yesterday, 'lifeRating')} life` : 'No prior'} />
          </div>
        </Panel>

        <Panel title="Wins / Weakness" icon={Target}>
          <div className="lx-note-stack">
            <strong>Biggest win today</strong>
            <p>{log.notes.biggestWin || 'Unlogged'}</p>
            <strong>Biggest weakness today</strong>
            <p>{log.notes.biggestWeakness || log.notes.biggestFail || 'Unlogged'}</p>
          </div>
        </Panel>

        <Panel title="Focus Module" icon={Focus} className="lx-span-2">
          <div className="lx-focus-switch">
            {['stats', 'graphs', 'looks', 'quests'].map((item) => (
              <button
                key={item}
                className={focus === item ? 'is-active' : ''}
                onClick={() => updateData((draft) => {
                  draft.settings.focusModule = item
                  return draft
                })}
              >
                {item}
              </button>
            ))}
          </div>
          <FocusModule focus={focus} data={data} setActive={setActive} />
        </Panel>

        <Panel title="Stat Trees" icon={Sparkles} className="lx-span-2">
          <StatTreeGrid data={data} compact />
        </Panel>
      </section>
    </div>
  )
}

function FocusModule({ focus, data, setActive }) {
  if (focus === 'photos') {
    return null
  }
  if (focus === 'looks') {
    const log = latestLog(data)
    return (
      <button className="lx-focus-module" onClick={() => setActive('stats')}>
        <PhotoPreview src={log.photos.front || log.photos.back} label="Latest daily photo" />
        <span>Open looks analysis, image history, and comparisons</span>
      </button>
    )
  }
  if (focus === 'quests') {
    return <QuestList data={data} limit={4} />
  }
  if (focus === 'graphs') {
    return <MiniGraph logs={getLogs(data).slice(-14)} metric="lifeRating" />
  }
  return <StatTreeGrid data={data} compact />
}

function ScoreRows({ rows }) {
  return (
    <div className="lx-score-rows">
      {rows.map(([label, value, score]) => (
        <div key={label}>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          <ProgressBar value={score} tone={score > 70 ? 'green' : score > 45 ? 'yellow' : 'red'} />
        </div>
      ))}
    </div>
  )
}

function PhotoPreview({ src, label }) {
  return src ? (
    <img className="lx-photo-preview" src={src} alt={label} />
  ) : (
    <div className="lx-photo-empty">
      <Camera size={24} />
      <span>{label}</span>
    </div>
  )
}

function PhotoAnalysisCard({ src, label, analysis, scores }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lx-photo-analysis-card">
      <PhotoPreview src={src} label={label} />
      {analysis && (
        <button className="lx-analysis-hotspot" onClick={() => setOpen(true)} aria-label={`Open ${label} analysis`}>
          <Brain size={16} />
        </button>
      )}
      {open && (
        <AnalysisModal
          title={`${label} analysis`}
          analysis={analysis}
          scores={scores}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

function AnalysisModal({ title, analysis, scores, onClose }) {
  const reasons = buildLooksReasons(analysis, scores)
  return (
    <div className="lx-modal-backdrop" role="dialog" aria-modal="true">
      <div className="lx-modal">
        <div className="lx-modal-head">
          <div>
            <p className="lx-kicker">Algorithmic looks readout</p>
            <h2>{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close analysis"><X size={18} /></button>
        </div>
        <p className="lx-formula">Final Looks Score = Face 70% + Body 20% + Presence 10%. The photo analysis below feeds those subfactors; scores are read-only.</p>
        <div className="lx-reason-grid">
          {reasons.map((item) => (
            <div key={item.title} className="lx-reason">
              <strong>{item.title}</strong>
              <span>{item.score}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DailyLog({ data, updateData, saveState }) {
  const [date, setDate] = useState(todayKey())
  const [manualSave, setManualSave] = useState('')
  const log = data.dailyLogs[date] || baseDailyLog(date)

  const updateLog = (path, value) => {
    updateData((draft) => {
      if (!draft.dailyLogs[date]) draft.dailyLogs[date] = baseDailyLog(date)
      setPath(draft.dailyLogs[date], path, value)
      draft.dailyLogs[date].updates.push({ at: new Date().toISOString(), path, value })
      draft.dailyLogs[date].savedAt = new Date().toISOString()
      return draft
    })
  }

  const saveDay = () => {
    updateData((draft) => {
      if (!draft.dailyLogs[date]) draft.dailyLogs[date] = baseDailyLog(date)
      draft.dailyLogs[date].savedAt = new Date().toISOString()
      return draft
    })
    setManualSave(`Saved ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)
  }

  return (
    <div className="lx-stack">
      <div className="lx-datebar">
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <button className="lx-primary" onClick={saveDay}>
          <Save size={16} /> Save day
        </button>
        <button
          onClick={() => updateData((draft) => {
            if (!draft.dailyLogs[date]) draft.dailyLogs[date] = baseDailyLog(date)
            draft.dailyLogs[date].finalized = !draft.dailyLogs[date].finalized
            draft.dailyLogs[date].savedAt = new Date().toISOString()
            return draft
          })}
        >
          <Save size={16} /> {log.finalized ? 'Reopen summary' : 'Finalize daily summary'}
        </button>
        <span className={`lx-save-state ${saveState?.status || 'saved'}`}>{manualSave || saveState?.message || 'Autosaved'}</span>
      </div>
      <div className="lx-form-grid">
        <FormSection title="Health">
          <NumberInput label="Weight" value={log.health.weight} onChange={(v) => updateLog('health.weight', v)} />
          <NumberInput label="Sleep duration" value={log.health.sleepDuration} onChange={(v) => updateLog('health.sleepDuration', v)} />
          <Slider label="Sleep quality" value={log.health.sleepQuality} onChange={(v) => updateLog('health.sleepQuality', v)} />
          <TextInput label="Wake time" type="time" value={log.health.wakeTime} onChange={(v) => updateLog('health.wakeTime', v)} />
          <TextInput label="Bedtime" type="time" value={log.health.bedtime} onChange={(v) => updateLog('health.bedtime', v)} />
          <NumberInput label="Protein" value={log.health.protein} onChange={(v) => updateLog('health.protein', v)} />
          <NumberInput label="Water oz" value={log.health.water} onChange={(v) => updateLog('health.water', v)} />
          <NumberInput label="Steps" value={log.health.steps} onChange={(v) => updateLog('health.steps', v)} />
          <Check label="Cardio" checked={log.health.cardio} onChange={(v) => updateLog('health.cardio', v)} />
          <Check label="Exercise" checked={log.health.exercise} onChange={(v) => updateLog('health.exercise', v)} />
          <NumberInput label="Gym sessions added" value={log.health.gymSessionsAdded} onChange={(v) => updateLog('health.gymSessionsAdded', v)} />
          <Check label="Creatine" checked={log.health.creatine} onChange={(v) => updateLog('health.creatine', v)} />
          <Check label="Calories tracked" checked={log.health.caloriesTracked} onChange={(v) => updateLog('health.caloriesTracked', v)} />
          <NumberInput label="Calories tracked" value={log.health.calories} onChange={(v) => updateLog('health.calories', v)} />
          <Slider label="Stress" value={log.health.stress} onChange={(v) => updateLog('health.stress', v)} />
          <Slider label="Mood" value={log.health.mood} onChange={(v) => updateLog('health.mood', v)} />
          <Slider label="Overthinking" value={log.health.overthinking} onChange={(v) => updateLog('health.overthinking', v)} />
          <Check label="Nicotine" checked={log.health.nicotine} onChange={(v) => updateLog('health.nicotine', v)} />
          <Check label="Alcohol / weed" checked={log.health.alcoholWeed} onChange={(v) => updateLog('health.alcoholWeed', v)} />
          <Check label="Illness / injury" checked={log.health.illnessInjury} onChange={(v) => updateLog('health.illnessInjury', v)} />
        </FormSection>

        <FormSection title="Looks">
          <NumberInput label="Brushed teeth count" value={log.looks.brushedTeeth} onChange={(v) => updateLog('looks.brushedTeeth', v)} />
          <Check label="Removed contacts in morning" checked={log.looks.removedContactsMorning} onChange={(v) => updateLog('looks.removedContactsMorning', v)} />
          <Check label="Wore retainer last night" checked={log.looks.woreRetainerLastNight} onChange={(v) => updateLog('looks.woreRetainerLastNight', v)} />
          <Check label="Cleaned retainer" checked={log.looks.cleanedRetainer} onChange={(v) => updateLog('looks.cleanedRetainer', v)} />
          <Check label="Skincare" checked={log.looks.skincare} onChange={(v) => updateLog('looks.skincare', v)} />
          <Check label="Hair styling" checked={log.looks.hairStyling} onChange={(v) => updateLog('looks.hairStyling', v)} />
          <Check label="Shaving / grooming" checked={log.looks.shavingGrooming} onChange={(v) => updateLog('looks.shavingGrooming', v)} />
          <Check label="Haircut" checked={log.looks.haircut} onChange={(v) => updateLog('looks.haircut', v)} />
        </FormSection>

        <FormSection title="Discipline">
          <Check label="NoFap clean" checked={log.discipline.noFapClean} onChange={(v) => updateLog('discipline.noFapClean', v)} />
          <Check label="Porn relapse" checked={log.discipline.porn} onChange={(v) => updateLog('discipline.porn', v)} />
          <Check label="Masturbation relapse" checked={log.discipline.masturbation} onChange={(v) => updateLog('discipline.masturbation', v)} />
          <Check label="Budgeting" checked={log.discipline.budgeting} onChange={(v) => updateLog('discipline.budgeting', v)} />
          <Check label="No-spend day" checked={log.discipline.noSpendDay} onChange={(v) => updateLog('discipline.noSpendDay', v)} />
          <Check label="Journaling" checked={log.discipline.journaling} onChange={(v) => updateLog('discipline.journaling', v)} />
        </FormSection>

        <FormSection title="Money">
          <NumberInput label="Earned" value={log.money.earned} onChange={(v) => updateLog('money.earned', v)} />
          <TextInput label="Made from" value={log.money.earnedFrom} onChange={(v) => updateLog('money.earnedFrom', v)} />
          <NumberInput label="Spent" value={log.money.spent} onChange={(v) => updateLog('money.spent', v)} />
          <TextInput label="Spent on" value={log.money.spentOn} onChange={(v) => updateLog('money.spentOn', v)} />
          <Select label="Spend category" value={log.money.spentCategory} options={['invested', 'personal', 'wasted']} onChange={(v) => updateLog('money.spentCategory', v)} />
          <NumberInput label="Saved" value={log.money.saved} onChange={(v) => updateLog('money.saved', v)} />
          <NumberInput label="Invested" value={log.money.invested} onChange={(v) => updateLog('money.invested', v)} />
          <NumberInput label="Wasted" value={log.money.wasted} onChange={(v) => updateLog('money.wasted', v)} />
          <NumberInput label="Bank balance" value={log.money.bankBalance} onChange={(v) => updateLog('money.bankBalance', v)} />
          <NumberInput label="Net worth" value={log.money.netWorth} onChange={(v) => updateLog('money.netWorth', v)} />
          <Slider label="Budget adherence" value={log.money.budgetAdherence} onChange={(v) => updateLog('money.budgetAdherence', v)} />
        </FormSection>

        <FormSection title="Productivity">
          <NumberInput label="Screen time" value={log.productivity.screenTime} onChange={(v) => updateLog('productivity.screenTime', v)} />
          <NumberInput label="Scrolling hours" value={log.productivity.scrolling} onChange={(v) => updateLog('productivity.scrolling', v)} />
          <Check label="Music overstimulation" checked={log.productivity.musicOverstimulation} onChange={(v) => updateLog('productivity.musicOverstimulation', v)} />
          <NumberInput label="Deep work hours" value={log.productivity.deepWorkHours} onChange={(v) => updateLog('productivity.deepWorkHours', v)} />
          <Check label="Skills worked on" checked={log.productivity.skillsWorked} onChange={(v) => updateLog('productivity.skillsWorked', v)} />
          <MultiCheck label="Skills" values={log.productivity.skills} options={skillOptions} onChange={(v) => updateLog('productivity.skills', v)} />
          <Slider label="Skill quality" value={log.productivity.skillQuality} onChange={(v) => updateLog('productivity.skillQuality', v)} />
          <TextArea label="Skill notes" value={log.productivity.skillNotes} onChange={(v) => updateLog('productivity.skillNotes', v)} />
          <Check label="Added to portfolio" checked={log.productivity.portfolioAdded} onChange={(v) => updateLog('productivity.portfolioAdded', v)} />
          <TextInput label="Portfolio project" value={log.productivity.portfolioProject} onChange={(v) => updateLog('productivity.portfolioProject', v)} />
        </FormSection>

        <FormSection title="Social / Life">
          <Check label="Went out" checked={log.social.wentOut} onChange={(v) => updateLog('social.wentOut', v)} />
          <TextInput label="Who with" value={log.social.whoWith} onChange={(v) => updateLog('social.whoWith', v)} />
          <TextInput label="Where" value={log.social.where} onChange={(v) => updateLog('social.where', v)} />
          <TextInput label="What you did" value={log.social.what} onChange={(v) => updateLog('social.what', v)} />
          <Check label="Substances involved" checked={log.social.substances} onChange={(v) => updateLog('social.substances', v)} />
          <Slider label="How good it was" value={log.social.quality} onChange={(v) => updateLog('social.quality', v)} />
          <NumberInput label="Money spent socially" value={log.social.moneySpent} onChange={(v) => updateLog('social.moneySpent', v)} />
          <Slider label="Social energy after" value={log.social.energyAfter} onChange={(v) => updateLog('social.energyAfter', v)} />
          <Check label="Friends time" checked={log.social.friendsTime} onChange={(v) => updateLog('social.friendsTime', v)} />
          <Check label="Family time" checked={log.social.familyTime} onChange={(v) => updateLog('social.familyTime', v)} />
          <Check label="Networking" checked={log.social.networking} onChange={(v) => updateLog('social.networking', v)} />
          <Check label="Girlfriend time" checked={log.social.girlfriendTime} onChange={(v) => updateLog('social.girlfriendTime', v)} />
        </FormSection>

        <FormSection title="Environment">
          <Check label="Room cleaned" checked={log.discipline.roomCleaned} onChange={(v) => updateLog('discipline.roomCleaned', v)} />
        </FormSection>

        <FormSection title="Notes">
          <TextArea label="Biggest win" value={log.notes.biggestWin} onChange={(v) => updateLog('notes.biggestWin', v)} />
          <TextArea label="Biggest fail" value={log.notes.biggestFail} onChange={(v) => updateLog('notes.biggestFail', v)} />
          <TextArea label="Biggest weakness" value={log.notes.biggestWeakness} onChange={(v) => updateLog('notes.biggestWeakness', v)} />
          <TextArea label="Daily notes" value={log.notes.dailyNotes} onChange={(v) => updateLog('notes.dailyNotes', v)} />
        </FormSection>
      </div>
    </div>
  )
}

function FormSection({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <section className={`lx-form-section ${open ? 'is-open' : ''}`}>
      <button className="lx-log-toggle" onClick={() => setOpen((current) => !current)}>
        <span>{title}</span>
        <strong>{open ? 'Close' : '+ Log'}</strong>
      </button>
      {open && <div>{children}</div>}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="lx-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function TextInput({ label, value, onChange, type = 'text' }) {
  return (
    <Field label={label}>
      <input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

function NumberInput({ label, value, onChange }) {
  return <TextInput label={label} type="number" value={value} onChange={onChange} />
}

function TextArea({ label, value, onChange }) {
  return (
    <Field label={label}>
      <textarea value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

function Slider({ label, value, onChange, max = 10 }) {
  return (
    <Field label={`${label}: ${value || 0}`}>
      <input type="range" min="1" max={max} value={value || 1} onChange={(event) => onChange(Number(event.target.value))} />
    </Field>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </Field>
  )
}

function Check({ label, checked, onChange }) {
  return (
    <label className="lx-check">
      <input type="checkbox" checked={!!checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

function MultiCheck({ label, values = [], options, onChange }) {
  return (
    <div className="lx-multi">
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <Check
            key={option}
            label={option}
            checked={values.includes(option)}
            onChange={(checked) =>
              onChange(checked ? [...values, option] : values.filter((item) => item !== option))
            }
          />
        ))}
      </div>
    </div>
  )
}

function LooksStudio({ data, updateData }) {
  const [date, setDate] = useState(todayKey())
  const [compareA, setCompareA] = useState(getLogs(data).at(-2)?.date || SYSTEM_START_DATE)
  const [compareB, setCompareB] = useState(latestLog(data).date)
  const log = data.dailyLogs[date] || baseDailyLog(date)
  const dates = Object.keys(data.dailyLogs).sort()

  const savePhoto = async (side, file) => {
    if (!file) return
    const [dataUrl, analysis] = await Promise.all([
      readFileAsDataUrl(file),
      analyzeLooksPhoto(file, side),
    ])
      updateData((draft) => {
        if (!draft.dailyLogs[date]) draft.dailyLogs[date] = baseDailyLog(date)
        draft.dailyLogs[date].photos[side] = dataUrl
        draft.dailyLogs[date].looks.looksBreakdown = mergePhotoAnalysis(
          draft.dailyLogs[date].looks.looksBreakdown,
          analysis.breakdown,
          side
        )
        draft.dailyLogs[date].looks.autoLooksAnalysis = {
          ...(draft.dailyLogs[date].looks.autoLooksAnalysis || {}),
          [side]: analysis,
          updatedAt: new Date().toISOString(),
        }
        return draft
      })
  }

  return (
    <div className="lx-stack">
      <div className="lx-datebar">
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <span>Looks analysis and image history</span>
      </div>
      <div className="lx-photo-upload-grid">
        {['front', 'back'].map((side) => (
          <Panel key={side} title={`${side} photo`} icon={Camera}>
            <PhotoAnalysisCard
              src={log.photos[side]}
              label={`${side} photo`}
              analysis={log.looks.autoLooksAnalysis?.[side]}
              scores={log.computed.looks}
            />
            <label className="lx-upload">
              <Upload size={16} />
              Upload {side}
              <input type="file" accept="image/*" onChange={(event) => savePhoto(side, event.target.files?.[0])} />
            </label>
          </Panel>
        ))}
      <Panel title="Looks Breakdown" icon={Sparkles}>
        <LooksBreakdown log={log} updateData={updateData} date={date} />
      </Panel>
      </div>
      <Panel title="Compare Days" icon={GalleryHorizontal}>
        <div className="lx-compare-controls">
          <Select label="First day" value={compareA} options={dates} onChange={setCompareA} />
          <Select label="Second day" value={compareB} options={dates} onChange={setCompareB} />
        </div>
        <div className="lx-compare-grid">
          {[compareA, compareB].map((day) => (
            <div key={day}>
              <strong>{day}</strong>
              <PhotoPreview src={data.dailyLogs[day]?.photos.front || data.dailyLogs[day]?.photos.back} label="No photo" />
              <span>Looks {data.dailyLogs[day]?.computed.looks?.overall || 0}/10</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Historical Gallery" icon={GalleryHorizontal}>
        <div className="lx-gallery">
          {getLogs(data).map((item) => (
            <button key={item.date} onClick={() => setDate(item.date)}>
              <PhotoPreview src={item.photos.front || item.photos.back} label="No photo" />
              <span>{item.date}</span>
              <small>{item.computed.looks?.overall || 0}/10</small>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function LooksBreakdown({ log, updateData, date }) {
  const [open, setOpen] = useState('face')
  const scores = log.computed.looks || calculateLooksScore(log.looks.looksBreakdown)
  const sections = [
    ['face', log.looks.looksBreakdown.face],
    ['body', log.looks.looksBreakdown.body],
    ['presence', log.looks.looksBreakdown.presence],
  ]

  return (
    <div className="lx-looks">
      <Metric label="Looks Score" value={`${scores.overall}/10 (${scores.display100}/100)`} />
      <p>{looksBand(scores.overall)}</p>
      <p className="lx-formula">Auto-generated from uploaded photos. Looks scoring is read-only so history stays algorithmic and comparable.</p>
      {log.looks.autoLooksAnalysis && <AutoLooksSignals analysis={log.looks.autoLooksAnalysis} />}
      <p className="lx-formula">Looks Score = (Face x 0.70) + (Body x 0.20) + (Presence x 0.10)</p>
      {sections.map(([section, values]) => (
        <div className="lx-breakdown" key={section}>
          <button onClick={() => setOpen(open === section ? '' : section)}>
            <span>{section} ({scores[section] || 0})</span>
            <ChevronDown size={16} />
          </button>
          {open === section && (
            <div className="lx-readonly-scores">
              {Object.entries(values).map(([key, value]) => (
                <div key={key}>
                  <span>{humanize(key)}</span>
                  <strong>{round(value)}/10</strong>
                  <ProgressBar value={Number(value) * 10} tone={Number(value) >= 7 ? 'green' : Number(value) >= 5.5 ? 'yellow' : 'red'} />
                  <small>{subfactorReason(section, key, value, log.looks.autoLooksAnalysis)}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function AutoLooksSignals({ analysis }) {
  const latest = analysis.front || analysis.back
  if (!latest) return null
  const signals = latest.signals || {}
  return (
    <div className="lx-auto-signals">
      {Object.entries(signals).map(([key, value]) => (
        <Metric key={key} label={humanize(key)} value={`${Math.round(value)}/100`} />
      ))}
    </div>
  )
}

function buildLooksReasons(analysis, scores) {
  const signals = analysis?.signals || {}
  return [
    {
      title: 'Symmetry',
      score: `${Math.round(signals.symmetry || 0)}/100`,
      text: signalText(signals.symmetry, 'Left/right balance reads clean and stable.', 'The image shows some left/right imbalance, which pulls down face harmony and posture signals.'),
    },
    {
      title: 'Bone Structure / Frame',
      score: `${scores?.face || 0} face / ${scores?.body || 0} body`,
      text: signalText(signals.silhouette, 'Silhouette and structure read strong in-frame.', 'Frame definition is less clear in this photo, so body and structure scores stay conservative.'),
    },
    {
      title: 'Harmony / Ratios',
      score: `${Math.round(blendScores([signals.symmetry || 0, 0.5], [signals.framing || 0, 0.5]))}/100`,
      text: signalText(signals.framing, 'Composition gives the algorithm enough centered information to read proportions.', 'Framing is limiting the ratio read; a centered, consistent progress shot will score more reliably.'),
    },
    {
      title: 'Feature Read',
      score: `${Math.round(blendScores([signals.clarity || 0, 0.6], [signals.contrast || 0, 0.4]))}/100`,
      text: signalText(signals.clarity, 'Feature edges are readable, which supports eyes, brows, hair, smile, and grooming estimates.', 'Low detail or blur makes individual feature scoring less confident.'),
    },
    {
      title: 'Skin / Health',
      score: `${Math.round(blendScores([signals.skinSignal || 0, 0.38], [signals.colorHealth || 0, 0.34], [signals.exposure || 0, 0.28]))}/100`,
      text: signalText(signals.colorHealth, 'Color balance and exposure are helping the skin/health read.', 'Lighting or color balance is making skin and stress-signal estimates more conservative.'),
    },
    {
      title: 'Presence',
      score: `${scores?.presence || 0}/10`,
      text: signalText(blendScores([signals.exposure || 0, 0.3], [signals.contrast || 0, 0.3], [signals.framing || 0, 0.4]), 'Grooming, style, and energy signals read composed.', 'Presence is being held back by lighting, framing, or visual clarity.'),
    },
  ]
}

function signalText(value = 0, strong, weak) {
  if (value >= 68) return strong
  if (value >= 48) return 'Neutral read: usable signal, but not dominant enough to push the score aggressively.'
  return weak
}

function subfactorReason(section, key, value, analysis) {
  const signals = analysis?.front?.signals || analysis?.back?.signals || {}
  const score = Number(value)
  const level = score >= 7 ? 'strong' : score >= 5.5 ? 'stable' : 'limited'
  const signalMap = {
    symmetry: 'left/right balance',
    boneStructure: 'silhouette and contrast',
    harmony: 'framing and proportional balance',
    eyes: 'clarity and exposure',
    nose: 'central symmetry and clarity',
    lips: 'color balance and feature clarity',
    brows: 'edge clarity and contrast',
    teethSmile: 'exposure and facial detail',
    hairlineHair: 'contrast, framing, and sharpness',
    ears: 'side balance and framing',
    skinClarity: 'skin-color consistency and clarity',
    eyeBrightness: 'exposure and clarity',
    facialFat: 'silhouette and facial balance',
    agingQuality: 'skin signal, clarity, and color health',
    stressSigns: 'overall facial health signals',
    frame: 'silhouette width and balance',
    muscle: 'silhouette, contrast, and visible definition',
    leanness: 'silhouette and contrast',
    posture: 'vertical balance and framing',
    grooming: 'clarity, color health, and contrast',
    style: 'contrast and composition',
    confidence: 'framing, posture, and balance',
    energy: 'exposure, color, and detail',
  }
  const confidence = Math.round(blendScores([signals.clarity || 0, 0.45], [signals.exposure || 0, 0.35], [signals.framing || 0, 0.2]))
  return `${humanize(key)} is ${level}; driven mainly by ${signalMap[key] || section}. Photo confidence ${confidence}/100.`
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function analyzeLooksPhoto(file, side) {
  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  const width = 180
  const height = Math.max(180, Math.round((image.height / image.width) * width))
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0, width, height)
  const { data } = ctx.getImageData(0, 0, width, height)
  const signals = extractImageSignals(data, width, height)
  const breakdown = side === 'back' ? bodyPresenceBreakdown(signals) : faceBodyPresenceBreakdown(signals)
  return {
    side,
    fileName: file.name,
    analyzedAt: new Date().toISOString(),
    signals,
    breakdown,
  }
}

function extractImageSignals(data, width, height) {
  let brightness = 0
  let saturation = 0
  let warmBalance = 0
  let contrastSum = 0
  let edgeSum = 0
  let skinLike = 0
  let visiblePixels = 0
  const leftBins = new Array(24).fill(0)
  const rightBins = new Array(24).fill(0)
  const centerBins = new Array(24).fill(0)

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const sat = max === 0 ? 0 : (max - min) / max
      const rightIndex = (y * width + (width - x - 1)) * 4
      const mirrorLum = 0.2126 * data[rightIndex] + 0.7152 * data[rightIndex + 1] + 0.0722 * data[rightIndex + 2]
      const nextLum = data[i + 4] * 0.2126 + data[i + 5] * 0.7152 + data[i + 6] * 0.0722
      const down = i + width * 4
      const downLum = data[down] * 0.2126 + data[down + 1] * 0.7152 + data[down + 2] * 0.0722
      const bin = Math.min(23, Math.floor((y / height) * 24))
      const active = lum > 26 && lum < 244

      brightness += lum
      saturation += sat * 100
      warmBalance += clamp((r - b + 65) / 130 * 100)
      contrastSum += Math.abs(lum - mirrorLum)
      edgeSum += Math.abs(lum - nextLum) + Math.abs(lum - downLum)
      skinLike += r > 70 && g > 45 && b > 30 && r > b && max - min > 12 ? 1 : 0
      visiblePixels += active ? 1 : 0
      if (active && x < width * 0.5) leftBins[bin] += 1
      if (active && x >= width * 0.5) rightBins[bin] += 1
      if (active && x > width * 0.28 && x < width * 0.72) centerBins[bin] += 1
    }
  }

  const pixels = (width - 2) * (height - 2)
  const symmetry = 100 - clamp((contrastSum / pixels / 70) * 100)
  const exposure = 100 - clamp((Math.abs(brightness / pixels - 128) / 92) * 100)
  const colorHealth = 100 - clamp(Math.abs(warmBalance / pixels - 54) * 2.2)
  const clarity = clamp((edgeSum / pixels / 18) * 100)
  const skinSignal = clamp((skinLike / pixels) * 700)
  const silhouette = silhouetteScore(leftBins, rightBins, centerBins)
  const framing = clamp((visiblePixels / pixels) * 190)
  const contrast = 100 - clamp(Math.abs(saturation / pixels - 32) * 2.1)

  return {
    symmetry: round(symmetry),
    exposure: round(exposure),
    clarity: round(clarity),
    colorHealth: round(colorHealth),
    skinSignal: round(skinSignal),
    silhouette: round(silhouette),
    framing: round(framing),
    contrast: round(contrast),
  }
}

function silhouetteScore(leftBins, rightBins, centerBins) {
  const pairDiff = leftBins.reduce((sum, left, index) => {
    const right = rightBins[index]
    const total = left + right || 1
    return sum + Math.abs(left - right) / total
  }, 0) / leftBins.length
  const shoulder = centerBins.slice(5, 10).reduce((sum, item) => sum + item, 0)
  const waist = centerBins.slice(11, 16).reduce((sum, item) => sum + item, 0) || 1
  const taper = clamp(((shoulder / waist) - 0.75) * 95)
  return clamp((100 - pairDiff * 90) * 0.55 + taper * 0.45)
}

function toTen(value, floor = 3.8, ceiling = 8.7) {
  return round(floor + (clamp(value) / 100) * (ceiling - floor))
}

function blendScores(...scores) {
  const totalWeight = scores.reduce((sum, [, weight]) => sum + weight, 0)
  return scores.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight
}

function faceBodyPresenceBreakdown(signals) {
  const faceQuality = blendScores(
    [signals.symmetry, 0.24],
    [signals.clarity, 0.18],
    [signals.exposure, 0.18],
    [signals.colorHealth, 0.16],
    [signals.skinSignal, 0.14],
    [signals.contrast, 0.1]
  )
  const featureSignal = blendScores([signals.clarity, 0.42], [signals.symmetry, 0.26], [signals.contrast, 0.18], [signals.exposure, 0.14])
  const skinSignal = blendScores([signals.skinSignal, 0.36], [signals.colorHealth, 0.28], [signals.exposure, 0.2], [signals.clarity, 0.16])
  return {
    face: {
      symmetry: toTen(signals.symmetry, 3.4, 9),
      boneStructure: toTen(blendScores([signals.silhouette, 0.35], [signals.contrast, 0.3], [signals.symmetry, 0.35])),
      harmony: toTen(blendScores([signals.symmetry, 0.45], [signals.framing, 0.28], [signals.exposure, 0.27])),
      eyes: toTen(featureSignal),
      nose: toTen(blendScores([signals.symmetry, 0.5], [signals.clarity, 0.26], [signals.framing, 0.24])),
      lips: toTen(blendScores([signals.colorHealth, 0.34], [signals.clarity, 0.34], [signals.contrast, 0.32])),
      brows: toTen(featureSignal),
      teethSmile: toTen(blendScores([signals.exposure, 0.42], [signals.clarity, 0.34], [signals.colorHealth, 0.24]), 3.2, 8.4),
      hairlineHair: toTen(blendScores([signals.contrast, 0.42], [signals.clarity, 0.34], [signals.framing, 0.24])),
      ears: toTen(blendScores([signals.symmetry, 0.55], [signals.framing, 0.45]), 3.6, 8.2),
      skinClarity: toTen(skinSignal),
      eyeBrightness: toTen(blendScores([signals.exposure, 0.5], [signals.clarity, 0.32], [signals.colorHealth, 0.18])),
      facialFat: toTen(blendScores([signals.silhouette, 0.45], [signals.symmetry, 0.34], [signals.framing, 0.21])),
      agingQuality: toTen(blendScores([signals.skinSignal, 0.3], [signals.clarity, 0.25], [signals.colorHealth, 0.25], [signals.exposure, 0.2])),
      stressSigns: toTen(faceQuality),
    },
    body: bodyPresenceBreakdown(signals).body,
    presence: bodyPresenceBreakdown(signals).presence,
  }
}

function bodyPresenceBreakdown(signals) {
  return {
    body: {
      frame: toTen(blendScores([signals.silhouette, 0.56], [signals.framing, 0.24], [signals.symmetry, 0.2])),
      muscle: toTen(blendScores([signals.silhouette, 0.36], [signals.contrast, 0.3], [signals.clarity, 0.2], [signals.framing, 0.14])),
      leanness: toTen(blendScores([signals.silhouette, 0.42], [signals.clarity, 0.24], [signals.contrast, 0.2], [signals.exposure, 0.14])),
      posture: toTen(blendScores([signals.symmetry, 0.45], [signals.framing, 0.3], [signals.silhouette, 0.25])),
    },
    presence: {
      grooming: toTen(blendScores([signals.clarity, 0.34], [signals.colorHealth, 0.26], [signals.contrast, 0.22], [signals.exposure, 0.18])),
      style: toTen(blendScores([signals.contrast, 0.36], [signals.framing, 0.3], [signals.colorHealth, 0.18], [signals.clarity, 0.16])),
      confidence: toTen(blendScores([signals.framing, 0.34], [signals.symmetry, 0.3], [signals.silhouette, 0.22], [signals.exposure, 0.14])),
      energy: toTen(blendScores([signals.exposure, 0.32], [signals.colorHealth, 0.3], [signals.clarity, 0.22], [signals.contrast, 0.16])),
    },
  }
}

function mergePhotoAnalysis(current, nextBreakdown, side) {
  const merged = structuredClone(current || emptyLooks)
  const weight = side === 'back' ? 0.55 : 0.72
  Object.entries(nextBreakdown).forEach(([section, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      const existing = Number(merged[section]?.[key] || 5)
      merged[section][key] = round(existing * (1 - weight) + Number(value) * weight)
    })
  })
  return merged
}

function Stats({ data, updateData }) {
  const log = latestLog(data)
  return (
    <div className="lx-stack">
      <div className="lx-grid">
        <Panel title="Objective Ratings" icon={Activity}>
          <ScoreRows
            rows={[
              ['Life', `${log.computed.life?.overall || 0}/100`, log.computed.life?.overall || 0],
              ['Looks', `${log.computed.looks?.overall || 0}/10`, (log.computed.looks?.overall || 0) * 10],
              ['HP', `${log.computed.hp || 0}/100`, log.computed.hp || 0],
              ['Dopamine', log.computed.dopamine?.state || 'Flat', log.computed.dopamine?.score || 0],
            ]}
          />
        </Panel>
        <Panel title="Life Rating Formula" icon={Brain}>
          <div className="lx-category-grid">
            {Object.entries(log.computed.life?.categories || {}).map(([key, value]) => (
              <Metric key={key} label={humanize(key)} value={`${value}/100`} />
            ))}
          </div>
          <p className="lx-formula">Life Rating = even average of discipline, money, looks, health, productivity, social life, and skill growth.</p>
        </Panel>
        <Panel title="HP Formula" icon={HeartPulse}>
          <p>HP recalculates from sleep, nutrition, hydration, exercise, recovery, stress, substances, illness, and injury. It is not used as punishment XP.</p>
        </Panel>
        <Panel title="Dopamine Formula" icon={Brain}>
          <p>Dopamine baseline blends historical score with screen time, porn, masturbation, nicotine, sleep, music overstimulation, scrolling, deep work, exercise, stress, alcohol / weed, and journaling.</p>
        </Panel>
      </div>
      <Panel title="Stat Trees" icon={Sparkles}>
        <StatTreeGrid data={data} />
      </Panel>
      <LooksStudio data={data} updateData={updateData} />
    </div>
  )
}

function StatTreeGrid({ data, compact = false }) {
  const logs = getLogs(data)
  const latest = logs.at(-1)
  return (
    <div className={`lx-tree-grid ${compact ? 'compact' : ''}`}>
      {Object.entries(statTrees).map(([tree, substats]) => {
        const xp = logs.reduce((sum, log) => sum + statTreeXp(tree, log), 0)
        const level = levelFromXp(xp)
        return (
          <div className="lx-tree" key={tree}>
            <div>
              <strong>{humanize(tree)}</strong>
              <span>Lv {level.level}</span>
            </div>
            <ProgressBar value={level.xpIntoLevel} max={level.xpForNext} tone="cyan" />
            {!compact && <p>{substats.join(' / ')}</p>}
            {!compact && <small>Current signal: {statTreeXp(tree, latest || baseDailyLog())} XP today</small>}
          </div>
        )
      })}
    </div>
  )
}

function statTreeXp(tree, log) {
  const c = log.computed || {}
  const p = log.productivity
  const h = log.health
  const d = log.discipline
  const s = log.social
  const m = log.money
  const map = {
    physique: (h.gymSessionsAdded > 0 ? 45 : 0) + scoreRange(h.steps, 0, 10000) / 4 + boolScore(h.creatine, 12, 0),
    looks: (c.looks?.overall || 5) * 5 + boolScore(log.looks.skincare, 12, 0) + boolScore(log.looks.shavingGrooming, 8, 0),
    discipline: (c.grade?.value || 0) / 2 + boolScore(d.noFapClean, 20, -30) + boolScore(d.roomCleaned, 10, 0),
    wealth: scoreRange(m.earned, 0, 250) / 2 + scoreRange(m.saved, 0, 150) / 3 + scoreRange(m.invested, 0, 150) / 3,
    social: boolScore(s.wentOut, 30, 0) + boolScore(s.networking, 20, 0) + scoreRange(s.quality, 1, 10) / 2,
    creativity: p.skills.includes('editing') || p.skills.includes('photography') || p.skills.includes('graphic design') || p.skills.includes('content creation') ? 55 : 0,
    tradingBusiness: p.skills.includes('trading') || p.skills.includes('marketing') || p.skills.includes('sales / outreach') ? 55 : 0,
    mindFocus: scoreRange(p.deepWorkHours, 0, 5) / 2 + (c.dopamine?.score || 0) / 5 + boolScore(d.journaling, 12, 0),
  }
  return Math.round(map[tree] || 0)
}

function Graphs({ data, updateData }) {
  const range = data.settings.graphRange
  const metric = data.settings.graphMetric
  const logs = getLogs(data)
  const visible = range === 'all' ? logs : logs.slice(-Number(range))
  const metrics = [
    'weight',
    'bankBalance',
    'lifeRating',
    'looksRating',
    'hp',
    'dopamine',
    'screenTime',
    'sleepDuration',
    'calories',
    'protein',
    'moneyEarned',
    'moneySpent',
    'moneySaved',
    'gymTotal',
    'dailyGrade',
    'level',
  ]
  return (
    <div className="lx-stack">
      <Panel title="Graph Control" icon={BarChart3}>
        <div className="lx-graph-controls">
          <Select
            label="Metric"
            value={metric}
            options={metrics}
            onChange={(value) => updateData((draft) => {
              draft.settings.graphMetric = value
              return draft
            })}
          />
          <Select
            label="Range"
            value={range}
            options={['7', '30', '90', '365', 'all']}
            onChange={(value) => updateData((draft) => {
              draft.settings.graphRange = value
              return draft
            })}
          />
          <Check
            label="Dopamine overlays"
            checked={data.settings.graphOverlay}
            onChange={(value) => updateData((draft) => {
              draft.settings.graphOverlay = value
              return draft
            })}
          />
        </div>
      </Panel>
      <Panel title={graphTitle(metric)} icon={TrendingUp}>
        <BigGraph logs={visible} metric={metric} overlay={data.settings.graphOverlay && metric === 'dopamine'} />
      </Panel>
    </div>
  )
}

function MiniGraph({ logs, metric }) {
  return <BigGraph logs={logs} metric={metric} mini />
}

function BigGraph({ logs, metric, overlay = false, mini = false }) {
  const width = 900
  const height = mini ? 180 : 360
  const values = logs.map((log) => metricValue(log, metric))
  const max = metric === 'dopamine' ? 100 : Math.max(...values, 10)
  const min = metric === 'dopamine' ? 0 : Math.min(...values, 0)
  const range = max - min || 1
  const chartType = graphChartType(metric)
  const points = values
    .map((value, index) => {
      const x = logs.length <= 1 ? 0 : (index / (logs.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 28) - 14
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="lx-graph">
      <div className="lx-graph-meta">
        <span>{graphAxisLabel(metric)}</span>
        <div className="lx-legend">
          <span><i className="trend" /> {humanize(metric)}</span>
          {overlay && <span><i className="relapse" /> relapse marker</span>}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metric} graph`}>
        <defs>
          <linearGradient id={`lx-line-${metric}`} x1="0" x2="1">
            <stop stopColor="#72f7d1" />
            <stop offset="1" stopColor="#f6d35e" />
          </linearGradient>
        </defs>
        {metric === 'dopamine'
          ? dopamineStates.map((state, index) => {
              const y = height - (index / (dopamineStates.length - 1)) * (height - 28) - 14
              return (
                <g key={state}>
                  <line x1="112" x2={width} y1={y} y2={y} />
                  <text x="8" y={y + 4}>{state}</text>
                </g>
              )
            })
          : [0, 1, 2, 3].map((line) => (
              <g key={line}>
                <line x1="0" x2={width} y1={(height / 4) * line + 8} y2={(height / 4) * line + 8} />
                <text x="8" y={(height / 4) * line + 20}>{round(max - (range / 4) * line)}</text>
              </g>
            ))}
        {chartType === 'bar' ? (
          values.map((value, index) => {
            const barWidth = Math.max(8, width / Math.max(values.length, 1) - 8)
            const x = logs.length <= 1 ? width / 2 - barWidth / 2 : (index / logs.length) * width + 4
            const barHeight = ((value - min) / range) * (height - 32)
            return (
              <rect key={logs[index]?.date || index} x={x} y={height - barHeight - 14} width={barWidth} height={barHeight} rx="3">
                <title>{`${logs[index]?.date}: ${value} ${graphUnit(metric)}`}</title>
              </rect>
            )
          })
        ) : (
          <>
            {chartType === 'area' && <polygon points={`0,${height - 14} ${points} ${width},${height - 14}`} fill="rgba(114,247,209,0.12)" />}
            <polyline points={points} fill="none" stroke={`url(#lx-line-${metric})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {values.map((value, index) => {
              const x = logs.length <= 1 ? 0 : (index / (logs.length - 1)) * width
              const y = height - ((value - min) / range) * (height - 28) - 14
              return (
                <circle key={logs[index]?.date || index} cx={x} cy={y} r={mini ? 3 : 5}>
                  <title>{`${logs[index]?.date}: ${metric === 'dopamine' ? dopamineStates[Math.min(9, Math.floor(value / 10))] : value} ${graphUnit(metric)}`}</title>
                </circle>
              )
            })}
          </>
        )}
        {logs.map((log, index) => {
          if (!overlay || (!log.discipline.porn && !log.discipline.masturbation)) return null
          const x = logs.length <= 1 ? 0 : (index / (logs.length - 1)) * width
          return <circle key={log.date} cx={x} cy={24} r="7" fill="#ff4d5e" />
        })}
      </svg>
      <div className="lx-graph-labels">
        <span>{logs[0]?.date || 'No data'}</span>
        {metric === 'dopamine' ? <strong>Brain fried to Fresh mind</strong> : <strong>{round(min)} - {round(max)} {graphUnit(metric)}</strong>}
        <span>{logs.at(-1)?.date || 'No data'}</span>
      </div>
    </div>
  )
}

function graphTitle(metric) {
  const titles = {
    dopamine: 'Dopamine Baseline Over Time',
    moneyEarned: 'Money Earned by Day',
    moneySpent: 'Money Spent by Day',
    moneySaved: 'Money Saved by Day',
    dailyGrade: 'Daily Grade History',
    level: 'Level Progression',
  }
  return titles[metric] || `${humanize(metric)} Trend`
}

function graphAxisLabel(metric) {
  if (metric === 'dopamine') return 'Mind state scale'
  if (metric.toLowerCase().includes('money') || metric === 'bankBalance') return 'Dollars'
  if (metric === 'looksRating') return 'Looks score, 0-10'
  if (metric === 'sleepDuration' || metric === 'screenTime') return 'Hours'
  return 'Score / value'
}

function graphUnit(metric) {
  if (metric.toLowerCase().includes('money') || metric === 'bankBalance') return '$'
  if (metric === 'sleepDuration' || metric === 'screenTime') return 'hrs'
  if (metric === 'looksRating') return '/10'
  if (metric === 'dopamine') return ''
  return ''
}

function graphChartType(metric) {
  if (['moneyEarned', 'moneySpent', 'moneySaved', 'gymTotal', 'dailyGrade'].includes(metric)) return 'bar'
  if (['bankBalance', 'level', 'totalXp'].includes(metric)) return 'area'
  return 'line'
}

function Streaks({ data }) {
  const streaks = computeStreaks(getLogs(data))
  return (
    <div className="lx-grid">
      {Object.entries(streaks).map(([key, value]) => (
        <Panel key={key} title={humanize(key)} icon={Flame}>
          <strong className="lx-big">{value}</strong>
          <span>day streak</span>
          <ProgressBar value={Math.min(value, 30)} max={30} tone="yellow" />
        </Panel>
      ))}
    </div>
  )
}

function computeStreaks(logs) {
  const checks = {
    creatine: (log) => log.health.creatine,
    noFapPornFree: (log) => log.discipline.noFapClean && !log.discipline.porn,
    gym: (log) => log.health.gymSessionsAdded > 0 || log.health.exercise,
    teeth: (log) => Number(log.looks.brushedTeeth) >= 2,
    retainer: (log) => log.looks.woreRetainerLastNight,
    calorieTracking: (log) => log.health.caloriesTracked,
    deepWork: (log) => Number(log.productivity.deepWorkHours) > 0,
    portfolioWork: (log) => log.productivity.portfolioAdded,
    skincare: (log) => log.looks.skincare,
    roomCleanliness: (log) => log.discipline.roomCleaned,
  }
  return Object.fromEntries(Object.entries(checks).map(([key, fn]) => [key, tailStreak(logs, fn)]))
}

function tailStreak(logs, fn) {
  let streak = 0
  for (let index = logs.length - 1; index >= 0; index -= 1) {
    if (!fn(logs[index])) break
    streak += 1
  }
  return streak
}

function Quests({ data }) {
  return (
    <div className="lx-stack">
      <Panel title="Daily / Weekly / Monthly Missions" icon={Swords}>
        <QuestList data={data} />
      </Panel>
      <Panel title="Boss Fights" icon={Target}>
        <div className="lx-quest-grid">
          {bossFights().map((quest) => <QuestCard key={quest.title} quest={quest} />)}
        </div>
      </Panel>
    </div>
  )
}

function QuestList({ data, limit }) {
  const quests = questState(latestLog(data))
  const visible = limit ? quests.slice(0, limit) : quests
  return <div className="lx-quest-grid">{visible.map((quest) => <QuestCard key={quest.title} quest={quest} />)}</div>
}

function QuestCard({ quest }) {
  return (
    <div className={`lx-quest ${quest.done ? 'done' : ''}`}>
      <div>
        <strong>{quest.title}</strong>
        <span>{quest.type}</span>
      </div>
      <ProgressBar value={quest.progress} tone={quest.done ? 'green' : 'cyan'} />
      <small>{quest.reward}</small>
    </div>
  )
}

function questState(log) {
  return [
    { title: 'No-spend day', type: 'daily', done: log.discipline.noSpendDay, progress: boolScore(log.discipline.noSpendDay), reward: '+20 wealth XP' },
    { title: '10k steps', type: 'daily', done: Number(log.health.steps) >= 10000, progress: scoreRange(log.health.steps, 0, 10000), reward: '+physique XP' },
    { title: 'Perfect routine day', type: 'daily', done: log.computed.grade?.value >= 92, progress: log.computed.grade?.value || 0, reward: 'S grade token' },
    { title: 'Portfolio update mission', type: 'daily', done: log.productivity.portfolioAdded, progress: boolScore(log.productivity.portfolioAdded), reward: '+creative XP' },
    { title: 'Deep work mission', type: 'daily', done: Number(log.productivity.deepWorkHours) >= 3, progress: scoreRange(log.productivity.deepWorkHours, 0, 3), reward: '+mind XP' },
    { title: 'Calorie logging mission', type: 'daily', done: log.health.caloriesTracked, progress: boolScore(log.health.caloriesTracked), reward: '+discipline XP' },
    { title: 'Clean room reset', type: 'daily', done: log.discipline.roomCleaned, progress: boolScore(log.discipline.roomCleaned), reward: '+environment streak' },
  ]
}

function bossFights() {
  return [
    { title: 'Reduce screen time average', type: 'monthly boss', done: false, progress: 45, reward: 'Unlock Focus Warden title' },
    { title: 'Improve sleep average', type: 'monthly boss', done: false, progress: 60, reward: 'Recovery multiplier' },
    { title: 'Save target amount', type: 'monthly boss', done: false, progress: 35, reward: 'Wealth rank unlock' },
  ]
}

function Shop({ data, updateData }) {
  const log = latestLog(data)
  const points = Math.floor((log.computed.totalXp || 0) / 100)
  const items = [
    ['Guilt-free movie token', 4],
    ['Cheat meal token', 7],
    ['Leisure night pass', 10],
    ['Title: Chrome Operator', 20],
    ['Cosmetic: gold graph line', 30],
  ]
  return (
    <div className="lx-stack">
      <Panel title="Reward Wallet" icon={Gem}>
        <Metric label="Reward points" value={points} />
        <p>Rewards are earned from total XP and should be spent after consistency, not impulse.</p>
      </Panel>
      <div className="lx-grid">
        {items.map(([name, cost]) => (
          <Panel key={name} title={name} icon={ShoppingBag}>
            <Metric label="Cost" value={`${cost} pts`} />
            <button
              className="lx-primary"
              onClick={() => updateData((draft) => {
                draft.rewards.push({ name, cost, purchasedAt: new Date().toISOString() })
                return draft
              })}
            >
              Purchase
            </button>
          </Panel>
        ))}
      </div>
      <Panel title="Purchased Unlocks" icon={Award}>
        <div className="lx-pill-row">{data.rewards.map((item, index) => <span key={`${item.name}-${index}`}>{item.name}</span>)}</div>
      </Panel>
    </div>
  )
}

function Achievements({ data }) {
  const logs = getLogs(data)
  const latest = logs.at(-1)
  const streaks = computeStreaks(logs)
  const achievements = [
    ['First Entry', logs.length >= 1],
    ['Level 5', (latest?.computed.level || 1) >= 5],
    ['Level 10', (latest?.computed.level || 1) >= 10],
    ['1,000 XP', (latest?.computed.totalXp || 0) >= 1000],
    ['Gym 250', (latest?.computed.gymTotal || 207) >= 250],
    ['NoFap 7', streaks.noFapPornFree >= 7],
    ['Skincare 14', streaks.skincare >= 14],
    ['Sleep Commander', logs.some((log) => Number(log.health.sleepDuration) >= 8 && log.health.sleepQuality >= 8)],
    ['Portfolio Progress', logs.filter((log) => log.productivity.portfolioAdded).length >= 5],
    ['Money Milestone', logs.some((log) => Number(log.money.bankBalance) >= 1000)],
    ['Social Win', logs.some((log) => log.social.wentOut && log.social.quality >= 8)],
  ]
  return (
    <div className="lx-achievements">
      {achievements.map(([name, unlocked]) => (
        <div className={`lx-achievement ${unlocked ? 'unlocked' : ''}`} key={name}>
          <Trophy size={20} />
          <strong>{name}</strong>
          <span>{unlocked ? 'Unlocked' : 'Locked'}</span>
        </div>
      ))}
    </div>
  )
}

function Reviews({ data }) {
  const [range, setRange] = useState('weekly')
  const logs = getLogs(data)
  const count = { weekly: 7, monthly: 30, yearly: 365, allTime: logs.length }[range]
  const slice = logs.slice(-count)
  const summary = reviewSummary(slice)
  return (
    <div className="lx-stack">
      <Panel title="Review Range" icon={Medal}>
        <div className="lx-focus-switch">
          {['weekly', 'monthly', 'yearly', 'allTime'].map((item) => (
            <button key={item} className={range === item ? 'is-active' : ''} onClick={() => setRange(item)}>{humanize(item)}</button>
          ))}
        </div>
      </Panel>
      <div className="lx-grid">
        {Object.entries(summary).map(([key, value]) => (
          <Panel key={key} title={humanize(key)} icon={TrendingUp}>
            {Array.isArray(value) ? <div className="lx-pill-row">{value.map((item) => <span key={item}>{item}</span>)}</div> : <p>{value}</p>}
          </Panel>
        ))}
      </div>
    </div>
  )
}

function reviewSummary(logs) {
  if (!logs.length) return { recommendations: 'No data yet.' }
  const avg = (fn) => Math.round(logs.reduce((sum, log) => sum + fn(log), 0) / logs.length)
  const bestHabits = [
    ['NoFap', logs.filter((log) => log.discipline.noFapClean).length],
    ['Deep work', logs.filter((log) => Number(log.productivity.deepWorkHours) > 0).length],
    ['Skincare', logs.filter((log) => log.looks.skincare).length],
    ['Room', logs.filter((log) => log.discipline.roomCleaned).length],
  ].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name)
  const worstHabits = [
    ['Screen time', avg((log) => Number(log.productivity.screenTime || 0))],
    ['Stress', avg((log) => Number(log.health.stress || 0))],
    ['Wasted money', avg((log) => Number(log.money.wasted || 0))],
  ].sort((a, b) => b[1] - a[1]).map(([name]) => name)
  return {
    bestHabits,
    worstHabits,
    biggestWins: logs.map((log) => log.notes.biggestWin).filter(Boolean).slice(-3),
    biggestFails: logs.map((log) => log.notes.biggestFail).filter(Boolean).slice(-3),
    statTrends: `Life ${avg((log) => log.computed.life?.overall || 0)}/100, HP ${avg((log) => log.computed.hp || 0)}/100, dopamine ${avg((log) => log.computed.dopamine?.score || 0)}/100.`,
    xpGained: logs.reduce((sum, log) => sum + (log.computed.xpGained || 0), 0),
    levelProgress: `Level ${logs.at(-1).computed.level}, ${logs.at(-1).computed.xpIntoLevel}/${logs.at(-1).computed.xpForNext} XP to next.`,
    moneyMovement: `Earned $${logs.reduce((sum, log) => sum + Number(log.money.earned || 0), 0)}, spent $${logs.reduce((sum, log) => sum + Number(log.money.spent || 0), 0)}, saved $${logs.reduce((sum, log) => sum + Number(log.money.saved || 0), 0)}.`,
    recommendations: 'Attack the weakest repeat habit first, keep HP separate from punishment, and push one high-difficulty quest daily.',
  }
}

function SettingsPage({ data, updateData, resetData, lock }) {
  const [passcode, setPasscode] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const fileRef = useRef(null)
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lifemaxxing-export-${todayKey()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  const importData = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        updateData(() => parsed)
      } catch {
        alert('Invalid JSON import')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="lx-stack">
      <Panel title="Access" icon={KeyRound}>
        <TextInput label="New passcode" value={passcode} onChange={setPasscode} />
        <button
          className="lx-primary"
          onClick={() => {
            if (passcode.trim()) {
              localStorage.setItem(PASSCODE_KEY, passcode.trim())
              setPasscode('')
            }
          }}
        >
          Change passcode
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem(UNLOCK_KEY)
            lock()
          }}
        >
          <Lock size={16} /> Lock page
        </button>
      </Panel>
      <Panel title="Data" icon={Import}>
        <button onClick={exportData}>Export JSON</button>
        <button onClick={() => fileRef.current?.click()}>Import JSON</button>
        <input ref={fileRef} hidden type="file" accept="application/json" onChange={(event) => importData(event.target.files?.[0])} />
      </Panel>
      <Panel title="System Values" icon={Settings}>
        <TextInput label="DOB" type="date" value={data.owner.dob} onChange={(value) => updateData((draft) => {
          draft.owner.dob = value
          return draft
        })} />
        <TextInput label="Occupation(s), comma separated" value={data.owner.occupations.join(', ')} onChange={(value) => updateData((draft) => {
          draft.owner.occupations = value.split(',').map((item) => item.trim()).filter(Boolean)
          return draft
        })} />
        <NumberInput label="Starting gym sessions" value={data.settings.startingGymSessions} onChange={(value) => updateData((draft) => {
          draft.settings.startingGymSessions = Number(value)
          return draft
        })} />
        <Check label="Notifications / reminders placeholder" checked={data.settings.reminders} onChange={(value) => updateData((draft) => {
          draft.settings.reminders = value
          return draft
        })} />
      </Panel>
      <Panel title="Reset Safeguards" icon={ShieldCheck}>
        <p>Export before any destructive reset. This build keeps all daily logs, computed histories, photos, rewards, settings, and updates in one JSON structure.</p>
        <button className="lx-danger" onClick={() => setResetOpen(true)}>Reset data</button>
      </Panel>
      {resetOpen && (
        <ResetModal
          onCancel={() => setResetOpen(false)}
          onResetAll={() => {
            localStorage.removeItem(STORAGE_KEY)
            resetData()
            setResetOpen(false)
          }}
          onResetDemo={() => {
            updateData((draft) => {
              const kept = {}
              Object.entries(draft.dailyLogs).forEach(([day, log]) => {
                if (day >= SYSTEM_START_DATE && (log.finalized || log.photos.front || log.photos.back || log.savedAt)) kept[day] = log
              })
              draft.dailyLogs = Object.keys(kept).length ? kept : { [SYSTEM_START_DATE]: baseDailyLog(SYSTEM_START_DATE) }
              draft.rewards = []
              draft.customQuests = []
              return draft
            })
            setResetOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ResetModal({ onCancel, onResetAll, onResetDemo }) {
  const [phrase, setPhrase] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState('all')
  const passcodeOk = code === (localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE)
  const phraseOk = phrase === 'RESET LIFEMAXXING'
  const canReset = phraseOk && passcodeOk
  return (
    <div className="lx-modal-backdrop" role="dialog" aria-modal="true">
      <div className="lx-modal lx-reset-modal">
        <div className="lx-modal-head">
          <div>
            <p className="lx-kicker">Destructive action</p>
            <h2>Reset Lifemaxxing</h2>
          </div>
          <button onClick={onCancel} aria-label="Cancel reset"><X size={18} /></button>
        </div>
        <p>This can erase daily logs, images, computed histories, rewards, and settings stored in this browser. Export JSON first if you may want the archive later.</p>
        <div className="lx-focus-switch">
          <button className={mode === 'all' ? 'is-active' : ''} onClick={() => setMode('all')}>Reset all data</button>
          <button className={mode === 'demo' ? 'is-active' : ''} onClick={() => setMode('demo')}>Reset only demo/test data</button>
        </div>
        <TextInput label='Type "RESET LIFEMAXXING"' value={phrase} onChange={setPhrase} />
        <TextInput label="Re-enter passcode" type="password" value={code} onChange={setCode} />
        <div className="lx-modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="lx-danger" disabled={!canReset} onClick={mode === 'all' ? onResetAll : onResetDemo}>
            Confirm reset
          </button>
        </div>
      </div>
    </div>
  )
}

function setPath(object, path, value) {
  const parts = path.split('.')
  let target = object
  parts.slice(0, -1).forEach((part) => {
    target = target[part]
  })
  target[parts.at(-1)] = value
}

function humanize(value) {
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function calcAge(dob) {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const month = now.getMonth() - birth.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1
  return age
}
