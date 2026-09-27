import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import BlockedIpManager from './BlockedIpManager'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })

  // Subject Form State
  const [subjectTitle, setSubjectTitle] = useState('')
  const [subjectDesc, setSubjectDesc] = useState('')

  // Content Form State
  const [selectedSubject, setSelectedSubject] = useState('')
  const [contentTitle, setContentTitle] = useState('')
  const [contentBody, setContentBody] = useState('')
  const [contentSections, setContentSections] = useState([])
  const [editingContentId, setEditingContentId] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/subjects`)
      setSubjects(res.data)
      if (res.data.length > 0) setSelectedSubject(res.data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      fetchSubjects()
    }
  }, [navigate, token])

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  })

  // --- DELETE LOGIC ---
  const [manageSubjectId, setManageSubjectId] = useState('')
  const [contentsToManage, setContentsToManage] = useState([])

  useEffect(() => {
    if (manageSubjectId) {
      axios.get(`${API_URL}/subjects/${manageSubjectId}`)
        .then(res => setContentsToManage(res.data.contents))
        .catch(err => console.error(err))
    } else {
      setContentsToManage([])
    }
  }, [manageSubjectId])

  // Block rendering completely if no token
  if (!token) return null;

  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/subjects`, {
        title: subjectTitle,
        description: subjectDesc
      }, getAuthHeaders())
      setStatus({ type: 'success', message: 'Subject created successfully!' })
      setSubjectTitle('')
      setSubjectDesc('')
      fetchSubjects() // refresh dropdown
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: 'Failed to create subject.' })
    }
  }

  const handleContentSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSubject) {
      setStatus({ type: 'error', message: 'Please select a subject first.' })
      return
    }

    const formData = new FormData()
    formData.append('title', contentTitle)
    formData.append('body', contentBody)
    formData.append('sections', JSON.stringify(contentSections.filter(section => section.title.trim() && section.body.trim())))
    if (pdfFile) {
      formData.append('pdf', pdfFile)
    }

    try {
      await axios({
        method: editingContentId ? 'put' : 'post',
        url: editingContentId ? `${API_URL}/contents/${editingContentId}` : `${API_URL}/subjects/${selectedSubject}/contents`,
        data: formData,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      setStatus({ type: 'success', message: editingContentId ? 'Content updated successfully!' : 'Content posted successfully!' })
      setContentTitle('')
      setContentBody('')
      setContentSections([])
      setPdfFile(null)
      setEditingContentId(null)
      e.target.reset() // reset file input
      if (manageSubjectId) {
        const response = await axios.get(`${API_URL}/subjects/${manageSubjectId}`)
        setContentsToManage(response.data.contents)
      }
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: 'Failed to post content.' })
    }
  }

  const startEditingContent = (content) => {
    setSelectedSubject(manageSubjectId)
    setEditingContentId(content.id)
    setContentTitle(content.title)
    setContentBody(content.body)
    setContentSections(content.sections || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelContentEdit = () => {
    setEditingContentId(null)
    setContentTitle('')
    setContentBody('')
    setContentSections([])
    setPdfFile(null)
  }

  const handleDeleteSubject = async () => {
    if (!window.confirm("Are you sure? This will delete the subject and ALL its content!")) return
    try {
      await axios.delete(`${API_URL}/subjects/${manageSubjectId}`, getAuthHeaders())
      setStatus({ type: 'success', message: 'Subject deleted successfully.' })
      setManageSubjectId('')
      setSelectedSubject('')
      fetchSubjects()
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete subject.' })
    }
  }

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm("Delete this content?")) return
    try {
      await axios.delete(`${API_URL}/contents/${contentId}`, getAuthHeaders())
      setStatus({ type: 'success', message: 'Content deleted.' })
      setContentsToManage(prev => prev.filter(c => c.id !== contentId))
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete content.' })
    }
  }

  return (
    <>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection="" onNavLinkClick={() => setMenuOpen(false)} />
      <main id="main-content" className="l-main" style={{ paddingTop: '80px' }}>
        <section className="section bd-grid">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h2>
            <button 
              className="button" 
              style={{ padding: '0.5rem 1rem' }}
              onClick={() => {
                localStorage.removeItem('adminToken')
                navigate('/login')
              }}
            >
              Logout
            </button>
          </div>
          
          <br/>
          
          {status.message && (
            <div className={`status-msg ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="dashboard__container">
            {/* --- CREATE SUBJECT FORM --- */}
            <div className="dashboard__card">
              <h3>1. Create a New Subject</h3>
              <p>e.g., "System Design", "HTML", "Data Structures"</p>
              <form onSubmit={handleSubjectSubmit} className="dashboard__form">
                <input 
                  type="text" 
                  placeholder="Subject Title" 
                  className="contact__input" 
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  required
                />
                <textarea 
                  placeholder="Short Description" 
                  className="contact__input" 
                  cols="0" rows="3"
                  value={subjectDesc}
                  onChange={(e) => setSubjectDesc(e.target.value)}
                ></textarea>
                <button type="submit" className="button">Create Subject</button>
              </form>
            </div>

            {/* --- CREATE CONTENT FORM --- */}
            <div className="dashboard__card">
              <h3>2. {editingContentId ? 'Edit Learning Content' : 'Post Learning Content'}</h3>
              <p>Add a main note, ordered sub-sections, and an optional PDF.</p>
              <form onSubmit={handleContentSubmit} className="dashboard__form">
                <select 
                  className="contact__input" 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a Subject</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.title}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Content Title (e.g. Chapter 1)" 
                  className="contact__input" 
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  required
                />

                <textarea 
                  placeholder="Write your content in Markdown here..." 
                  className="contact__input" 
                  cols="0" rows="6"
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  required
                ></textarea>

                <div className="dashboard-subsections">
                  <div className="dashboard-subsections__heading">
                    <div>
                      <h4>Sub-sections</h4>
                      <p>Optional headings and notes shown beneath this article.</p>
                    </div>
                    <button type="button" className="button button-outline" onClick={() => setContentSections(current => [...current, { title: '', body: '' }])}>Add section</button>
                  </div>
                  {contentSections.map((section, index) => (
                    <div className="dashboard-subsection" key={`section-${index}`}>
                      <div className="dashboard-subsection__heading">
                        <strong>Section {index + 1}</strong>
                        <button type="button" className="dashboard-link-button" onClick={() => setContentSections(current => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                      </div>
                      <input
                        type="text"
                        className="contact__input"
                        aria-label={`Section ${index + 1} title`}
                        placeholder="Section title"
                        value={section.title}
                        onChange={event => setContentSections(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))}
                      />
                      <textarea
                        className="contact__input"
                        aria-label={`Section ${index + 1} content`}
                        placeholder="Write this section in Markdown..."
                        rows="4"
                        value={section.body}
                        onChange={event => setContentSections(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item))}
                      />
                    </div>
                  ))}
                </div>

                <div className="file-upload">
                  <label>Attach PDF (Optional):</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="contact__input"
                    style={{padding: '0.5rem'}}
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                </div>

                <div className="dashboard-form-actions">
                  <button type="submit" className="button">{editingContentId ? 'Save Changes' : 'Post Content'}</button>
                  {editingContentId && <button type="button" className="button button-outline" onClick={cancelContentEdit}>Cancel</button>}
                </div>
              </form>
            </div>

            {/* --- MANAGE / DELETE DATA --- */}
            <div className="dashboard__card">
              <h3>3. Manage Data</h3>
              <p>Delete subjects or specific content.</p>
              <div className="dashboard__form">
                <select 
                  className="contact__input" 
                  value={manageSubjectId} 
                  onChange={(e) => setManageSubjectId(e.target.value)}
                >
                  <option value="">Select a Subject to Manage</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.title}</option>
                  ))}
                </select>

                {manageSubjectId && (
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      onClick={handleDeleteSubject} 
                      className="button" 
                      style={{ backgroundColor: '#dc3545', width: '100%', marginBottom: '1.5rem' }}
                    >
                      Delete Entire Subject
                    </button>

                    <h4 style={{ color: 'var(--first-color)', marginBottom: '1rem' }}>Content inside this Subject:</h4>
                    {contentsToManage.length === 0 ? <p>No content found.</p> : (
                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {contentsToManage.map(c => (
                          <li key={c.id} className="dashboard-content-row">
                            <span>{c.title}</span>
                            <div className="dashboard-content-actions">
                              <button type="button" className="dashboard-link-button" onClick={() => startEditingContent(c)}>Edit</button>
                              <button type="button" className="dashboard-link-button is-danger" onClick={() => handleDeleteContent(c.id)}>Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <BlockedIpManager />
        </section>
      </main>
    </>
  )
}

export default Dashboard
