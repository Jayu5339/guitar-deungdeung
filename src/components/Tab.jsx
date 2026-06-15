import { useState, useRef, useEffect, useCallback } from "react";
import PageHeader from "../PageHeader";
import "./Tab.css";

// ─── Data ───────────────────────────────────────────────────────────────────

const TECHNIQUES = [
  {
    id: "gliss_up",
    symbol: "/5",
    name: "글리산도 (위로)",
    short: "오픈 → 5프렛",
    color: "#378ADD",
    explanation:
      "글리산도 슬라이드 위로는 시작 프렛 없이 낮은 음에서 목표 프렛으로 빠르게 밀어 올리는 주법입니다. 시작 위치가 명확하지 않아 '어딘가에서 올라온다'는 느낌을 줍니다.",
    tip: "손가락을 2~3프렛 아래에 대고 목표 프렛까지 빠르게 밀어 올리세요. 픽킹은 처음 한 번만 합니다.",
  },
  {
    id: "gliss_down",
    symbol: "5\\",
    name: "글리산도 (아래로)",
    short: "5프렛 → 오픈",
    color: "#D85A30",
    explanation:
      "글리산도 슬라이드 아래로는 목표 프렛에서 끝 위치 없이 낮은 음 방향으로 빠르게 내려오는 주법입니다. 음이 사라지듯 흘러내리는 효과를 줍니다.",
    tip: "목표 프렛을 픽킹한 후 손가락을 빠르게 아래 방향으로 밀어 내려보내세요. 끝 프렛은 정해져 있지 않아도 됩니다.",
  },
  {
    id: "slide_up",
    symbol: "5/7",
    name: "슬라이드 (위로)",
    short: "5프렛 → 7프렛",
    color: "#378ADD",
    explanation:
      "슬라이드 업은 시작 프렛에서 목표 프렛까지 손가락을 떼지 않고 미끄러지듯 올라가는 주법입니다. 두 음이 명확하고, 중간 이동 음들이 연속적으로 들립니다.",
    tip: "처음 픽킹 후 손가락 압력을 유지한 채 부드럽게 밀어 올리세요. 목표 프렛에서 정확히 멈춰야 깔끔합니다.",
  },
  {
    id: "slide_down",
    symbol: "7\\5",
    name: "슬라이드 (아래로)",
    short: "7프렛 → 5프렛",
    color: "#D85A30",
    explanation:
      "슬라이드 다운은 높은 프렛에서 낮은 프렛으로 손가락을 밀어 내리는 주법입니다. 슬라이드 업과 반대 방향이며, 두 음 모두 명확하게 들립니다.",
    tip: "시작 프렛을 픽킹한 후 압력을 유지하며 아래 방향으로 밀어내세요. 도착 프렛에서 멈추는 것이 중요합니다.",
  },
  {
    id: "vibrato",
    symbol: "5~",
    name: "비브라토",
    short: "음을 떨리게",
    color: "#BA7517",
    explanation:
      "비브라토는 프렛을 누른 채로 손가락을 줄과 수직 방향으로 반복적으로 움직여 음의 높이를 미세하게 변화시키는 주법입니다. 노래하는 듯한 표정을 만들어냅니다.",
    tip: "팔목 회전을 이용해 손가락을 위아래로 리듬감 있게 흔드세요. 빠를수록 긴박한 느낌, 느릴수록 서정적인 느낌이 납니다.",
  },
  {
    id: "full_bend",
    symbol: "5b7",
    name: "풀 밴딩",
    short: "5프렛 → 7프렛 음",
    color: "#BA7517",
    explanation:
      "풀 밴딩은 줄을 2프렛 위의 음정이 나도록 수직으로 밀거나 당기는 주법입니다. 예시에서 5프렛을 밴딩하면 7프렛과 같은 음이 납니다.",
    tip: "여러 손가락으로 지지하면서 줄을 위 또는 아래로 밀어 올리세요. 음정이 정확히 전음(2프렛) 올라가야 합니다.",
  },
  {
    id: "half_bend",
    symbol: "5b6",
    name: "1/2 밴딩",
    short: "5프렛 → 6프렛 음",
    color: "#BA7517",
    explanation:
      "하프 밴딩은 줄을 1프렛 위의 음정이 나도록 당기는 주법입니다. 풀 밴딩보다 덜 밀고, 섬세한 음의 표현에 사용됩니다.",
    tip: "풀 밴딩의 절반 정도만 당기세요. 블루스나 컨트리 음악에서 자주 쓰이며, 정확한 음정 감각이 필요합니다.",
  },
  {
    id: "let_ring",
    symbol: "5 ──",
    name: "Let Ring",
    short: "음을 지속시키기",
    color: "#3B6D11",
    explanation:
      "Let Ring은 음을 뮤트하지 않고 최대한 길게 울리도록 하는 주법입니다. 탭에서는 숫자 뒤에 긴 선(──)으로 표시합니다. 아르페지오나 클린 톤 연주에서 자주 사용됩니다.",
    tip: "한번 짚은 음에서 손가락을 떼지 마세요. 코드 전체를 Let Ring으로 연주하면 각 음이 겹쳐 울리며 풍성한 소리가 납니다.",
  },
  {
    id: "palm_mute",
    symbol: "P.M.",
    name: "팜 뮤트",
    short: "손바닥으로 줄 죽이기",
    color: "#534AB7",
    explanation:
      "팜 뮤트(Palm Mute)는 오른손 손바닥 끝부분을 브리지 근처 줄 위에 살짝 올려놓아 음의 울림을 억제하는 주법입니다. '퍽퍽' 하는 탁하고 짧은 소리가 나며 메탈, 록, 펑크 등에서 매우 자주 쓰입니다. 탭에서는 P.M. 또는 P.M.──── 로 표시하며, 선이 이어지는 구간 동안 계속 팜 뮤트를 유지합니다.",
    tip: "손바닥을 브리지에 최대한 가깝게 놓을수록 음이 살아나고, 멀수록 더 많이 죽습니다. 처음에는 브리지 바로 위에 올려두고 조금씩 위치를 조정해 원하는 소리를 찾아보세요.",
  },
  {
    id: "mute_stroke",
    symbol: "X",
    name: "뮤트 스트로크 (컷팅)",
    short: "줄을 막고 스트로크",
    color: "#B53A3A",
    explanation:
      "뮤트 스트로크(컷팅)는 왼손 손가락을 줄에 살짝 얹어 음정 없이 퍼커시브한 소리만 내는 주법입니다. 탭에서는 프렛 숫자 대신 'X'로 표기합니다. 리듬 기타에서 박자감을 살리거나 펑키한 느낌을 줄 때 자주 사용됩니다.",
    tip: "왼손 손가락들을 줄 위에 살짝 얹되, 프렛을 누르지는 마세요. 완전히 뮤트된 상태에서 오른손으로 스트로크하면 '칙칙' 하는 퍼커시브한 소리가 납니다.",
  },
  {
    id: "mute_picking",
    symbol: "x",
    name: "뮤트 피킹",
    short: "단음 뮤트 피킹",
    color: "#B53A3A",
    explanation:
      "뮤트 피킹은 뮤트 스트로크와 같이 왼손으로 줄을 막은 채로 픽으로 단음을 피킹하는 주법입니다. 스트로크와 달리 한 줄씩 피킹하며, 소문자 'x'로 표기하는 경우가 많습니다. 베이스 라인이나 리프에서 특정 음을 강조할 때 사용됩니다.",
    tip: "왼손 손가락 하나로 대상 줄만 가볍게 터치해 뮤트하세요. 다른 줄이 울리지 않도록 인접한 줄도 함께 컨트롤하는 것이 중요합니다.",
  },
  {
    id: "hammer_pull",
    symbol: "5h7p5",
    name: "해머링 & 플링",
    short: "5 → 해머온 7 → 풀오프 5",
    color: "#1A7A62",
    explanation:
      "해머링(Hammer-on)은 픽킹 없이 왼손 손가락으로 줄을 강하게 눌러 음을 내는 주법이고, 풀오프(Pull-off)는 짚고 있던 손가락을 줄을 튕기듯 떼어내어 아래 음을 내는 주법입니다. 탭에서 'h'는 해머온, 'p'는 풀오프를 뜻합니다. 두 기법을 조합하면 빠르고 부드러운 레가토 선율을 만들 수 있습니다.",
    tip: "해머링은 손가락 끝으로 프렛 바로 뒤를 강하게 '망치질'하듯 누르세요. 풀오프는 단순히 떼는 게 아니라 손가락을 살짝 아래로 튕기듯 당겨야 소리가 납니다.",
  },
];

const STRING_NAMES = ["e", "B", "G", "D", "A", "E"];
const STRING_COUNT = 6;
const STRING_GAP = 22;
const START_Y = 32;
const LEFT_X = 52;

// G현(3번줄) 기준 오픈 MIDI 노트 (Copy.jsx의 OPEN_STRING_MIDI[2]와 동일)
const G_STRING_OPEN_MIDI = 55;

// ─── Audio (사운드 합성) ────────────────────────────────────────────────────

const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// 디스토션 커브 (Copy.jsx와 동일한 크런치 톤)
const makeDistortionCurve = (amount) => {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
};

// ─── Canvas Drawing ──────────────────────────────────────────────────────────

function getThemeColors() {
  return {
    primary: "#f0ece3",
    secondary: "#666",
    blue: "#85b7eb",
    blueLight: "rgba(133,183,235,0.12)",
    amber: "#e8c96a",
    green: "#97c459",
    coral: "#f0997b",
    lineColor: "rgba(240,236,227,0.14)",
  };
}

function drawBase(ctx, W, H, highlightStr = -1, waveAmp = 0) {
  const c = getThemeColors();
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < STRING_COUNT; i++) {
    const y = START_Y + i * STRING_GAP;
    // label
    ctx.save();
    ctx.font = "11px monospace";
    ctx.fillStyle = c.secondary;
    ctx.textAlign = "right";
    ctx.fillText(STRING_NAMES[i], LEFT_X - 8, y + 4);
    ctx.restore();

    const isHi = i === highlightStr;
    ctx.beginPath();
    ctx.strokeStyle = isHi ? c.blue : c.lineColor;
    ctx.lineWidth = isHi ? 1.6 : 0.75;
    if (isHi && waveAmp > 0) {
      ctx.moveTo(LEFT_X, y);
      for (let x = LEFT_X; x <= W - 20; x += 2) {
        ctx.lineTo(x, y + waveAmp * Math.sin((x - LEFT_X) * 0.09 + waveAmp * 10));
      }
    } else {
      ctx.moveTo(LEFT_X, y);
      ctx.lineTo(W - 20, y);
    }
    ctx.stroke();
  }
  return c;
}

function drawCaption(ctx, W, H, text, color) {
  ctx.save();
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, W / 2, H - 22);
  ctx.restore();
}

// individual draw functions
const drawers = {
  gliss_up(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const sx = LEFT_X + 55, ex = LEFT_X + 200;
    const prog = Math.min(t, 1);
    // ghost region
    ctx.fillStyle = c.blueLight;
    ctx.fillRect(sx - 8, sy - 14, 28, 26);
    // slash
    ctx.beginPath();
    ctx.strokeStyle = c.blue;
    ctx.lineWidth = 2;
    ctx.moveTo(sx, sy + 9);
    ctx.lineTo(sx + (ex - sx) * prog, sy - 9);
    ctx.stroke();
    // target
    if (t > 0.7) {
      ctx.save();
      ctx.globalAlpha = Math.min((t - 0.7) / 0.3, 1);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.blue;
      ctx.textAlign = "center";
      ctx.fillText("5", ex + 16, sy + 5);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "/5", c.blue);
  },
  gliss_down(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const sx = LEFT_X + 70, ex = sx + 160;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("5", sx, sy + 5);
    const prog = Math.min(t, 1);
    ctx.beginPath();
    ctx.strokeStyle = c.coral;
    ctx.lineWidth = 2;
    ctx.moveTo(sx + 14, sy - 8);
    ctx.lineTo(sx + 14 + (ex - sx) * prog, sy + 8);
    ctx.stroke();
    if (t > 0.5) {
      ctx.save();
      ctx.globalAlpha = 1 - Math.min((t - 0.5) / 0.5, 1) * 0.75;
      ctx.font = "12px monospace";
      ctx.fillStyle = c.secondary;
      ctx.textAlign = "center";
      ctx.fillText("?", sx + 14 + (ex - sx) * prog + 12, sy + 5);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "5\\", c.coral);
  },
  slide_up(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const sx = LEFT_X + 60, ex = LEFT_X + 210;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("5", sx, sy + 5);
    const prog = Math.min(t, 1);
    ctx.beginPath();
    ctx.strokeStyle = c.blue;
    ctx.lineWidth = 2;
    ctx.moveTo(sx + 10, sy + 7);
    ctx.lineTo(sx + 10 + (ex - sx - 10) * prog, sy - 7);
    ctx.stroke();
    if (t > 0.8) {
      ctx.save();
      ctx.globalAlpha = Math.min((t - 0.8) / 0.2, 1);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("7", ex + 12, sy + 5);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "5/7", c.blue);
  },
  slide_down(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const sx = LEFT_X + 70, ex = LEFT_X + 220;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("7", sx, sy + 5);
    const prog = Math.min(t, 1);
    ctx.beginPath();
    ctx.strokeStyle = c.coral;
    ctx.lineWidth = 2;
    ctx.moveTo(sx + 12, sy - 7);
    ctx.lineTo(sx + 12 + (ex - sx) * prog, sy + 7);
    ctx.stroke();
    if (t > 0.8) {
      ctx.save();
      ctx.globalAlpha = Math.min((t - 0.8) / 0.2, 1);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("5", ex + 14, sy + 5);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "7\\5", c.coral);
  },
  vibrato(ctx, W, H, t) {
    const wave = Math.sin(t * Math.PI * 7) * Math.min(t * 2, 1);
    const c = drawBase(ctx, W, H, 2, wave * 0.6);
    const sy = START_Y + 2 * STRING_GAP;
    const cx = LEFT_X + 90;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("5", cx, sy + 5);
    // tilde
    ctx.beginPath();
    ctx.strokeStyle = c.amber;
    ctx.lineWidth = 2;
    const wobble = Math.sin(t * Math.PI * 9) * 4;
    for (let i = 0; i <= 44; i++) {
      const x = cx + 14 + i * 1.5;
      const y = sy + wobble * Math.sin(i * 0.45);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // up arrow
    if (t > 0.25) {
      const arrY = sy - 10 - Math.abs(Math.sin(t * Math.PI * 7)) * 7;
      ctx.beginPath();
      ctx.strokeStyle = c.amber;
      ctx.lineWidth = 1.5;
      ctx.moveTo(cx, sy - 7);
      ctx.lineTo(cx, arrY);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = c.amber;
      ctx.moveTo(cx - 4, arrY + 5);
      ctx.lineTo(cx + 4, arrY + 5);
      ctx.lineTo(cx, arrY - 1);
      ctx.closePath();
      ctx.fill();
    }
    drawCaption(ctx, W, H, "5~", c.amber);
  },
  full_bend(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const bx = LEFT_X + 90;
    const bh = 24 * Math.min(t * 1.6, 1);
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("5", bx, sy + 5);
    ctx.beginPath();
    ctx.strokeStyle = c.amber;
    ctx.lineWidth = 2.2;
    ctx.moveTo(bx + 7, sy - 4);
    ctx.quadraticCurveTo(bx + 24, sy - bh - 2, bx + 24, sy - bh - 10);
    ctx.stroke();
    if (t > 0.3) {
      ctx.save();
      ctx.fillStyle = c.amber;
      ctx.beginPath();
      ctx.moveTo(bx + 19, sy - bh - 8);
      ctx.lineTo(bx + 29, sy - bh - 8);
      ctx.lineTo(bx + 24, sy - bh - 15);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    if (t > 0.65) {
      ctx.save();
      ctx.globalAlpha = Math.min((t - 0.65) / 0.35, 1);
      ctx.font = "11px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("(7)", bx + 24, sy - bh - 18);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "5b7  (Full Bend)", c.amber);
  },
  half_bend(ctx, W, H, t) {
    const c = drawBase(ctx, W, H, 2);
    const sy = START_Y + 2 * STRING_GAP;
    const bx = LEFT_X + 90;
    const bh = 13 * Math.min(t * 1.6, 1);
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = c.blue;
    ctx.textAlign = "center";
    ctx.fillText("5", bx, sy + 5);
    ctx.beginPath();
    ctx.strokeStyle = c.amber;
    ctx.lineWidth = 2.2;
    ctx.moveTo(bx + 7, sy - 4);
    ctx.quadraticCurveTo(bx + 22, sy - bh - 2, bx + 22, sy - bh - 8);
    ctx.stroke();
    if (t > 0.3) {
      ctx.save();
      ctx.fillStyle = c.amber;
      ctx.beginPath();
      ctx.moveTo(bx + 17, sy - bh - 6);
      ctx.lineTo(bx + 27, sy - bh - 6);
      ctx.lineTo(bx + 22, sy - bh - 13);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    if (t > 0.65) {
      ctx.save();
      ctx.globalAlpha = Math.min((t - 0.65) / 0.35, 1);
      ctx.font = "11px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("(6)", bx + 22, sy - bh - 16);
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.amber;
      ctx.fillText("½", bx + 38, sy - bh - 4);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "5b6  (½ Bend)", c.amber);
  },
  let_ring(ctx, W, H, t) {
    const c = drawBase(ctx, W, H);
    const frets = ["0", "1", "0", "2", "2", "0"];
    const noteX = LEFT_X + 65;
    const lineLen = 165 * Math.min(t * 1.3, 1);
    for (let i = 0; i < STRING_COUNT; i++) {
      const y = START_Y + i * STRING_GAP;
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = c.blue;
      ctx.textAlign = "center";
      ctx.fillText(frets[i], noteX, y + 5);
      // dashed ring line
      ctx.save();
      ctx.globalAlpha = 0.55 + i * 0.06;
      ctx.beginPath();
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.moveTo(noteX + 10, y);
      ctx.lineTo(noteX + 10 + lineLen, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    drawCaption(ctx, W, H, "let ring ──────", c.green);
  },
  palm_mute(ctx, W, H, t) {
    const purple = "#534AB7";
    const purpleLight = "rgba(83,74,183,0.10)";
    drawBase(ctx, W, H);

    const frets = ["5", "5", "5", "7", "7", "5"];
    const noteX = LEFT_X + 60;
    const pmStart = noteX - 4;
    const pmEnd = W - 48;
    const lineLen = (pmEnd - pmStart) * Math.min(t * 1.2, 1);

    // animated shaded region
    ctx.save();
    ctx.fillStyle = purpleLight;
    ctx.fillRect(pmStart, START_Y - 14, lineLen, STRING_GAP * 5 + 24);
    ctx.restore();

    // fret numbers
    for (let i = 0; i < STRING_COUNT; i++) {
      const y = START_Y + i * STRING_GAP;
      ctx.save();
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = purple;
      ctx.textAlign = "center";
      ctx.fillText(frets[i], noteX, y + 5);
      ctx.restore();
    }

    // P.M. label + dashed bracket line above
    if (t > 0.15) {
      const labelAlpha = Math.min((t - 0.15) / 0.25, 1);
      ctx.save();
      ctx.globalAlpha = labelAlpha;
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = purple;
      ctx.textAlign = "left";
      ctx.fillText("P.M.", pmStart, START_Y - 18);
      ctx.beginPath();
      ctx.strokeStyle = purple;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.moveTo(pmStart + 30, START_Y - 22);
      ctx.lineTo(pmStart + lineLen, START_Y - 22);
      ctx.stroke();
      ctx.setLineDash([]);
      // right tick
      if (t > 0.5) {
        ctx.beginPath();
        ctx.strokeStyle = purple;
        ctx.lineWidth = 1.5;
        ctx.moveTo(pmStart + lineLen, START_Y - 22);
        ctx.lineTo(pmStart + lineLen, START_Y - 12);
        ctx.stroke();
      }
      ctx.restore();
    }

    // dampened wave on strings
    if (t > 0.3) {
      const wavePhase = (t - 0.3) / 0.7;
      for (let i = 0; i < STRING_COUNT; i++) {
        const y = START_Y + i * STRING_GAP;
        const amp = 1.8 * Math.sin(wavePhase * Math.PI) * (1 - wavePhase * 0.55);
        ctx.beginPath();
        ctx.strokeStyle = purple;
        ctx.lineWidth = 0.9;
        ctx.globalAlpha = 0.4;
        ctx.moveTo(noteX + 8, y);
        for (let x = noteX + 8; x <= pmStart + lineLen - 4; x += 2) {
          ctx.lineTo(x, y + amp * Math.sin((x - noteX) * 0.22 + t * 18));
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    drawCaption(ctx, W, H, "P.M.────  ←  팜 뮤트: 브리지에 손바닥을 살짝 올려 음 억제", purple);
  },

  mute_stroke(ctx, W, H, t) {
    const red = "#B53A3A";
    drawBase(ctx, W, H);

    // All 6 strings get X marks
    const positions = [LEFT_X + 65, LEFT_X + 105, LEFT_X + 145, LEFT_X + 185, LEFT_X + 225, LEFT_X + 265];
    const visibleCount = Math.floor(positions.length * Math.min(t * 2.5, 1));

    // Strum line (downstroke arrow)
    if (t > 0.2) {
      const strokeAlpha = Math.min((t - 0.2) / 0.3, 1);
      const strokeProg = Math.min((t - 0.2) / 0.5, 1);
      const strikeX = LEFT_X + 55 + (W - LEFT_X - 80) * 0.3;
      const strikeTop = START_Y - 10;
      const strikeBot = START_Y + STRING_GAP * 5 + 10;
      const strikeY = strikeTop + (strikeBot - strikeTop) * strokeProg;

      ctx.save();
      ctx.globalAlpha = strokeAlpha * 0.18;
      ctx.fillStyle = red;
      ctx.fillRect(strikeX - 14, strikeTop, 28, strikeY - strikeTop);
      ctx.restore();

      // arrow head at bottom
      if (strokeProg > 0.8) {
        ctx.save();
        ctx.globalAlpha = strokeAlpha;
        ctx.fillStyle = red;
        ctx.beginPath();
        ctx.moveTo(strikeX - 7, strikeBot - 12);
        ctx.lineTo(strikeX + 7, strikeBot - 12);
        ctx.lineTo(strikeX, strikeBot);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // X marks per string
    for (let i = 0; i < STRING_COUNT; i++) {
      const y = START_Y + i * STRING_GAP;
      const alpha = i < visibleCount ? 1 : 0;
      if (alpha === 0) continue;
      const xPos = positions[0]; // same column, stacked vertically

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = red;
      ctx.textAlign = "center";
      ctx.fillText("X", xPos, y + 5);
      ctx.restore();
    }

    // ripple effect after strum
    if (t > 0.6) {
      const rp = (t - 0.6) / 0.4;
      for (let i = 0; i < STRING_COUNT; i++) {
        const y = START_Y + i * STRING_GAP;
        const amp = 1.5 * Math.sin(rp * Math.PI) * (1 - rp);
        ctx.beginPath();
        ctx.strokeStyle = red;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.3 * (1 - rp);
        ctx.moveTo(positions[0] + 10, y);
        for (let x = positions[0] + 10; x <= W - 40; x += 2) {
          ctx.lineTo(x, y + amp * Math.sin((x - positions[0]) * 0.18 + t * 20));
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    drawCaption(ctx, W, H, "X  ←  뮤트 스트로크(컷팅): 음정 없이 퍼커시브한 소리", red);
  },

  mute_picking(ctx, W, H, t) {
    const red = "#B53A3A";
    drawBase(ctx, W, H, 2); // highlight G string

    const sy = START_Y + 2 * STRING_GAP;
    // sequence of x picks: positions
    const picks = [
      { x: LEFT_X + 70,  str: 2 },
      { x: LEFT_X + 110, str: 2 },
      { x: LEFT_X + 150, str: 3 },
      { x: LEFT_X + 190, str: 2 },
    ];
    const visibleCount = Math.floor(picks.length * Math.min(t * 3, 1));

    picks.slice(0, visibleCount).forEach((p, idx) => {
      const y = START_Y + p.str * STRING_GAP;
      const alpha = idx === visibleCount - 1 ? Math.min(t * 4 - idx * 0.8, 1) : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = red;
      ctx.textAlign = "center";
      ctx.fillText("x", p.x, y + 5);

      // pick impact flash on last visible
      if (idx === visibleCount - 1 && alpha > 0.5) {
        ctx.globalAlpha = (1 - alpha) * 0.4;
        ctx.fillStyle = red;
        ctx.beginPath();
        ctx.arc(p.x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // dampened string ripple
    if (t > 0.25) {
      const rp = Math.sin((t - 0.25) * Math.PI * 3) * Math.max(0, 1 - t);
      ctx.beginPath();
      ctx.strokeStyle = red;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = 0.3;
      ctx.moveTo(LEFT_X, sy);
      for (let x = LEFT_X; x <= W - 20; x += 2) {
        ctx.lineTo(x, sy + rp * 2.2 * Math.sin((x - LEFT_X) * 0.14 + t * 15));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    drawCaption(ctx, W, H, "x  ←  뮤트 피킹: 단음으로 뮤트 피킹", red);
  },

  hammer_pull(ctx, W, H, t) {
    const teal = "#1A7A62";
    const c = getThemeColors();
    drawBase(ctx, W, H, 2);

    const sy = START_Y + 2 * STRING_GAP;
    const x1 = LEFT_X + 70;   // fret 5 (start)
    const x2 = LEFT_X + 130;  // fret 7 (hammer)
    const x3 = LEFT_X + 190;  // fret 5 (pull)

    // Phase: 0-0.33 = show 5, 0.33-0.66 = hammer to 7, 0.66-1 = pull to 5
    const phase = t * 3; // 0..3

    // ── Note 1: fret 5 ──
    ctx.save();
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = teal;
    ctx.textAlign = "center";
    ctx.fillText("5", x1, sy + 5);
    ctx.restore();

    // "h" label between 5 and 7
    if (phase > 0.5) {
      const a = Math.min((phase - 0.5) / 0.5, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "12px monospace";
      ctx.fillStyle = c.secondary;
      ctx.textAlign = "center";
      ctx.fillText("h", (x1 + x2) / 2, sy - 10);
      ctx.restore();
    }

    // ── Hammer arc 5→7 ──
    if (phase > 0.8) {
      const arcProg = Math.min((phase - 0.8) / 0.8, 1);
      ctx.save();
      ctx.strokeStyle = teal;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc((x1 + x2) / 2, sy + 2, (x2 - x1) / 2, Math.PI, Math.PI + Math.PI * arcProg, false);
      ctx.stroke();

      // hammer "impact" dot
      if (arcProg > 0.85) {
        const impAlpha = Math.min((arcProg - 0.85) / 0.15, 1);
        ctx.globalAlpha = impAlpha;
        ctx.fillStyle = teal;
        ctx.beginPath();
        ctx.arc(x2, sy - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ── Note 2: fret 7 (hammer destination) ──
    if (phase > 1.3) {
      const a = Math.min((phase - 1.3) / 0.4, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = teal;
      ctx.textAlign = "center";
      ctx.fillText("7", x2, sy + 5);
      ctx.restore();
    }

    // "p" label between 7 and 5
    if (phase > 1.7) {
      const a = Math.min((phase - 1.7) / 0.4, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "12px monospace";
      ctx.fillStyle = c.secondary;
      ctx.textAlign = "center";
      ctx.fillText("p", (x2 + x3) / 2, sy - 10);
      ctx.restore();
    }

    // ── Pull arc 7→5 ──
    if (phase > 1.9) {
      const arcProg = Math.min((phase - 1.9) / 0.8, 1);
      ctx.save();
      ctx.strokeStyle = c.amber;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc((x2 + x3) / 2, sy + 2, (x3 - x2) / 2, Math.PI, Math.PI + Math.PI * arcProg, false);
      ctx.stroke();

      // pull "flick" arrow
      if (arcProg > 0.85) {
        const flAlpha = Math.min((arcProg - 0.85) / 0.15, 1);
        ctx.globalAlpha = flAlpha;
        ctx.fillStyle = c.amber;
        ctx.beginPath();
        ctx.arc(x3, sy - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ── Note 3: fret 5 again ──
    if (phase > 2.5) {
      const a = Math.min((phase - 2.5) / 0.4, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = teal;
      ctx.textAlign = "center";
      ctx.fillText("5", x3, sy + 5);
      ctx.restore();
    }

    // string vibration
    if (phase > 1.2 && phase < 2.8) {
      const vp = ((phase - 1.2) % 0.8) / 0.8;
      const amp = 2 * Math.sin(vp * Math.PI);
      ctx.save();
      ctx.strokeStyle = teal;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.moveTo(LEFT_X, sy);
      for (let x = LEFT_X; x <= W - 20; x += 2) {
        ctx.lineTo(x, sy + amp * Math.sin((x - LEFT_X) * 0.12 + t * 16));
      }
      ctx.stroke();
      ctx.restore();
    }

    drawCaption(ctx, W, H, "5h7p5  ←  해머링(h) & 풀오프(p): 픽킹 없이 레가토 연주", teal);
  },
};

// ─── TabCanvas Component ─────────────────────────────────────────────────────

function TabCanvas({ techId, progress }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = 172;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.canvasW = W;
    ctx.canvasH = H;
    if (techId && drawers[techId]) {
      drawers[techId](ctx, W, H, progress);
    } else {
      drawBase(ctx, W, H);
    }
  }, [techId, progress]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="tab-canvas"
    />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "guitar_checklist";
const LOG_KEY = "guitar_tab_log";

const todayStr = () => {
  const d = new Date();
  return `${d.getMonth() + 1}.${d.getDate()}`;
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// ─── PracticeTracker Component ────────────────────────────────────────────────

function PracticeTracker() {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.tab) return data.tab;
      } catch {
        // ignore parse error
      }
    }
    return {};
  });
  const [log, setLog] = useState(() => {
    const savedLog = localStorage.getItem(LOG_KEY);
    if (savedLog) {
      try {
        return JSON.parse(savedLog);
      } catch {
        // ignore parse error
      }
    }
    return [];
  });
  const [submittedToday, setSubmittedToday] = useState(() => {
    const savedLog = localStorage.getItem(LOG_KEY);
    if (savedLog) {
      try {
        const parsed = JSON.parse(savedLog);
        return parsed.length > 0 && parsed[0].dateKey === todayKey();
      } catch {
        // ignore parse error
      }
    }
    return false;
  });

  const toggleStep = (i) => {
    if (submittedToday) return;
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      const saved = localStorage.getItem(STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data.tab = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return next;
    });
  };

  const doneCount = TECHNIQUES.filter((_, i) => checked[i]).length;

  const clearTodayChecklist = () => {
    setChecked((prev) => {
      const next = { ...prev };
      TECHNIQUES.forEach((_, i) => delete next[i]);
      const saved = localStorage.getItem(STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data.tab = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return next;
    });
  };

  const handleSubmit = () => {
    if (doneCount === 0) return;

    const entry = {
      date: todayStr(),
      dateKey: todayKey(),
      text: `기타 Tab 주법 연습 ${doneCount} / ${TECHNIQUES.length}개 완료`,
    };

    setLog((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
      return next;
    });

    clearTodayChecklist();
    setSubmittedToday(true);
  };

  const handleEdit = () => {
    setLog((prev) => {
      const next = prev.filter((entry) => entry.dateKey !== todayKey());
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
      return next;
    });
    setSubmittedToday(false);
  };

  const deleteLogEntry = (index) => {
    setLog((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
      if (prev[index]?.dateKey === todayKey()) {
        setSubmittedToday(false);
      }
      return next;
    });
  };

  return (
    <>
      <div className="section-label">오늘의 연습 체크리스트</div>

      <div className="progress-section">
        <span className="progress-text">{doneCount} / {TECHNIQUES.length} 완료</span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(doneCount / TECHNIQUES.length) * 100}%` }}
          />
        </div>
      </div>

      {submittedToday ? (
        <div className="submitted-banner">
          <span className="submitted-banner-text">
            <i className="ti ti-check" aria-hidden="true" /> 오늘 학습을 제출했습니다.
          </span>
          <button className="edit-btn" onClick={handleEdit}>
            수정하기
          </button>
        </div>
      ) : (
        <>
          <div className="steps-list">
            {TECHNIQUES.map((tech, i) => {
              const isDone = !!checked[i];
              return (
                <div
                  key={tech.id}
                  className={`step-card ${isDone ? "done" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => toggleStep(i)}
                >
                  <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="step-body">
                    <div className="step-title">
                      {tech.name}
                      <span className="step-tag" style={{ color: tech.color, borderColor: `${tech.color}44` }}>
                        {tech.symbol}
                      </span>
                    </div>
                    <p className="step-desc">{tech.short}</p>
                  </div>
                  <div className="step-check">
                    <i className="ti ti-check" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="submit-section">
            <button className="submit-btn" onClick={handleSubmit} disabled={doneCount === 0}>
              오늘 연습 제출하기
            </button>
          </div>
        </>
      )}

      <div className="section-label">연습 기록</div>

      <div className="log-section">
        {log.length === 0 ? (
          <div className="log-empty">아직 제출한 연습 기록이 없습니다.</div>
        ) : (
          log.map((entry, i) => (
            <div key={i} className="log-item">
              <span className="log-date">{entry.date}</span>
              <span className="log-desc">{entry.text}</span>
              <button
                className="log-delete"
                onClick={() => deleteLogEntry(i)}
                aria-label="연습 기록 삭제"
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function GuitarTabApp() {
  const [selected, setSelected] = useState(TECHNIQUES[2]);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState("learn"); // "learn" | "practice"
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const audioCtxRef = useRef(null);
  const DURATION = 2000;

  // ── 사운드: Copy.jsx와 동일한 디스토션 기타 톤 체인 ──
  const getAudioChain = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(35);
    distortion.oversample = "4x";

    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = "lowpass";
    toneFilter.frequency.value = 2800;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;

    distortion.connect(toneFilter);
    toneFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    return { ctx, distortion, toneFilter, masterGain };
  };

  // 한 음을 피킹
  const pluckNote = (chain, midi, start, dur, vol = 0.5) => {
    const { ctx, distortion } = chain;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(midiToFreq(midi), start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(distortion);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  };

  // 글리산도 / 슬라이드 / 벤딩: 음정을 부드럽게 이동
  const glideNote = (chain, fromMidi, toMidi, start, glideDur, holdDur, vol = 0.5) => {
    const { ctx, distortion } = chain;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(midiToFreq(fromMidi), start);
    osc.frequency.linearRampToValueAtTime(midiToFreq(toMidi), start + glideDur);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + glideDur + holdDur);
    osc.connect(gain);
    gain.connect(distortion);
    osc.start(start);
    osc.stop(start + glideDur + holdDur + 0.05);
  };

  // 비브라토: 피치를 LFO로 흔든다
  const vibratoNote = (chain, midi, start, dur, vol = 0.5) => {
    const { ctx, distortion } = chain;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(midiToFreq(midi), start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 5.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(distortion);
    osc.start(start);
    lfo.start(start + dur * 0.2);
    osc.stop(start + dur);
    lfo.stop(start + dur);
  };

  // 팜 뮤트 / 뮤트 피킹: 짧고 어두운 톤 (디스토션을 약하게, 로우패스를 낮게)
  const mutedNote = (chain, midi, start, dur = 0.16, vol = 0.45) => {
    const { ctx, masterGain } = chain;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const dist = ctx.createWaveShaper();
    dist.curve = makeDistortionCurve(20);
    filter.type = "lowpass";
    filter.frequency.value = 750;
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(midiToFreq(midi), start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(dist);
    dist.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  };

  // 뮤트 스트로크(X): 음정 없는 퍼커시브 노이즈
  const noiseClick = (chain, start, dur = 0.1, vol = 0.35, freq = 1200) => {
    const { ctx, masterGain } = chain;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start(start);
  };

  // 선택된 주법의 애니메이션 진행에 맞춰 사운드 재생 (G현 기준)
  const playTechniqueSound = (tech) => {
    const chain = getAudioChain();
    const now = chain.ctx.currentTime;
    const D = DURATION / 1000;
    const G = G_STRING_OPEN_MIDI;

    switch (tech.id) {
      case "gliss_up": // /5 — 아래쪽 어딘가에서 5프렛으로 글리산도
        glideNote(chain, G - 7, G + 5, now, D * 0.9, D * 0.1, 0.45);
        break;
      case "gliss_down": // 5\ — 5프렛에서 아래로 흘러내림
        glideNote(chain, G + 5, G - 8, now, D * 0.95, 0.05, 0.45);
        break;
      case "slide_up": // 5/7
        glideNote(chain, G + 5, G + 7, now, D * 0.8, D * 0.2, 0.5);
        break;
      case "slide_down": // 7\5
        glideNote(chain, G + 7, G + 5, now, D * 0.8, D * 0.2, 0.5);
        break;
      case "vibrato": // 5~
        vibratoNote(chain, G + 5, now, D, 0.5);
        break;
      case "full_bend": // 5b7 — 5프렛을 7프렛 음정까지 밴딩
        glideNote(chain, G + 5, G + 7, now, D * 0.625, D * 0.375, 0.5);
        break;
      case "half_bend": // 5b6 — 5프렛을 6프렛 음정까지 하프 밴딩
        glideNote(chain, G + 5, G + 6, now, D * 0.625, D * 0.375, 0.5);
        break;
      case "let_ring": { // 0,1,0,2,2,0 코드를 길게 울림
        const notes = [64, 60, 55, 52, 47, 40]; // e,B,G,D,A,E
        notes.forEach((midi, i) => pluckNote(chain, midi, now + i * 0.025, D * 1.3, 0.4));
        break;
      }
      case "palm_mute": { // 5,5,5,7,7,5 폼을 일정 박으로 뮤트 커팅
        const notes = [69, 64, 60, 57, 52, 45]; // e,B,G,D,A,E
        [0, 0.5, 1.0, 1.5].forEach((tOff) => {
          notes.forEach((midi) => mutedNote(chain, midi, now + tOff, 0.18, 0.32));
        });
        break;
      }
      case "mute_stroke": // X — 한 번의 뮤트 스트로크
        noiseClick(chain, now + D * 0.45, 0.12, 0.4, 900);
        break;
      case "mute_picking": // x — 짧은 뮤트 피킹 4회
        [0.083, 0.167, 0.25, 0.333].forEach((tFrac) => {
          mutedNote(chain, G + 5, now + tFrac * D, 0.07, 0.3);
        });
        break;
      case "hammer_pull": // 5h7p5
        pluckNote(chain, G + 5, now, D * 0.267, 0.5);
        pluckNote(chain, G + 7, now + D * 0.267, D * 0.366, 0.35);
        pluckNote(chain, G + 5, now + D * 0.633, D * 0.367 + 0.3, 0.32);
        break;
      default:
        break;
    }
  };

  const stopAnim = useCallback(() => {
    setPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startAnim = useCallback(() => {
    setPlaying(true);
    startRef.current = null;
    playTechniqueSound(selected);
    const loop = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setTimeout(() => {
          startRef.current = null;
          playTechniqueSound(selected);
          rafRef.current = requestAnimationFrame(loop);
        }, 500);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const togglePlay = () => {
    if (playing) { stopAnim(); setProgress(0); } else { startAnim(); }
  };

  const handleSelect = (tech) => {
    stopAnim();
    setProgress(0);
    setSelected(tech);
    setTab("learn");
  };

  useEffect(() => () => stopAnim(), [stopAnim]);

  return (
    <div>
      <PageHeader
        title={<>기타 <em>Tab</em> 악보 읽는 법</>}
        subtitle="탭은 6줄로 구성됩니다. 위가 1번 줄(가장 가는 줄 · e), 아래가 6번 줄(가장 굵은 줄 · E)이며 숫자는 프렛 번호입니다."
      />

      <div className="string-badges">
        {["1번줄 e", "2번줄 B", "3번줄 G", "4번줄 D", "5번줄 A", "6번줄 E"].map((label) => (
          <span key={label} className="string-badge">{label}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className="section-toggle">
        <button
          className={`toggle-btn ${tab === "learn" ? "active" : ""}`}
          onClick={() => setTab("learn")}
        >
          📖 주법 배우기
        </button>
        <button
          className={`toggle-btn ${tab === "practice" ? "active" : ""}`}
          onClick={() => setTab("practice")}
        >
          ✅ 연습 체크리스트
        </button>
      </div>

      {/* Tab: Learn */}
      {tab === "learn" && (
        <>
          <div className="section-label">주법 선택</div>

          <div className="tech-grid">
            {TECHNIQUES.map((tech) => {
              const isActive = selected?.id === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelect(tech)}
                  className={`tech-btn ${isActive ? "active" : ""}`}
                  style={isActive ? { boxShadow: `inset 0 0 0 1px ${tech.color}55`, background: `${tech.color}10` } : {}}
                >
                  <span className="tech-symbol" style={{ color: isActive ? tech.color : "#85b7eb" }}>
                    {tech.symbol}
                  </span>
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-short">{tech.short}</span>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="tech-panel">
              <div className="tech-panel-head">
                <span className="tech-panel-symbol" style={{ color: selected.color }}>{selected.symbol}</span>
                <div className="tech-panel-info">
                  <div className="tech-panel-title">{selected.name}</div>
                  <div className="tech-panel-short">{selected.short}</div>
                </div>
                <button
                  onClick={() => setTab("practice")}
                  className="go-check-btn"
                  title="체크리스트에서 확인"
                >
                  ✅ 체크하러 가기
                </button>
              </div>

              <div className="canvas-wrap">
                <TabCanvas techId={selected.id} progress={progress} />
              </div>

              <div className="playback-row">
                <button
                  onClick={togglePlay}
                  className={`play-btn ${playing ? "playing" : ""}`}
                  style={playing ? { borderColor: selected.color, color: selected.color, background: `${selected.color}10` } : {}}
                >
                  {playing ? "⏸ 일시정지" : "▶ 애니메이션 재생"}
                </button>
                <div className="progress-track">
                  <div className="progress-fill playback-fill" style={{ width: `${progress * 100}%`, background: selected.color }} />
                </div>
              </div>

              <p className="tech-explanation">{selected.explanation}</p>

              <div className="tip-box" style={{ borderColor: selected.color, background: `${selected.color}11` }}>
                <span className="tip-label" style={{ color: selected.color }}>연주 팁</span>
                <span className="tip-text">{selected.tip}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab: Practice */}
      {tab === "practice" && (
        <PracticeTracker />
      )}
    </div>
  );
}
