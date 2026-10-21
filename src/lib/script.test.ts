// 옵션 조합별로 만든 스크립트가 문법 오류 없이 파싱되는지 node --check 로 본다.
// 실행: pnpm test

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_OPTIONS, buildScript, normalizeOptions, parseKeep, type ScriptOptions } from "./script.ts";

const cases: [string, ScriptOptions][] = [
  ["기본값", DEFAULT_OPTIONS],
  ["keep 여러 개", { ...DEFAULT_OPTIONS, keep: ["threads", "zuck", "a.b_c"] }],
  ["자동 언팔로우", { ...DEFAULT_OPTIONS, unfollow: true, maxUnfollow: 20, minDelaySec: 30, maxDelaySec: 60 }],
  ["범위 밖 값", { ...DEFAULT_OPTIONS, unfollow: true, maxUnfollow: 999, minDelaySec: 90, maxDelaySec: 1 }],
  ["숫자가 아닌 값", { ...DEFAULT_OPTIONS, maxUnfollow: Number.NaN, minDelaySec: Number.NaN, maxDelaySec: Infinity }],
  // parseKeep 을 거치지 않은 이상한 이름도 코드로 새지 않아야 한다.
  ["따옴표·백틱이 든 이름", { ...DEFAULT_OPTIONS, keep: ['a"b', "c`d", "${x}", "e\\f\nconsole.log(1)"] }],
];

const dir = mkdtempSync(join(tmpdir(), "threads-script-"));
test.after(() => rmSync(dir, { recursive: true, force: true }));

for (const [name, options] of cases) {
  test(`node --check: ${name}`, () => {
    const file = join(dir, `${name.replace(/\W+/g, "_")}.js`);
    const script = buildScript(options);
    writeFileSync(file, script);
    execFileSync(process.execPath, ["--check", file]);
    assert.ok(!script.includes("__CONFIG__") && !script.includes("__SITE__"));
  });
}

test("CONFIG 값이 그대로 들어간다", () => {
  const script = buildScript({ ...DEFAULT_OPTIONS, unfollow: true, maxUnfollow: 7, keep: ["threads"] });
  assert.match(script, /unfollow: true,/);
  assert.match(script, /maxUnfollow: 7,/);
  assert.match(script, /minDelayMs: 20000,/);
  assert.match(script, /"threads",/);
});

test("normalizeOptions: 범위를 맞추고 최소·최대 간격을 바로잡는다", () => {
  assert.deepEqual(normalizeOptions({ keep: [], unfollow: false, maxUnfollow: 0, minDelaySec: 90, maxDelaySec: 1 }), {
    keep: [],
    unfollow: false,
    maxUnfollow: 1,
    minDelaySec: 5,
    maxDelaySec: 90,
  });
});

test("parseKeep: @이름·프로필 주소·쉼표·줄바꿈을 받고 중복은 뺀다", () => {
  assert.deepEqual(parseKeep("@Threads, zuck\nhttps://www.threads.com/@mosseri?x=1 zuck 잘못된!이름"), [
    "threads",
    "zuck",
    "mosseri",
  ]);
});
