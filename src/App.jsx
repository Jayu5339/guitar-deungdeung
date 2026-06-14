import { Routes, Route, useNavigate } from 'react-router-dom'
import Tab from './components/Tab'
import Copy from './components/Copy'
import Rendition from './components/Rendition'
import './App.css'

const Home = () => {
  const navigate = useNavigate()

  const cards = [
    {
      num: '01',
      icon: 'ti-music',
      title: '노래 안에서\n기타 카피하는 법',
      desc: 'Triad · 7th Chord 기본 폼 악보로 코드 모양을 익히고 직접 카피해보기',
      path: '/copy',
    },
    {
      num: '02',
      icon: 'ti-hand-finger',
      title: '깔끔하게\n연주하는 법',
      desc: '왼손 운지법, 오른손 피킹, 뮤트 · 코드 전환 핵심 주법 단계별 설명',
      path: '/rendition',
    },
    {
      num: '03',
      icon: 'ti-file-music',
      title: 'Tab 악보\n읽는 법',
      desc: '6줄 · 프렛 의미부터 슬라이드, 벤딩, 해머링 기호까지 차근차근',
      path: '/tab',
    },
  ]

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          Guitar 등등
          <span>일렉 기타 입문 가이드</span>
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate('/copy')}>코드 카피</li>
          <li onClick={() => navigate('/rendition')}>깔끔한 연주</li>
          <li onClick={() => navigate('/tab')}>Tab 읽기</li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <svg className="hero-fret-bg" viewBox="0 0 340 500" fill="none">
          <line x1="0" y1="70"  x2="340" y2="70"  stroke="white" strokeWidth="9"/>
          <line x1="0" y1="160" x2="340" y2="160" stroke="white" strokeWidth="6"/>
          <line x1="0" y1="240" x2="340" y2="240" stroke="white" strokeWidth="4"/>
          <line x1="0" y1="310" x2="340" y2="310" stroke="white" strokeWidth="3"/>
          <line x1="0" y1="370" x2="340" y2="370" stroke="white" strokeWidth="2"/>
          <line x1="0" y1="420" x2="340" y2="420" stroke="white" strokeWidth="1.5"/>
          <line x1="60"  y1="0" x2="60"  y2="500" stroke="white" strokeWidth="3"/>
          <line x1="170" y1="0" x2="170" y2="500" stroke="white" strokeWidth="3"/>
          <line x1="280" y1="0" x2="280" y2="500" stroke="white" strokeWidth="3"/>
        </svg>

        <div className="hero-tag">Electric Guitar for Beginners</div>

        <h1 className="hero-title">
          기타,<br />
          <em>제대로</em><br />
          배우기.
        </h1>

        <p className="hero-sub">
          Tab 악보 읽기부터 코드 카피까지 —<br />
          흩어진 정보 없이, 한 곳에서 단계별로.
        </p>

        <div className="hero-cta">
          <button className="btn-primary" onClick={() => navigate('/copy')}>
            학습 시작하기 →
          </button>
          <button className="btn-secondary" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
            메뉴 보기
          </button>
        </div>
      </section>

      {/* STRINGS */}
      <div className="strings-bar">
        <span className="strings-label">E A D G B e</span>
        <div className="strings-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="string-line" />
          ))}
        </div>
        <span className="strings-label">♩= 120</span>
      </div>

      {/* CARDS */}
      <div className="section-label">학습 메뉴</div>

      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.num} className="card" onClick={() => navigate(card.path)}>
            <div className="card-accent" />
            <div className="card-num">{card.num}</div>
            <i className={`ti ${card.icon} card-icon`} aria-hidden="true" />
            <div className="card-title">
              {card.title.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </div>
            <p className="card-desc">{card.desc}</p>
            <i className="ti ti-arrow-up-right card-arrow" aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* CHECKLIST BANNER */}
      <div className="checklist-banner">
        <div className="checklist-info">
          <span className="checklist-title">오늘의 연습 체크리스트</span>
          <span className="checklist-sub">완료한 항목을 체크하며 진도를 확인하세요</span>
        </div>
        <div className="checklist-right">
          <div className="checklist-dots">
            {[true, true, false, false, false].map((done, i) => (
              <div key={i} className={`dot${done ? ' done' : ''}`} />
            ))}
          </div>
          <button className="checklist-link" onClick={() => navigate('/rendition')}>
            체크하기 →
          </button>
        </div>
      </div>
    </div>
  )
}

const TabPage = () => <div><Tab /></div>
const CopyPage = () => <div><Copy /></div>
const RenditionPage = () => <div><Rendition /></div>

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tab" element={<TabPage />} />
      <Route path="/copy" element={<CopyPage />} />
      <Route path="/rendition" element={<RenditionPage />} />
    </Routes>
  )
}

export default App
