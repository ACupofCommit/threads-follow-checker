export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const ko = {
  meta: {
    title: "스레드 맞팔 확인 — 맞팔 안 한 계정 1분 만에 찾기",
    description:
      "스레드(Threads)에서 내가 팔로우하지만 나를 팔로우하지 않는 계정을 찾는 브라우저 콘솔 스크립트. 로그인 정보는 받지 않고, 데이터는 내 브라우저 밖으로 나가지 않습니다.",
  },
  header: { name: "스레드 맞팔 확인", theme: "화면 모드", light: "라이트", dark: "다크", system: "시스템", language: "언어" },
  hero: {
    title: "쓰팔 안 한 친구 찾기",
    subtitle: "스레드에서 내가 팔로우하지만 나를 팔로우하지 않는 계정을 찾아 드려요. 스크립트 하나만 복사해서 붙여 넣으면 돼요.",
    meme: "누가 뒷삭을 하였는가~",
  },
  safety: {
    title: "계정 정보는 받지 않아요",
    items: [
      "이 사이트는 스레드 계정에 접근하지 않아요. 로그인 정보·비밀번호·쿠키를 묻지도 받지도 않아요.",
      "스크립트는 내가 직접 스레드 탭의 콘솔에 붙여 넣어 실행하고, 내 브라우저 안에서만 돌아요. 어떤 데이터도 밖으로 보내지 않아요.",
      "스크립트는 목록을 보여 주고 내 화면에 표시만 해요. 아무도 언팔로우하지 않고, 언팔로우는 내가 직접 해요.",
    ],
  },
  steps: {
    title: "사용 방법",
    illustration: {
      followers: "팔로워",
      following: "팔로잉",
      followBack: "맞팔로우",
      followingButton: "팔로잉",
      pasteWarning: "붙여 넣기가 막히면 아래처럼 입력하고 Enter",
      collected: "팔로워: 139명 수집 · 팔로잉: 141명 수집",
      resultTitle: "나를 팔로우하지 않는 계정 3명:",
      account: "계정",
      address: "주소",
      done: "언팔로우는 하지 않았습니다. 팔로잉 목록을 내리며 '뒷삭 검거' 표시가…",
      badge: "뒷삭 검거(맞팔안한 친구)",
    },
    items: [
      {
        title: "PC에서 스레드 내 프로필 열기",
        body: "PC 브라우저(Chrome 권장)로 threads.com 에 로그인하고 내 프로필을 열어요. 팔로워·팔로잉 창은 스크립트가 “팔로워 OO명”을 눌러 알아서 열어요.",
      },
      {
        title: "개발자 도구 콘솔 열기",
        body: "F12(맥은 ⌥⌘I)를 눌러 개발자 도구를 열고 Console 탭으로 가요.",
      },
      {
        title: "스크립트 붙여 넣고 Enter",
        body: "아래에서 스크립트를 복사해 콘솔에 붙여 넣고 Enter를 눌러요. Chrome이 붙여 넣기를 막으면 allow pasting 을 입력하고 Enter를 누른 뒤 다시 붙여 넣어요.",
      },
      {
        title: "결과 표 확인",
        body: "팔로워와 팔로잉 목록을 끝까지 내려 모은 뒤, 나를 팔로우하지 않는 계정과 프로필 주소를 표로 보여 줘요. 표 아래에는 복사하기 쉽게 계정 이름만 한 줄씩 나와요. 계정이 많으면 몇 분 걸려요.",
      },
      {
        title: "표시된 계정을 직접 언팔로우",
        body: "스크립트가 끝나면 팔로잉 목록에서 나를 팔로우하지 않는 계정 줄이 붉게 칠해지고 ‘뒷삭 검거(맞팔안한 친구)’가 붙어요. 목록을 내리며 표시된 계정의 ‘팔로잉’ → ‘언팔로우’를 눌러요. 특정 계정을 바로 찾으려면 ‘팔로잉’ 탭 제목을 한 번 누른 뒤 Cmd+F(Windows는 Ctrl+F)로 아이디를 찾아요. 표시는 새로 고치면 사라져요.",
      },
    ],
  },
  options: {
    title: "스크립트 만들기",
    keepLabel: "계속 팔로우할 계정 (선택)",
    keepHint: "맞팔이 아니어도 결과에서 뺄 계정이에요. 줄바꿈·쉼표로 나눠 적고, @이름이나 프로필 주소도 돼요.",
    keepPlaceholder: "@threads\n@zuck",
    keepCount: "{count}개 계정을 결과에서 빼요",
    copy: "스크립트 복사",
    copied: "스크립트를 복사했어요. 스레드 탭의 콘솔에 붙여 넣으세요.",
    copyFailed: "복사하지 못했어요. 미리보기에서 직접 선택해 복사해 주세요.",
    note: "목록을 보여 주고 화면에 표시만 해요. 아무도 언팔로우하지 않아요.",
    preview: "스크립트 미리보기",
  },
  faq: {
    title: "자주 묻는 질문",
    items: [
      {
        q: "안전한가요?",
        a: "이 사이트는 계정 정보를 받지 않고, 스크립트는 내 브라우저 안에서 스레드 화면을 읽기만 해요. 외부로 보내는 코드가 없다는 건 미리보기에서 직접 확인할 수 있어요.",
      },
      {
        q: "자동으로 언팔로우해 주지는 않나요?",
        a: "Meta는 짧은 시간에 몰리는 언팔로우를 자동화로 보고 계정을 제한할 수 있어요. 계정을 지키려고 스크립트는 찾기만 하고, 언팔로우는 직접 하도록 했어요.",
      },
      {
        q: "모바일에서도 되나요?",
        a: "안 돼요. 개발자 도구 콘솔이 필요해서 PC 브라우저에서만 쓸 수 있어요.",
      },
      {
        q: "결과 숫자가 탭에 보이는 숫자와 달라요.",
        a: "탭의 팔로워·팔로잉 수에는 목록에 보이지 않는 비활성·제한 계정이 들어갈 수 있어요. 스크립트는 목록에 실제로 보이는 계정만 세요.",
      },
      {
        q: "도중에 멈추고 싶어요.",
        a: "스레드 탭을 새로 고치면 스크립트가 멈춰요.",
      },
    ],
  },
  tools: {
    title: "커밋한잔의 다른 도구",
    youtube: { name: "YouTube Playlist Maker", body: "YouTube 링크 여러 개를 재생목록 링크 하나로" },
  },
  banner: {
    label: "특별한 광고",
    eyebrow: "1Bookmark",
    title: "스레드에서 본 좋은 글, 링크 하나 놓치지 않게",
    body: "마음에 드는 글이나 계정 링크를 1Bookmark에 단축키 한 번으로 저장하고, 언제든 검색해서 다시 여세요.",
    cta: "1Bookmark 알아보기",
  },
  footer: { brand: "커밋한잔", madeBy: "{brand}이 만들었어요" },
};

export type Dictionary = typeof ko;

const en: Dictionary = {
  meta: {
    title: "Threads Follow Checker — Find who doesn't follow you back",
    description:
      "A browser console script that finds Threads accounts you follow that don't follow you back. No sign-in info needed, and your data never leaves your browser.",
  },
  header: { name: "Threads Follow Checker", theme: "Theme", light: "Light", dark: "Dark", system: "System", language: "Language" },
  hero: {
    title: "Find Threads accounts\nthat don't follow you back",
    subtitle: "Find Threads accounts you follow that don't follow you back. Just copy one script and paste it.",
    meme: "Who dared to unfollow me~?",
  },
  safety: {
    title: "We never touch your account",
    items: [
      "This site doesn't access your Threads account. It never asks for or receives your login, password, or cookies.",
      "You paste the script into the console of your own Threads tab, and it runs only in your browser. No data is sent anywhere.",
      "The script only shows a list and marks accounts on your screen. It never unfollows anyone; you unfollow by hand.",
    ],
  },
  steps: {
    title: "How to use",
    illustration: {
      followers: "Followers",
      following: "Following",
      followBack: "Follow back",
      followingButton: "Following",
      pasteWarning: "If pasting is blocked, type this and press Enter",
      collected: "팔로워: 139명 수집 · 팔로잉: 141명 수집",
      resultTitle: "나를 팔로우하지 않는 계정 3명:",
      account: "계정",
      address: "주소",
      done: "언팔로우는 하지 않았습니다. 팔로잉 목록을 내리며 '뒷삭 검거' 표시가…",
      badge: "뒷삭 검거(맞팔안한 친구)",
    },
    items: [
      {
        title: "Open your profile on desktop",
        body: "Sign in to threads.com in a desktop browser (Chrome recommended) and open your profile. The script clicks “OO followers” to open the followers/following dialog for you.",
      },
      {
        title: "Open the developer console",
        body: "Press F12 (⌥⌘I on Mac) to open developer tools and go to the Console tab.",
      },
      {
        title: "Paste the script and press Enter",
        body: "Copy the script below, paste it into the console, and press Enter. If Chrome blocks pasting, type allow pasting, press Enter, and paste again.",
      },
      {
        title: "Check the result table",
        body: "It scrolls through your followers and following, then shows a table of accounts that don't follow you back with their profile links. Below the table, the account names are listed one per line for easy copying. Large lists can take a few minutes.",
      },
      {
        title: "Unfollow the marked accounts by hand",
        body: "When the script finishes, rows in your Following list that don't follow you back turn red with a ‘뒷삭 검거(맞팔안한 친구)’ (not following you back) badge. Scroll the list and click ‘Following’ → ‘Unfollow’ on the marked accounts. To jump to one, click the ‘Following’ tab title once, then search its name with Cmd+F (Ctrl+F on Windows). The marks disappear when you reload.",
      },
    ],
  },
  options: {
    title: "Build your script",
    keepLabel: "Accounts to keep following (optional)",
    keepHint: "These are left out of the result even if they don't follow back. Separate with new lines or commas; @names and profile links work too.",
    keepPlaceholder: "@threads\n@zuck",
    keepCount: "{count} accounts will be left out",
    copy: "Copy script",
    copied: "Script copied. Paste it into the console of your Threads tab.",
    copyFailed: "Couldn't copy. Please select and copy it from the preview.",
    note: "It only lists and marks accounts. It never unfollows anyone.",
    preview: "Script preview",
  },
  faq: {
    title: "FAQ",
    items: [
      {
        q: "Is it safe?",
        a: "This site never receives your account info, and the script only reads the Threads page inside your browser. You can check in the preview that nothing is sent out.",
      },
      {
        q: "Can it unfollow automatically?",
        a: "Meta may treat a burst of unfollows as automation and restrict your account. To keep your account safe, the script only finds accounts and you unfollow by hand.",
      },
      {
        q: "Does it work on mobile?",
        a: "No. It needs the developer console, so it only works in a desktop browser.",
      },
      {
        q: "The numbers differ from the counts on the tabs.",
        a: "Tab counts can include inactive or restricted accounts that don't appear in the list. The script only counts accounts actually shown in the list.",
      },
      {
        q: "How do I stop it midway?",
        a: "Reload the Threads tab and the script stops.",
      },
    ],
  },
  tools: {
    title: "More tools by A Cup of Commit",
    youtube: { name: "YouTube Playlist Maker", body: "Turn many YouTube links into one playlist link" },
  },
  banner: {
    label: "Special ad",
    eyebrow: "1Bookmark",
    title: "Never lose a great Threads post again",
    body: "Save posts and profiles you like to 1Bookmark with a single shortcut, and search them anytime.",
    cta: "Discover 1Bookmark",
  },
  footer: { brand: "A Cup of Commit", madeBy: "Made by {brand}" },
};

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** "{count}개" 같은 자리에 값을 넣는다. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
