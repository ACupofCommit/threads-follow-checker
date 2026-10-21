# Threads Follow Checker (스레드 맞팔 확인)

스레드(Threads)에서 "내가 팔로우하지만 나를 팔로우하지 않는 계정"을 찾는 브라우저 콘솔 스크립트를 옵션과 함께 만들어 복사하게 해 주는 1페이지 사이트. 커밋한잔의 [YouTube Playlist Maker](https://youtube-playlist-maker.commit2.app)와 같은 구조·디자인을 쓴다.

- 사이트는 계정에 접근하지 않는다. 스크립트는 사용자가 직접 스레드 탭 콘솔에 붙여 넣어 실행하고, 데이터는 브라우저 밖으로 나가지 않는다.
- 스크립트 템플릿: `src/lib/script.ts` (원본 `threads-nonfollowers.js`의 구조·셀렉터 그대로, `CONFIG`만 폼 값으로 주입)
- Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui (base-ui), 화면 모드(`next-themes`), `/ko`·`/en`(`src/proxy.ts`)

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm test    # 옵션 조합별 스크립트를 node --check 로 문법 검사
```
