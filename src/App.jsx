import React, { useState } from 'react';
import './App.css';

const mockIncidents = [
  { id: 1, title: "Biased Recommendation Algorithm", description: "Algorithm consistently favored certain demographics...", severity: "Medium", reported_at: "2025-03-15T10:00:00Z" },
  { id: 2, title: "LLM Hallucination in Critical Info", description: "LLM provided incorrect safety procedure information...", severity: "High", reported_at: "2025-04-01T14:30:00Z" },
  { id: 3, title: "Minor Data Leak via Chatbot", description: "Chatbot inadvertently exposed non-sensitive user metadata...", severity: "Low", reported_at: "2025-03-20T09:15:00Z" },
  { id: 4, title: "Unauthorized Facial Recognition Deployment", description: "Facial recognition system deployed without proper consent checks, leading to privacy violations.", severity: "High", reported_at: "2025-04-10T11:45:00Z" },
  { id: 5, title: "Incorrect Language Translation", description: "Machine translation app provided dangerous mistranslation in medical instructions.", severity: "Medium", reported_at: "2025-04-05T16:20:00Z" }
];

function App() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'Low' });

  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);

  const filteredIncidents = incidents.filter(incident =>
    filter === 'All' ? true : incident.severity === filter
  );

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    return sortOrder === 'Newest'
      ? new Date(b.reported_at) - new Date(a.reported_at)
      : new Date(a.reported_at) - new Date(b.reported_at);
  });

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    const newIncident = {
      id: incidents.length + 1,
      ...formData,
      reported_at: new Date().toISOString()
    };
    setIncidents([newIncident, ...incidents]);
    setFormData({ title: '', description: '', severity: 'Low' });
  };

  return (
    <div className="container">
      <h1>AI Safety Incident Dashboard</h1>

      <div className="controls">
        <select onChange={handleFilterChange} value={filter}>
          <option value="All">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select onChange={handleSortChange} value={sortOrder}>
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>

      <div className="incident-list">
        {sortedIncidents.map(incident => (
          <div key={incident.id} className={`incident-card severity-${incident.severity.toLowerCase()}`}>
            <div className="incident-header">
              <h3>{incident.title}</h3>
              <span className="badge">{incident.severity}</span>
            </div>
            <p className="date">Reported: {new Date(incident.reported_at).toLocaleDateString()}</p>
            <button onClick={() => toggleDetails(incident.id)}>
              {expandedId === incident.id ? 'Hide Details' : 'View Details'}
            </button>
            {expandedId === incident.id && <p className="description">{incident.description}</p>}
          </div>
        ))}
      </div>
      
      <div className="form-section">
        <h2>Report New Incident</h2>
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange}></textarea>
          <select name="severity" value={formData.severity} onChange={handleInputChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
