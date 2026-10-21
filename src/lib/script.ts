// 스레드 콘솔 스크립트 템플릿. 원본(threads-nonfollowers.js)의 구조와 셀렉터는 그대로 두고 CONFIG 만 폼 값으로 바꿔 끼운다.
// 이 파일은 다른 모듈을 가져오지 않는다. 테스트(script.test.ts)가 node 로 바로 불러 쓰기 때문이다.

export type ScriptOptions = {
  /** 맞팔이 아니어도 계속 팔로우할 계정. */
  keep: string[];
  unfollow: boolean;
  maxUnfollow: number;
  minDelaySec: number;
  maxDelaySec: number;
};

export const UNFOLLOW_LIMIT = { min: 1, max: 20, default: 10 };
export const DELAY_LIMIT = { min: 5, max: 300, defaultMin: 20, defaultMax: 45 };

export const DEFAULT_OPTIONS: ScriptOptions = {
  keep: [],
  unfollow: false,
  maxUnfollow: UNFOLLOW_LIMIT.default,
  minDelaySec: DELAY_LIMIT.defaultMin,
  maxDelaySec: DELAY_LIMIT.defaultMax,
};

const SITE = "https://threads-follow-checker.commit2.app";

/** 줄바꿈·쉼표·공백으로 나눈 입력에서 계정 이름만 고른다. "@이름"·프로필 주소도 받는다. */
export function parseKeep(text: string): string[] {
  const names = text
    .split(/[\s,]+/)
    .map((token) => {
      const fromUrl = /threads\.(?:com|net)\/@([\w.]+)/i.exec(token);
      return (fromUrl ? fromUrl[1] : token.replace(/^@/, "")).toLowerCase();
    })
    .filter((name) => /^[\w.]{1,30}$/.test(name));
  return [...new Set(names)];
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** 폼 값을 허용 범위로 맞춘다. 최소 간격이 최대보다 크면 둘을 바꾼다. */
export function normalizeOptions(options: ScriptOptions): ScriptOptions {
  const maxUnfollow = clamp(options.maxUnfollow, UNFOLLOW_LIMIT.min, UNFOLLOW_LIMIT.max, UNFOLLOW_LIMIT.default);
  let minDelaySec = clamp(options.minDelaySec, DELAY_LIMIT.min, DELAY_LIMIT.max, DELAY_LIMIT.defaultMin);
  let maxDelaySec = clamp(options.maxDelaySec, DELAY_LIMIT.min, DELAY_LIMIT.max, DELAY_LIMIT.defaultMax);
  if (minDelaySec > maxDelaySec) [minDelaySec, maxDelaySec] = [maxDelaySec, minDelaySec];
  return { keep: options.keep, unfollow: options.unfollow, maxUnfollow, minDelaySec, maxDelaySec };
}

function configBlock(options: ScriptOptions): string {
  const o = normalizeOptions(options);
  // 계정 이름은 JSON.stringify 로 넣어 따옴표·특수 문자가 코드로 새지 않게 한다.
  const keep = o.keep.length === 0 ? "[]" : `[\n${o.keep.map((name) => `      ${JSON.stringify(name)},`).join("\n")}\n    ]`;
  return [
    "  const CONFIG = {",
    `    unfollow: ${o.unfollow},${o.unfollow ? "           // 실제로 언팔로우한다" : "          // true 면 실제로 언팔로우한다"}`,
    `    maxUnfollow: ${o.maxUnfollow},          // 한 번 실행에 언팔로우할 최대 계정 수`,
    `    minDelayMs: ${o.minDelaySec * 1000},       // 언팔로우 사이 최소 간격`,
    `    maxDelayMs: ${o.maxDelaySec * 1000},       // 언팔로우 사이 최대 간격`,
    `    keep: ${keep}, // 맞팔이 아니어도 계속 팔로우할 계정`,
    "  };",
    "",
  ].join("\n");
}

export function buildScript(options: ScriptOptions): string {
  // 치환 문자열의 $ 가 특수 패턴으로 읽히지 않게 함수로 넘긴다.
  return TEMPLATE.replace("__SITE__", () => SITE).replace("__CONFIG__", () => configBlock(options));
}

const TEMPLATE = `// 스레드: 내가 팔로우하는데 나를 팔로우하지 않는 계정 찾기 (+ 선택적으로 언팔로우)
// __SITE__ 에서 만든 스크립트입니다. 이 브라우저 안에서만 돌고, 어떤 데이터도 밖으로 보내지 않습니다.
//
// 쓰는 법
// 1. 스레드 내 프로필에서 "OO followers"를 눌러 팔로워/팔로잉 대화상자를 연다.
// 2. 개발자 도구 콘솔에 이 스크립트 전체를 붙여 넣고 Enter.
//
// 주의: Meta 는 자동화된 대량 행동을 제한한다. 한 번에 많이 언팔로우하면
// "작업이 제한됨" 경고나 계정 제한을 받을 수 있으니, 간격을 길게 두고 하루에 조금씩만 한다.

(async () => {
__CONFIG__
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const dialog = () => document.querySelector('[role="dialog"]');
  if (!dialog()) return console.error("팔로워/팔로잉 대화상자를 먼저 열어 주세요.");

  const tabs = () => [...dialog().querySelectorAll('[role="tab"]')];
  const tabOf = (i) => tabs()[i]; // 0 = Followers(팔로워), 1 = Following(팔로잉)
  const countOf = (i) => Number((tabOf(i)?.innerText.match(/[\\d,]+/) || ["0"])[0].replace(/,/g, ""));
  const scroller = () =>
    [...dialog().querySelectorAll("*")].find(
      (e) => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 5,
    );
  const usernamesInView = () =>
    [...dialog().querySelectorAll('a[href^="/@"]')].map((a) => a.getAttribute("href").slice(2).split(/[/?]/)[0]);

  async function openTab(i) {
    const t = tabOf(i);
    (t.querySelector('[role="button"]') || t).click();
    await sleep(1500);
  }

  // 무한 스크롤: 화면의 80%씩 내리면서 보이는 계정을 모은다(한 번에 끝으로 건너뛰면 중간 줄을 놓친다).
  // 바닥에 닿은 상태에서 새 계정이 5번 연속 안 늘면 끝으로 본다.
  async function collect(i, label) {
    await openTab(i);
    const sc = scroller();
    if (sc) sc.scrollTop = 0;
    await sleep(800);
    const set = new Set();
    let still = 0;
    while (still < 5) {
      const before = set.size;
      usernamesInView().forEach((u) => set.add(u));
      const s = scroller();
      const atBottom = !s || s.scrollTop + s.clientHeight >= s.scrollHeight - 2;
      if (s) s.scrollTop += s.clientHeight * 0.8;
      await sleep(rand(1000, 1800));
      still = set.size === before && atBottom ? still + 1 : 0;
    }
    console.log(\`\${label}: \${set.size}명 수집 (화면 표시 \${countOf(i)}명)\`);
    return set;
  }

  const followers = await collect(0, "팔로워");
  const following = await collect(1, "팔로잉");
  const keep = new Set(CONFIG.keep);
  const targets = [...following].filter((u) => !followers.has(u) && !keep.has(u));

  console.log(\`나를 팔로우하지 않는 계정 \${targets.length}명:\`);
  console.table(targets.map((u) => ({ 계정: u, 주소: \`https://www.threads.com/@\${u}\` })));
  window.__nonFollowers = targets;

  if (!CONFIG.unfollow) {
    console.log("DRY_RUN: 아무도 언팔로우하지 않았습니다. CONFIG.unfollow 를 true 로 바꾸면 언팔로우합니다.");
    return;
  }

  // 언팔로우: 팔로잉 탭에서 그 계정 줄의 "Following" 버튼 → 확인창의 "Unfollow" 버튼.
  const rowOf = (u) => {
    const a = [...dialog().querySelectorAll(\`a[href^="/@\${u}"]\`)].find(
      (x) => x.getAttribute("href").slice(2).split(/[/?]/)[0] === u,
    );
    let el = a;
    while (el && el !== dialog() && !el.querySelector('[role="button"]')) el = el.parentElement;
    return el;
  };
  async function findRow(u) {
    const sc = scroller();
    if (sc) sc.scrollTop = 0;
    for (let k = 0; k < 60; k++) {
      const row = rowOf(u);
      if (row) return row;
      const s = scroller();
      if (!s || s.scrollTop + s.clientHeight >= s.scrollHeight - 2) break;
      s.scrollTop += s.clientHeight * 0.8;
      await sleep(800);
    }
    return null;
  }
  const isFollowingText = (t) => /^(Following|팔로잉)$/.test(t);
  const isConfirmText = (t) => /^(Unfollow|언팔로우|팔로우 취소)$/.test(t);

  await openTab(1);
  let done = 0;
  for (const u of targets.slice(0, CONFIG.maxUnfollow)) {
    const row = await findRow(u);
    const btn = row && [...row.querySelectorAll('[role="button"]')].find((b) => isFollowingText(b.innerText.trim()));
    if (!btn) {
      console.warn(\`@\${u}: 팔로잉 버튼을 못 찾아서 건너뜁니다.\`);
      continue;
    }
    btn.scrollIntoView({ block: "center" });
    btn.click();
    await sleep(1200);
    const confirm = [...document.querySelectorAll('[role="button"], button')].find((b) =>
      isConfirmText(b.innerText.trim()),
    );
    if (confirm) {
      confirm.click();
      await sleep(1200);
    }
    const nowText = btn.innerText.trim();
    if (isFollowingText(nowText)) {
      console.warn(\`@\${u}: 언팔로우가 반영되지 않았습니다. 여기서 멈춥니다 (제한 경고가 떴는지 확인하세요).\`);
      break;
    }
    done += 1;
    console.log(\`@\${u} 언팔로우 (\${done}/\${Math.min(targets.length, CONFIG.maxUnfollow)})\`);
    await sleep(rand(CONFIG.minDelayMs, CONFIG.maxDelayMs));
  }
  console.log(\`끝: \${done}명 언팔로우. 남은 대상은 다음에 다시 실행하세요.\`);
})();
`;
