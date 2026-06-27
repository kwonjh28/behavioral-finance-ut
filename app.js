const currency = new Intl.NumberFormat("ko-KR");

const screenEls = [...document.querySelectorAll(".screen")];
const modalBackdrop = document.getElementById("modal-backdrop");
const categorySheetBackdrop = document.getElementById("category-sheet-backdrop");
const uploadInput = document.getElementById("excel-file");
const statusText = document.getElementById("status-text");
let scrollStateRefreshQueued = false;

const ASSETS = {
  iconCafe: "https://www.figma.com/api/mcp/asset/692cc764-419c-49c5-a393-9e9f0e5e7e21",
  iconDining: "https://www.figma.com/api/mcp/asset/1dba0a96-7b44-41dc-b7d0-e2564a781f9d",
  iconShopping: "https://www.figma.com/api/mcp/asset/7e771fee-917b-49df-b627-4ccaf659cbef",
  iconFashion: "https://www.figma.com/api/mcp/asset/2a7d0101-902e-49d9-a968-7642b7e20862",
  wishOne: "https://www.figma.com/api/mcp/asset/0dad9db8-abe1-4a52-b9b8-9cb38537846f",
  wishTwo: "https://www.figma.com/api/mcp/asset/6245b70f-6023-4f3b-bdc7-1cc7a2b123db",
  wishSnowman: "https://www.figma.com/api/mcp/asset/c0481063-63ed-430c-aabd-e2fde156b1f2",
  wishTumbler: "https://www.figma.com/api/mcp/asset/54088dc8-da79-4783-8601-23fd89b385f5",
  wishAesop: "https://www.figma.com/api/mcp/asset/c3f23808-7e11-4133-9449-0a01e263df0e",
};

const TEXT = {
  all: "\uC804\uCCB4",
  sample: "\uC0D8\uD50C \uB370\uC774\uD130",
  expense: "\uC9C0\uCD9C",
  categoryCafe: "\uCE74\uD398/\uAC04\uC2DD",
  categoryFood: "\uC2DD\uBE44",
  categoryLife: "\uC0DD\uD65C",
  categoryTraffic: "\uAD50\uD1B5",
  categoryShopping: "\uC1FC\uD551",
  subDrink: "\uCEE4\uD53C/\uC74C\uB8CC",
  subBakery: "\uBCA0\uC774\uCEE4\uB9AC",
  subJapanese: "\uC77C\uC2DD",
  subStore: "\uD3B8\uC758\uC810",
  subDelivery: "\uBC30\uB2EC",
  subFastfood: "\uD328\uC2A4\uD2B8\uD478\uB4DC",
  titleHabitCafe: "\uC2B5\uAD00\uC131 \uCE74\uD398 \uC904\uC774\uAE30",
  titleLife: "\uC0DD\uD65C\uBE44 \uC0C8\uB294 \uB3C8 \uC904\uC774\uAE30",
  titleSaving: "\uC808\uC57D \uCC4C\uB9B0\uC9C0",
  monthSaving: "\uC6D4",
  yearSaving: "\uC5F0",
  countAverage: "1\uAC74 \uD3C9\uADE0",
  recentBase: "\uCD5C\uADFC \uC18C\uBE44 \uAE30\uC900",
  statusReady: "\uC0D8\uD50C \uB370\uC774\uD130\uB85C \uC900\uBE44\uB428",
  statusApplied: "\uC801\uC6A9 \uC644\uB8CC",
  statusLoading: "\uC77D\uB294 \uC911",
  statusNoSheet: "\"\uAC00\uACC4\uBD80 \uB0B4\uC5ED\" \uC2DC\uD2B8\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694",
  statusNoRows: "\uC77D\uC744 \uC218 \uC788\uB294 \uAC70\uB798\uB0B4\uC5ED\uC774 \uC5C6\uC5B4\uC694",
  statusNoLibrary: "\uC5D1\uC140 \uC77D\uAE30 \uB77C\uC774\uBE0C\uB7EC\uB9AC\uAC00 \uB85C\uB4DC\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694",
  summaryUpdated: "\uAE30\uC900\uC73C\uB85C \uCD5C\uADFC \uCC4C\uB9B0\uC9C0 \uD604\uD669\uC744 \uACC4\uC0B0\uD588\uC5B4\uC694.",
  modalAdded: "\uCC4C\uB9B0\uC9C0 \uB0B4\uC5ED\uC744 \uD655\uC778\uD558\uB7EC \uAC00\uC2DC\uACA0\uC5B4\uC694?",
  hintSaving: "\uB9E4\uC6D4 \uC57D",
  hintSaved: "\uC544\uAEF4\uC694.",
};

const INITIAL_SUMMARY = {
  monthlySavingGoal: 13870,
  currentMonthSaving: 46850,
  savingsAccount: 37750,
  currentMonthSpend: 455250,
  totalSaved: 955000,
  savingPeriodLabel: "1\uB144 6\uAC1C\uC6D4",
};

function getInitialWishlistItems() {
  return [
    {
      id: "snowman",
      title: "일광전구 스노우맨",
      price: 110000,
      category: "생활",
      progress: 34,
      savedAmount: 37750,
      image: ASSETS.wishSnowman,
      status: "in-progress",
      registeredAt: "2026년 6월 3일",
      expectedAt: "2027년 6월",
    },
    {
      id: "stanley",
      title: "스탠리 텀블러",
      price: 49000,
      category: "생활",
      progress: 77,
      savedAmount: 37750,
      image: ASSETS.wishTumbler,
      status: "in-progress",
      registeredAt: "2026년 6월 3일",
      expectedAt: "2026년 9월",
    },
  ];
}

const appState = {
  currentScreen: "home",
  lastScreen: "home",
  monthlySavingGoal: INITIAL_SUMMARY.monthlySavingGoal,
  currentMonthSaving: INITIAL_SUMMARY.currentMonthSaving,
  savingsAccount: INITIAL_SUMMARY.savingsAccount,
  currentMonthSpend: INITIAL_SUMMARY.currentMonthSpend,
  totalSaved: INITIAL_SUMMARY.totalSaved,
  savingPeriodLabel: INITIAL_SUMMARY.savingPeriodLabel,
  sourceName: TEXT.sample,
  transactions: [],
  candidateCategories: [],
  selectedCandidateId: null,
  selectedChallengeId: "habit-cafe",
  challengeFilter: "all",
  selectedSubcategory: TEXT.all,
  selectedRatio: 0.9,
  previewUsesAverage: true,
  selectedSpendCategory: "all",
  selectedWishlistId: "snowman",
  selectedWishlistPreset: null,
  wishlistJustRegistered: false,
  modalMode: "challenge",
  wishlistItems: getInitialWishlistItems(),
  challenges: [
    {
      id: "habit-cafe",
      title: TEXT.titleHabitCafe,
      category: TEXT.categoryCafe,
      currentAmount: 22500,
      targetAmount: 69350,
      currentCount: 4,
      targetCount: 10,
      insight: "\uC6D4 13,870\uC6D0 \uC808\uC57D / \uC5F0 166,440\uC6D0 \uC808\uC57D",
      icon: "dining",
      baseMonthlyAmount: 73860,
      baseMonthlyCount: 12,
      monthlySavingTarget: 13870,
      detailMonthlySaving: 6155,
      totalSaving: 48650,
      startDate: "2025.06.15",
      history: [15780, 14900, 14200],
    },
  ],
  archivedChallenges: [
    {
      id: "completed-store",
      title: "\uD3B8\uC758\uC810 \uC911\uB3C5",
      category: TEXT.categoryLife,
      status: "completed",
      currentLabel: "-\uC6D0",
      targetLabel: "/24,000\uC6D0",
      statusLabel: "\uC885\uB8CC",
      insight: "1\uB144 6\uAC1C\uC6D4 \uB3D9\uC548 64,270\uC6D0 \uC544\uAF08\uC5B4\uC694.",
    },
    {
      id: "completed-clothes",
      title: "\uC637\uC73C\uB85C \uAE08\uC735\uCE58\uB8CC \uAE08\uC9C0",
      category: TEXT.categoryShopping,
      status: "completed",
      currentLabel: "-\uC6D0",
      targetLabel: "/150,000\uC6D0",
      statusLabel: "\uC885\uB8CC",
      insight: "7\uAC1C\uC6D4 \uB3D9\uC548 324,500\uC6D0 \uC544\uAF08\uC5B4\uC694.",
    },
    {
      id: "completed-shoes",
      title: "\uC2E0\uBC1C \uCF5C\uB809\uD130 \uAD00\uB454\uB2E4",
      category: TEXT.categoryShopping,
      status: "completed",
      currentLabel: "-\uC6D0",
      targetLabel: "/244,000\uC6D0",
      statusLabel: "\uC885\uB8CC",
      insight: "8\uAC1C\uC6D4 \uB3D9\uC548 564,270\uC6D0 \uC544\uAF08\uC5B4\uC694.",
    },
  ],
};

const wishlistPresets = {
  living: {
    id: "aesop",
    title: "이솝 핸드워시",
    price: 56000,
    category: "리빙/인테리어",
    progress: 58,
    savedAmount: 32500,
    image: ASSETS.wishAesop,
    status: "in-progress",
    registeredAt: "2026년 6월 27일",
    expectedAt: "2026년 11월",
  },
};

const wishlistCategoryPresets = {
  fashion: { title: "아크테릭스 맨티스", price: 89000, category: "패션/잡화", image: ASSETS.wishTumbler },
  food: { title: "오마카세 식사권", price: 120000, category: "미식/푸드", image: ASSETS.wishSnowman },
  tech: { title: "무선 키보드", price: 139000, category: "테크/가전", image: ASSETS.wishTumbler },
  living: wishlistPresets.living,
  culture: { title: "전시 패키지", price: 65000, category: "여가/문화", image: ASSETS.wishSnowman },
  beauty: { title: "이솝 핸드워시", price: 56000, category: "뷰티/웰니스", image: ASSETS.wishAesop },
  sports: { title: "러닝화", price: 129000, category: "스포츠", image: ASSETS.wishTumbler },
  travel: { title: "제주 항공권", price: 180000, category: "여행", image: ASSETS.wishSnowman },
  career: { title: "온라인 클래스", price: 99000, category: "배움/커리어", image: ASSETS.wishTumbler },
  etc: { title: "이솝 핸드워시", price: 56000, category: "기타", image: ASSETS.wishAesop },
};

const spendData = {
  all: {
    total: 455250,
    shareLabel: "전체 중",
    share: 100,
    groups: [
      {
        date: "22일 (월)",
        rows: [
          { merchant: "컬리", time: "22:30", amount: 41200 },
          { merchant: "이디야", time: "16:11", amount: 6200 },
          { merchant: "서브웨이", time: "12:32", amount: 9200 },
        ],
      },
      {
        date: "21일 (일)",
        rows: [
          { merchant: "GS25 상수점", time: "22:06", amount: 6900 },
          { merchant: "배달의민족", time: "20:32", amount: 23400 },
          { merchant: "메가커피", time: "15:28", amount: 3500 },
        ],
      },
      {
        date: "20일 (토)",
        rows: [
          { merchant: "쿠팡", time: "19:43", amount: 32900 },
          { merchant: "올리브영", time: "14:12", amount: 18500 },
          { merchant: "네이버쇼핑", time: "14:08", amount: 49000 },
        ],
      },
    ],
  },
  online: {
    total: 138500,
    shareLabel: "전체 중",
    share: 30,
    groups: [
      {
        date: "22일 (월)",
        rows: [
          { merchant: "컬리", time: "22:30", amount: 41200 },
        ],
      },
      {
        date: "20일 (토)",
        rows: [
          { merchant: "쿠팡", time: "19:43", amount: 32900 },
          { merchant: "올리브영", time: "14:12", amount: 18500 },
          { merchant: "네이버쇼핑", time: "14:08", amount: 45900 },
        ],
      },
    ],
  },
};

const categoryLabelMap = {
  [TEXT.categoryCafe]: TEXT.categoryCafe,
  [TEXT.categoryFood]: TEXT.categoryFood,
  [TEXT.categoryLife]: TEXT.categoryLife,
  [TEXT.categoryTraffic]: TEXT.categoryTraffic,
  [TEXT.categoryShopping]: TEXT.categoryShopping,
  "\uC628\uB77C\uC778\uC1FC\uD551": "\uC628\uB77C\uC778\uC1FC\uD551",
  "\uD328\uC158/\uC1FC\uD551": "\uD328\uC158/\uC1FC\uD551",
};

const categoryAssetMap = {
  [TEXT.categoryCafe]: ASSETS.iconCafe,
  [TEXT.categoryFood]: ASSETS.iconDining,
  [TEXT.categoryLife]: ASSETS.iconDining,
  [TEXT.categoryTraffic]: ASSETS.iconDining,
  [TEXT.categoryShopping]: ASSETS.iconFashion,
  "\uC628\uB77C\uC778\uC1FC\uD551": ASSETS.iconShopping,
  "\uD328\uC158/\uC1FC\uD551": ASSETS.iconFashion,
};

const sampleTransactions = [
  { date: "2026-06-15", type: TEXT.expense, major: TEXT.categoryCafe, minor: TEXT.subDrink, merchant: "\uD22C\uC378\uD50C\uB808\uC774\uC2A4", amount: 6300 },
  { date: "2026-06-14", type: TEXT.expense, major: TEXT.categoryCafe, minor: TEXT.subBakery, merchant: "\uD321\uB3C4\uB9AC\uB178\uBCA0\uC774\uCEE4\uB9AC", amount: 11000 },
  { date: "2026-06-13", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subJapanese, merchant: "\uC544\uBD80\uB77C\uC18C\uBC14\uD558\uB098\uB808", amount: 11000 },
  { date: "2026-06-12", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subJapanese, merchant: "\uD615\uC81C\uBD80\uD0C0\uB3D9", amount: 16000 },
  { date: "2026-06-11", type: TEXT.expense, major: TEXT.categoryLife, minor: TEXT.subStore, merchant: "\uC774\uB9C8\uD2B824", amount: 2500 },
  { date: "2026-06-10", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subDelivery, merchant: "\uBC30\uB2EC\uC758\uBBFC\uC871", amount: 22000 },
  { date: "2026-06-09", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subDelivery, merchant: "\uC694\uAE30\uC694", amount: 18000 },
  { date: "2026-06-08", type: TEXT.expense, major: TEXT.categoryCafe, minor: TEXT.subDrink, merchant: "\uC2A4\uD0C0\uBC85\uC2A4", amount: 5800 },
  { date: "2026-06-07", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subFastfood, merchant: "\uB9E5\uB3C4\uB0A0\uB4DC", amount: 9500 },
  { date: "2026-05-30", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subDelivery, merchant: "\uCFE0\uD321\uC774\uCE20", amount: 21000 },
  { date: "2026-05-28", type: TEXT.expense, major: TEXT.categoryCafe, minor: TEXT.subDrink, merchant: "\uBA54\uAC00\uCEE4\uD53C", amount: 3000 },
  { date: "2026-05-25", type: TEXT.expense, major: TEXT.categoryFood, minor: TEXT.subJapanese, merchant: "\uC2A4\uC2DC\uC9D1", amount: 17000 },
];

const sampleCandidateCategories = [
  {
    id: "food",
    major: TEXT.categoryFood,
    title: "\uC2DD\uBE44 \uC808\uC57D \uCC4C\uB9B0\uC9C0",
    placeholderName: "\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
    defaultTitle: "\uC2DD\uBE44 \uC808\uC57D \uCC4C\uB9B0\uC9C0",
    annualAmount: 3612164,
    annualCount: 253,
    monthlyAmount: 301014,
    monthlyCount: 21.1,
    averageAmount: 14277,
    ratioOverrides: {
      "0.9": { targetAmount: 270912, targetCount: 18, monthlySaving: 30101, yearlySaving: 361212 },
    },
    topSubcategories: [
      {
        name: TEXT.subDelivery,
        title: "\uBC30\uB2EC\uBE44 \uC544\uAEF4 \uC8FC\uC2DD \uBAA8\uC73C\uAE30",
        annualAmount: 1808545,
        annualCount: 85,
        monthlyAmount: 151066,
        monthlyCount: 7.1,
        averageAmount: 21277,
        ratioOverrides: {
          "0.9": { targetAmount: 135959, targetCount: 6, monthlySaving: 15106, yearlySaving: 181272 },
          "0.8": { targetAmount: 120852, targetCount: 6, monthlySaving: 30213, yearlySaving: 362556 },
        },
      },
      {
        name: TEXT.subJapanese,
        title: "\uC77C\uC2DD \uC904\uC774\uACE0 \uC138\uC774\uBE59 \uB9CC\uB4E4\uAE30",
        annualAmount: 965430,
        annualCount: 64,
        monthlyAmount: 80453,
        monthlyCount: 5.3,
        averageAmount: 15100,
      },
      {
        name: TEXT.subFastfood,
        title: "\uD328\uC2A4\uD2B8\uD478\uB4DC \uC904\uC774\uAE30",
        annualAmount: 838189,
        annualCount: 52,
        monthlyAmount: 69849,
        monthlyCount: 4.3,
        averageAmount: 16229,
      },
    ],
  },
  {
    id: "online-shopping",
    major: "\uC628\uB77C\uC778\uC1FC\uD551",
    title: "\uC628\uB77C\uC778\uC1FC\uD551 \uC904\uC774\uAE30",
    defaultTitle: "\uC628\uB77C\uC778\uC1FC\uD551 \uC904\uC774\uAE30",
    annualAmount: 3031692,
    annualCount: 123,
    monthlyAmount: 252641,
    monthlyCount: 10.2,
    averageAmount: 24648,
    topSubcategories: [],
  },
  {
    id: "traffic",
    major: TEXT.categoryTraffic,
    title: "\uAD50\uD1B5\uBE44 \uC904\uC774\uAE30",
    defaultTitle: "\uAD50\uD1B5\uBE44 \uC904\uC774\uAE30",
    annualAmount: 925668,
    annualCount: 84,
    monthlyAmount: 77139,
    monthlyCount: 7,
    averageAmount: 11020,
    topSubcategories: [],
  },
  {
    id: "fashion-shopping",
    major: "\uD328\uC158/\uC1FC\uD551",
    title: "\uD328\uC158/\uC1FC\uD551 \uC904\uC774\uAE30",
    defaultTitle: "\uD328\uC158/\uC1FC\uD551 \uC904\uC774\uAE30",
    annualAmount: 1658939,
    annualCount: 46,
    monthlyAmount: 138245,
    monthlyCount: 3.8,
    averageAmount: 36064,
    topSubcategories: [],
  },
];

function formatWon(value) {
  return `${currency.format(Math.round(value || 0))}\uC6D0`;
}

function formatCount(value) {
  return `${Math.round(value || 0)}\uD68C`;
}

function formatCountMetric(value) {
  const num = Number(value || 0);
  if (Number.isInteger(num)) return `${num}\uD68C`;
  return `${num.toFixed(1)}\uD68C`;
}

function formatMonthlySavingText(value) {
  return `${TEXT.hintSaving} ${formatWon(value)} ${TEXT.hintSaved}`;
}

function setRollingText(element, nextText, options = {}) {
  if (!element) return;

  const {
    animate = true,
    duration = 520,
    stagger = 26,
  } = options;
  const normalized = String(nextText ?? "");
  const previous = element.dataset.rollingValue;

  element.dataset.rollingValue = normalized;
  element.setAttribute("aria-label", normalized);

  if (!animate || previous == null || previous === normalized) {
    element.textContent = normalized;
    return;
  }

  const wrapper = document.createElement("span");
  wrapper.className = "rolling-value";

  [...normalized].forEach((char, index) => {
    if (/\d/.test(char)) {
      const slot = document.createElement("span");
      slot.className = "rolling-slot";

      const reel = document.createElement("span");
      reel.className = "rolling-reel";
      reel.style.transitionDuration = `${duration}ms`;
      reel.style.transitionDelay = `${index * stagger}ms`;

      const digit = Number(char);
      const sequence = [
        (digit + 7) % 10,
        (digit + 8) % 10,
        (digit + 9) % 10,
        digit,
      ];

      sequence.forEach((value) => {
        const glyph = document.createElement("span");
        glyph.className = "rolling-glyph";
        glyph.textContent = String(value);
        reel.appendChild(glyph);
      });

      slot.appendChild(reel);
      wrapper.appendChild(slot);
      requestAnimationFrame(() => {
        reel.style.transform = `translateY(-${sequence.length - 1}em)`;
      });
      return;
    }

    const staticChar = document.createElement("span");
    staticChar.className = "rolling-static";
    staticChar.textContent = char;
    wrapper.appendChild(staticChar);
  });

  element.replaceChildren(wrapper);
}

function slugify(value) {
  return String(value).replace(/\s+/g, "-").toLowerCase();
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function isSampleSource(sourceName = appState.sourceName) {
  return sourceName === TEXT.sample;
}

function refreshScreenScrollState() {
  document.querySelectorAll(".screen-scroll").forEach((container) => {
    const screen = container.closest(".screen")?.dataset.screen;
    const shouldAlwaysScroll = ["detail", "challenge-detail", "add", "wishlist", "wishlist-detail", "wishlist-add", "spend"].includes(screen);
    const fitsViewport = container.scrollHeight <= container.clientHeight + 12;
    container.classList.toggle("is-scroll-locked", fitsViewport && !shouldAlwaysScroll);
    if (fitsViewport && !shouldAlwaysScroll) {
      container.scrollTop = 0;
    }
  });
}

function resetScreenScroll(screenName) {
  const activeScroll = document.querySelector(`.screen[data-screen="${screenName}"] .screen-scroll`);
  if (activeScroll) {
    activeScroll.scrollTop = 0;
  }
}

function queueScrollStateRefresh() {
  if (scrollStateRefreshQueued) return;
  scrollStateRefreshQueued = true;
  requestAnimationFrame(() => {
    scrollStateRefreshQueued = false;
    refreshScreenScrollState();
  });
}

function refreshActiveScreenScrollState() {
  const activeScroll = document.querySelector(".screen.active .screen-scroll");
  if (!activeScroll) return;
  const screen = activeScroll.closest(".screen")?.dataset.screen;
  const shouldAlwaysScroll = ["detail", "challenge-detail", "add", "wishlist", "wishlist-detail", "wishlist-add", "spend"].includes(screen);
  const fitsViewport = activeScroll.scrollHeight <= activeScroll.clientHeight + 12;
  activeScroll.classList.toggle("is-scroll-locked", fitsViewport && !shouldAlwaysScroll);
  if (fitsViewport && !shouldAlwaysScroll) {
    activeScroll.scrollTop = 0;
  }
}

function clampScrollPosition(container) {
  if (!container) return;
  const maxScrollTop = Math.max(container.scrollHeight - container.clientHeight, 0);
  if (container.scrollTop < 0) {
    container.scrollTop = 0;
    return;
  }
  if (container.scrollTop > maxScrollTop) {
    container.scrollTop = maxScrollTop;
  }
}

function bindScrollGuards() {
  document.querySelectorAll(".screen-scroll").forEach((container) => {
    if (container.dataset.scrollGuardBound === "true") return;
    container.dataset.scrollGuardBound = "true";

    let lastTouchY = 0;

    container.addEventListener("scroll", () => {
      clampScrollPosition(container);
    }, { passive: true });

    container.addEventListener("wheel", (event) => {
      const isLocked = container.classList.contains("is-scroll-locked");
      if (isLocked) {
        event.preventDefault();
        container.scrollTop = 0;
        return;
      }

      const maxScrollTop = Math.max(container.scrollHeight - container.clientHeight, 0);
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >= maxScrollTop - 1;
      const scrollingUp = event.deltaY < 0;
      const scrollingDown = event.deltaY > 0;

      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        event.preventDefault();
        clampScrollPosition(container);
      }
    }, { passive: false });

    container.addEventListener("touchstart", (event) => {
      lastTouchY = event.touches[0]?.clientY || 0;
    }, { passive: true });

    container.addEventListener("touchmove", (event) => {
      const isLocked = container.classList.contains("is-scroll-locked");
      if (isLocked) {
        event.preventDefault();
        return;
      }

      const currentY = event.touches[0]?.clientY || 0;
      const deltaY = currentY - lastTouchY;
      const maxScrollTop = Math.max(container.scrollHeight - container.clientHeight, 0);
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >= maxScrollTop - 1;

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
        clampScrollPosition(container);
      }
    }, { passive: false });
  });
}

function bindScrollStateObservers() {
  const resizeObserver = new ResizeObserver(() => {
    queueScrollStateRefresh();
  });

  document.querySelectorAll(".screen-scroll").forEach((container) => {
    resizeObserver.observe(container);
  });

  window.addEventListener("resize", queueScrollStateRefresh);
  window.addEventListener("load", queueScrollStateRefresh);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      queueScrollStateRefresh();
    });
  }
}

function setScreen(screenName) {
  if (["home", "status", "my-challenges", "wishlist", "spend", "add", "detail"].includes(screenName)) {
    appState.lastScreen = screenName;
  }
  appState.currentScreen = screenName;
  screenEls.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === screenName);
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resetScreenScroll(screenName);
      refreshScreenScrollState();
      setTimeout(refreshActiveScreenScrollState, 80);
    });
  });
}

function getCurrentChallenge() {
  return (
    appState.challenges.find((challenge) => challenge.id === appState.selectedChallengeId) ||
    appState.challenges[0]
  );
}

function getCategoryAsset(category, fallback = ASSETS.iconDining) {
  return categoryAssetMap[category] || fallback;
}

function renderCategoryIcon(category, alt = "", size = "default") {
  const asset = getCategoryAsset(category);
  return `<img class="category-icon-image category-icon-image--${size}" src="${asset}" alt="${alt}" loading="lazy" />`;
}

function showModal(message, title = "챌린지 추가가 완료되었습니다!", mode = "challenge") {
  appState.modalMode = mode;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  modalBackdrop.classList.remove("hidden");
}

function getCurrentWishlistItem() {
  return (
    appState.wishlistItems.find((item) => item.id === appState.selectedWishlistId) ||
    appState.wishlistItems[0]
  );
}

function hideModal() {
  modalBackdrop.classList.add("hidden");
}

function showCategorySheet() {
  categorySheetBackdrop?.classList.remove("hidden");
}

function hideCategorySheet() {
  categorySheetBackdrop?.classList.add("hidden");
}

function getCurrentCandidate() {
  return (
    appState.candidateCategories.find(
      (candidate) => candidate.id === appState.selectedCandidateId,
    ) || appState.candidateCategories[0]
  );
}

function getChallengeSourceCandidate(challenge) {
  if (!challenge) return null;

  return appState.candidateCategories.find(
    (candidate) => candidate.id === challenge.id || candidate.major === challenge.category,
  );
}

function computeCandidates(transactions) {
  const expenseRows = transactions.filter((item) => item.type === TEXT.expense && item.amount > 0);
  const grouped = new Map();

  expenseRows.forEach((item) => {
    const key = item.major || "\uAE30\uD0C0";
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: slugify(key),
        major: key,
        totalAmount: 0,
        totalCount: 0,
        months: new Set(),
        subcategories: new Map(),
        icon: "dining",
      });
    }

    const bucket = grouped.get(key);
    bucket.totalAmount += item.amount;
    bucket.totalCount += 1;
    bucket.months.add(item.date.slice(0, 7));

    const subKey = item.minor || "\uAE30\uD0C0";
    if (!bucket.subcategories.has(subKey)) {
      bucket.subcategories.set(subKey, {
        name: subKey,
        totalAmount: 0,
        totalCount: 0,
      });
    }

    const subBucket = bucket.subcategories.get(subKey);
    subBucket.totalAmount += item.amount;
    subBucket.totalCount += 1;
  });

  return [...grouped.values()]
    .map((bucket) => {
      const monthCount = Math.max(bucket.months.size, 1);
      const monthlyAmount = bucket.totalAmount / monthCount;
      const monthlyCount = bucket.totalCount / monthCount;
      const topSubcategories = [...bucket.subcategories.values()]
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 3);

      return {
        ...bucket,
        title: createChallengeTitle(bucket.major, topSubcategories[0]?.name),
        annualAmount: bucket.totalAmount,
        annualCount: bucket.totalCount,
        monthlyAmount,
        monthlyCount,
        averageAmount: monthlyCount ? monthlyAmount / monthlyCount : monthlyAmount,
        topSubcategories,
      };
    })
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 4);
}

function createChallengeTitle(major, minor) {
  if (major === TEXT.categoryCafe) return TEXT.titleHabitCafe;
  if (major === TEXT.categoryFood && minor) {
    return `${minor} \uB35C \uC4F0\uACE0 \uC138\uC774\uBE59 \uB9CC\uB4E4\uAE30`;
  }
  if (major === TEXT.categoryLife) return TEXT.titleLife;
  return `${major} ${TEXT.titleSaving}`;
}

function getDetailSelection() {
  const candidate = getCurrentCandidate();
  if (!candidate) return null;

  const subcategoryData =
    appState.selectedSubcategory === TEXT.all
      ? null
      : candidate.topSubcategories.find((item) => item.name === appState.selectedSubcategory);
  const source = subcategoryData || candidate;
  const ratioOverride = source?.ratioOverrides?.[appState.selectedRatio.toFixed(1)] || null;
  const fallbackMonthlyAmount = subcategoryData
    ? subcategoryData.totalAmount / Math.max(candidate.months?.size || 1, 1)
    : candidate.monthlyAmount;
  const fallbackMonthlyCount = subcategoryData
    ? subcategoryData.totalCount / Math.max(candidate.months?.size || 1, 1)
    : candidate.monthlyCount;
  const baseMonthlyAmount = source.monthlyAmount ?? fallbackMonthlyAmount;
  const baseMonthlyCount = source.monthlyCount ?? fallbackMonthlyCount;
  const annualAmount = source.annualAmount ?? candidate.annualAmount;
  const annualCount = source.annualCount ?? candidate.annualCount;
  const targetAmount = ratioOverride?.targetAmount ?? Math.round(baseMonthlyAmount * appState.selectedRatio);
  const savingMonthly = ratioOverride?.monthlySaving ?? Math.max(Math.round(baseMonthlyAmount - targetAmount), 0);
  const targetCount = ratioOverride?.targetCount ?? Math.max(Math.round(baseMonthlyCount * appState.selectedRatio), 1);
  const yearlySaving = ratioOverride?.yearlySaving ?? savingMonthly * 12;
  const challengeTitle = source.title || candidate.defaultTitle || candidate.title;
  const displayName = subcategoryData?.title || candidate.placeholderName || challengeTitle;
  const nameIsPlaceholder = !subcategoryData?.title && Boolean(candidate.placeholderName);
  const challengeId = subcategoryData ? `${candidate.id}-${slugify(subcategoryData.name)}` : candidate.id;

  return {
    candidate,
    subcategoryData,
    annualAmount,
    annualCount,
    baseMonthlyAmount,
    baseMonthlyCount,
    targetAmount,
    savingMonthly,
    targetCount,
    yearlySaving,
    challengeTitle,
    displayName,
    nameIsPlaceholder,
    challengeId,
  };
}

function buildChallengeFromCandidate(candidate) {
  const selection = candidate?.major ? getDetailSelection() : candidate;
  if (!selection) return null;

  return {
    id: selection.challengeId,
    title: selection.challengeTitle,
    category: selection.candidate.major,
    currentAmount: 0,
    targetAmount: selection.targetAmount,
    currentCount: 0,
    targetCount: selection.targetCount,
    insight: `${TEXT.monthSaving} ${formatWon(selection.savingMonthly)} \uC808\uC57D / ${TEXT.yearSaving} ${formatWon(selection.yearlySaving)} \uC808\uC57D`,
    icon: "dining",
    baseMonthlyAmount: Math.round(selection.baseMonthlyAmount),
    baseMonthlyCount: Math.max(Math.round(selection.baseMonthlyCount), 1),
    monthlySavingTarget: selection.savingMonthly,
    detailMonthlySaving: selection.savingMonthly,
    totalSaving: selection.yearlySaving,
    startDate: "2025.06.15",
    selectedSubcategory: selection.subcategoryData?.name || TEXT.all,
    history: [
      Math.round(selection.savingMonthly * 2.55),
      Math.round(selection.savingMonthly * 2.4),
      Math.round(selection.savingMonthly * 2.28),
    ],
  };
}

function recalculateSavingsSummary() {
  const monthlyGoals = appState.challenges.reduce(
    (sum, challenge) => sum + (challenge.monthlySavingTarget || 0),
    0,
  );
  const extraMonthlySaving = Math.max(monthlyGoals - INITIAL_SUMMARY.monthlySavingGoal, 0);

  appState.monthlySavingGoal = monthlyGoals;
  appState.currentMonthSaving = INITIAL_SUMMARY.currentMonthSaving + extraMonthlySaving;
  appState.savingsAccount = INITIAL_SUMMARY.savingsAccount + Math.round(extraMonthlySaving * 0.72);
  appState.totalSaved = INITIAL_SUMMARY.totalSaved + extraMonthlySaving * 12;
}

function updateHomeSummary() {
  recalculateSavingsSummary();
  const monthlyGoals = appState.challenges.reduce(
    (sum, challenge) => sum + (challenge.monthlySavingTarget || 0),
    0,
  );
  const focusChallenge = getCurrentChallenge();
  const focusGoal =
    focusChallenge?.monthlySavingTarget ||
    Math.max((focusChallenge?.targetAmount || 0) - (focusChallenge?.currentAmount || 0), 0);

  document.getElementById("home-saving-amount").textContent = formatWon(monthlyGoals);
  document.getElementById("home-saving-period").textContent = appState.savingPeriodLabel;
  document.getElementById("home-saving-total").textContent = formatWon(appState.totalSaved);
  document.getElementById("home-month-spend").textContent = formatWon(appState.currentMonthSpend);
  document.getElementById("home-savings-account").textContent = formatWon(appState.savingsAccount);
  document.getElementById("home-savings-account-clone").textContent = formatWon(appState.savingsAccount);
  document.getElementById("status-month-saving").textContent = formatWon(appState.currentMonthSaving);
  document.getElementById("status-goal-amount").textContent = formatWon(focusGoal);
  document.getElementById("status-challenge-count").textContent = `${appState.statusChallengeCountDisplay || appState.challenges.length}\uAC74`;
}

function openChallengeDetail(challengeId, sourceScreen = appState.currentScreen) {
  appState.selectedChallengeId = challengeId;
  appState.lastScreen = sourceScreen;
  renderChallengeOverview();
  setScreen("challenge-detail");
}

function renderChallengeOverview() {
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  const sourceCandidate = getChallengeSourceCandidate(challenge);
  const baseMonthlyAmount = challenge.baseMonthlyAmount || Math.round(sourceCandidate?.monthlyAmount || challenge.targetAmount);
  const baseMonthlyCount = challenge.baseMonthlyCount || Math.max(Math.round(sourceCandidate?.monthlyCount || challenge.targetCount), 1);
  const monthSaving = challenge.detailMonthlySaving || challenge.monthlySavingTarget || Math.max(baseMonthlyAmount - challenge.targetAmount, 0);
  const totalSaving = challenge.totalSaving || monthSaving * 8;
  const history = challenge.history || [
    Math.round(monthSaving * 2.55),
    Math.round(monthSaving * 2.4),
    Math.round(monthSaving * 2.28),
  ];
  const recentAverage = Math.round(history.reduce((sum, value) => sum + value, 0) / history.length);
  const riseValue = Math.max((history[0] || 0) - (history[1] || 0), 0);
  const previewYears = [2, 3, 5];
  const previewBase = appState.previewUsesAverage ? monthSaving : Math.max(challenge.targetAmount - challenge.currentAmount, 0);

  document.getElementById("overview-title").textContent = challenge.title;
  document.getElementById("overview-amount-current").textContent = formatWon(challenge.currentAmount);
  document.getElementById("overview-amount-target").textContent = `/${formatWon(challenge.targetAmount)}`;
  document.getElementById("overview-count-current").textContent = formatCount(challenge.currentCount);
  document.getElementById("overview-count-target").textContent = `/${formatCount(challenge.targetCount)}`;
  document.getElementById("overview-month-saving").textContent = `${formatWon(monthSaving)} (${formatCount(challenge.targetCount)})`;
  document.getElementById("overview-base-spend").textContent = `${formatWon(baseMonthlyAmount)} (${formatCount(baseMonthlyCount)})`;
  document.getElementById("overview-total-saving").textContent = formatWon(totalSaving);
  document.getElementById("overview-start-date").textContent = challenge.startDate || "2025.06.15";
  document.querySelector(".overview-heading-value strong").textContent = formatWon(recentAverage);
  document.querySelector(".overview-rise").textContent = `\u25B2 ${formatWon(riseValue)}`;
  document.getElementById("preview-toggle").setAttribute("aria-pressed", String(appState.previewUsesAverage));

  const historyRows = document.querySelectorAll(".overview-history-row");
  historyRows.forEach((row, index) => {
    const amountEl = row.querySelector("strong");
    const monthEl = row.querySelector("span");
    if (amountEl) amountEl.textContent = formatWon(history[index] || 0);
    if (monthEl) monthEl.textContent = `${5 - index}\uC6D4`;
  });

  const previewRows = document.querySelectorAll(".preview-row");
  previewRows.forEach((row, index) => {
    const years = previewYears[index];
    const badge = row.querySelector(".preview-badge");
    const countEl = row.querySelector("strong");
    const amountEl = row.querySelector("b");
    if (badge) badge.textContent = `${years}Y`;
    if (countEl) countEl.textContent = formatCount(years * 12);
    if (amountEl) amountEl.textContent = formatWon(previewBase * years * 12);
  });
}

function getFilteredChallenges() {
  if (appState.challengeFilter === "in-progress") {
    return appState.challenges.filter((challenge) => challenge.currentAmount < challenge.targetAmount);
  }

  if (appState.challengeFilter === "completed") {
    return appState.archivedChallenges;
  }

  return [...appState.challenges, ...appState.archivedChallenges];
}

function renderChallengeCards(containerId, challenges, options = {}) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  challenges.forEach((challenge) => {
    const card = document.createElement("article");
    const isCompleted = challenge.status === "completed";
    card.className = `challenge-card${options.clickable === false || isCompleted ? "" : " is-clickable"}${isCompleted ? " is-completed" : ""}`;
    const currentLabel = isCompleted ? challenge.currentLabel : formatWon(challenge.currentAmount);
    const targetLabel = isCompleted ? challenge.targetLabel : `/${formatWon(challenge.targetAmount)}`;
    const countMarkup = isCompleted
      ? `<span class="challenge-status-label">${challenge.statusLabel || ""}</span>`
      : `<strong>${formatCount(challenge.currentCount)}</strong><span>/${formatCount(challenge.targetCount)}</span>`;
    card.innerHTML = `
      <div class="challenge-top">
        <div class="challenge-title-wrap">
          <div class="category-icon">${renderCategoryIcon(challenge.category, challenge.title, "large")}</div>
          <div>
            <h4>${challenge.title}</h4>
            <div class="challenge-progress">
              <strong>${currentLabel}</strong>
              <span>${targetLabel}</span>
            </div>
          </div>
        </div>
        <div class="challenge-count">
          ${countMarkup}
        </div>
      </div>
      <div class="challenge-divider"></div>
      <p>${challenge.insight}</p>
    `;
    if (options.clickable !== false && !isCompleted) {
      card.addEventListener("click", () => {
        openChallengeDetail(challenge.id, options.sourceScreen || appState.currentScreen);
      });
    }
    container.appendChild(card);
  });
}

function renderWishlistCard(item, options = {}) {
  const card = document.createElement("article");
  card.className = "wishlist-card wishlist-card--with-progress";
  card.innerHTML = `
    <div class="wishlist-image">
      <img src="${item.image}" alt="" loading="lazy" />
    </div>
    <div class="wishlist-copy">
      <strong>${item.title}</strong>
      <p>${formatWon(item.price)}</p>
      <div class="wishlist-progress">
        <span>${item.progress}%</span>
        <div><i style="width:${item.progress}%"></i></div>
      </div>
    </div>
  `;
  card.addEventListener("click", () => {
    appState.selectedWishlistId = item.id;
    renderWishlistDetail();
    setScreen("wishlist-detail");
  });
  if (options.compact) {
    card.classList.add("wishlist-card--compact");
  }
  return card;
}

function renderWishlist() {
  const container = document.getElementById("wishlist-page-grid");
  if (!container) return;
  container.innerHTML = "";
  appState.wishlistItems.forEach((item) => {
    container.appendChild(renderWishlistCard(item));
  });
}

function renderWishlistDetail() {
  const item = getCurrentWishlistItem();
  if (!item) return;
  const percent = Math.max(0, Math.min(item.progress, 100));

  document.getElementById("wishlist-detail-image").src = item.image;
  document.getElementById("wishlist-detail-category").textContent = item.category;
  document.getElementById("wishlist-detail-title").textContent = item.title;
  document.getElementById("wishlist-detail-price").textContent = formatWon(item.price);
  document.getElementById("wish-progress-fill").style.width = `${percent}%`;
  document.getElementById("wish-progress-bubble").style.left = `${percent}%`;
  document.getElementById("wish-progress-bubble").textContent = formatWon(item.savedAmount);
  document.getElementById("wish-achievement").textContent = `달성률 ${percent}%`;

  const metaRows = document.querySelectorAll(".wish-meta div");
  if (metaRows[0]) metaRows[0].querySelector("strong").textContent = item.registeredAt;
  if (metaRows[1]) metaRows[1].querySelector("strong").textContent = item.expectedAt;
}

function renderWishlistAddForm() {
  const preset = appState.selectedWishlistPreset ? wishlistCategoryPresets[appState.selectedWishlistPreset] : null;
  const imagePicker = document.getElementById("wishlist-image-picker");
  const nameInput = document.getElementById("wishlist-name-input");
  const categorySelect = document.getElementById("wishlist-category-select");
  const priceInput = document.getElementById("wishlist-price-input");
  const registerButton = document.getElementById("wishlist-register-button");

  if (!imagePicker || !nameInput || !categorySelect || !priceInput || !registerButton) return;

  imagePicker.innerHTML = preset
    ? `<img src="${preset.image}" alt="" />`
    : "이미지 추가";
  imagePicker.classList.toggle("has-image", Boolean(preset));
  nameInput.value = preset?.title || "";
  categorySelect.textContent = preset?.category || "카테고리를 선택해주세요.";
  priceInput.value = preset ? formatWon(preset.price) : "";
  registerButton.textContent = appState.wishlistJustRegistered ? "등록 완료" : "등록하기";
  registerButton.classList.toggle("disabled-button", !preset || appState.wishlistJustRegistered);
}

function getSpendCategories() {
  return [
    { key: "all", label: "전체", count: 25, icon: "grid" },
    { key: TEXT.categoryCafe, label: "카페/간식", count: 8, icon: TEXT.categoryCafe },
    { key: TEXT.categoryFood, label: "외식", count: 7, icon: TEXT.categoryFood },
    { key: "패션/쇼핑", label: "패션/쇼핑", count: 5, icon: "패션/쇼핑" },
    { key: "online", label: "온라인 쇼핑", count: 4, icon: "온라인쇼핑" },
    { key: TEXT.categoryTraffic, label: "교통", count: 2, icon: TEXT.categoryTraffic },
    { key: "술/유흥", label: "술/유흥", count: 2, icon: TEXT.categoryCafe },
    { key: "기타", label: "기타", count: 2, icon: "grid" },
  ];
}

function renderSpendCategoryIcon(category) {
  if (category.icon === "grid") {
    return `<span class="spend-grid-icon"><i></i><i></i><i></i><i></i></span>`;
  }
  return renderCategoryIcon(category.icon, category.label, "small");
}

function renderSpend() {
  const categoryContainer = document.getElementById("spend-category-row");
  const list = document.getElementById("spend-transaction-list");
  if (!categoryContainer || !list) return;

  const selectedSpend = spendData[appState.selectedSpendCategory] || spendData.all;
  document.getElementById("spend-total").textContent = formatWon(selectedSpend.total);
  document.getElementById("spend-share-label").innerHTML = `${selectedSpend.shareLabel} <b>${selectedSpend.share}%</b>`;
  document.getElementById("spend-saving-amount").textContent = formatWon(appState.savingsAccount);
  categoryContainer.innerHTML = "";
  getSpendCategories().forEach((category) => {
    const item = document.createElement("button");
    item.className = `spend-category${appState.selectedSpendCategory === category.key ? " active" : ""}`;
    item.dataset.spendCategory = category.key;
    item.innerHTML = `
      <span class="spend-category-icon">${renderSpendCategoryIcon(category)}<b>${category.count}</b></span>
      <span>${category.label}</span>
    `;
    item.addEventListener("click", () => {
      appState.selectedSpendCategory = category.key;
      renderSpend();
    });
    categoryContainer.appendChild(item);
  });
  requestAnimationFrame(() => {
    categoryContainer.querySelector(".spend-category.active")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });

  list.innerHTML = selectedSpend.groups.map((group) => `
    <div class="transaction-day">
      <p>${group.date}</p>
      <div class="transaction-divider"></div>
      ${group.rows.map((row) => `
        <article class="transaction-row">
          <div>
            <strong>${row.merchant}</strong>
            <span>${row.time}</span>
          </div>
          <b>-${formatWon(row.amount)}</b>
        </article>
      `).join("")}
    </div>
  `).join("");
}

function renderCandidateList() {
  const container = document.getElementById("candidate-list");
  container.innerHTML = "";

  appState.candidateCategories.forEach((candidate) => {
    const item = document.createElement("article");
    item.className = "candidate-item";
    item.dataset.candidateId = candidate.id;
    item.innerHTML = `
      <div class="candidate-leading">
        <div class="category-icon">${renderCategoryIcon(candidate.major, candidate.major, "small")}</div>
        <strong>${categoryLabelMap[candidate.major] || candidate.major}</strong>
      </div>
      <div class="candidate-stats">
        <div class="candidate-metric candidate-metric--annual">
          <span class="candidate-metric-label">${TEXT.yearSaving}</span>
          <strong>${formatWon(candidate.annualAmount)}</strong>
          <b>${formatCount(candidate.annualCount)}</b>
        </div>
        <div class="candidate-metric candidate-metric--monthly">
          <span class="candidate-metric-label">${TEXT.monthSaving} 평균</span>
          <span class="candidate-metric-subvalue">${formatWon(candidate.monthlyAmount)}</span>
          <b>${formatCountMetric(candidate.monthlyCount)}</b>
        </div>
        <div class="candidate-average-pill">
          <span>${TEXT.countAverage}</span>
          <strong>${formatWon(candidate.averageAmount)}</strong>
        </div>
      </div>
    `;
    item.addEventListener("click", () => {
      appState.selectedCandidateId = candidate.id;
      appState.selectedSubcategory = TEXT.all;
      appState.selectedRatio = 0.9;
      renderAll();
      setScreen("detail");
    });
    container.appendChild(item);
  });
}

function renderDetail() {
  const selection = getDetailSelection();
  if (!selection) return;
  const { candidate, subcategoryData } = selection;
  const shouldAnimateNumbers = document.querySelector('.screen.active')?.dataset.screen === "detail";

  document.getElementById("detail-category-title").textContent =
    categoryLabelMap[candidate.major] || candidate.major;
  document.querySelector(".candidate-summary .category-icon").innerHTML = renderCategoryIcon(
    candidate.major,
    candidate.major,
    "small",
  );
  const challengeNameEl = document.getElementById("detail-challenge-name");
  setRollingText(
    document.getElementById("detail-annual-amount"),
    formatWon(selection.annualAmount),
    { animate: shouldAnimateNumbers },
  );
  setRollingText(
    document.getElementById("detail-annual-count"),
    formatCount(selection.annualCount),
    { animate: shouldAnimateNumbers },
  );
  setRollingText(
    document.getElementById("detail-monthly-amount"),
    formatWon(selection.baseMonthlyAmount),
    { animate: shouldAnimateNumbers },
  );
  setRollingText(
    document.getElementById("detail-monthly-count"),
    formatCountMetric(selection.baseMonthlyCount),
    { animate: shouldAnimateNumbers },
  );
  challengeNameEl.textContent = selection.displayName;
  challengeNameEl.classList.toggle("is-placeholder", selection.nameIsPlaceholder);
  setRollingText(
    document.getElementById("detail-target-amount"),
    formatWon(selection.targetAmount),
    { animate: shouldAnimateNumbers, duration: 560, stagger: 24 },
  );
  setRollingText(
    document.getElementById("detail-target-count"),
    formatCount(selection.targetCount),
    { animate: shouldAnimateNumbers, duration: 480, stagger: 20 },
  );
  const detailSavingTextEl = document.getElementById("detail-saving-text");
  detailSavingTextEl.textContent = formatMonthlySavingText(selection.savingMonthly);
  detailSavingTextEl.setAttribute("aria-label", detailSavingTextEl.textContent);
  setRollingText(
    document.getElementById("detail-year-saving"),
    formatWon(selection.yearlySaving),
    { animate: shouldAnimateNumbers, duration: 580, stagger: 24 },
  );

  const subcategoryContainer = document.getElementById("detail-subcategory-chips");
  subcategoryContainer.innerHTML = "";
  const subcategoryNames = [TEXT.all, ...candidate.topSubcategories.map((item) => item.name)];
  subcategoryContainer.style.setProperty("--segment-count", String(Math.max(subcategoryNames.length, 1)));
  subcategoryNames.forEach((name) => {
    const chip = document.createElement("button");
    chip.className = `subcategory-chip${appState.selectedSubcategory === name ? " active" : ""}`;
    chip.textContent = name;
    chip.addEventListener("click", () => {
      appState.selectedSubcategory = name;
      renderDetail();
    });
    subcategoryContainer.appendChild(chip);
  });

  const ratioContainer = document.getElementById("detail-ratio-chips");
  ratioContainer.innerHTML = "";
  [
    { label: "90%", value: 0.9 },
    { label: "80%", value: 0.8 },
    { label: "70%", value: 0.7 },
    { label: "\uC9C1\uC811 \uC785\uB825", value: 0.65 },
  ].forEach((ratioOption) => {
    const chip = document.createElement("button");
    chip.className = `ratio-chip${appState.selectedRatio === ratioOption.value ? " active" : ""}`;
    chip.textContent = ratioOption.label;
    chip.addEventListener("click", () => {
      appState.selectedRatio = ratioOption.value;
      renderDetail();
    });
    ratioContainer.appendChild(chip);
  });
}

function renderAll() {
  updateHomeSummary();
  const filteredChallenges = getFilteredChallenges();
  document.getElementById("home-challenge-count").textContent = `${appState.homeChallengeCountDisplay || appState.challenges.length}\uAC74`;
  renderChallengeCards("home-challenge-list", appState.challenges.slice(0, 2), { sourceScreen: "home" });
  renderChallengeCards("all-challenge-list", filteredChallenges, { sourceScreen: "my-challenges" });
  renderChallengeCards("status-challenge-list", appState.challenges.slice(0, 1), { sourceScreen: "status" });
  renderCandidateList();
  renderDetail();
  renderChallengeOverview();
  renderWishlist();
  renderWishlistDetail();
  renderWishlistAddForm();
  renderSpend();
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === appState.challengeFilter);
  });
  requestAnimationFrame(refreshScreenScrollState);
}

function applyTransactions(transactions, sourceName = TEXT.sample) {
  appState.transactions = transactions;
  appState.sourceName = sourceName;

  const expenseRows = transactions.filter((item) => item.type === TEXT.expense && item.amount > 0);
  const monthKey = expenseRows[0]?.date?.slice(0, 7);
  const monthRows = expenseRows.filter((item) => item.date.startsWith(monthKey));
  const isSample = isSampleSource(sourceName);
  const candidates = isSample ? cloneData(sampleCandidateCategories) : computeCandidates(expenseRows);

  appState.currentMonthSpend = isSample
    ? 455250
    : monthRows.reduce((sum, item) => sum + item.amount, 0);
  appState.candidateCategories = candidates;
  appState.selectedCandidateId = candidates[0]?.id || null;
  appState.selectedSubcategory = TEXT.all;
  appState.selectedRatio = 0.9;
  const cafeCandidate = candidates.find((item) => item.major === TEXT.categoryCafe);
  appState.challenges = [
    {
      id: "habit-cafe",
      title: TEXT.titleHabitCafe,
      category: TEXT.categoryCafe,
      currentAmount: 22500,
      targetAmount: 69350,
      currentCount: 4,
      targetCount: 10,
      insight: "\uC6D4 13,870\uC6D0 \uC808\uC57D / \uC5F0 166,440\uC6D0 \uC808\uC57D",
      icon: "dining",
      baseMonthlyAmount: isSample ? 73860 : Math.round(cafeCandidate?.monthlyAmount || 73860),
      baseMonthlyCount: isSample ? 12 : Math.max(Math.round(cafeCandidate?.monthlyCount || 12), 1),
      monthlySavingTarget: 13870,
      detailMonthlySaving: 6155,
      totalSaving: 48650,
      startDate: "2025.06.15",
      history: [15780, 14900, 14200],
    },
  ];

  appState.monthlySavingGoal = appState.challenges.reduce(
    (sum, challenge) => sum + (challenge.monthlySavingTarget || 0),
    0,
  );
  appState.totalSaved = 955000;
  appState.savingPeriodLabel = "1\uB144 6\uAC1C\uC6D4";
  appState.homeChallengeCountDisplay = 2;
  appState.statusChallengeCountDisplay = 2;
  appState.selectedChallengeId = appState.challenges[0]?.id || null;
  statusText.textContent = `${sourceName} ${TEXT.statusApplied}`;
  renderAll();
}

function parseWorkbook(file) {
  if (typeof XLSX === "undefined") {
    statusText.textContent = TEXT.statusNoLibrary;
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const sheet = workbook.Sheets["\uAC00\uACC4\uBD80 \uB0B4\uC5ED"];

    if (!sheet) {
      statusText.textContent = TEXT.statusNoSheet;
      return;
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });
    const transactions = rows
      .map((row) => {
        const rawAmount = Number(row["\uAE08\uC561"]);
        return {
          date: formatExcelDate(row["\uB0A0\uC9DC"]),
          time: row["\uC2DC\uAC04"],
          type: row["\uD0C0\uC785"],
          major: row["\uB300\uBD84\uB958"] || "\uAE30\uD0C0",
          minor: row["\uC18C\uBD84\uB958"] || "\uAE30\uD0C0",
          merchant: row["\uB0B4\uC6A9"] || "\uC774\uB984 \uC5C6\uC74C",
          amount: Math.abs(rawAmount || 0),
          paymentMethod: row["\uACB0\uC81C\uC218\uB2E8"] || "",
        };
      })
      .filter((row) => row.date && row.type);

    if (!transactions.length) {
      statusText.textContent = TEXT.statusNoRows;
      return;
    }

    applyTransactions(transactions, file.name);
  };

  reader.readAsArrayBuffer(file);
}

function formatExcelDate(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number") {
    const converted = XLSX.SSF.parse_date_code(value);
    if (!converted) return null;
    const mm = String(converted.m).padStart(2, "0");
    const dd = String(converted.d).padStart(2, "0");
    return `${converted.y}-${mm}-${dd}`;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "-").replace(/\//g, "-");
    const maybeDate = new Date(normalized);
    if (!Number.isNaN(maybeDate.getTime())) {
      return maybeDate.toISOString().slice(0, 10);
    }
  }

  return null;
}

function completeChallenge() {
  const challenge = buildChallengeFromCandidate(getCurrentCandidate());
  if (!challenge) return;
  const existingIndex = appState.challenges.findIndex((item) => item.id === challenge.id);

  if (existingIndex >= 0) {
    const previous = appState.challenges[existingIndex];
    appState.challenges[existingIndex] = {
      ...previous,
      ...challenge,
      currentAmount: previous.currentAmount || challenge.currentAmount,
      currentCount: previous.currentCount || challenge.currentCount,
      startDate: previous.startDate || challenge.startDate,
    };
  } else {
    appState.challenges.push(challenge);
  }

  const displayCount = Math.max(appState.challenges.length, 2);
  appState.homeChallengeCountDisplay = displayCount;
  appState.statusChallengeCountDisplay = displayCount;
  appState.selectedChallengeId = challenge.id;
  renderAll();
  showModal(TEXT.modalAdded);
}

function resetPrototype() {
  hideModal();
  hideCategorySheet();
  if (uploadInput) uploadInput.value = "";

  appState.lastScreen = "home";
  appState.challengeFilter = "all";
  appState.selectedSubcategory = TEXT.all;
  appState.selectedRatio = 0.9;
  appState.previewUsesAverage = true;
  appState.selectedSpendCategory = "all";
  appState.selectedWishlistId = "snowman";
  appState.selectedWishlistPreset = null;
  appState.wishlistJustRegistered = false;
  appState.modalMode = "challenge";
  appState.wishlistItems = getInitialWishlistItems();
  appState.currentMonthSaving = INITIAL_SUMMARY.currentMonthSaving;
  appState.savingsAccount = INITIAL_SUMMARY.savingsAccount;
  appState.currentMonthSpend = INITIAL_SUMMARY.currentMonthSpend;
  appState.totalSaved = INITIAL_SUMMARY.totalSaved;
  appState.savingPeriodLabel = INITIAL_SUMMARY.savingPeriodLabel;

  applyTransactions(cloneData(sampleTransactions), TEXT.sample);
  statusText.textContent = "\uCCAB \uD654\uBA74\uC73C\uB85C \uCD08\uAE30\uD654\uB428";
  setScreen("home");
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "reset-prototype") resetPrototype();
      if (action === "go-home") setScreen("home");
      if (action === "go-add") setScreen("add");
      if (action === "go-status") setScreen("status");
      if (action === "go-my-challenges") setScreen("my-challenges");
      if (action === "go-wishlist") setScreen("wishlist");
      if (action === "go-wishlist-add") {
        appState.selectedWishlistPreset = null;
        appState.wishlistJustRegistered = false;
        renderWishlistAddForm();
        setScreen("wishlist-add");
      }
      if (action === "go-spend") setScreen("spend");
      if (action === "open-wishlist-primary") {
        appState.selectedWishlistId = "snowman";
        renderWishlistDetail();
        setScreen("wishlist-detail");
      }
      if (action === "open-wishlist-secondary") {
        appState.selectedWishlistId = "stanley";
        renderWishlistDetail();
        setScreen("wishlist-detail");
      }
      if (action === "go-detail-from-wishlist") {
        appState.selectedChallengeId = "habit-cafe";
        appState.lastScreen = "wishlist-detail";
        renderChallengeOverview();
        setScreen("challenge-detail");
      }
      if (action === "open-category-sheet") {
        showCategorySheet();
      }
      if (action === "close-category-sheet") {
        hideCategorySheet();
      }
      if (action === "register-wishlist") {
        if (appState.wishlistJustRegistered) return;
        const preset = appState.selectedWishlistPreset ? wishlistCategoryPresets[appState.selectedWishlistPreset] : null;
        if (!preset) {
          showCategorySheet();
          return;
        }
        const normalizedPreset = {
          ...preset,
          id: preset.id || slugify(preset.title),
          progress: preset.progress ?? 58,
          savedAmount: preset.savedAmount ?? 32500,
          status: "in-progress",
          registeredAt: preset.registeredAt || "2026년 6월 27일",
          expectedAt: preset.expectedAt || "2026년 11월",
        };
        const existingIndex = appState.wishlistItems.findIndex((item) => item.id === normalizedPreset.id);
        if (existingIndex >= 0) {
          appState.wishlistItems[existingIndex] = normalizedPreset;
        } else {
          appState.wishlistItems.unshift(normalizedPreset);
        }
        appState.selectedWishlistId = normalizedPreset.id;
        appState.wishlistJustRegistered = true;
        renderAll();
        showModal(
          "위시리스트 내역을 확인하러 가시겠어요?",
          "위시리스트 등록이 완료되었습니다!",
          "wishlist",
        );
      }
      if (action === "go-back-overview") setScreen(appState.lastScreen || "home");
      if (action === "close-modal") hideModal();
      if (action === "go-home-modal") {
        hideModal();
        setScreen("home");
      }
      if (action === "confirm-modal") {
        hideModal();
        setScreen(appState.modalMode === "wishlist" ? "wishlist" : "my-challenges");
      }
    });
  });

  document.querySelector(".small-edit-button")?.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    const sourceCandidate = getChallengeSourceCandidate(challenge);
    if (sourceCandidate) {
      appState.selectedCandidateId = sourceCandidate.id;
      appState.selectedSubcategory = challenge.selectedSubcategory || TEXT.all;
      renderDetail();
      setScreen("detail");
      return;
    }

    setScreen(appState.lastScreen || "home");
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.challengeFilter = button.dataset.filter || "all";
      renderAll();
    });
  });

  document.getElementById("preview-toggle")?.addEventListener("click", () => {
    appState.previewUsesAverage = !appState.previewUsesAverage;
    renderChallengeOverview();
  });

  document.getElementById("complete-button").addEventListener("click", completeChallenge);

  categorySheetBackdrop?.addEventListener("click", (event) => {
    if (event.target === categorySheetBackdrop) hideCategorySheet();
  });

  document.querySelectorAll("[data-wishlist-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedWishlistPreset = button.dataset.wishlistPreset;
      renderWishlistAddForm();
      hideCategorySheet();
    });
  });

  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    statusText.textContent = `${file.name} ${TEXT.statusLoading}`;
    parseWorkbook(file);
  });
}

function bindStaticAssets() {
  const wishOne = document.getElementById("wishlist-image-1");
  const wishTwo = document.getElementById("wishlist-image-2");

  if (wishOne) wishOne.src = ASSETS.wishSnowman;
  if (wishTwo) wishTwo.src = ASSETS.wishTumbler;
}

function updateStatusTime() {
  const timeEl = document.getElementById("status-time");
  if (!timeEl) return;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  const displayHour = hour % 12 || 12;

  timeEl.textContent = `${displayHour}:${minute}`;
}

bindActions();
bindScrollGuards();
bindScrollStateObservers();
bindStaticAssets();
updateStatusTime();
setInterval(updateStatusTime, 60000);
statusText.textContent = TEXT.statusReady;
applyTransactions(sampleTransactions, TEXT.sample);
renderAll();
