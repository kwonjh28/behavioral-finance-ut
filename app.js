const currency = new Intl.NumberFormat("ko-KR");

const screenEls = [...document.querySelectorAll(".screen")];
const modalBackdrop = document.getElementById("modal-backdrop");
const categorySheetBackdrop = document.getElementById("category-sheet-backdrop");
const uploadInput = document.getElementById("excel-file");
const statusText = document.getElementById("status-text");
const uploadCompleteToast = document.getElementById("upload-complete-toast");
let scrollStateRefreshQueued = false;
let uploadToastTimer = null;

const ASSETS = {
  iconCafe: "./assets/icons/cafe.svg",
  iconDining: "./assets/icons/dining.png",
  iconShopping: "./assets/icons/shopping.svg",
  iconShoppingBack: "./assets/icons/shopping-back.svg",
  iconShoppingHandle: "./assets/icons/shopping-handle.svg",
  iconShoppingBody: "./assets/icons/shopping-body.svg",
  iconFashion: "./assets/icons/fashion.svg",
  iconEducation: "./assets/icons/education.svg",
  iconPet: "./assets/icons/pet.svg",
  iconBeauty: "./assets/icons/beauty.svg",
  iconBus: "./assets/icons/bus.svg",
  iconTransport: "./assets/icons/car.svg",
  iconCommunication: "./assets/icons/letter.svg",
  iconMedical: "./assets/icons/medic.svg",
  iconHousing: "./assets/icons/house.svg",
  iconGame: "./assets/icons/joystick.svg",
  iconTravel: "./assets/icons/travel.png",
  iconFinance: "./assets/icons/finance.png",
  iconWine: "./assets/icons/wine.png",
  iconLife: "./assets/icons/life.svg",
  wishOne: "./assets/wishlist/snowman.png",
  wishTwo: "./assets/wishlist/tumbler.png",
  wishSnowman: "./assets/wishlist/snowman.png",
  wishTumbler: "./assets/wishlist/tumbler.png",
  wishAesop: "./assets/wishlist/aesop.png",
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

const UT_ANALYSIS_MONTH = "2026-06";

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

const surveyQuestions = [
  {
    eyebrow: "UI 01",
    title: "소비 카테고리 인지",
    image: "./assets/survey/spend.png",
    question: "카테고리별로 모아진 소비 내역은 내가 어느 카테고리에서 어느 정도의 금액을 사용하는지 파악하는데 도움이 된다.",
  },
  {
    eyebrow: "UI 02",
    title: "챌린지 후보 선택",
    image: "./assets/survey/challenge-add.png",
    question: "해당 화면은 절약하고자 하는 소비 카테고리를 선정하는데 도움이 된다.",
  },
  {
    eyebrow: "UI 03",
    title: "목표 설정",
    image: "./assets/survey/challenge-add-detail.png",
    question: "비율(%)이나 횟수를 기반으로 챌린지를 설정하는 방식은 절약 목표를 세우는 데 도움이 되었다.",
  },
  {
    eyebrow: "UI 04",
    title: "절약 금액 추정",
    image: "./assets/survey/challenge-add-detail.png",
    question: "매년 아낄 수 있는 금액을 추정하여 보여주는 것은 챌린지에 대한 동기부여에 도움이 된다.",
  },
  {
    eyebrow: "UI 05",
    title: "세이빙 미리보기",
    image: "./assets/survey/challenge-detail.png",
    question: "‘세이빙 미리보기’의 n년 뒤 절감 가능한 자산 규모로 시각화되는 화면은 소비습관 관리에 대한 동기부여에 도움이 된다.",
  },
  {
    eyebrow: "UI 06",
    title: "결제 후 알림",
    image: "./assets/survey/lockscreen.png",
    question: "결제 이후 마주하게 되는 푸시알림은, 이후의 순간적인 충동 결제 및 습관성 결제를 줄여야겠다는 심리적 브레이크를 작동시킨다.",
  },
  {
    eyebrow: "UI 07",
    title: "위시리스트 연결",
    image: "./assets/survey/wishlist-detail.png",
    question: "단순히 '돈을 아껴라'가 아니라 '원하는 것을 구매하기 위해 이 지출을 제어하라'고 제안하는 방식이 기존 가계부 앱보다 동기부여가 잘 된다.",
  },
  {
    eyebrow: "마지막 문항",
    title: "서비스 전체 평가",
    noPreview: true,
    question: "기존에 사용하던 금융 앱(토스, 뱅크샐러드 등)과 비교했을 때, 이 서비스는 내 소비 행동을 변화시키는 데 실질적으로 더 유용하다고 느낀다.",
  },
];

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
  candidateSort: "count",
  selectedCandidateId: null,
  selectedChallengeId: "habit-cafe",
  challengeFilter: "all",
  selectedSubcategory: TEXT.all,
  selectedRatio: 0.9,
  detailTargetMode: "ratio",
  detailMode: "add",
  editingChallengeId: null,
  detailReturnScreen: "add",
  manualTargetCount: null,
  previewUsesAverage: true,
  selectedSpendCategory: "all",
  selectedWishlistId: "snowman",
  selectedWishlistPreset: null,
  wishlistJustRegistered: false,
  modalMode: "challenge",
  surveyIndex: 0,
  surveyAnswers: Array(surveyQuestions.length).fill(null),
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
      detailMonthlySaving: 13870,
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
  tech: { title: "아이폰 17pro", price: 1790000, category: "테크/가전", image: ASSETS.wishTumbler },
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
  "\uAD50\uC721/\uD559\uC2B5": "\uAD50\uC721/\uD559\uC2B5",
  "\uBB38\uD654/\uC5EC\uAC00": "\uBB38\uD654/\uC5EC\uAC00",
  "\uBC18\uB824\uB3D9\uBB3C": "\uBC18\uB824\uB3D9\uBB3C",
  "\uBDF0\uD2F0/\uBBF8\uC6A9": "\uBDF0\uD2F0/\uBBF8\uC6A9",
  "\uC790\uB3D9\uCC28": "\uC790\uB3D9\uCC28",
  "\uC8FC\uAC70/\uD1B5\uC2E0": "\uC8FC\uAC70/\uD1B5\uC2E0",
  "\uACBD\uC870/\uC120\uBB3C": "\uACBD\uC870/\uC120\uBB3C",
  "\uC758\uB8CC\uAC74\uAC15": "\uC758\uB8CC\uAC74\uAC15",
  "\uC758\uB8CC/\uAC74\uAC15": "\uC758\uB8CC/\uAC74\uAC15",
  "\uC5EC\uD589/\uC219\uBC15": "\uC5EC\uD589/\uC219\uBC15",
  "\uAE08\uC735": "\uAE08\uC735",
  "\uC220/\uC720\uD765": "\uC220/\uC720\uD765",
  "\uAE30\uD0C0": "\uAE30\uD0C0",
};

const categoryAssetMap = {
  [TEXT.categoryCafe]: ASSETS.iconCafe,
  [TEXT.categoryFood]: ASSETS.iconDining,
  [TEXT.categoryTraffic]: ASSETS.iconDining,
  [TEXT.categoryShopping]: ASSETS.iconFashion,
  "\uC628\uB77C\uC778\uC1FC\uD551": ASSETS.iconShopping,
  "\uD328\uC158/\uC1FC\uD551": ASSETS.iconFashion,
  "\uC5EC\uD589/\uC219\uBC15": ASSETS.iconTravel,
  "\uAE08\uC735": ASSETS.iconFinance,
  "\uC220/\uC720\uD765": ASSETS.iconWine,
};

const categoryMaskAssetMap = {
  [TEXT.categoryLife]: { asset: ASSETS.iconLife, className: "category-mask-icon--life" },
  "\uAD50\uC721/\uD559\uC2B5": { asset: ASSETS.iconEducation, className: "category-mask-icon--education" },
  "\uBB38\uD654/\uC5EC\uAC00": { asset: ASSETS.iconGame, className: "category-mask-icon--game" },
  "\uBC18\uB824\uB3D9\uBB3C": { asset: ASSETS.iconPet, className: "category-mask-icon--pet" },
  "\uBDF0\uD2F0/\uBBF8\uC6A9": { asset: ASSETS.iconBeauty, className: "category-mask-icon--beauty" },
  "\uC790\uB3D9\uCC28": { asset: ASSETS.iconTransport, className: "category-mask-icon--transport" },
  "\uC8FC\uAC70/\uD1B5\uC2E0": { asset: ASSETS.iconHousing, className: "category-mask-icon--housing" },
  "\uACBD\uC870/\uC120\uBB3C": { asset: ASSETS.iconCommunication, className: "category-mask-icon--communication" },
  "\uC758\uB8CC\uAC74\uAC15": { asset: ASSETS.iconMedical, className: "category-mask-icon--medical" },
  "\uC758\uB8CC/\uAC74\uAC15": { asset: ASSETS.iconMedical, className: "category-mask-icon--medical" },
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

function formatKoreanYearMonth(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getMonthlyChallengeSavingTotal() {
  const activeMonthlySaving = appState.challenges.reduce((sum, challenge) => {
    if (challenge.status === "completed") return sum;
    return sum + (challenge.monthlySavingTarget || 0);
  }, 0);

  return activeMonthlySaving || appState.monthlySavingGoal || INITIAL_SUMMARY.monthlySavingGoal;
}

function getWishlistMonthsToGoal(item, monthlySavingOverride = getMonthlyChallengeSavingTotal()) {
  const price = Math.max(Number(item?.price || 0), 0);
  const savedAmount = Math.max(Number(appState.savingsAccount || 0), 0);
  const remainingAmount = Math.max(price - savedAmount, 0);
  const monthlySaving = Math.max(Math.round(Number(monthlySavingOverride) || 0), 1);
  return remainingAmount > 0 ? Math.ceil(remainingAmount / monthlySaving) : 0;
}

function getChallengeOneMoreMonthlySaving(challenge) {
  if (!challenge || challenge.status === "completed") return 0;
  const averageByBase =
    Number(challenge.baseMonthlyCount || 0) > 0
      ? Number(challenge.baseMonthlyAmount || 0) / Number(challenge.baseMonthlyCount || 0)
      : 0;
  const averageByTarget =
    Number(challenge.targetCount || 0) > 0
      ? Number(challenge.targetAmount || 0) / Number(challenge.targetCount || 0)
      : 0;
  return Math.max(Math.round(averageByBase || averageByTarget || 0), 0);
}

function getWishlistRecommendationModels(item) {
  const currentMonthlySaving = getMonthlyChallengeSavingTotal();
  const currentMonths = getWishlistMonthsToGoal(item, currentMonthlySaving);
  if (currentMonths <= 0) return [];

  return appState.challenges
    .filter((challenge) => challenge.status !== "completed")
    .map((challenge) => {
      const additionalSaving = getChallengeOneMoreMonthlySaving(challenge);
      const revisedMonths = getWishlistMonthsToGoal(item, currentMonthlySaving + additionalSaving);
      return {
        challenge,
        additionalSaving,
        reducedMonths: Math.max(currentMonths - revisedMonths, 1),
      };
    })
    .filter((model) => model.additionalSaving > 0)
    .sort((a, b) => b.reducedMonths - a.reducedMonths)
    .slice(0, 2);
}

function getWishlistProgressModel(item) {
  const price = Math.max(Number(item?.price || 0), 0);
  const savedAmount = Math.max(Number(appState.savingsAccount || 0), 0);
  const rawPercent = price ? (savedAmount / price) * 100 : 0;
  const percent = Math.max(0, Math.min(Math.round(rawPercent), 100));
  const monthsToGoal = getWishlistMonthsToGoal(item);
  const expectedDate = addMonths(new Date(), monthsToGoal);

  return {
    savedAmount,
    percent,
    expectedAt: formatKoreanYearMonth(expectedDate),
  };
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
    const wrapper = document.createElement("span");
    wrapper.className = "rolling-value";
    wrapper.textContent = normalized;
    element.replaceChildren(wrapper);
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

function normalizeTransactionType(type, rawAmount) {
  const normalized = String(type || "").replace(/\s+/g, "");
  if (["이체", "입금", "충전", "내계좌이체"].some((keyword) => normalized.includes(keyword))) {
    return type || "";
  }
  if ([TEXT.expense, "출금", "사용", "결제", "체크카드", "카드사용", "승인"].some((keyword) => normalized.includes(keyword))) {
    return TEXT.expense;
  }
  if (!normalized && Number(rawAmount) < 0) return TEXT.expense;
  return type || "";
}

function getExpenseRows(transactions = appState.transactions) {
  return transactions.filter((item) => normalizeTransactionType(item.type, item.rawAmount) === TEXT.expense && item.amount > 0 && item.date);
}

function isExpenseOutflow(item) {
  return Number(item.rawAmount) < 0;
}

function getExpenseImpact(item) {
  return isExpenseOutflow(item) ? item.amount : -item.amount;
}

function getNetExpenseAmount(rows) {
  return Math.max(
    rows.reduce((sum, item) => sum + getExpenseImpact(item), 0),
    0,
  );
}

function getLatestMonthKey(transactions = appState.transactions) {
  return getExpenseRows(transactions)
    .map((item) => item.date.slice(0, 7))
    .sort()
    .at(-1) || null;
}

function getAnalysisMonthKey(transactions = appState.transactions) {
  const expenseRows = getExpenseRows(transactions);
  const hasUtMonth = expenseRows.some((item) => item.date.startsWith(UT_ANALYSIS_MONTH));
  return hasUtMonth ? UT_ANALYSIS_MONTH : getLatestMonthKey(transactions);
}

function getCurrentMonthRows(transactions = appState.transactions) {
  const monthKey = getAnalysisMonthKey(transactions);
  if (!monthKey) return [];
  return getExpenseRows(transactions).filter((item) => item.date.startsWith(monthKey));
}

function isOnlineShoppingTransaction(item) {
  const source = `${item.major || ""} ${item.minor || ""} ${item.merchant || ""}`.toLowerCase();
  return [
    "온라인",
    "쿠팡",
    "네이버",
    "컬리",
    "무신사",
    "지그재그",
    "에이블리",
    "오늘의집",
    "11번가",
    "g마켓",
    "옥션",
  ].some((keyword) => source.includes(keyword.toLowerCase()));
}

function formatTransactionDay(dateString) {
  const date = new Date(`${dateString}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function formatTransactionTime(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
  }
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const hour = String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0");
    const minute = String(totalMinutes % 60).padStart(2, "0");
    return `${hour}:${minute}`;
  }
  const text = String(value).trim();
  const timeMatch = text.match(/(\d{1,2})[:시](\d{1,2})?/);
  if (!timeMatch) return text;
  const hour = String(Number(timeMatch[1])).padStart(2, "0");
  const minute = String(Number(timeMatch[2] || 0)).padStart(2, "0");
  return `${hour}:${minute}`;
}

function normalizeSpendCategoryKey(value, item = null) {
  if (item && isOnlineShoppingTransaction(item)) return "online";
  const normalized = String(value || "").replace(/\s+/g, "");
  if (normalized.includes("온라인")) return "online";
  if (normalized.includes("카페") || normalized.includes("간식") || normalized.includes("커피")) return TEXT.categoryCafe;
  if (normalized.includes("식비") || normalized.includes("외식") || normalized.includes("음식")) return TEXT.categoryFood;
  if (normalized.includes("자동차") || normalized.includes("차량") || normalized.includes("주유") || normalized.includes("택시")) return "자동차";
  if (normalized.includes("교통")) return TEXT.categoryTraffic;
  if (normalized.includes("교육") || normalized.includes("학습") || normalized.includes("강의")) return "교육/학습";
  if (normalized.includes("문화") || normalized.includes("여가") || normalized.includes("게임") || normalized.includes("오락") || normalized.includes("영화") || normalized.includes("공연") || normalized.includes("전시")) return "문화/여가";
  if (normalized.includes("반려") || normalized.includes("동물") || normalized.includes("펫")) return "반려동물";
  if (normalized.includes("뷰티") || normalized.includes("미용") || normalized.includes("화장품")) return "뷰티/미용";
  if (normalized.includes("주거") || normalized.includes("월세") || normalized.includes("관리비") || normalized.includes("인테리어") || normalized.includes("통신")) return "주거/통신";
  if (normalized.includes("경조") || normalized.includes("선물") || normalized.includes("축의") || normalized.includes("조의")) return "경조/선물";
  if (normalized.includes("의료") || normalized.includes("병원") || normalized.includes("약국") || normalized.includes("건강")) return "의료/건강";
  if (normalized.includes("여행") || normalized.includes("숙박") || normalized.includes("항공") || normalized.includes("호텔")) return "여행/숙박";
  if (normalized.includes("금융") || normalized.includes("보험") || normalized.includes("대출") || normalized.includes("이자") || normalized.includes("수수료")) return "금융";
  if (normalized.includes("술") || normalized.includes("유흥") || normalized.includes("주점") || normalized.includes("와인") || normalized.includes("맥주")) return "술/유흥";
  if (normalized.includes("생활")) return TEXT.categoryLife;
  if (normalized.includes("패션") || normalized.includes("쇼핑") || value === TEXT.categoryShopping) return "패션/쇼핑";
  return value || "기타";
}

function getCandidateMajor(item) {
  if (isOnlineShoppingTransaction(item)) return "온라인쇼핑";
  const normalized = normalizeSpendCategoryKey(item.major, item);
  if (normalized === "online") return "온라인쇼핑";
  return normalized || "기타";
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
  if (["home", "status", "my-challenges", "wishlist", "spend", "add", "wishlist-detail"].includes(screenName)) {
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

function getActiveScreenName() {
  return document.querySelector(".screen.active")?.dataset.screen || appState.currentScreen || appState.lastScreen || "home";
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

function getCategoryIconClass(category) {
  if (category === TEXT.categoryCafe) return "category-icon-image--cafe";
  if (category === TEXT.categoryFood) {
    return "category-icon-image--dining";
  }
  if (category === TEXT.categoryTraffic) return "category-icon-image--bus";
  if (category === "온라인쇼핑") return "category-icon-image--shopping";
  if (category === TEXT.categoryShopping || category === "패션/쇼핑") return "category-icon-image--fashion";
  if (category === "여행/숙박") return "category-icon-image--travel";
  if (category === "금융") return "category-icon-image--finance";
  if (category === "술/유흥") return "category-icon-image--wine";
  return "category-icon-image--dining";
}

function getMaskCategoryIcon(category) {
  return categoryMaskAssetMap[normalizeSpendCategoryKey(category)] || null;
}

function renderCategoryIcon(category, alt = "", size = "default", color = "default") {
  if (category === TEXT.categoryTraffic) {
    return `<img class="category-icon-image category-icon-image--${size} category-icon-image--bus" src="${ASSETS.iconBus}" alt="${alt}" loading="lazy" />`;
  }

  if (category === "온라인쇼핑") {
    return `
      <span class="shopping-icon shopping-icon--${size}" role="img" aria-label="${alt}">
        <img class="shopping-icon-part shopping-icon-back" src="${ASSETS.iconShoppingBack}" alt="" loading="lazy" />
        <img class="shopping-icon-part shopping-icon-handle" src="${ASSETS.iconShoppingHandle}" alt="" loading="lazy" />
        <img class="shopping-icon-part shopping-icon-body" src="${ASSETS.iconShoppingBody}" alt="" loading="lazy" />
      </span>
    `;
  }

  if (category === "기타") {
    return `
      <span class="category-else-icon category-else-icon--${size} category-else-icon--${color}" role="img" aria-label="${alt}">
        <i></i><i></i><i></i>
      </span>
    `;
  }

  const maskIcon = getMaskCategoryIcon(category);
  if (maskIcon) {
    return `
      <span class="category-mask-icon category-mask-icon--${size} category-mask-icon--${color} ${maskIcon.className}" role="img" aria-label="${alt}">
        <span class="category-mask-icon-shape" style="--category-icon-mask: url('${maskIcon.asset}')"></span>
      </span>
    `;
  }

  const asset = getCategoryAsset(category);
  const iconClass = getCategoryIconClass(category);
  return `<img class="category-icon-image category-icon-image--${size} ${iconClass}" src="${asset}" alt="${alt}" loading="lazy" />`;
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
  if (!categorySheetBackdrop) return;
  categorySheetBackdrop.classList.remove("hidden", "is-closing");
  requestAnimationFrame(() => {
    categorySheetBackdrop.classList.add("is-open");
  });
}

function hideCategorySheet() {
  if (!categorySheetBackdrop || categorySheetBackdrop.classList.contains("hidden")) return;
  categorySheetBackdrop.classList.remove("is-open");
  categorySheetBackdrop.classList.add("is-closing");
}

function getCurrentCandidate() {
  return (
    appState.candidateCategories.find(
      (candidate) => candidate.id === appState.selectedCandidateId,
    ) || appState.candidateCategories[0]
  );
}

function resetDetailTargetMode() {
  appState.detailTargetMode = "ratio";
  appState.manualTargetCount = null;
}

function getChallengeSourceCandidate(challenge) {
  if (!challenge) return null;

  return appState.candidateCategories.find(
    (candidate) => candidate.id === challenge.id || candidate.major === challenge.category,
  );
}

function getOrCreateChallengeEditCandidate(challenge) {
  const sourceCandidate = getChallengeSourceCandidate(challenge);
  if (sourceCandidate) return sourceCandidate;
  if (!challenge) return null;

  const baseMonthlyAmount = Math.max(Math.round(challenge.baseMonthlyAmount || challenge.targetAmount || 0), 0);
  const baseMonthlyCount = Math.max(Math.round(challenge.baseMonthlyCount || challenge.targetCount || 1), 1);
  const averageAmount = baseMonthlyCount ? Math.round(baseMonthlyAmount / baseMonthlyCount) : baseMonthlyAmount;
  const editCandidate = {
    id: challenge.id,
    major: challenge.category,
    title: challenge.title,
    defaultTitle: challenge.title,
    annualAmount: baseMonthlyAmount * 12,
    annualCount: baseMonthlyCount * 12,
    monthlyAmount: baseMonthlyAmount,
    monthlyCount: baseMonthlyCount,
    averageAmount,
    topSubcategories: [],
    ratioOverrides: {
      [String(challenge.selectedRatio || 0.9)]: {
        targetAmount: challenge.targetAmount,
        targetCount: challenge.targetCount,
        monthlySaving: challenge.monthlySavingTarget || challenge.detailMonthlySaving || Math.max(baseMonthlyAmount - challenge.targetAmount, 0),
        yearlySaving: challenge.totalSaving || (challenge.monthlySavingTarget || 0) * 12,
      },
    },
  };
  appState.candidateCategories.unshift(editCandidate);
  return editCandidate;
}

function openChallengeEdit(challenge, sourceScreen = null) {
  const returnScreen = sourceScreen || getActiveScreenName();
  const sourceCandidate = getOrCreateChallengeEditCandidate(challenge);
  if (!challenge || !sourceCandidate) {
    setScreen(returnScreen || "home");
    return;
  }

  appState.selectedChallengeId = challenge.id;
  appState.editingChallengeId = challenge.id;
  appState.detailReturnScreen = returnScreen && returnScreen !== "detail" ? returnScreen : "home";
  appState.selectedCandidateId = sourceCandidate.id;
  appState.selectedSubcategory = challenge.selectedSubcategory || TEXT.all;
  appState.selectedRatio = challenge.selectedRatio || 0.9;
  appState.detailMode = "edit";
  appState.detailTargetMode = challenge.targetMode || "ratio";
  appState.manualTargetCount = challenge.targetMode === "count" ? challenge.manualTargetCount || challenge.targetCount : null;
  renderDetail();
  setScreen("detail");
}

function isDetailEditing(selection = null) {
  if (appState.detailMode !== "edit") return false;
  if (!appState.editingChallengeId) return false;
  return true;
}

function computeCandidates(transactions) {
  const expenseRows = getExpenseRows(transactions);
  const grouped = new Map();

  expenseRows.forEach((item) => {
    const key = getCandidateMajor(item);
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
    const expenseImpact = getExpenseImpact(item);
    bucket.totalAmount += expenseImpact;
    if (isExpenseOutflow(item)) {
      bucket.totalCount += 1;
    }
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
    subBucket.totalAmount += expenseImpact;
    if (isExpenseOutflow(item)) {
      subBucket.totalCount += 1;
    }
  });

  return [...grouped.values()]
    .filter((bucket) => bucket.totalAmount > 0 && bucket.totalCount > 0)
    .map((bucket) => {
      const monthCount = Math.max(bucket.months.size, 1);
      const monthlyAmount = bucket.totalAmount / monthCount;
      const monthlyCount = bucket.totalCount / monthCount;
      const topSubcategories = [...bucket.subcategories.values()]
        .filter((subcategory) => subcategory.totalAmount > 0 && subcategory.totalCount > 0)
        .map((subcategory) => ({
          ...subcategory,
          annualAmount: subcategory.totalAmount,
          annualCount: subcategory.totalCount,
          monthlyAmount: subcategory.totalAmount / monthCount,
          monthlyCount: subcategory.totalCount / monthCount,
          averageAmount: subcategory.totalCount ? subcategory.totalAmount / subcategory.totalCount : subcategory.totalAmount,
          share: bucket.totalAmount ? subcategory.totalAmount / bucket.totalAmount : 0,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount || b.totalCount - a.totalCount)
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
    .sort((a, b) => b.totalCount - a.totalCount);
}

function createChallengeTitle(major, minor) {
  if (major === TEXT.categoryCafe) return TEXT.titleHabitCafe;
  if (major === TEXT.categoryFood && minor) {
    return `${minor} \uB35C \uC4F0\uACE0 \uC138\uC774\uBE59 \uB9CC\uB4E4\uAE30`;
  }
  if (major === TEXT.categoryLife) return TEXT.titleLife;
  return `${major} ${TEXT.titleSaving}`;
}

function createSavingChallengeTitle(label) {
  return `${label} 덜 쓰고 돈 아끼기`;
}

function getTopSubcategories(candidate) {
  return (candidate?.topSubcategories || [])
    .slice()
    .sort((a, b) => {
      const amountA = a.totalAmount ?? a.annualAmount ?? 0;
      const amountB = b.totalAmount ?? b.annualAmount ?? 0;
      const countA = a.totalCount ?? a.annualCount ?? 0;
      const countB = b.totalCount ?? b.annualCount ?? 0;
      return amountB - amountA || countB - countA;
    })
    .slice(0, 3);
}

function getDetailSelection() {
  const candidate = getCurrentCandidate();
  if (!candidate) return null;

  const topSubcategories = getTopSubcategories(candidate);
  if (
    appState.selectedSubcategory !== TEXT.all &&
    !topSubcategories.some((item) => item.name === appState.selectedSubcategory)
  ) {
    appState.selectedSubcategory = TEXT.all;
  }

  const subcategoryData =
    appState.selectedSubcategory === TEXT.all
      ? null
      : topSubcategories.find((item) => item.name === appState.selectedSubcategory);
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
  const averageAmount = source.averageAmount ?? (annualCount ? annualAmount / annualCount : annualAmount);
  const ratioTargetAmount = ratioOverride?.targetAmount ?? Math.round(baseMonthlyAmount * appState.selectedRatio);
  const ratioSavingMonthly = ratioOverride?.monthlySaving ?? Math.max(Math.round(baseMonthlyAmount - ratioTargetAmount), 0);
  const ratioTargetCount = ratioOverride?.targetCount ?? Math.max(Math.round(baseMonthlyCount * appState.selectedRatio), 1);
  const usesManualCount = appState.detailTargetMode === "count";
  const targetCount = usesManualCount
    ? Math.max(Math.round(Number(appState.manualTargetCount) || ratioTargetCount), 1)
    : ratioTargetCount;
  const countAverageAmount = baseMonthlyCount ? baseMonthlyAmount / baseMonthlyCount : baseMonthlyAmount;
  const targetAmount = usesManualCount
    ? Math.max(Math.round(countAverageAmount * targetCount), 0)
    : ratioTargetAmount;
  const savingMonthly = usesManualCount
    ? Math.max(Math.round(baseMonthlyAmount - targetAmount), 0)
    : ratioSavingMonthly;
  const yearlySaving = usesManualCount
    ? savingMonthly * 12
    : ratioOverride?.yearlySaving ?? savingMonthly * 12;
  const selectedLabel = subcategoryData?.name || categoryLabelMap[candidate.major] || candidate.major;
  const challengeTitle = createSavingChallengeTitle(selectedLabel);
  const displayName = challengeTitle;
  const nameIsPlaceholder = false;
  const generatedChallengeId = subcategoryData ? `${candidate.id}-${slugify(subcategoryData.name)}` : candidate.id;
  const challengeId = isDetailEditing() ? appState.editingChallengeId : generatedChallengeId;

  return {
    candidate,
    subcategoryData,
    annualAmount,
    annualCount,
    baseMonthlyAmount,
    baseMonthlyCount,
    averageAmount,
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
    selectedRatio: appState.selectedRatio,
    targetMode: appState.detailTargetMode,
    manualTargetCount: appState.detailTargetMode === "count" ? selection.targetCount : null,
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
  // UT simulation: added challenges can change monthly saving projections,
  // but the savings account itself remains a seeded balance.
  const extraMonthlySaving = Math.max(monthlyGoals - INITIAL_SUMMARY.monthlySavingGoal, 0);

  appState.monthlySavingGoal = monthlyGoals;
  appState.currentMonthSaving = INITIAL_SUMMARY.currentMonthSaving + extraMonthlySaving;
  appState.savingsAccount = INITIAL_SUMMARY.savingsAccount;
  appState.totalSaved = INITIAL_SUMMARY.totalSaved + extraMonthlySaving * 12;
}

function updateHomeSummary() {
  recalculateSavingsSummary();
  const monthlyGoals = appState.challenges.reduce(
    (sum, challenge) => sum + (challenge.monthlySavingTarget || 0),
    0,
  );
  document.getElementById("home-saving-amount").textContent = formatWon(monthlyGoals);
  document.getElementById("home-saving-period").textContent = appState.savingPeriodLabel;
  document.getElementById("home-saving-total").textContent = formatWon(appState.totalSaved);
  document.getElementById("home-month-spend").textContent = formatWon(appState.currentMonthSpend);
  document.getElementById("home-savings-account").textContent = formatWon(appState.savingsAccount);
  document.getElementById("home-savings-account-clone").textContent = formatWon(appState.savingsAccount);
  document.getElementById("status-month-saving").textContent = formatWon(appState.currentMonthSaving);
  document.getElementById("status-goal-amount").textContent = formatWon(monthlyGoals);
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
  const recentAverage = history.length
    ? Math.round(history.reduce((sum, value) => sum + value, 0) / history.length)
    : monthSaving;
  const riseValue = Math.max((history[0] || 0) - (history[1] || 0), 0);
  const previewYears = [2, 3, 5];
  const previewBase = appState.previewUsesAverage
    ? recentAverage
    : monthSaving;

  document.getElementById("overview-title").textContent = challenge.title;
  document.getElementById("overview-amount-current").textContent = formatWon(challenge.currentAmount);
  document.getElementById("overview-amount-target").textContent = `/${formatWon(challenge.targetAmount)}`;
  document.getElementById("overview-count-current").textContent = formatCount(challenge.currentCount);
  document.getElementById("overview-count-target").textContent = `/${formatCount(challenge.targetCount)}`;
  document.getElementById("overview-month-saving").textContent = formatWon(monthSaving);
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
  const progress = getWishlistProgressModel(item);
  const showProgress = options.showProgress !== false;
  const card = document.createElement("article");
  card.className = `wishlist-card${showProgress ? " wishlist-card--with-progress" : ""}`;
  card.innerHTML = `
    <div class="wishlist-image">
      <img src="${item.image}" alt="" loading="lazy" />
    </div>
    <div class="wishlist-copy">
      <strong>${item.title}</strong>
      <p>${formatWon(item.price)}</p>
      ${showProgress ? `
        <div class="wishlist-progress">
          <span>${progress.percent}%</span>
          <div><i style="width:${progress.percent}%"></i></div>
        </div>
      ` : ""}
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

function renderHomeWishlist() {
  const container = document.getElementById("home-wishlist-grid");
  if (!container) return;
  container.innerHTML = "";
  appState.wishlistItems.slice(0, 2).forEach((item) => {
    container.appendChild(renderWishlistCard(item, { showProgress: false }));
  });
}

function renderWishlist() {
  const container = document.getElementById("wishlist-page-grid");
  if (!container) return;
  container.innerHTML = "";
  appState.wishlistItems.forEach((item) => {
    container.appendChild(renderWishlistCard(item));
  });
}

function renderWishlistRecommendations(item) {
  const container = document.getElementById("wish-recommendations");
  if (!container) return;
  const recommendations = getWishlistRecommendationModels(item);
  container.innerHTML = "";
  container.classList.toggle("hidden", recommendations.length === 0);

  recommendations.forEach(({ challenge, reducedMonths }) => {
    const card = document.createElement("article");
    card.className = "wish-tip-card";
    card.innerHTML = `
      <span class="sparkle">✦</span>
      <p>‘${challenge.title}’ 챌린지를 월 1회 더 실천하면 기간을 ${reducedMonths}개월 단축시킬 수 있어요!</p>
      <button type="button">바로 챌린지 수정하기</button>
    `;
    card.addEventListener("click", () => {
      openChallengeEdit(challenge, "wishlist-detail");
    });
    card.querySelector("button")?.addEventListener("click", (event) => {
      event.stopPropagation();
      openChallengeEdit(challenge, "wishlist-detail");
    });
    container.appendChild(card);
  });
}

function renderWishlistDetail() {
  const item = getCurrentWishlistItem();
  if (!item) return;
  const progress = getWishlistProgressModel(item);

  document.getElementById("wishlist-detail-image").src = item.image;
  document.getElementById("wishlist-detail-category").textContent = item.category;
  document.getElementById("wishlist-detail-title").textContent = item.title;
  document.getElementById("wishlist-detail-price").textContent = formatWon(item.price);
  document.getElementById("wish-progress-fill").style.width = `${progress.percent}%`;
  document.getElementById("wish-progress-bubble").style.left = `${progress.percent}%`;
  document.getElementById("wish-progress-bubble").textContent = formatWon(progress.savedAmount);
  document.getElementById("wish-achievement").textContent = `달성률 ${progress.percent}%`;

  const metaRows = document.querySelectorAll(".wish-meta div");
  if (metaRows[0]) metaRows[0].querySelector("strong").textContent = item.registeredAt;
  if (metaRows[1]) metaRows[1].querySelector("strong").textContent = progress.expectedAt;
  renderWishlistRecommendations(item);
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

function getStaticSpendCategories() {
  return [
    { key: "all", label: "전체", count: 25, icon: "grid" },
    { key: TEXT.categoryCafe, label: "카페/간식", count: 8, icon: TEXT.categoryCafe },
    { key: TEXT.categoryFood, label: "외식", count: 7, icon: TEXT.categoryFood },
    { key: "패션/쇼핑", label: "패션/쇼핑", count: 5, icon: "패션/쇼핑" },
    { key: "online", label: "온라인쇼핑", count: 4, icon: "온라인쇼핑" },
    { key: TEXT.categoryTraffic, label: "교통", count: 2, icon: TEXT.categoryTraffic },
    { key: "술/유흥", label: "술/유흥", count: 2, icon: "술/유흥" },
    { key: "기타", label: "기타", count: 2, icon: "기타" },
  ];
}

function buildSpendModelFromTransactions() {
  const monthRows = getCurrentMonthRows();
  const spendRows = monthRows.filter(isExpenseOutflow);
  const total = getNetExpenseAmount(monthRows);
  const categoryCounts = new Map();
  const onlineCount = spendRows.filter(isOnlineShoppingTransaction).length;

  spendRows.forEach((item) => {
    const key = normalizeSpendCategoryKey(item.major, item);
    categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
  });

  const categories = [
    { key: "all", label: "전체", count: spendRows.length, icon: "grid" },
    ...[...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: key === "online" ? "온라인쇼핑" : categoryLabelMap[key] || key,
        count,
        icon: key === "online" ? "온라인쇼핑" : key,
      })),
  ];

  if (onlineCount && !categories.some((category) => category.key === "online")) {
    categories.splice(Math.min(categories.length, 4), 0, {
      key: "online",
      label: "온라인쇼핑",
      count: onlineCount,
      icon: "온라인쇼핑",
    });
  }

  return {
    total,
    categories,
    rows: monthRows,
    displayRows: spendRows,
  };
}

function getRowsForSpendCategory(rows, key) {
  if (key === "all") return rows;
  if (key === "online") return rows.filter(isOnlineShoppingTransaction);
  return rows.filter((item) => normalizeSpendCategoryKey(item.major, item) === key);
}

function groupSpendRows(rows) {
  const groups = new Map();

  rows
    .slice()
    .sort((a, b) => `${b.date} ${formatTransactionTime(b.time)}`.localeCompare(`${a.date} ${formatTransactionTime(a.time)}`))
    .forEach((item) => {
      if (!groups.has(item.date)) {
        groups.set(item.date, {
          date: formatTransactionDay(item.date),
          rows: [],
        });
      }

      groups.get(item.date).rows.push({
        merchant: item.merchant,
        time: formatTransactionTime(item.time),
        amount: item.amount,
      });
    });

  return [...groups.values()];
}

function getRowValue(row, keys, fallback = "") {
  const foundKey = keys.find((key) => row[key] != null && row[key] !== "");
  return foundKey ? row[foundKey] : fallback;
}

function getSpendModel() {
  if (isSampleSource()) {
    const selectedSpend = spendData[appState.selectedSpendCategory] || spendData.all;
    return {
      selected: selectedSpend,
      categories: getStaticSpendCategories(),
    };
  }

  const model = buildSpendModelFromTransactions();

  if (!model.categories.some((category) => category.key === appState.selectedSpendCategory)) {
    appState.selectedSpendCategory = "all";
  }

  const normalizedRows = getRowsForSpendCategory(model.rows, appState.selectedSpendCategory);
  const normalizedDisplayRows = getRowsForSpendCategory(model.displayRows, appState.selectedSpendCategory);
  const normalizedTotal = getNetExpenseAmount(normalizedRows);

  return {
    selected: {
      total: normalizedTotal,
      shareLabel: "전체 중",
      share: model.total ? Math.round((normalizedTotal / model.total) * 100) : 0,
      groups: groupSpendRows(normalizedDisplayRows),
    },
    categories: model.categories,
  };
}

function renderSpendCategoryIcon(category) {
  if (category.icon === "grid") {
    return `<span class="spend-grid-icon"><i></i><i></i><i></i><i></i></span>`;
  }
  return renderCategoryIcon(category.icon, category.label, "small");
}

function bindSpendCategoryDrag(container) {
  if (!container || container.dataset.dragBound === "true") return;
  container.dataset.dragBound = "true";

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasMoved = false;

  container.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = event.pageX;
    startScrollLeft = container.scrollLeft;
    container.classList.add("is-dragging");
  });

  container.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    const deltaX = event.pageX - startX;
    if (Math.abs(deltaX) > 4) {
      hasMoved = true;
      container.dataset.dragMoved = "true";
    }
    container.scrollLeft = startScrollLeft - deltaX;
  });

  ["mouseup", "mouseleave"].forEach((eventName) => {
    container.addEventListener(eventName, () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");
      if (hasMoved) {
        window.setTimeout(() => {
          container.dataset.dragMoved = "false";
        }, 0);
      }
    });
  });
}

function renderSpend() {
  const categoryContainer = document.getElementById("spend-category-row");
  const list = document.getElementById("spend-transaction-list");
  if (!categoryContainer || !list) return;
  bindSpendCategoryDrag(categoryContainer);

  const { selected: selectedSpend, categories } = getSpendModel();
  setRollingText(
    document.getElementById("spend-total"),
    formatWon(selectedSpend.total),
    { animate: document.querySelector('.screen.active')?.dataset.screen === "spend", duration: 520, stagger: 22 },
  );
  document.getElementById("spend-share-label").innerHTML = `${selectedSpend.shareLabel} <b>${selectedSpend.share}%</b>`;
  document.getElementById("spend-saving-amount").textContent = formatWon(appState.savingsAccount);
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const item = document.createElement("button");
    item.className = `spend-category${appState.selectedSpendCategory === category.key ? " active" : ""}`;
    item.dataset.spendCategory = category.key;
    item.innerHTML = `
      <span class="spend-category-icon">${renderSpendCategoryIcon(category)}<b>${category.count}</b></span>
      <span>${category.label}</span>
    `;
    item.addEventListener("click", (event) => {
      if (categoryContainer.dataset.dragMoved === "true") {
        event.preventDefault();
        return;
      }
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

  list.innerHTML = selectedSpend.groups.length ? selectedSpend.groups.map((group) => `
    <div class="transaction-day">
      <p>${group.date}</p>
      ${group.rows.map((row) => `
        <div class="transaction-divider"></div>
        <article class="transaction-row">
          <div>
            <strong>${row.merchant}</strong>
            <span>${row.time}</span>
          </div>
          <b>-${formatWon(row.amount)}</b>
        </article>
      `).join("")}
    </div>
  `).join("") : `
    <div class="transaction-empty">이번달 소비내역이 없어요.</div>
  `;
}

function getSortedCandidateCategories() {
  return appState.candidateCategories
    .slice()
    .sort((a, b) => {
      if (appState.candidateSort === "amount") {
        return (b.annualAmount || 0) - (a.annualAmount || 0) || (b.annualCount || 0) - (a.annualCount || 0);
      }

      return (b.annualCount || 0) - (a.annualCount || 0) || (b.annualAmount || 0) - (a.annualAmount || 0);
    });
}

function renderCandidateSortControl() {
  const sortButton = document.getElementById("candidate-sort-button");
  const sortMenu = document.getElementById("candidate-sort-menu");
  if (!sortButton || !sortMenu) return;

  const labels = {
    count: "횟수많은순",
    amount: "금액많은순",
  };
  sortButton.textContent = labels[appState.candidateSort] || labels.count;
  sortButton.setAttribute("aria-expanded", String(!sortMenu.classList.contains("hidden")));
  sortMenu.querySelectorAll("[data-candidate-sort]").forEach((button) => {
    button.classList.toggle("active", button.dataset.candidateSort === appState.candidateSort);
  });
}

function renderCandidateList() {
  const container = document.getElementById("candidate-list");
  const footer = document.querySelector(".add-footer-note");
  renderCandidateSortControl();
  container.innerHTML = "";

  if (footer) {
    footer.hidden = !isSampleSource();
  }

  if (!appState.candidateCategories.length) {
    container.innerHTML = `<div class="candidate-empty">소비데이터를 업로드하면 챌린지 후보를 불러올게요.</div>`;
    return;
  }

  getSortedCandidateCategories().forEach((candidate) => {
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
      appState.detailMode = "add";
      appState.editingChallengeId = null;
      appState.detailReturnScreen = "add";
      resetDetailTargetMode();
      renderAll();
      setScreen("detail");
    });
    container.appendChild(item);
  });
}

function renderDetail(options = {}) {
  const selection = getDetailSelection();
  if (!selection) return;
  const { candidate, subcategoryData } = selection;
  const shouldAnimateNumbers = options.animateNumbers !== false && document.querySelector('.screen.active')?.dataset.screen === "detail";
  const isEditing = isDetailEditing(selection);
  const detailScreenTitle = document.getElementById("detail-screen-title");
  const completeButton = document.getElementById("complete-button");

  if (detailScreenTitle) detailScreenTitle.textContent = isEditing ? "챌린지 수정" : "챌린지 추가";
  if (completeButton) completeButton.textContent = isEditing ? "수정하기" : "등록하기";

  document.getElementById("detail-category-title").textContent =
    subcategoryData?.name || categoryLabelMap[candidate.major] || candidate.major;
  document.querySelector(".candidate-summary-leading .category-icon").innerHTML = renderCategoryIcon(
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
  const detailAverageAmountEl = document.getElementById("detail-average-amount");
  if (detailAverageAmountEl) {
    detailAverageAmountEl.textContent = formatWon(selection.averageAmount);
    delete detailAverageAmountEl.dataset.rollingValue;
    detailAverageAmountEl.removeAttribute("aria-label");
  }
  challengeNameEl.textContent = selection.displayName;
  challengeNameEl.classList.toggle("is-placeholder", selection.nameIsPlaceholder);
  setRollingText(
    document.getElementById("detail-target-amount"),
    formatWon(selection.targetAmount),
    { animate: shouldAnimateNumbers, duration: 520, stagger: 22 },
  );
  document.getElementById("target-amount-card")?.classList.toggle("active-card", appState.detailTargetMode === "ratio");
  const targetCountCard = document.getElementById("target-count-card");
  const targetCountInput = document.getElementById("detail-target-count-input");
  targetCountCard?.classList.toggle("active-card", appState.detailTargetMode === "count");
  if (targetCountInput && document.activeElement !== targetCountInput) {
    targetCountInput.value = String(selection.targetCount);
  }
  setRollingText(
    document.getElementById("detail-target-count-display"),
    String(selection.targetCount),
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
  const subcategoryNames = [TEXT.all, ...getTopSubcategories(candidate).map((item) => item.name)];
  subcategoryContainer.style.setProperty("--segment-count", String(Math.max(subcategoryNames.length, 1)));
  subcategoryNames.forEach((name) => {
    const chip = document.createElement("button");
    chip.className = `subcategory-chip${appState.selectedSubcategory === name ? " active" : ""}`;
    chip.textContent = name;
    chip.addEventListener("click", () => {
      appState.selectedSubcategory = name;
      resetDetailTargetMode();
      renderDetail();
    });
    subcategoryContainer.appendChild(chip);
  });

  const ratioContainer = document.getElementById("detail-ratio-chips");
  ratioContainer.innerHTML = "";
  ratioContainer.classList.toggle("is-disabled", appState.detailTargetMode === "count");
  [
    { label: "90%", value: 0.9 },
    { label: "80%", value: 0.8 },
    { label: "70%", value: 0.7 },
    { label: "\uC9C1\uC811 \uC785\uB825", value: 0.65 },
  ].forEach((ratioOption) => {
    const chip = document.createElement("button");
    chip.className = `ratio-chip${appState.detailTargetMode === "ratio" && appState.selectedRatio === ratioOption.value ? " active" : ""}`;
    chip.textContent = ratioOption.label;
    chip.addEventListener("click", () => {
      appState.detailTargetMode = "ratio";
      appState.manualTargetCount = null;
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
  renderChallengeCards("status-challenge-list", appState.challenges, { sourceScreen: "status" });
  renderCandidateList();
  renderDetail();
  renderChallengeOverview();
  renderHomeWishlist();
  renderWishlist();
  renderWishlistDetail();
  renderWishlistAddForm();
  renderSpend();
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === appState.challengeFilter);
  });
  requestAnimationFrame(refreshScreenScrollState);
}

function activateManualTargetCount(value = null) {
  const selection = getDetailSelection();
  appState.detailTargetMode = "count";
  appState.manualTargetCount = Math.max(
    Math.round(Number(value ?? appState.manualTargetCount ?? selection?.targetCount ?? 1) || 1),
    1,
  );
}

function applyTransactions(transactions, sourceName = TEXT.sample) {
  appState.transactions = transactions;
  appState.sourceName = sourceName;

  const expenseRows = getExpenseRows(transactions);
  const monthKey = getAnalysisMonthKey(transactions);
  const monthRows = monthKey ? expenseRows.filter((item) => item.date.startsWith(monthKey)) : [];
  const isSample = isSampleSource(sourceName);
  const candidates = isSample ? cloneData(sampleCandidateCategories) : computeCandidates(expenseRows);

  appState.currentMonthSpend = isSample
    ? 455250
    : getNetExpenseAmount(monthRows);
  appState.candidateCategories = candidates;
  appState.candidateSort = "count";
  appState.selectedCandidateId = candidates[0]?.id || null;
  appState.selectedSubcategory = TEXT.all;
  appState.selectedRatio = 0.9;
  resetDetailTargetMode();
  appState.selectedSpendCategory = "all";
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
      detailMonthlySaving: 13870,
      totalSaving: 48650,
      startDate: "2025.06.15",
      history: [15780, 14900, 14200],
    },
  ];

  appState.monthlySavingGoal = appState.challenges.reduce(
    (sum, challenge) => sum + (challenge.monthlySavingTarget || 0),
    0,
  );
  appState.savingsAccount = INITIAL_SUMMARY.savingsAccount;
  appState.totalSaved = INITIAL_SUMMARY.totalSaved;
  appState.savingPeriodLabel = "1\uB144 6\uAC1C\uC6D4";
  appState.homeChallengeCountDisplay = 1;
  appState.statusChallengeCountDisplay = 1;
  appState.selectedChallengeId = appState.challenges[0]?.id || null;
  statusText.textContent = isSample
    ? `${sourceName} ${TEXT.statusApplied}`
    : `${sourceName} ${monthKey || ""} ${TEXT.statusApplied}`;
  if (!isSample) showUploadCompleteToast();
  renderAll();
}

function showUploadCompleteToast() {
  if (!uploadCompleteToast) return;
  uploadCompleteToast.classList.remove("hidden");
  if (uploadToastTimer) clearTimeout(uploadToastTimer);
  uploadToastTimer = setTimeout(() => {
    uploadCompleteToast.classList.add("hidden");
  }, 2600);
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
        const rawAmount = Number(getRowValue(row, ["\uAE08\uC561", "\uC9C0\uCD9C\uAE08\uC561", "\uAC70\uB798\uAE08\uC561", "\uC774\uC6A9\uAE08\uC561", "\uC2B9\uC778\uAE08\uC561"], 0));
        const rawType = getRowValue(row, ["\uD0C0\uC785", "\uAD6C\uBD84", "\uAC70\uB798\uAD6C\uBD84", "\uC785\uCD9C\uAE08\uAD6C\uBD84"], "");
        return {
          date: formatExcelDate(getRowValue(row, ["\uB0A0\uC9DC", "\uC77C\uC790", "\uAC70\uB798\uC77C", "\uC2B9\uC778\uC77C", "\uC774\uC6A9\uC77C"])),
          time: getRowValue(row, ["\uC2DC\uAC04", "\uAC70\uB798\uC2DC\uAC04", "\uC2B9\uC778\uC2DC\uAC04", "\uC774\uC6A9\uC2DC\uAC04"], ""),
          type: normalizeTransactionType(rawType, rawAmount),
          rawAmount,
          major: getRowValue(row, ["\uB300\uBD84\uB958", "\uCE74\uD14C\uACE0\uB9AC", "\uBD84\uB958", "\uC5C5\uC885"], "\uAE30\uD0C0"),
          minor: getRowValue(row, ["\uC18C\uBD84\uB958", "\uC138\uBD80\uBD84\uB958", "\uC18C\uCE74\uD14C\uACE0\uB9AC", "\uC138\uBD80\uCE74\uD14C\uACE0\uB9AC"], "\uAE30\uD0C0"),
          merchant: getRowValue(row, ["\uB0B4\uC6A9", "\uAC00\uB9F9\uC810", "\uC0AC\uC6A9\uCC98", "\uC801\uC694", "\uAC70\uB798\uB0B4\uC6A9"], "\uC774\uB984 \uC5C6\uC74C"),
          amount: Math.abs(rawAmount || 0),
          paymentMethod: getRowValue(row, ["\uACB0\uC81C\uC218\uB2E8", "\uCE74\uB4DC\uBA85", "\uACC4\uC88C", "\uC218\uB2E8"], ""),
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
  const isEditing = isDetailEditing(getDetailSelection());

  if (existingIndex >= 0) {
    const previous = appState.challenges[existingIndex];
    const updatedChallenge = {
      ...previous,
      ...challenge,
      currentAmount: previous.currentAmount || challenge.currentAmount,
      currentCount: previous.currentCount || challenge.currentCount,
      startDate: previous.startDate || challenge.startDate,
    };
    appState.challenges[existingIndex] = updatedChallenge;
  } else {
    appState.challenges.push(challenge);
  }

  const displayCount = appState.challenges.length;
  appState.homeChallengeCountDisplay = displayCount;
  appState.statusChallengeCountDisplay = displayCount;
  appState.challengeFilter = "all";
  appState.selectedChallengeId = challenge.id;
  renderAll();
  showModal(
    TEXT.modalAdded,
    isEditing ? "챌린지 수정이 완료되었습니다." : "챌린지 추가가 완료되었습니다!",
  );
}

function resetPrototype() {
  hideModal();
  hideCategorySheet();
  if (uploadInput) uploadInput.value = "";

  appState.lastScreen = "home";
  appState.challengeFilter = "all";
  appState.candidateSort = "count";
  appState.selectedSubcategory = TEXT.all;
  appState.selectedRatio = 0.9;
  resetDetailTargetMode();
  appState.detailMode = "add";
  appState.editingChallengeId = null;
  appState.detailReturnScreen = "add";
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

function setPaymentDemoMode(isActive) {
  if (isActive) {
    document.body.classList.remove("survey-demo-mode");
    const surveyDemo = document.getElementById("survey-demo");
    const surveyToggle = document.getElementById("survey-demo-toggle");
    if (surveyDemo) surveyDemo.setAttribute("aria-hidden", "true");
    if (surveyToggle) surveyToggle.textContent = "\uC124\uBB38\uC870\uC0AC";
  }
  document.body.classList.toggle("payment-demo-mode", isActive);
  const demo = document.getElementById("payment-demo");
  const toggle = document.getElementById("payment-demo-toggle");
  if (demo) demo.setAttribute("aria-hidden", String(!isActive));
  if (toggle) toggle.textContent = isActive ? "\uB3CC\uC544\uAC00\uAE30" : "\uACB0\uC81C\uC2DC";
}

function togglePaymentDemoMode() {
  setPaymentDemoMode(!document.body.classList.contains("payment-demo-mode"));
}

function renderSurveyDemo() {
  const demo = document.getElementById("survey-demo");
  const previewCard = document.getElementById("survey-preview-card");
  const eyebrow = document.getElementById("survey-preview-eyebrow");
  const title = document.getElementById("survey-preview-title");
  const image = document.getElementById("survey-preview-image");
  const empty = document.getElementById("survey-preview-empty");
  const progress = document.getElementById("survey-progress");
  const question = document.getElementById("survey-question");
  const scale = document.getElementById("survey-scale");
  const prev = document.getElementById("survey-prev");
  const next = document.getElementById("survey-next");
  if (!demo || !previewCard || !eyebrow || !title || !image || !empty || !progress || !question || !scale || !prev || !next) return;

  const index = Math.min(Math.max(appState.surveyIndex, 0), surveyQuestions.length - 1);
  appState.surveyIndex = index;
  const item = surveyQuestions[index];
  const selectedAnswer = appState.surveyAnswers[index];

  demo.classList.toggle("is-final", Boolean(item.noPreview));
  previewCard.classList.toggle("is-empty", Boolean(item.noPreview));
  eyebrow.textContent = item.eyebrow;
  title.textContent = item.title;
  if (item.noPreview) {
    image.hidden = true;
    image.removeAttribute("src");
    empty.hidden = false;
  } else {
    image.hidden = false;
    image.src = item.image;
    image.alt = `${item.title} 화면 캡쳐`;
    empty.hidden = true;
  }
  progress.textContent = `${index + 1} / ${surveyQuestions.length}`;
  question.textContent = item.question;
  scale.innerHTML = "";

  for (let value = 1; value <= 7; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `survey-score${selectedAnswer === value ? " active" : ""}`;
    button.textContent = String(value);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(selectedAnswer === value));
    button.addEventListener("click", () => {
      appState.surveyAnswers[index] = value;
      renderSurveyDemo();
    });
    scale.appendChild(button);
  }

  prev.disabled = index === 0;
  next.textContent = index === surveyQuestions.length - 1 ? "\uC644\uB8CC" : "\uB2E4\uC74C \uD398\uC774\uC9C0";
}

function setSurveyDemoMode(isActive) {
  if (isActive) {
    setPaymentDemoMode(false);
  }
  document.body.classList.toggle("survey-demo-mode", isActive);
  const demo = document.getElementById("survey-demo");
  const toggle = document.getElementById("survey-demo-toggle");
  if (demo) demo.setAttribute("aria-hidden", String(!isActive));
  if (toggle) toggle.textContent = isActive ? "\uB418\uB3CC\uC544\uAC00\uAE30" : "\uC124\uBB38\uC870\uC0AC";
  if (isActive) renderSurveyDemo();
}

function toggleSurveyDemoMode() {
  setSurveyDemoMode(!document.body.classList.contains("survey-demo-mode"));
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "toggle-payment-demo") togglePaymentDemoMode();
      if (action === "toggle-survey-demo") toggleSurveyDemoMode();
      if (action === "survey-prev") {
        appState.surveyIndex = Math.max(appState.surveyIndex - 1, 0);
        renderSurveyDemo();
      }
      if (action === "survey-next") {
        if (appState.surveyIndex >= surveyQuestions.length - 1) {
          setSurveyDemoMode(false);
        } else {
          appState.surveyIndex = Math.min(appState.surveyIndex + 1, surveyQuestions.length - 1);
          renderSurveyDemo();
        }
      }
      if (action === "reset-prototype") resetPrototype();
      if (action === "go-home") setScreen("home");
      if (action === "go-detail-back") {
        if (isDetailEditing()) {
          const previousScreen = appState.detailReturnScreen && appState.detailReturnScreen !== "detail"
            ? appState.detailReturnScreen
            : "home";
          appState.detailMode = "add";
          appState.editingChallengeId = null;
          appState.detailReturnScreen = "add";
          setScreen(previousScreen);
        } else {
          appState.detailMode = "add";
          appState.editingChallengeId = null;
          appState.detailReturnScreen = "add";
          setScreen("add");
        }
      }
      if (action === "go-add") {
        appState.detailMode = "add";
        appState.editingChallengeId = null;
        appState.detailReturnScreen = "add";
        setScreen("add");
      }
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
        const wishlistChallenge = appState.challenges.find((challenge) => challenge.id === "habit-cafe") || getCurrentChallenge();
        openChallengeEdit(wishlistChallenge, "wishlist-detail");
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
          status: "in-progress",
          registeredAt: preset.registeredAt || "2026년 6월 27일",
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
      if (action === "go-back-overview") {
        const previousScreen = appState.lastScreen && appState.lastScreen !== "detail" ? appState.lastScreen : "home";
        setScreen(previousScreen);
      }
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
    openChallengeEdit(challenge, appState.lastScreen || "home");
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.challengeFilter = button.dataset.filter || "all";
      renderAll();
    });
  });

  const candidateSortButton = document.getElementById("candidate-sort-button");
  const candidateSortMenu = document.getElementById("candidate-sort-menu");
  candidateSortButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    candidateSortMenu?.classList.toggle("hidden");
    renderCandidateSortControl();
  });
  candidateSortMenu?.querySelectorAll("[data-candidate-sort]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      appState.candidateSort = button.dataset.candidateSort || "count";
      candidateSortMenu.classList.add("hidden");
      renderCandidateList();
    });
  });
  document.addEventListener("click", (event) => {
    if (!candidateSortMenu || candidateSortMenu.classList.contains("hidden")) return;
    if (event.target.closest(".sort-control")) return;
    candidateSortMenu.classList.add("hidden");
    renderCandidateSortControl();
  });

  document.getElementById("preview-toggle")?.addEventListener("click", () => {
    appState.previewUsesAverage = !appState.previewUsesAverage;
    renderChallengeOverview();
  });

  const targetCountInput = document.getElementById("detail-target-count-input");
  document.getElementById("target-count-card")?.addEventListener("click", () => {
    targetCountInput?.focus();
  });
  targetCountInput?.addEventListener("focus", () => {
    activateManualTargetCount(targetCountInput.value);
    renderDetail();
    requestAnimationFrame(() => {
      targetCountInput.focus();
      targetCountInput.select();
    });
  });
  targetCountInput?.addEventListener("input", () => {
    const sanitized = targetCountInput.value.replace(/\D/g, "").slice(0, 3);
    targetCountInput.value = sanitized;
    appState.detailTargetMode = "count";
    appState.manualTargetCount = sanitized ? Math.max(Number(sanitized), 1) : null;
    renderDetail();
  });
  targetCountInput?.addEventListener("blur", () => {
    const selection = getDetailSelection();
    targetCountInput.value = String(selection?.targetCount || 1);
  });

  document.getElementById("complete-button").addEventListener("click", completeChallenge);

  categorySheetBackdrop?.addEventListener("click", (event) => {
    if (event.target === categorySheetBackdrop) hideCategorySheet();
  });

  categorySheetBackdrop?.querySelector(".bottom-sheet")?.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    if (!categorySheetBackdrop.classList.contains("is-closing")) return;
    categorySheetBackdrop.classList.add("hidden");
    categorySheetBackdrop.classList.remove("is-closing");
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
