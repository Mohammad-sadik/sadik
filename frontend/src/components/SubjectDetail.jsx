import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

import { API_URL, SERVER_URL } from '../config/api'

const SubjectDetail = () => {
  const { id } = useParams()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/subjects/${id}/`)
      .then(res => {
        setSubject(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching subject:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <section className="section bd-grid"><p>Loading content...</p></section>
  if (!subject) return <section className="section bd-grid"><p>Subject not found.</p></section>

  return (
    <section className="subject-detail section bd-grid">
      <Link to="/learning" className="back-link"><i className='bx bx-left-arrow-alt'></i> Back to Subjects</Link>
      <h2 className="section-title" style={{marginTop: '1rem'}}>{subject.title}</h2>
      <p style={{textAlign: 'center', marginBottom: '2rem'}}>{subject.description}</p>
      
      <div className="content__container">
        {subject.contents && subject.contents.length > 0 ? (
          subject.contents.map(content => (
            <div className="content__card" key={content.id}>
              <h3>{content.title}</h3>
              <div className="markdown-body">
                <ReactMarkdown>{content.body}</ReactMarkdown>
              </div>
              {content.pdf_file && (
                <a href={/^https?:\/\//i.test(content.pdf_file) ? content.pdf_file : `${SERVER_URL}${content.pdf_file}`} target="_blank" rel="noreferrer" className="button" style={{marginTop: '1rem'}}>
                  <i className={content.media_type?.startsWith('image/') ? 'bx bx-image' : 'bx bx-paperclip'}></i> {content.media_name || 'Open attachment'}
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No content uploaded for this subject yet.</p>
        )}
      </div>
    </section>
  )
}

export default SubjectDetail
