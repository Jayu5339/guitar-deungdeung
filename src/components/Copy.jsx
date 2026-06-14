import { useState, useEffect, useRef } from 'react'
import PageHeader from '../PageHeader'

// ── 코드 폼 데이터 (D 기준) ──
// frets: [e, B, G, D, A, E] 순서의 프렛 번호 문자열, '' = 연주 안함(뮤트)
// degrees: 각 현에 대응하는 음정 역할. 동일 음정이 여러 현에 있으면 모두 표시한다.
const OPEN_STRING_MIDI = [64, 59, 55, 50, 45, 40] // [e, B, G, D, A, E]

const DEGREE_LABEL = {
  root: 'Root',
  '3rd': '3rd',
  '5th': '5th',
  '7th': '7th',
}

const CHORD_FAMILIES = {
  triad: {
    label: 'Triad',
    chords: [
      {
        name: 'D Major',
        alt: '*D · 5프렛 폼',
        desc: '근음 - 장3도 - 완전5도. 5프렛 중심의 메이저 코드 폼.',
        frets: ['5', '7', '7', '7', '5', ''],
        degrees: ['5th', '3rd', 'root', '5th', 'root', null],
      },
      {
        name: 'D Major',
        alt: '*D · 10프렛 폼',
        desc: '근음 - 장3도 - 완전5도. 10프렛 중심의 동일한 메이저 코드.',
        frets: ['10', '10', '11', '12', '12', '10'],
        degrees: ['root', '5th', '3rd', 'root', '5th', 'root'],
      },
      {
        name: 'D minor',
        alt: '*Dm · 5프렛 폼',
        desc: '메이저 코드에서 3도음이 반음 내려간다 (F# → F).',
        frets: ['5', '6', '7', '7', '5', ''],
        degrees: ['5th', '3rd', 'root', '5th', 'root', null],
      },
      {
        name: 'D minor',
        alt: '*Dm · 10프렛 폼',
        desc: '메이저 코드에서 3도음이 반음 내려간다 (F# → F).',
        frets: ['10', '10', '10', '12', '12', '10'],
        degrees: ['root', '5th', '3rd', 'root', '5th', 'root'],
      },
      {
        name: 'D Diminished',
        alt: '*Ddim, D° · 오픈 폼',
        desc: '마이너 코드에서 5도음까지 반음 내려간다 (단3도 + 감5도).',
        frets: ['1', '3', '1', '0', '', ''],
        degrees: ['3rd', 'root', '5th', 'root', null, null],
      },
      {
        name: 'D Diminished',
        alt: '*Ddim, D° · 고음역 폼',
        desc: '동일한 D Diminished를 더 높은 프렛에서 짚는 폼.',
        frets: ['', '9', '10', '12', '', ''],
        degrees: [null, '5th', '3rd', 'root', null, null],
      },
      {
        name: 'D Augmented',
        alt: '*Daug, D+',
        desc: '메이저 코드에서 5도음이 반음 올라간다 (장3도 + 증5도).',
        frets: ['2', '3', '3', '0', '', ''],
        degrees: ['3rd', 'root', '5th', 'root', null, null],
      },
    ],
  },
  seventh: {
    label: '7th',
    chords: [
      {
        name: 'Major 7th',
        alt: '*DM7, D△7 · 5프렛 폼',
        desc: '근음 - 장3도 - 완전5도 - 장7도(C#)로 구성된다.',
        frets: ['5', '7', '6', '7', '5', ''],
        degrees: ['5th', '3rd', '7th', '5th', 'root', null],
      },
      {
        name: 'Major 7th',
        alt: '*DM7, D△7 · 10프렛 폼',
        desc: '근음 - 장3도 - 완전5도 - 장7도(C#)로 구성된다.',
        frets: ['', '10', '11', '11', '', '10'],
        degrees: [null, '5th', '3rd', '7th', null, 'root'],
      },
      {
        name: 'Dominant 7th',
        alt: '*D7 · 5프렛 폼',
        desc: 'DM7에서 7도음이 반음 내려간다 (장7도 → 단7도).',
        frets: ['5', '7', '5', '7', '5', ''],
        degrees: ['5th', '3rd', '7th', '5th', 'root', null],
      },
      {
        name: 'Dominant 7th',
        alt: '*D7 · 10프렛 폼',
        desc: 'DM7에서 7도음이 반음 내려간다 (장7도 → 단7도).',
        frets: ['', '10', '11', '10', '', '10'],
        degrees: [null, '5th', '3rd', '7th', null, 'root'],
      },
      {
        name: 'minor 7th',
        alt: '*Dm7, D-7 · 5프렛 폼',
        desc: 'D7 폼에서 3도음이 반음 내려간다 (장3도 → 단3도).',
        frets: ['5', '6', '5', '7', '5', ''],
        degrees: ['5th', '3rd', '7th', '5th', 'root', null],
      },
      {
        name: 'minor 7th',
        alt: '*Dm7, D-7 · 10프렛 폼',
        desc: 'D7 폼에서 3도음이 반음 내려간다 (장3도 → 단3도).',
        frets: ['', '10', '10', '10', '', '10'],
        degrees: [null, '5th', '3rd', '7th', null, 'root'],
      },
    ],
  },
  more: {
    label: '7th More Shapes',
    chords: [
      {
        name: 'Half-Diminished 7th',
        alt: '*Dø7, Dm7♭5',
        desc: '근음 - 단3도 - 감5도 - 단7도로 구성된 하이코드 폼.',
        frets: ['', '6', '5', '6', '5', ''],
        degrees: [null, '3rd', '7th', '5th', 'root', null],
      },
      {
        name: 'Diminished 7th',
        alt: '*Ddim7, D°7',
        desc: 'Half-dim7에서 7도음이 한 번 더 내려간다 (단7도 → 감7도).',
        frets: ['', '6', '4', '6', '5', ''],
        degrees: [null, '3rd', '7th', '5th', 'root', null],
      },
      {
        name: 'D minor Major 7th',
        alt: 'DmM7 · 오픈 폼',
        desc: '근음 - 단3도 - 완전5도 - 장7도로 구성된 오픈 폼.',
        frets: ['1', '2', '2', '0', '', ''],
        degrees: ['3rd', '7th', '5th', 'root', null, null],
      },
      {
        name: 'Dominant 7th',
        alt: '*D7 · 바레 폼',
        desc: '6번줄 5프렛(5도)을 베이스로 쓰고, 5~2번줄로 짚는 대중적인 D7 바레 코드.',
        frets: ['', '7', '5', '7', '5', '5'],
        degrees: [null, '3rd', '7th', '5th', 'root', '5th'],
      },
    ],
  },
}

const COPY_STEPS = [
  {
    title: '1. 베이스 근음 듣기',
    tag: 'ROOT',
    desc: '곡 전체에서 베이스 라인을 따라가며 코드가 바뀌는 지점의 가장 낮은 음(근음)을 찾는다. 베이스 음이 곧 코드 네임의 알파벳(D, A, G...)이 된다.',
  },
  {
    title: '2. 3도음으로 메이저/마이너 구분',
    tag: '3RD',
    desc: '근음 기준으로 장3도(밝음)인지 단3도(어두움)인지 듣고 구분한다. 장3도면 메이저 계열, 단3도면 마이너 계열로 좁혀진다.',
  },
  {
    title: '3. 5도음으로 형태 확정',
    tag: '5TH',
    desc: '완전5도면 일반 메이저/마이너, 감5도가 들리면 Diminished, 증5도가 들리면 Augmented 계열로 판별한다.',
  },
  {
    title: '4. 7th음 확인',
    tag: '7TH',
    desc: '코드에 텐션감 있는 음이 더 들리는지 확인한다. 단7도(b7)면 Dominant7/m7, 장7도면 Major7/mMaj7 계열이다.',
  },
  {
    title: '5. 코드 폼 매칭',
    tag: 'FORM',
    desc: '위에서 판별한 코드 종류(예: Dm7)를 1단계의 코드 폼 라이브러리에서 찾아 지판 위에 그대로 옮겨 짚어본다.',
  },
]

const SINGLE_STEPS = [
  {
    title: '1. 첫 음 따기',
    tag: 'FIRST',
    desc: '멜로디나 리프가 시작되는 첫 음을 듣고, 기타에서 같은 음높이를 찾아 첫 음을 고정한다.',
  },
  {
    title: '2. 톤으로 대략적인 줄(포지션) 가늠',
    tag: 'POSITION',
    desc: '같은 음이라도 여러 줄/프렛에 존재한다. 곡에서 들리는 기타의 톤(음색, 배음)을 듣고 대략 몇 번째 줄 근처에서 연주되는지 가늠해 후보 위치를 좁힌다.',
  },
  {
    title: '3. 다음 음의 높낮이로 좁혀서 따기',
    tag: 'DIRECTION',
    desc: '다음 음이 첫 음보다 높은지 낮은지 듣고, 후보 위치 중에서 해당 방향으로 이동 가능한 자리를 찾아 음을 확정한다.',
  },
  {
    title: '4. 주법 확인',
    tag: 'TECHNIQUE',
    desc: '음과 음 사이에 슬라이드, 벤딩, 해머링/풀링, 비브라토 등 어떤 주법이 들어가 있는지 듣고 동일하게 적용한다.',
  },
]

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']
const STORAGE_KEY = 'guitar_checklist'
const LOG_KEY = 'guitar_copy_log'

const todayStr = () => {
  const d = new Date()
  return `${d.getMonth() + 1}.${d.getDate()}`
}

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// 연속된 완료 단계 구간을 "1단계부터 4단계까지" 형태로 변환
const summarizeRanges = (steps, checked, mode) => {
  const doneIdx = steps
    .map((_, i) => i)
    .filter((i) => checked[`${mode}-${i}`])

  if (doneIdx.length === 0) return null

  const ranges = []
  let start = doneIdx[0]
  let prev = doneIdx[0]

  for (let i = 1; i < doneIdx.length; i++) {
    if (doneIdx[i] === prev + 1) {
      prev = doneIdx[i]
    } else {
      ranges.push([start, prev])
      start = doneIdx[i]
      prev = doneIdx[i]
    }
  }
  ranges.push([start, prev])

  return ranges
    .map(([s, e]) => (s === e ? `${s + 1}단계` : `${s + 1}단계부터 ${e + 1}단계까지`))
    .join(', ')
}

const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12)

// 디스토션 커브 (크런치 톤용)
const makeDistortionCurve = (amount) => {
  const samples = 44100
  const curve = new Float32Array(samples)
  const deg = Math.PI / 180
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

const Copy = () => {
  const [mode, setMode] = useState('chord') // 'chord' | 'single'
  const [family, setFamily] = useState('triad')
  const [checked, setChecked] = useState({})
  const [log, setLog] = useState([])
  const [playingChord, setPlayingChord] = useState(null)
  const [submittedToday, setSubmittedToday] = useState(false)
  const audioCtxRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.chord) setChecked(data.chord)
      } catch {
        // ignore parse error
      }
    }

    const savedLog = localStorage.getItem(LOG_KEY)
    if (savedLog) {
      try {
        const parsed = JSON.parse(savedLog)
        setLog(parsed)
        if (parsed.length > 0 && parsed[0].dateKey === todayKey()) {
          setSubmittedToday(true)
        }
      } catch {
        // ignore parse error
      }
    }
  }, [])

  const toggleStep = (key) => {
    if (submittedToday) return
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      const saved = localStorage.getItem(STORAGE_KEY)
      const data = saved ? JSON.parse(saved) : {}
      data.chord = next
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return next
    })
  }

  const playChord = (chord, key) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const notes = chord.frets
      .map((val, i) => (val === '' ? null : OPEN_STRING_MIDI[i] + Number(val)))
      .filter((n) => n !== null)

    setPlayingChord(key)

    // 마스터 체인: 디스토션 → 톤 필터 → 출력
    const distortion = ctx.createWaveShaper()
    distortion.curve = makeDistortionCurve(35)
    distortion.oversample = '4x'

    const toneFilter = ctx.createBiquadFilter()
    toneFilter.type = 'lowpass'
    toneFilter.frequency.value = 2800

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.5

    distortion.connect(toneFilter)
    toneFilter.connect(masterGain)
    masterGain.connect(ctx.destination)

    notes.forEach((midi, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = midiToFreq(midi)

      const start = now + idx * 0.03
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.5, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.3)

      osc.connect(gain)
      gain.connect(distortion)
      osc.start(start)
      osc.stop(start + 1.3)
    })

    setTimeout(() => setPlayingChord(null), 1400)
  }

  const steps = mode === 'chord' ? COPY_STEPS : SINGLE_STEPS
  const doneCount = steps.filter((_, i) => checked[`${mode}-${i}`]).length

  const clearTodayChecklist = () => {
    setChecked((prev) => {
      const next = { ...prev }
      steps.forEach((_, i) => delete next[`${mode}-${i}`])
      const saved = localStorage.getItem(STORAGE_KEY)
      const data = saved ? JSON.parse(saved) : {}
      data.chord = next
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return next
    })
  }

  const handleSubmit = () => {
    const summary = summarizeRanges(steps, checked, mode)
    if (!summary) return

    const modeLabel = mode === 'chord' ? '코드 카피' : '단음 카피'
    const entry = {
      date: todayStr(),
      dateKey: todayKey(),
      text: `기타 ${modeLabel}하기 ${summary} 완료`,
    }

    setLog((prev) => {
      const next = [entry, ...prev]
      localStorage.setItem(LOG_KEY, JSON.stringify(next))
      return next
    })

    clearTodayChecklist()
    setSubmittedToday(true)
  }

  const handleEdit = () => {
    setLog((prev) => {
      const next = prev.filter((entry) => entry.dateKey !== todayKey())
      localStorage.setItem(LOG_KEY, JSON.stringify(next))
      return next
    })
    setSubmittedToday(false)
  }

  const deleteLogEntry = (index) => {
    setLog((prev) => {
      const next = prev.filter((_, i) => i !== index)
      localStorage.setItem(LOG_KEY, JSON.stringify(next))
      if (prev[index]?.dateKey === todayKey()) {
        setSubmittedToday(false)
      }
      return next
    })
  }

  return (
    <div>
      <PageHeader
        title={<>노래 안에서 <em>기타 카피</em>하는 법</>}
        subtitle="코드 카피와 단음(멜로디/리프) 카피, 두 가지 방식으로 곡을 직접 따라가며 익혀보세요."
      />

      <div className="section-toggle">
        <button
          className={`toggle-btn ${mode === 'chord' ? 'active' : ''}`}
          onClick={() => setMode('chord')}
        >
          코드 카피
        </button>
        <button
          className={`toggle-btn ${mode === 'single' ? 'active' : ''}`}
          onClick={() => setMode('single')}
        >
          단음 카피
        </button>
      </div>

      {mode === 'chord' && (
        <>
          <div className="section-label">기본 코드 폼 라이브러리 (D 기준)</div>

          <div className="family-tabs">
            {Object.entries(CHORD_FAMILIES).map(([key, f]) => (
              <button
                key={key}
                className={`family-tab ${family === key ? 'active' : ''}`}
                onClick={() => setFamily(key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="degree-legend">
            <span className="degree-legend-item">
              <span className="degree-legend-dot" style={{ background: '#f0ece3' }} /> Root (근음)
            </span>
            <span className="degree-legend-item">
              <span className="degree-legend-dot" style={{ background: '#e8c96a' }} /> 3rd (3도)
            </span>
            <span className="degree-legend-item">
              <span className="degree-legend-dot" style={{ background: '#7aa6c2' }} /> 5th (5도)
            </span>
            <span className="degree-legend-item">
              <span className="degree-legend-dot" style={{ background: '#c98a6a' }} /> 7th (7도)
            </span>
          </div>

          <div className="chord-grid">
            {CHORD_FAMILIES[family].chords.map((chord, i) => {
              const key = `${family}-${i}`
              return (
                <div
                  key={key}
                  className="chord-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="chord-card-head-row">
                    <div className="chord-card-head" style={{ marginBottom: 0 }}>
                      <span className="chord-card-title">{chord.name}</span>
                      <span className="chord-card-alt">{chord.alt}</span>
                    </div>
                    <button
                      className={`preview-btn ${playingChord === key ? 'playing' : ''}`}
                      onClick={() => playChord(chord, key)}
                      aria-label={`${chord.name} 코드 미리듣기`}
                    >
                      <i className="ti ti-player-play" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="tab-diagram">
                    {chord.frets.map((val, sIdx) => {
                      const isMuted = val === ''
                      const degree = chord.degrees[sIdx]
                      return (
                        <div key={sIdx} className="tab-row">
                          <span className="tab-string-name">{STRING_LABELS[sIdx]}</span>
                          <span
                            className={`tab-fret ${isMuted ? 'muted' : 'has-note'} ${
                              degree === 'root' ? 'root' : ''
                            }`}
                          >
                            {isMuted ? '×' : val}
                          </span>
                          {degree && (
                            <span className={`tab-degree deg-${degree}`}>
                              {DEGREE_LABEL[degree]}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <p className="chord-card-desc">{chord.desc}</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="section-label">
        {mode === 'chord' ? '코드 찾는 절차' : '멜로디 카피 절차'}
      </div>

      <div className="progress-section">
        <span className="progress-text">
          {doneCount} / {steps.length} 완료
        </span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
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
            {steps.map((step, i) => {
              const key = `${mode}-${i}`
              const isDone = !!checked[key]
              return (
                <div
                  key={key}
                  className={`step-card ${isDone ? 'done' : ''}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => toggleStep(key)}
                >
                  <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="step-body">
                    <div className="step-title">
                      {step.title}
                      <span className="step-tag">{step.tag}</span>
                    </div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                  <div className="step-check">
                    <i className="ti ti-check" aria-hidden="true" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="submit-section">
            <button className="submit-btn" onClick={handleSubmit} disabled={doneCount === 0}>
              오늘 학습 제출하기
            </button>
          </div>
        </>
      )}

      <div className="section-label">학습 기록</div>

      <div className="log-section">
        {log.length === 0 ? (
          <div className="log-empty">아직 제출한 학습 기록이 없습니다.</div>
        ) : (
          log.map((entry, i) => (
            <div key={i} className="log-item">
              <span className="log-date">{entry.date}</span>
              <span className="log-desc">{entry.text}</span>
              <button
                className="log-delete"
                onClick={() => deleteLogEntry(i)}
                aria-label="학습 기록 삭제"
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Copy
