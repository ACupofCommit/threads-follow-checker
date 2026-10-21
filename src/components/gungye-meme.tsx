/**
 * "누가 뒷삭을 하였는가~" 밈. 드라마 장면 캡처는 저작권·초상권 문제가 있어 쓰지 않고,
 * 안대를 찬 왕을 직접 그린 만화풍 일러스트로 대신한다(특정 배우를 닮게 그리지 않는다).
 */
export function GungyeMeme({ line }: { line: string }) {
  return (
    <figure className="mx-auto flex items-end gap-3">
      <svg viewBox="0 0 200 220" role="img" aria-label={line} className="h-36 w-auto shrink-0 sm:h-44">
        {/* 곤룡포 */}
        <path d="M30 220c4-44 30-70 70-70s66 26 70 70Z" fill="#7a1f2b" />
        <path d="M100 150l-22 70h44Z" fill="#5b1520" />
        <circle cx="100" cy="186" r="13" fill="#d9a441" />
        {/* 얼굴 */}
        <ellipse cx="100" cy="104" rx="40" ry="46" fill="#f1c9a2" />
        {/* 수염 */}
        <path d="M78 136c6 18 14 26 22 26s16-8 22-26c-8 6-14 8-22 8s-14-2-22-8Z" fill="#2a1d17" />
        {/* 화난 입 */}
        <path d="M88 128q12-8 24 0" stroke="#5a2a1e" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* 눈썹·눈 */}
        <path d="M112 86l20-6" stroke="#2a1d17" strokeWidth="6" strokeLinecap="round" />
        <circle cx="121" cy="98" r="5" fill="#2a1d17" />
        {/* 안대 */}
        <path d="M58 70l86 50" stroke="#111" strokeWidth="4" />
        <ellipse cx="80" cy="99" rx="17" ry="14" fill="#111" transform="rotate(20 80 99)" />
        {/* 관모 */}
        <path d="M62 70c0-30 18-46 38-46s38 16 38 46Z" fill="#1c1c22" />
        <rect x="56" y="64" width="88" height="12" rx="5" fill="#2b2b33" />
        <ellipse cx="42" cy="66" rx="16" ry="7" fill="#1c1c22" transform="rotate(-12 42 66)" />
        <ellipse cx="158" cy="66" rx="16" ry="7" fill="#1c1c22" transform="rotate(12 158 66)" />
        <circle cx="100" cy="40" r="5" fill="#d9a441" />
      </svg>
      <figcaption className="bg-card relative mb-20 rounded-2xl border px-4 py-3 text-lg font-bold shadow-sm sm:mb-24 sm:text-xl">
        {line}
        {/* 말풍선 꼬리 */}
        <span className="bg-card absolute bottom-3 -left-1.5 size-3 rotate-45 border-b border-l" aria-hidden />
      </figcaption>
    </figure>
  );
}
