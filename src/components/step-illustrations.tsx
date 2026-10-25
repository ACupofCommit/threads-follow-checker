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
function Browser({ children, url = "threads.com/@me" }: { children: ReactNode; url?: string }) {
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

/** 팔로워·팔로잉 대화상자의 한 줄. */
function Row({
  y,
  name,
  button,
  filled,
  found,
}: {
  y: number;
  name: string;
  button: string;
  filled?: boolean;
  /** Cmd+F 로 찾은 줄. 이름을 찾기 강조색으로 칠한다. */
  found?: boolean;
}) {
  return (
    <g>
      <circle cx="96" cy={y} r="7" fill="#4a4a4a" />
      {found && <rect x="107.5" y={y - 8} width={name.length * 4.6 + 3} height="10" rx="1.5" fill="#ff9632" />}
      <text x="109" y={y - 1} fontSize="7.5" fontWeight="600" fill={found ? "#000" : TEXT}>
        {name}
      </text>
      <rect x="109" y={y + 2} width="34" height="4" rx="2" fill="#3a3a3a" />
      <rect x="200" y={y - 7} width="42" height="14" rx="4" fill={filled ? "#fff" : "none"} stroke={filled ? "none" : "#444"} />
      <text x="221" y={y + 2.5} fontSize="6.5" fontWeight="600" fill={filled ? "#000" : MUTED} textAnchor="middle">
        {button}
      </text>
      <line x1="80" x2="250" y1={y + 12} y2={y + 12} stroke={LINE} />
    </g>
  );
}

function FollowDialog({ l, tab = "followers", found }: { l: Labels; tab?: "followers" | "following"; found?: string }) {
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
          <Row y={76} name="user_a" button={l.followingButton} />
          <Row y={102} name="user_b" button={l.followingButton} found={found === "user_b"} />
          <Row y={128} name="user_c" button={l.followingButton} />
          <Row y={154} name="user_d" button={l.followingButton} />
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

/** 1. 내 프로필에서 팔로워 수를 눌러 연 대화상자. */
export function OpenDialogIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      {/* 뒤의 프로필 화면 */}
      <rect x="14" y="30" width="44" height="6" rx="3" fill="#2a2a2a" />
      {[44, 56, 68, 80].map((y) => (
        <rect key={y} x="14" y={y} width="36" height="5" rx="2.5" fill="#1f1f1f" />
      ))}
      <rect x="262" y="34" width="44" height="44" rx="22" fill="#222" />
      <FollowDialog l={l} />
      <Cursor x={140} y={44} />
    </Browser>
  );
}

/** 2. 오른쪽에 개발자 도구를 열고 Console 탭으로. */
export function OpenConsoleIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      <g transform="translate(-58 0) scale(1)">
        <FollowDialog l={l} />
      </g>
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

/** 3. 콘솔에 스크립트를 붙여 넣고 Enter. Chrome 이 막으면 allow pasting. */
export function PasteScriptIllustration({ l }: { l: Labels }) {
  const code = ["(async () => {", "  const CONFIG = {", "    keep: [],", "  };", "  …", "})();"];
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

/** 4. 콘솔에 나온 결과 표. */
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

/** 5. 팔로잉 탭 제목을 눌러 페이지를 선택하고, Cmd+F 로 계정을 찾아 직접 언팔로우. */
export function FindAndUnfollowIllustration({ l }: { l: Labels }) {
  return (
    <Browser>
      <FollowDialog l={l} tab="following" found="user_b" />
      {/* 브라우저 찾기 막대 */}
      <rect x="256" y="24" width="58" height="16" rx="4" fill="#2b2b2b" stroke="#4a4a4a" />
      <text x="261" y="34.5" fontSize="6.5" fill={TEXT} fontFamily={MONO}>
        user_b
      </text>
      <text x="309" y="34.5" fontSize="6" fill={MUTED} textAnchor="end">
        1/1
      </text>
      <Cursor x={226} y={104} />
      <Key x={262} y={152} label="⌘F" highlight />
      <Key x={262} y={132} label="Ctrl+F" />
    </Browser>
  );
}

export const STEP_ILLUSTRATIONS = [
  OpenDialogIllustration,
  OpenConsoleIllustration,
  PasteScriptIllustration,
  ResultTableIllustration,
  FindAndUnfollowIllustration,
];
