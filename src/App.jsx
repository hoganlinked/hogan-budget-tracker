import { useState, useEffect } from 'react'
import './App.css'

const CATEGORIES = [
  { id: 'insurance', name: 'Insurance Review', icon: '🛡️', description: 'Review and optimize insurance policies' },
  { id: 'meals', name: 'Meal Planning', icon: '🍽️', description: 'Plan meals to reduce food waste and dining out' },
  { id: 'energy', name: 'Energy Audit', icon: '⚡', description: 'Reduce utility costs through efficiency' },
  { id: 'debt', name: 'Debt Consolidation', icon: '💳', description: 'Consolidate and reduce interest payments' },
  { id: 'tax', name: 'Tax Optimization', icon: '📊', description: 'Maximize deductions and credits' },
  { id: 'transport', name: 'Transportation', icon: '🚗', description: 'Optimize fuel, maintenance, and commute costs' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Find free/low-cost entertainment alternatives' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Optimize healthcare spending and insurance' },
  { id: 'shopping', name: 'Shopping Habits', icon: '🛒', description: 'Reduce impulse purchases and find deals' },
  { id: 'home', name: 'Home Maintenance', icon: '🏠', description: 'Preventive maintenance to avoid costly repairs' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', description: 'Audit and cancel unused subscriptions' },
]

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Complete']

// Pre-populated with Hogan family financial data as of 2025-12-25
const INITIAL_DATA = {
  insurance: {
    savings: '',
    notes: 'Review auto insurance (2 vehicles: $20,855 + $17,697 loans). Shop for better rates.',
    status: 'Not Started'
  },
  meals: {
    savings: '500',
    notes: 'Current: $700/mo dining out vs $200 budget = $500 overspend.\nAction: Meal prep Sundays, pack lunches, limit dining to 2x/week.',
    status: 'In Progress'
  },
  energy: {
    savings: '',
    notes: 'Audit utility bills. Check for phantom loads, LED conversion, thermostat optimization.',
    status: 'Not Started'
  },
  debt: {
    savings: '',
    notes: 'CRITICAL: Credit One AMEX OVER LIMIT ($2,738/$2,700).\nCapital One: $4,956/$5,000 (99%)\nComplex CC: $2,423/$3,000 (81%)\nTotal CC debt: $10,117\nTotal debt incl vehicles: $48,669\n\nPriority: Pay $39+ to Credit One immediately.',
    status: 'In Progress'
  },
  tax: {
    savings: '',
    notes: 'WDT business unit income: $9,534/mo net. Review deductions for 2025 filing.',
    status: 'Not Started'
  },
  transport: {
    savings: '',
    notes: 'Two vehicle loans: $20,855 + $17,697 = $38,552 total.\nOptimize fuel costs, maintenance scheduling.',
    status: 'Not Started'
  },
  entertainment: {
    savings: '300',
    notes: 'Current: $400/mo alcohol vs $100 budget = $300 overspend.\nAction: Reduce bar visits, buy in bulk if drinking at home.',
    status: 'In Progress'
  },
  healthcare: {
    savings: '',
    notes: 'Review health insurance options. Check HSA/FSA eligibility.',
    status: 'Not Started'
  },
  shopping: {
    savings: '',
    notes: 'Implement 24-hour rule for purchases over $50. Use cash envelope system.',
    status: 'Not Started'
  },
  home: {
    savings: '',
    notes: 'Monahans, TX location. Schedule preventive maintenance to avoid costly repairs.',
    status: 'Not Started'
  },
  subscriptions: {
    savings: '284',
    notes: 'COMPLETED 2025-12-25: Canceled 11 subscriptions.\n\nCanceled ($284/mo saved):\n- InVideo AI ($128)\n- ART-GEN.AI ($60)\n- Adobe ($21)\n- Netlify ($21)\n- Disney+ ($14)\n- Suno AI ($11)\n- Obsidian Sync ($10)\n- D-ID ($6)\n- Proton ($5)\n- NY Times ($4)\n- Truthfinder ($4)\n\nRemaining 7 subscriptions: $187/mo',
    status: 'Complete'
  }
}

const DEFAULT_DATA = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = { savings: '', notes: '', status: 'Not Started' }
  return acc
}, {})

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('hoganBudgetData')
    return saved ? JSON.parse(saved) : INITIAL_DATA
  })

  const [expandedCategory, setExpandedCategory] = useState(null)

  useEffect(() => {
    localStorage.setItem('hoganBudgetData', JSON.stringify(data))
  }, [data])

  const updateCategory = (categoryId, field, value) => {
    setData(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value
      }
    }))
  }

  const totalSavings = Object.values(data).reduce((sum, cat) => {
    const amount = parseFloat(cat.savings) || 0
    return sum + amount
  }, 0)

  const completedCount = Object.values(data).filter(cat => cat.status === 'Complete').length
  const inProgressCount = Object.values(data).filter(cat => cat.status === 'In Progress').length
  const progressPercent = (completedCount / CATEGORIES.length) * 100

  const resetAll = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setData(INITIAL_DATA)
      localStorage.removeItem('hoganBudgetData')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Hogan Budget Tracker</h1>
        <p className="subtitle">Track savings across 11 categories</p>
      </header>

      <div className="dashboard">
        <div className="dashboard-card total-savings">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <span className="card-label">Total Monthly Savings</span>
            <span className="card-value">${totalSavings.toFixed(2)}</span>
          </div>
        </div>

        <div className="dashboard-card completion-status">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <span className="card-label">Categories Complete</span>
            <span className="card-value">{completedCount} / {CATEGORIES.length}</span>
          </div>
        </div>

        <div className="dashboard-card in-progress">
          <div className="card-icon">🔄</div>
          <div className="card-content">
            <span className="card-label">In Progress</span>
            <span className="card-value">{inProgressCount}</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="categories">
        {CATEGORIES.map(category => {
          const catData = data[category.id]
          const isExpanded = expandedCategory === category.id
          const statusClass = catData.status.toLowerCase().replace(' ', '-')

          return (
            <div
              key={category.id}
              className={`category-card ${statusClass} ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="category-header"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <div className="category-summary">
                  {catData.savings && (
                    <span className="savings-badge">${parseFloat(catData.savings).toFixed(2)}/mo</span>
                  )}
                  <span className={`status-badge ${statusClass}`}>{catData.status}</span>
                </div>
                <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
              </div>

              {isExpanded && (
                <div className="category-details">
                  <div className="form-group">
                    <label>Monthly Savings ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter savings amount"
                      value={catData.savings}
                      onChange={(e) => updateCategory(category.id, 'savings', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <div className="status-buttons">
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status}
                          className={`status-btn ${catData.status === status ? 'active' : ''} ${status.toLowerCase().replace(' ', '-')}`}
                          onClick={() => updateCategory(category.id, 'status', status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notes & Details</label>
                    <textarea
                      placeholder="Add notes about this category..."
                      value={catData.notes}
                      onChange={(e) => updateCategory(category.id, 'notes', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <footer className="footer">
        <button className="reset-btn" onClick={resetAll}>
          Reset All Data
        </button>
        <p className="footer-note">Data saved locally in your browser</p>
      </footer>
    </div>
  )
}

export default App
