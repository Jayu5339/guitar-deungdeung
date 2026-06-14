import { useState } from 'react'
import PageHeader from '../PageHeader'
import goodWaveform from '../assets/good.png'
import badWaveform from '../assets/bad.png'

const RENDITION_STEPS = [
  {
    title: '1. 단음 연습 녹음',
    tag: 'SINGLE',
    desc: '메트로놈에 맞춰 한 음씩 피킹하며 녹음한다. 재생 후 파형을 보고, 음표 길이만큼 소리가 끊김 없이 이어지는지 확인한다.',
  },
  {
    title: '2. 코드 연습 녹음',
    tag: 'CHORD',
    desc: '코드를 잡고 스트로크 또는 아르페지오로 녹음한다. 모든 현이 동시에 깨끗하게 울리는지, 잡음이나 먹먹하게 막힌 현이 없는지 파형으로 확인한다.',
  },
  {
    title: '3. 왼손 뮤트 체크',
    tag: 'L-MUTE',
    desc: '코드 전환 구간을 녹음 후 재생한다. 이전 코드의 잔향이나 옆 현이 스치는 잡음이 다음 코드 시작 전까지 깔끔히 끊기는지 확인한다.',
  },
  {
    title: '4. 오른손 뮤트 체크',
    tag: 'R-MUTE',
    desc: '피킹하지 않는 현이 오른손 손바닥/손가락으로 잘 눌려 있는지 확인한다. 파형에 의도하지 않은 현의 울림이 섞여 있다면 뮤트가 부족한 상태다.',
  },
  {
    title: '5. 코드 전환 연습',
    tag: 'SWITCH',
    desc: '코드 전환을 포함한 짧은 progression을 녹음한다. 전환 구간에서도 파형이 끊기지 않고 박자에 맞춰 자연스럽게 이어지는지 확인한다.',
  },
]

const STORAGE_KEY = 'guitar_checklist'
const LOG_KEY = 'guitar_rendition_log'

const todayStr = () => {
  const d = new Date()
  return `${d.getMonth() + 1}.${d.getDate()}`
}

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// 연속된 완료 단계 구간을 "1단계부터 4단계까지" 형태로 변환
const summarizeRanges = (checked) => {
  const doneIdx = RENDITION_STEPS.map((_, i) => i).filter((i) => checked[i])

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

const Rendition = () => {
  const [hasInterface, setHasInterface] = useState(null) // null | 'yes' | 'no'
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.clean_play) return data.clean_play
      } catch {
        // ignore parse error
      }
    }
    return {}
  })
  const [log, setLog] = useState(() => {
    const savedLog = localStorage.getItem(LOG_KEY)
    if (savedLog) {
      try {
        return JSON.parse(savedLog)
      } catch {
        // ignore parse error
      }
    }
    return []
  })
  const [submittedToday, setSubmittedToday] = useState(() => {
    const savedLog = localStorage.getItem(LOG_KEY)
    if (savedLog) {
      try {
        const parsed = JSON.parse(savedLog)
        return parsed.length > 0 && parsed[0].dateKey === todayKey()
      } catch {
        // ignore parse error
      }
    }
    return false
  })

  const toggleStep = (i) => {
    if (submittedToday) return
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] }
      const saved = localStorage.getItem(STORAGE_KEY)
      const data = saved ? JSON.parse(saved) : {}
      data.clean_play = next
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return next
    })
  }

  const doneCount = RENDITION_STEPS.filter((_, i) => checked[i]).length

  const clearTodayChecklist = () => {
    setChecked((prev) => {
      const next = { ...prev }
      RENDITION_STEPS.forEach((_, i) => delete next[i])
      const saved = localStorage.getItem(STORAGE_KEY)
      const data = saved ? JSON.parse(saved) : {}
      data.clean_play = next
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return next
    })
  }

  const handleSubmit = () => {
    const summary = summarizeRanges(checked)
    if (!summary) return

    const entry = {
      date: todayStr(),
      dateKey: todayKey(),
      text: `깔끔하게 연주하기 ${summary} 완료`,
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
        title={<>기타 <em>깔끔하게</em> 연주하는 법</>}
        subtitle="녹음을 하면서 연습하면 손으로 느끼지 못한 잡음과 끊김을 귀로 직접 확인할 수 있습니다."
      />

      <div className="section-label">사전 준비</div>

      <div className="branch-section">
        <p className="branch-question">오디오 인터페이스를 사용하고 있나요?</p>

        <div className="branch-options">
          <button
            className={`branch-option ${hasInterface === 'yes' ? 'selected' : ''}`}
            onClick={() => setHasInterface(hasInterface === 'yes' ? null : 'yes')}
          >
            <div className="branch-option-title">
              <i className="ti ti-plug" aria-hidden="true" /> 있음
            </div>
            <p className="branch-option-desc">
              오디오 인터페이스로 기타를 직접 라인 입력하여 녹음
            </p>
          </button>

          <button
            className={`branch-option ${hasInterface === 'no' ? 'selected' : ''}`}
            onClick={() => setHasInterface(hasInterface === 'no' ? null : 'no')}
          >
            <div className="branch-option-title">
              <i className="ti ti-microphone" aria-hidden="true" /> 없음
            </div>
            <p className="branch-option-desc">
              스마트폰/노트북 마이크로 앰프 또는 합주 소리를 녹음
            </p>
          </button>
        </div>

        {hasInterface === 'yes' && (
          <div className="branch-detail">
            기타를 오디오 인터페이스에 연결하고, DAW(GarageBand, Reaper, Audacity 등)에서
            새 트랙을 만들어 입력 소스를 인터페이스 채널로 지정합니다.
            <br />
            <strong>레벨 체크</strong>: 가장 세게 칠 때 클리핑(빨간불)이 뜨지 않는 선에서
            입력 게인을 맞춥니다. 너무 작으면 미세한 잡음을 파형에서 구분하기 어렵습니다.
          </div>
        )}

        {hasInterface === 'no' && (
          <div className="branch-detail">
            스마트폰 기본 녹음 앱(보이스 메모 등)으로도 충분합니다. 앰프나 기타 본체와
            <strong> 30~50cm 거리</strong>를 두고 녹음하면 노이즈가 줄어듭니다.
            <br />
            정확한 톤 분석보다는 <strong>파형의 끊김·잡음 유무</strong>를 보는 용도이므로,
            마이크 녹음으로도 이 체크리스트를 진행하는 데 무리가 없습니다.
          </div>
        )}
      </div>

      <div className="section-label">파형으로 확인하기</div>

      <div className="waveform-box">
        <div className="waveform-label">
          <span>좋은 예시 — 음 사이가 끊기지 않고 자연스럽게 줄어드는 파형</span>
          <span className="waveform-good"><span>GOOD</span></span>
        </div>
        <img src={goodWaveform} alt="끊김 없이 자연스럽게 이어지는 좋은 파형 예시" className="waveform-img" />

        <div className="waveform-label" style={{ marginTop: '1.2rem' }}>
          <span>나쁜 예시 — 음 사이에 빈 구간(무음)이나 갑작스러운 끊김이 있는 파형</span>
          <span className="waveform-bad"><span>CHECK</span></span>
        </div>
        <img src={badWaveform} alt="음 사이에 끊김이 있는 나쁜 파형 예시" className="waveform-img" />
      </div>

      <div className="section-label">녹음 체크리스트</div>

      <div className="progress-section">
        <span className="progress-text">{doneCount} / {RENDITION_STEPS.length} 완료</span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(doneCount / RENDITION_STEPS.length) * 100}%` }}
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
            {RENDITION_STEPS.map((step, i) => {
              const isDone = !!checked[i]
              return (
                <div
                  key={i}
                  className={`step-card ${isDone ? 'done' : ''}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => toggleStep(i)}
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

export default Rendition
