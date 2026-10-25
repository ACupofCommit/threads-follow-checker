import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";

// 사용 방법 단계별 그림. 실제 스레드·개발자 도구 화면을 단순하게 옮긴 SVG 라 화면 모드와 상관없이 어두운 색을 쓴다.
// 계정 이름은 실제 계정이 아닌 예시 이름이다.

type Labels = Dictionary["steps"]["illustration"];

const BG = "#101010";
const PANEL = "#181818";
const LINE = "#2e2e2e";
const MUTED = "#777";
const TEXT = "#f2f2f2";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** 주소창이 있는 브라우저 창 틀. */
function Browser({ children, url = "threads.com/@acupofcommit" }: { children: ReactNode; url?: string }) {
  return (
    <svg viewBox="0 0 320 180" role="img" className="h-auto w-full rounded-lg" fontFamily="inherit">
      <rect width="320" height="180" rx="8" fill={BG} />
      <rect width="320" height="20" rx="8" fill="#262626" />
      <rect y="12" width="320" height="8" fill="#262626" />
      {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
        <circle key={color} cx={12 + i * 10} cy="10" r="3" fill={color} />
      ))}
      <rect x="50" y="5" width="170" height="10" rx="5" fill="#161616" />
      <text x="58" y="12.5" fontSize="6.5" fill={MUTED}>
        {url}
      </text>
      {children}
    </svg>
  );
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y}l0 16 4.5-4 3 7 3-1.3-3-6.8 6-.4Z`}
      fill="#fff"
      stroke="#000"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  );
}

function Key({ x, y, label, highlight }: { x: number; y: number; label: string; highlight?: boolean }) {
  const width = 10 + label.length * 6;
  return (
    <g>
      <rect x={x} y={y} width={width} height="16" rx="4" fill={highlight ? "#00A63E" : "#2a2a2a"} stroke={highlight ? "none" : "#444"} />
      <text x={x + width / 2} y={y + 11} fontSize="8" fontWeight="600" fill="#fff" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

/** 배지 폭. 한글은 글자 폭이 넓어 대략 글자 수로 잡는다. */
function flagWidth(flag: string): number {
  return 8 + [...flag].reduce((sum, ch) => sum + (/[가-힣]/.test(ch) ? 5.6 : 3.2), 0);
}

/** 팔로워·팔로잉 대화상자의 한 줄. */
function Row({
  y,
  name,
  button,
  filled,
  flag,
}: {
  y: number;
  name: string;
  button: string;
  filled?: boolean;
  /** 스크립트가 "뒷삭 검거"로 표시한 줄. 값이 표시 문구다. */
  flag?: string;
}) {
  return (
    <g>
      {flag && (
        <>
          <rect x="81" y={y - 12.5} width="168" height="25" fill="#ff3b30" fillOpacity="0.16" />
          <rect x="81" y={y - 12.5} width="2" height="25" fill="#ff3b30" />
          {/* 배지 문구가 길어 버튼과 겹치지 않게 아이디 아래 줄에 둔다. */}
          <rect x="109" y={y + 1.5} width={flagWidth(flag)} height="8.5" rx="4.25" fill="#ff3b30" />
          <text x={109 + flagWidth(flag) / 2} y={y + 7.6} fontSize="5.3" fontWeight="700" fill="#fff" textAnchor="middle">
            {flag}
          </text>
        </>
      )}
      <circle cx="96" cy={y} r="7" fill="#4a4a4a" />
      <text x="109" y={y - 1} fontSize="7.5" fontWeight="600" fill={TEXT}>
        {name}
      </text>
      {!flag && <rect x="109" y={y + 2} width="34" height="4" rx="2" fill="#3a3a3a" />}
      <rect x="200" y={y - 7} width="42" height="14" rx="4" fill={filled ? "#fff" : "none"} stroke={filled ? "none" : "#444"} />
      <text x="221" y={y + 2.5} fontSize="6.5" fontWeight="600" fill={filled ? "#000" : MUTED} textAnchor="middle">
        {button}
      </text>
      <line x1="80" x2="250" y1={y + 12} y2={y + 12} stroke={LINE} />
    </g>
  );
}

function FollowDialog({ l, tab = "followers", flagged = [] }: { l: Labels; tab?: "followers" | "following"; flagged?: string[] }) {
  const onFollowing = tab === "following";
  return (
    <g>
      <rect x="80" y="28" width="170" height="146" rx="10" fill={PANEL} stroke={LINE} />
      <text x="122" y="44" fontSize="8" fontWeight={onFollowing ? 600 : 700} fill={onFollowing ? MUTED : TEXT} textAnchor="middle">
        {l.followers}
      </text>
      <text x="122" y="54" fontSize="6.5" fill={onFollowing ? MUTED : TEXT} textAnchor="middle">
        139
      </text>
      <text x="208" y="44" fontSize="8" fontWeight={onFollowing ? 700 : 600} fill={onFollowing ? TEXT : MUTED} textAnchor="middle">
        {l.following}
      </text>
      <text x="208" y="54" fontSize="6.5" fill={onFollowing ? TEXT : MUTED} textAnchor="middle">
        141
      </text>
      <line x1="80" x2="250" y1="60" y2="60" stroke={LINE} />
      <line x1={onFollowing ? 165 : 80} x2={onFollowing ? 250 : 165} y1="60" y2="60" stroke={TEXT} strokeWidth="1.5" />
      {onFollowing ? (
        <>
          {["user_a", "user_b", "user_c", "user_d"].map((name, i) => (
            <Row
              key={name}
              y={76 + i * 26}
              name={name}
              button={l.followingButton}
              flag={flagged.includes(name) ? l.badge : undefined}
            />
          ))}
        </>
      ) : (
        <>
          <Row y={76} name="user_a" button={l.followBack} filled />
          <Row y={102} name="user_b" button={l.followingButton} />
          <Row y={128} name="user_c" button={l.followBack} filled />
          <Row y={154} name="user_d" button={l.followingButton} />
        </>
      )}
    </g>
  );
}

/** 로그인한 스레드 내 프로필 화면(차아린 계정 예시). 2·3단계 그림이 함께 쓴다. */
function ProfilePage({ l }: { l: Labels }) {
  const p = l.profile;
  return (
    <g>
      {/* 왼쪽 메뉴 */}
      <text x="12" y="36" fontSize="10" fontWeight="800" fontStyle="italic" fill={TEXT}>
        threads
      </text>
      {p.nav.map((label, i) => {
        const y = 52 + i * 14;
        const active = i === p.activeNav;
        return (
          <g key={label}>
            {active && <rect x="7" y={y - 8.5} width="70" height="13" rx="3" fill="#262626" />}
            <circle cx="15" cy={y - 2} r="3" fill="none" stroke={active ? TEXT : MUTED} strokeWidth="1.2" />
            <text x="23" y={y} fontSize="6.5" fontWeight={active ? 700 : 400} fill={active ? TEXT : "#bbb"}>
              {label}
            </text>
          </g>
        );
      })}
      {/* 프로필 카드 */}
      <rect x="90" y="28" width="222" height="160" rx="10" fill={PANEL} stroke={LINE} />
      <text x="102" y="47" fontSize="9" fontWeight="700" fill={TEXT}>
        {p.name}
      </text>
      <text x="102" y="57" fontSize="6.5" fill="#bbb">
        acupofcommit
      </text>
      <circle cx="288" cy="48" r="13" fill="#3a3a3a" />
      {p.bio.map((line, i) => (
        <text key={i} x="102" y={70 + i * 8} fontSize="5.8" fill="#ddd">
          {line}
        </text>
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={105 + i * 5} cy="96" r="3.2" fill={["#5a5a5a", "#6a6a6a", "#7a7a7a"][i]} stroke={PANEL} />
      ))}
      <text x="121" y="98.5" fontSize="6.5" fill={MUTED}>
        {p.followers}
      </text>
      <rect x="102" y="106" width="198" height="14" rx="4" fill="none" stroke="#444" />
      <text x="201" y="115.5" fontSize="6.5" fontWeight="600" fill={TEXT} textAnchor="middle">
        {p.editProfile}
      </text>
      {p.tabs.map((label, i) => (
        <text key={label} x={127 + i * 50} y="136" fontSize="6.5" fontWeight={i === 0 ? 700 : 400} fill={i === 0 ? TEXT : MUTED} textAnchor="middle">
          {label}
        </text>
      ))}
      <line x1="90" x2="312" y1="142" y2="142" stroke={LINE} />
      <line x1="102" x2="152" y1="142" y2="142" stroke={TEXT} strokeWidth="1.2" />
      <circle cx="108" cy="156" r="6" fill="#3a3a3a" />
      <text x="120" y="158.3" fontSize="6" fill={MUTED}>
        {p.composer}
      </text>
      <rect x="276" y="150" width="24" height="12" rx="4" fill="none" stroke="#444" />
      <text x="288" y="158.3" fontSize="5.8" fontWeight="600" fill={TEXT} textAnchor="middle">
        {p.post}
      </text>
    </g>
  );
}

/** 2. threads.com 에 로그인한 화면(내 프로필). 팔로워 창은 스크립트가 연다. */
export function SignedInIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      <ProfilePage l={l} />
    </Browser>
  );
}

/** 3. 오른쪽에 개발자 도구를 열고 Console 탭으로. */
export function OpenConsoleIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      {/* 2단계와 같은 프로필 화면. 오른쪽에 개발자 도구가 열려 왼쪽만 보인다. */}
      <svg x="0" y="20" width="196" height="160" viewBox="0 20 196 160" overflow="hidden">
        <ProfilePage l={l} />
      </svg>
      <rect x="196" y="20" width="124" height="160" fill="#202124" />
      <line x1="196" x2="196" y1="20" y2="180" stroke="#3c3c3c" />
      <rect x="196" y="20" width="124" height="16" fill="#292a2d" />
      <text x="204" y="31" fontSize="6.5" fill="#9aa0a6">
        Elements
      </text>
      <text x="238" y="31" fontSize="6.5" fontWeight="700" fill="#e8eaed">
        Console
      </text>
      <line x1="236" x2="266" y1="35.5" y2="35.5" stroke="#8ab4f8" strokeWidth="1.5" />
      <text x="272" y="31" fontSize="6.5" fill="#9aa0a6">
        Sources
      </text>
      <text x="204" y="50" fontSize="7" fill="#8ab4f8" fontFamily={MONO}>
        &gt;
      </text>
      <rect x="212" y="44" width="1.2" height="8" fill="#e8eaed" />
      <Cursor x={262} y={33} />
      <Key x={204} y={154} label="F12" highlight />
      <text x="237" y="165" fontSize="7" fill={MUTED}>
        Mac
      </text>
      <Key x={254} y={154} label="⌥⌘I" highlight />
    </Browser>
  );
}

/** 1. 복사한 스크립트를 AI 채팅에 붙여 넣어 안전한지 검사. 특정 AI 서비스가 아닌 일반 채팅 화면이다. */
export function AiCheckIllustration({ l }: { l: Labels }) {
  const a = l.ai;
  return (
    <Browser url="chat · AI">
      <text x="160" y="34" fontSize="7" fontWeight="700" fill={TEXT} textAnchor="middle">
        {a.title}
      </text>
      {/* 내 요청: 문구 + 스크립트 */}
      <rect x="92" y="42" width="220" height="44" rx="8" fill="#2f2f35" />
      <foreignObject x="98" y="45" width="208" height="16">
        <div style={{ fontSize: "6.3px", lineHeight: 1.3, color: TEXT, wordBreak: "keep-all" }}>{a.request}</div>
      </foreignObject>
      <rect x="98" y="62" width="208" height="19" rx="3" fill="#1b1b1f" />
      <text x="103" y="70" fontSize="5.8" fill="#9aa0a6" fontFamily={MONO}>
        void (async () =&gt; {"{"}
      </text>
      <text x="103" y="77.5" fontSize="5.8" fill="#9aa0a6" fontFamily={MONO}>
        {"  const CONFIG = { keep: [] }; …"}
      </text>
      {/* AI 답변 */}
      <circle cx="16" cy="98" r="6" fill="#00A63E" />
      <text x="16" y="100.3" fontSize="6" fontWeight="700" fill="#fff" textAnchor="middle">
        AI
      </text>
      <rect x="26" y="92" width="210" height="80" rx="8" fill="#1d1d1d" stroke={LINE} />
      {a.checks.map((line, i) => (
        <g key={line}>
          <text x="34" y={106 + i * 13} fontSize="7" fill="#34c759">
            ✓
          </text>
          <text x="44" y={106 + i * 13} fontSize="6.5" fill={TEXT}>
            {line}
          </text>
        </g>
      ))}
      <text x="34" y={106 + a.checks.length * 13} fontSize="6.5" fontWeight="700" fill={TEXT}>
        {a.verdict}
      </text>
    </Browser>
  );
}

/** 4. 콘솔에 스크립트를 붙여 넣고 Enter. Chrome 이 막으면 allow pasting. */
export function PasteScriptIllustration({ l }: { l: Labels }) {
  const code = ["void (async () => {", "  try {", "    const CONFIG = {", "      keep: [],", "    };", "    …", "})();"];
  return (
    <Browser>
      <rect x="0" y="20" width="320" height="160" fill="#202124" />
      <rect x="0" y="20" width="320" height="16" fill="#292a2d" />
      <text x="10" y="31" fontSize="6.5" fontWeight="700" fill="#e8eaed">
        Console
      </text>
      <line x1="8" x2="38" y1="35.5" y2="35.5" stroke="#8ab4f8" strokeWidth="1.5" />
      {/* 붙여 넣기 경고 */}
      <rect x="8" y="42" width="304" height="24" rx="3" fill="#413c26" />
      <text x="16" y="52" fontSize="6.5" fill="#f2d675">
        ⚠ {l.pasteWarning}
      </text>
      <text x="16" y="61" fontSize="6.5" fill="#f2d675" fontFamily={MONO}>
        allow pasting
      </text>
      <text x="10" y="80" fontSize="7" fill="#8ab4f8" fontFamily={MONO}>
        &gt;
      </text>
      <text x="20" y="80" fontSize="7" fill="#e8eaed" fontFamily={MONO}>
        allow pasting
      </text>
      <text x="10" y="94" fontSize="7" fill="#8ab4f8" fontFamily={MONO}>
        &gt;
      </text>
      {code.map((line, i) => (
        <text key={i} x="20" y={94 + i * 10} fontSize="7" fill="#e8eaed" fontFamily={MONO} xmlSpace="preserve">
          {line}
        </text>
      ))}
      <Key x={258} y={152} label="Enter ↵" highlight />
    </Browser>
  );
}

/** 5. 콘솔에 나온 결과 표. */
export function ResultTableIllustration({ l }: { l: Labels }) {
  const rows = ["user_b", "user_d", "user_e"];
  const col = [10, 54, 128];
  return (
    <Browser>
      <rect x="0" y="20" width="320" height="160" fill="#202124" />
      <text x="10" y="36" fontSize="6.5" fill="#9aa0a6">
        {l.collected}
      </text>
      <text x="10" y="50" fontSize="7" fontWeight="600" fill="#e8eaed">
        {l.resultTitle}
      </text>
      <g fontSize="7" fontFamily={MONO}>
        <rect x="8" y="58" width="304" height="16" fill="#2d2e31" stroke="#3c3c3c" />
        {["(index)", l.account, l.address].map((head, i) => (
          <text key={head} x={col[i] + 4} y="69" fill="#e8eaed" fontWeight="600">
            {head}
          </text>
        ))}
        {rows.map((name, i) => {
          const y = 74 + i * 16;
          return (
            <g key={name}>
              <rect x="8" y={y} width="304" height="16" fill="none" stroke="#3c3c3c" />
              <text x={col[0] + 4} y={y + 11} fill="#9aa0a6">
                {i}
              </text>
              <text x={col[1] + 4} y={y + 11} fill="#f28b82">
                {`'${name}'`}
              </text>
              <text x={col[2] + 4} y={y + 11} fill="#8ab4f8">
                {`'https://www.threads.com/@${name}'`}
              </text>
            </g>
          );
        })}
        <line x1={col[1]} x2={col[1]} y1="58" y2="122" stroke="#3c3c3c" />
        <line x1={col[2]} x2={col[2]} y1="58" y2="122" stroke="#3c3c3c" />
      </g>
      {rows.map((name, i) => (
        <text key={name} x="10" y={134 + i * 9} fontSize="7" fill="#e8eaed" fontFamily={MONO}>
          {name}
        </text>
      ))}
      <text x="10" y="170" fontSize="6.5" fill="#9aa0a6">
        {l.done}
      </text>
    </Browser>
  );
}

/** 6. 팔로잉 목록에서 "뒷삭 검거" 표시가 붙은 계정을 직접 언팔로우. */
export function UnfollowMarkedIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      <FollowDialog l={l} tab="following" flagged={["user_b", "user_d"]} />
      <Cursor x={226} y={104} />
    </Browser>
  );
}

export const STEP_ILLUSTRATIONS = [
  AiCheckIllustration,
  SignedInIllustration,
  OpenConsoleIllustration,
  PasteScriptIllustration,
  ResultTableIllustration,
  UnfollowMarkedIllustration,
];
