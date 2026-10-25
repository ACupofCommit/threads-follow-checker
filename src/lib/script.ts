// 스레드 콘솔 스크립트 템플릿. 원본(threads-nonfollowers.js)의 찾기 부분 구조와 셀렉터는 그대로 두고 CONFIG 만 폼 값으로 바꿔 끼운다.
// 언팔로우는 계정 제한 위험이 있어 스크립트에서 뺐다. 사용자가 결과를 보고 직접 언팔로우한다.
// 이 파일은 다른 모듈을 가져오지 않는다. 테스트(script.test.ts)가 node 로 바로 불러 쓰기 때문이다.

export type ScriptOptions = {
  /** 맞팔이 아니어도 결과에서 뺄 계정. */
  keep: string[];
};

export const DEFAULT_OPTIONS: ScriptOptions = { keep: [] };

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

function configBlock(options: ScriptOptions): string {
  // 계정 이름은 JSON.stringify 로 넣어 따옴표·특수 문자가 코드로 새지 않게 한다.
  const keep =
    options.keep.length === 0 ? "[]" : `[\n${options.keep.map((name) => `      ${JSON.stringify(name)},`).join("\n")}\n    ]`;
  return ["  const CONFIG = {", `    keep: ${keep}, // 맞팔이 아니어도 결과에서 뺄 계정`, "  };", ""].join("\n");
}

export function buildScript(options: ScriptOptions): string {
  // 치환 문자열의 $ 가 특수 패턴으로 읽히지 않게 함수로 넘긴다.
  return TEMPLATE.replace("__SITE__", () => SITE).replace("__CONFIG__", () => configBlock(options));
}

const TEMPLATE = `// 스레드: 내가 팔로우하는데 나를 팔로우하지 않는 계정 찾기
// __SITE__ 에서 만든 스크립트입니다. 이 브라우저 안에서만 돌고, 어떤 데이터도 밖으로 보내지 않습니다.
//
// 쓰는 법
// 1. 스레드 내 프로필에서 "OO followers"를 눌러 팔로워/팔로잉 대화상자를 연다.
// 2. 개발자 도구 콘솔에 이 스크립트 전체를 붙여 넣고 Enter.
// 3. 팔로잉 목록에서 "뒷삭하였음" 표시가 붙은 계정을 직접 언팔로우한다.
//    이 스크립트는 목록을 보여 주고 화면에 표시만 할 뿐, 아무도 언팔로우하지 않는다.

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

  // 계정 이름만 따로 찍어 복사하기 쉽게 한다.
  if (targets.length > 0) console.log(targets.join("\\n"));

  // 팔로잉 목록에서 나를 팔로우하지 않는 계정 줄에 "뒷삭하였음"을 표시한다.
  // 화면 모양만 바꾸고 스레드에는 아무것도 보내지 않는다. 새로 고치면 사라진다.
  // 스레드 화면을 그리는 React 와 부딪히지 않게 요소를 끼워 넣지 않고 속성과 CSS(::after)로만 표시한다.
  // 목록은 스크롤할 때마다 줄을 다시 그리고 같은 요소에 다른 계정을 넣기도 하므로, 바뀔 때마다 다시 맞춘다.
  const targetSet = new Set(targets);
  const ROW = "data-nonfollower";
  const NAME = "data-nonfollower-name";
  window.__nonFollowerObserver?.disconnect();
  document.getElementById("nonfollower-style")?.remove();
  const style = document.createElement("style");
  style.id = "nonfollower-style";
  style.textContent = [
    "[" + ROW + "] { background: rgba(255, 59, 48, 0.14) !important; box-shadow: inset 3px 0 0 #ff3b30; }",
    "[" + NAME + "]::after { content: '뒷삭하였음'; display: inline-block; margin-left: 6px; padding: 1px 6px;" +
      " border-radius: 999px; background: #ff3b30; color: #fff; font-size: 11px; font-weight: 700; line-height: 16px; vertical-align: middle; }",
  ].join("\\n");
  document.head.appendChild(style);

  const userOf = (a) => a.getAttribute("href").slice(2).split(/[/?]/)[0];
  const rowOfLink = (a) => {
    let el = a;
    while (el && el !== dialog() && !el.querySelector('[role="button"]')) el = el.parentElement;
    return el && el !== dialog() ? el : null;
  };
  const mark = () => {
    const d = dialog();
    if (!d) return;
    // 이전에 붙인 표시가 지금 그 자리의 계정과 안 맞으면 뗀다.
    d.querySelectorAll("[" + ROW + "]").forEach((row) => {
      const a = row.querySelector('a[href^="/@"]');
      if (!a || userOf(a) !== row.getAttribute(ROW)) row.removeAttribute(ROW);
    });
    d.querySelectorAll("[" + NAME + "]").forEach((a) => {
      if (userOf(a) !== a.getAttribute(NAME)) a.removeAttribute(NAME);
    });
    d.querySelectorAll('a[href^="/@"]').forEach((a) => {
      const u = userOf(a);
      if (!targetSet.has(u)) return;
      const row = rowOfLink(a);
      if (row) row.setAttribute(ROW, u);
      // 사진 링크가 아니라 아이디 글자가 있는 링크에만 붙인다.
      if (a.innerText.trim().startsWith(u)) a.setAttribute(NAME, u);
    });
  };
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      mark();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.__nonFollowerObserver = observer;
  mark();

  console.log(
    "언팔로우는 하지 않았습니다. 팔로잉 목록에서 '뒷삭하였음' 표시가 붙은 계정을 직접 언팔로우하세요. 표시는 새로 고치면 사라집니다.",
  );
})();
`;
