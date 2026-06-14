import { useNavigate } from 'react-router-dom'

const PageHeader = ({ title, subtitle }) => {
  const navigate = useNavigate()

  return (
    <>
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

      <header className="page-header">
        <button className="back-link" onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left" aria-hidden="true" /> 메인으로
        </button>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </header>
    </>
  )
}

export default PageHeader
