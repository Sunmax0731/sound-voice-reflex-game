export const product = {
  "repo": "sound-voice-reflex-game",
  "domain": "Game",
  "rank": 66,
  "tier": "P3",
  "score": 49,
  "ideaNo": 5,
  "ideaName": "音・声・反射入力ゲーム",
  "field": "反射入力ゲーム",
  "publicTarget": "GitHub Pages / BOOTH",
  "platformScope": "static Web playable prototype / optional microphone manual test",
  "overview": "音や声の代替入力を含む反射ゲームをブラウザで試し、入力遅延と環境差を確認する検証版。",
  "problem": "音声入力は環境差が大きく、いきなりマイク依存にするとプレイ不能になりやすい。",
  "differentiation": "クリック代替入力とサンプル信号で遊べる状態を先に固定し、マイク入力は手動テスト対象として分離する。",
  "audience": "反射ゲームの試作者、音声入力UIの検証者、ブラウザゲーム開発者",
  "requiredInputs": [
    "inputSource",
    "reactionWindow",
    "playerSignal",
    "noiseLevel"
  ],
  "modules": [
    "game-loop",
    "input-simulator",
    "web-game",
    "scenario-validator"
  ],
  "accent": "#db2777",
  "secondary": "#111827",
  "scenarioNouns": [
    "音入力",
    "反応時間",
    "コンボ"
  ]
};

export function evaluateScenario(scenario) {
  if (scenario.type === 'mixed-batch') {
    const results = (scenario.items || []).map((inputs, index) => evaluateScenario({ id: scenario.id + '-' + index, inputs, flags: index === 2 ? ['needsReview'] : [] }));
    const accepted = results.filter((result) => result.status !== 'error').length;
    const warnings = results.filter((result) => result.status !== 'pass').length;
    return { id: scenario.id, status: warnings ? 'warning' : 'pass', accepted, warnings, missing: results.flatMap((result) => result.missing), score: warnings ? 78 : 96 };
  }
  const inputs = scenario.inputs || {};
  const missing = product.requiredInputs.filter((key) => inputs[key] === undefined || inputs[key] === null || inputs[key] === '');
  if (missing.length) return { id: scenario.id, status: 'error', accepted: 0, warnings: 0, missing, score: 0 };
  const risky = Object.values(inputs).some((value) => /stale|low|noisy|manual-lock|large-water-change|late-brake|unknown|overflow|rush|storm|fatigue|unstable|crowded|high/i.test(String(value)));
  const warnings = (scenario.flags || []).includes('needsReview') || risky ? 1 : 0;
  return { id: scenario.id, status: warnings ? 'warning' : 'pass', accepted: 1, warnings, missing: [], score: warnings ? 86 : 96 };
}

export function summarizeProduct() {
  return { name: product.ideaName, repo: product.repo, domain: product.domain, releaseTarget: product.publicTarget, platformScope: product.platformScope, responsibilities: product.modules, requiredInputs: product.requiredInputs };
}
