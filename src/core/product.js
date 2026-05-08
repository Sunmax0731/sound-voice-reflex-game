export const product = {
  "repo": "sound-voice-reflex-game",
  "domain": "Game",
  "rank": 66,
  "tier": "P3",
  "score": 49,
  "ideaNo": 5,
  "ideaName": "音・声・反射入力ゲーム",
  "field": "ゲーム・入力デバイス",
  "publicTarget": "GitHub Pages / BOOTH",
  "overview": "音、声、タップの反応速度を短いチャレンジとして可視化する。",
  "problem": "入力デバイスと環境差の検証が必要で、MVPの安定性が課題になる。",
  "differentiation": "音声入力を必須にせず、疑似入力と手動タップでも検証できる反射ゲームにする。",
  "audience": "ブラウザで音・声・反射を試したいゲーム利用者と配信者",
  "requiredInputs": [
    "inputSource",
    "promptCue",
    "reactionMs",
    "environmentProfile"
  ],
  "modules": [
    "game-loop",
    "balancer",
    "web-game",
    "scenario-validator"
  ],
  "accent": "#d94f70",
  "secondary": "#1f9bb4",
  "scenarioNouns": [
    "音キュー",
    "声入力",
    "反応速度"
  ]
};

export function evaluateScenario(scenario) {
  if (scenario.type === "mixed-batch") {
    const results = (scenario.items || []).map((inputs, index) => evaluateScenario({ id: scenario.id + "-" + index, inputs, flags: index === 2 ? ["needsReview"] : [] }));
    const accepted = results.filter((r) => r.status !== "error").length;
    const warnings = results.filter((r) => r.status !== "pass").length;
    return { id: scenario.id, status: warnings ? "warning" : "pass", accepted, warnings, missing: results.flatMap((r) => r.missing), score: warnings ? 78 : 96 };
  }
  const inputs = scenario.inputs || {};
  const missing = product.requiredInputs.filter((key) => inputs[key] === undefined || inputs[key] === null || inputs[key] === "");
  if (missing.length) return { id: scenario.id, status: "error", accepted: 0, warnings: 0, missing, score: 0 };
  const risky = Object.values(inputs).some((v) => /stale|low|noisy|manual-lock|large-water-change|late-brake|unknown/i.test(String(v)));
  const warnings = (scenario.flags || []).includes("needsReview") || risky ? 1 : 0;
  return { id: scenario.id, status: warnings ? "warning" : "pass", accepted: 1, warnings, missing: [], score: warnings ? 86 : 96 };
}

export function summarizeProduct() {
  return { name: product.ideaName, repo: product.repo, releaseTarget: product.publicTarget, responsibilities: product.modules, requiredInputs: product.requiredInputs };
}
