import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, ArrowRight, BookOpen, FileText, Search } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
const ARTICLES_PER_PAGE = 6

const MyLearning = () => {
  const [subjects, setSubjects] = useState([])
  const [activeSubject, setActiveSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingSubject, setLoadingSubject] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const loadSubjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/subjects`, { timeout: 10000 })
        if (!active) return
        setSubjects(response.data)
        if (response.data.length) {
          const detail = await axios.get(`${API_URL}/subjects/${response.data[0].id}`, { timeout: 10000 })
          if (active) setActiveSubject(detail.data)
        }
      } catch {
        if (active) setError('The Knowledge Hub is temporarily unavailable. Please try again later.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSubjects()
    return () => { active = false }
  }, [])

  const selectSubject = async (subject) => {
    if (subject.id === activeSubject?.id) return
    setLoadingSubject(true)
    setError('')
    setSearchTerm('')
    setCurrentPage(1)
    try {
      const response = await axios.get(`${API_URL}/subjects/${subject.id}`, { timeout: 10000 })
      setActiveSubject(response.data)
    } catch {
      setError('Could not load this topic. Please try again.')
    } finally {
      setLoadingSubject(false)
    }
  }

  const filteredContents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    const contents = activeSubject?.contents || []
    if (!query) return contents
    return contents.filter(content => [content.title, content.body, ...(content.sections || []).flatMap(section => [section.title, section.body])]
      .some(value => value?.toLowerCase().includes(query)))
  }, [activeSubject, searchTerm])

  const pageCount = Math.ceil(filteredContents.length / ARTICLES_PER_PAGE)
  const visibleContents = filteredContents.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  return (
    <main className="knowledge-page">
      <div className="knowledge-shell">
        <Link to="/" className="knowledge-back-link"><ArrowLeft size={17} /> Back to portfolio</Link>

        <header className="knowledge-hero">
          <div className="knowledge-hero__icon"><BookOpen size={24} /></div>
          <p className="knowledge-eyebrow">My learning library</p>
          <h1>Knowledge Hub</h1>
          <p className="knowledge-hero__description">Practical notes, clear explanations, and useful references from the things I build and learn.</p>
        </header>

        <section className="knowledge-content" aria-label="Learning topics and notes">
          <div className="knowledge-toolbar">
            <div className="knowledge-topic-list" role="group" aria-label="Choose a topic">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  type="button"
                  className={`knowledge-topic ${activeSubject?.id === subject.id ? 'is-active' : ''}`}
                  aria-pressed={activeSubject?.id === subject.id}
                  onClick={() => selectSubject(subject)}
                >
                  {subject.title}
                </button>
              ))}
              {!loading && subjects.length === 0 && <p className="knowledge-muted">Topics will appear here as they are added.</p>}
            </div>
            <label className="knowledge-search">
              <Search size={18} aria-hidden="true" />
              <input type="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search notes" aria-label="Search notes" />
            </label>
          </div>

          {activeSubject && (
            <div className="knowledge-topic-heading">
              <div>
                <p className="knowledge-eyebrow">Selected topic</p>
                <h2>{activeSubject.title}</h2>
                {activeSubject.description && <p>{activeSubject.description}</p>}
              </div>
              <span className="knowledge-count">{filteredContents.length} {filteredContents.length === 1 ? 'note' : 'notes'}</span>
            </div>
          )}

          {error && <div className="knowledge-message is-error" role="alert">{error}</div>}
          {(loading || loadingSubject) && <div className="knowledge-message" role="status">Loading notes…</div>}

          {!loading && !loadingSubject && activeSubject && visibleContents.length > 0 && (
            <div className="knowledge-article-grid">
              {visibleContents.map(content => (
                <article className="knowledge-article" key={content.id}>
                  <div className="knowledge-article__topline"><FileText size={18} /><span>Note</span></div>
                  <h3>{content.title}</h3>
                  <div className="knowledge-markdown"><ReactMarkdown>{content.body}</ReactMarkdown></div>
                  {content.sections?.length > 0 && (
                    <div className="knowledge-subsections">
                      <p className="knowledge-subsections__label">In this note</p>
                      {content.sections.map((section, index) => (
                        <details className="knowledge-subsection" key={`${content.id}-${index}`}>
                          <summary>{section.title}</summary>
                          <div className="knowledge-markdown"><ReactMarkdown>{section.body}</ReactMarkdown></div>
                        </details>
                      ))}
                    </div>
                  )}
                  {content.pdf_file && <a className="knowledge-pdf-link" href={`${SERVER_URL}${content.pdf_file}`} target="_blank" rel="noreferrer">Open attached PDF <ArrowRight size={16} /></a>}
                </article>
              ))}
            </div>
          )}

          {!loading && !loadingSubject && activeSubject && visibleContents.length === 0 && (
            <div className="knowledge-empty-state">
              <BookOpen size={25} />
              <h3>{searchTerm ? 'No notes match your search' : 'No notes here yet'}</h3>
              <p>{searchTerm ? 'Try a different title or keyword.' : 'New notes for this topic will appear here.'}</p>
            </div>
          )}

          {pageCount > 1 && (
            <nav className="knowledge-pagination" aria-label="Notes pagination">
              <button type="button" className="button button-outline" disabled={currentPage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}><ArrowLeft size={16} /> Previous</button>
              <span>Page {currentPage} of {pageCount}</span>
              <button type="button" className="button button-outline" disabled={currentPage === pageCount} onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}>Next <ArrowRight size={16} /></button>
            </nav>
          )}
        </section>
      </div>
    </main>
  )
}

export default MyLearning
