// 옵션 조합별로 만든 스크립트가 문법 오류 없이 파싱되는지 node --check 로 본다.
// 실행: pnpm test

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_OPTIONS, buildScript, parseKeep, type ScriptOptions } from "./script.ts";

const cases: [string, ScriptOptions][] = [
  ["기본값", DEFAULT_OPTIONS],
  ["keep 여러 개", { ...DEFAULT_OPTIONS, keep: ["threads", "zuck", "a.b_c"] }],
  ["자동 언팔로우", { ...DEFAULT_OPTIONS, unfollow: true }],
  ["자동 언팔로우 + keep", { keep: ["threads"], unfollow: true }],
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

test("CONFIG: 폼 값과 고정값(2명, 2~4초)이 들어간다", () => {
  const script = buildScript({ unfollow: true, keep: ["threads"] });
  assert.match(script, /unfollow: true,/);
  assert.match(script, /maxUnfollow: 2,/);
  assert.match(script, /minDelayMs: 2000,/);
  assert.match(script, /maxDelayMs: 4000,/);
  assert.match(script, /"threads",/);
});

test("parseKeep: @이름·프로필 주소·쉼표·줄바꿈을 받고 중복은 뺀다", () => {
  assert.deepEqual(parseKeep("@Threads, zuck\nhttps://www.threads.com/@mosseri?x=1 zuck 잘못된!이름"), [
    "threads",
    "zuck",
    "mosseri",
  ]);
});
