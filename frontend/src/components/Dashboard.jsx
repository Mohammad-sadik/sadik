import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSessionsManager from './AdminSessionsManager'

import { API_URL } from '../config/api'

const Dashboard = () => {
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
  const [attachment, setAttachment] = useState(null)
  const [existingAttachment, setExistingAttachment] = useState(null)

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

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, getAuthHeaders())
    } catch (err) {
      console.error('Unable to revoke the current session:', err)
    } finally {
      localStorage.removeItem('adminToken')
      navigate('/login')
    }
  }

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
    if (attachment) {
      formData.append('file', attachment)
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
      setAttachment(null)
      setExistingAttachment(null)
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
    setExistingAttachment(content.pdf_file ? { url: content.pdf_file, name: content.media_name, type: content.media_type } : null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelContentEdit = () => {
    setEditingContentId(null)
    setContentTitle('')
    setContentBody('')
    setContentSections([])
    setAttachment(null)
    setExistingAttachment(null)
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
      <main id="main-content" className="l-main">
        <section className="section dashboard-page">
          <div className="dashboard-shell">
          <header className="dashboard-hero">
            <div>
              <p className="dashboard-eyebrow"><i className="bx bx-shield-quarter" aria-hidden="true" /> PRIVATE WORKSPACE</p>
              <h1>Admin dashboard</h1>
              <p className="dashboard-hero__description">Create learning notes, organize your Knowledge Hub, and manage signed-in devices.</p>
            </div>
            <button className="button button-outline dashboard-logout" onClick={handleLogout}>
              <i className="bx bx-log-out" aria-hidden="true" /> Sign out
            </button>
          </header>

          <div className="dashboard-overview">
            <div className="dashboard-overview__metric">
              <span className="dashboard-overview__icon"><i className="bx bx-book-open" aria-hidden="true" /></span>
              <div><strong>{subjects.length}</strong><span>{subjects.length === 1 ? 'subject' : 'subjects'} in your hub</span></div>
            </div>
            <div className="dashboard-overview__hint">
              <strong>What would you like to do?</strong>
              <span>Choose an action to jump to the right section.</span>
            </div>
          </div>

          <nav className="dashboard-shortcuts" aria-label="Dashboard sections">
            <a href="#create-subject"><i className="bx bx-plus-circle" aria-hidden="true" /> Create a subject</a>
            <a href="#post-content"><i className="bx bx-edit" aria-hidden="true" /> Write a learning note</a>
            <a href="#manage-data"><i className="bx bx-folder-open" aria-hidden="true" /> Manage content</a>
            <a href="#sessions"><i className="bx bx-devices" aria-hidden="true" /> Signed-in devices</a>
          </nav>
          
          {status.message && (
            <div className={`status-msg ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="dashboard__container">
            {/* --- CREATE SUBJECT FORM --- */}
            <section id="create-subject" className="dashboard__card" aria-labelledby="create-subject-title">
              <div className="dashboard-card__heading"><span className="dashboard-card__step">01</span><h2 id="create-subject-title">Create a subject</h2><p>Start a new topic in your learning library.</p></div>
              <form onSubmit={handleSubjectSubmit} className="dashboard__form">
                <label htmlFor="subject-title">Subject title</label>
                <input 
                  id="subject-title"
                  type="text" 
                  placeholder="e.g. System Design" 
                  className="contact__input" 
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  required
                />
                <label htmlFor="subject-description">Short description <span>(optional)</span></label>
                <textarea 
                  id="subject-description"
                  placeholder="What will you learn in this subject?" 
                  className="contact__input" 
                  cols="0" rows="3"
                  value={subjectDesc}
                  onChange={(e) => setSubjectDesc(e.target.value)}
                ></textarea>
                <button type="submit" className="button">Create Subject</button>
              </form>
            </section>

            {/* --- CREATE CONTENT FORM --- */}
            <section id="post-content" className="dashboard__card dashboard-content-card" aria-labelledby="post-content-title">
              <div className="dashboard-card__heading"><span className="dashboard-card__step">02</span><h2 id="post-content-title">{editingContentId ? 'Edit learning note' : 'Write a learning note'}</h2><p>Add a clear title, your notes, optional sections, and an image or file.</p></div>
              <form onSubmit={handleContentSubmit} className="dashboard__form">
                <label htmlFor="content-subject">Subject</label>
                <select 
                  id="content-subject"
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

                <label htmlFor="content-title">Note title</label>
                <input 
                  id="content-title"
                  type="text" 
                  placeholder="e.g. How HTTP requests work" 
                  className="contact__input" 
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  required
                />

                <label htmlFor="content-body">Your notes <span>Markdown supported</span></label>
                <textarea 
                  id="content-body"
                  placeholder="Write what you learned today…" 
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
                  <label htmlFor="content-pdf">Add an attachment <span>(optional)</span></label>
                  <p>Images, PDF, Word, PowerPoint, Excel, CSV, text, or Markdown · up to 10 MB</p>
                  {existingAttachment && !attachment && <div className="dashboard-current-attachment">
                    <i className={existingAttachment.type?.startsWith('image/') ? 'bx bx-image' : 'bx bx-paperclip'} aria-hidden="true" />
                    <a href={existingAttachment.url} target="_blank" rel="noreferrer">{existingAttachment.name || 'View current attachment'}</a>
                    <span>Current file · upload another to replace it</span>
                  </div>}
                  <input 
                    id="content-pdf"
                    type="file" 
                    accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md"
                    className="contact__input"
                    style={{padding: '0.5rem'}}
                    onChange={(e) => setAttachment(e.target.files[0] || null)}
                  />
                  {attachment && <p className="dashboard-file-selected"><i className="bx bx-check-circle" aria-hidden="true" /> Selected: {attachment.name}</p>}
                </div>

                <div className="dashboard-form-actions">
                  <button type="submit" className="button">{editingContentId ? 'Save Changes' : 'Post Content'}</button>
                  {editingContentId && <button type="button" className="button button-outline" onClick={cancelContentEdit}>Cancel</button>}
                </div>
              </form>
            </section>

            {/* --- MANAGE / DELETE DATA --- */}
            <section id="manage-data" className="dashboard__card" aria-labelledby="manage-data-title">
              <div className="dashboard-card__heading"><span className="dashboard-card__step">03</span><h2 id="manage-data-title">Manage your content</h2><p>Review, edit, or remove subjects and notes.</p></div>
              <div className="dashboard__form">
                <label htmlFor="manage-subject">Choose a subject</label>
                <select 
                  id="manage-subject"
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

                    <h3 className="dashboard-manage-heading">Notes in this subject</h3>
                    {contentsToManage.length === 0 ? <p className="dashboard-empty-state">No notes yet. Write the first one above.</p> : (
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
            </section>
          </div>

          <div id="sessions"><AdminSessionsManager /></div>
          </div>
        </section>
      </main>
  )
}

export default Dashboard
