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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function App() {
  const [activeTab, setActiveTab] = useState('categories')
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('hoganBudgetData')
    return saved ? JSON.parse(saved) : INITIAL_DATA
  })
  const [calendarData, setCalendarData] = useState(() => {
    const saved = localStorage.getItem('hoganCalendarData')
    return saved ? JSON.parse(saved) : {}
  })
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    localStorage.setItem('hoganBudgetData', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('hoganCalendarData', JSON.stringify(calendarData))
  }, [calendarData])

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
      setCalendarData({})
      localStorage.removeItem('hoganBudgetData')
      localStorage.removeItem('hoganCalendarData')
    }
  }

  // Calendar functions
  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getDayTotal = (dateKey) => {
    const dayData = calendarData[dateKey]
    if (!dayData) return 0
    return Object.values(dayData.categories || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  }

  const getMonthTotal = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    let total = 0
    const { daysInMonth } = getMonthDays(year, month)
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      total += getDayTotal(dateKey)
    }
    return total
  }

  const getDaysWithEntries = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    let count = 0
    const { daysInMonth } = getMonthDays(year, month)
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      if (getDayTotal(dateKey) > 0) count++
    }
    return count
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const openDateModal = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const existingData = calendarData[dateKey] || { categories: {}, notes: '' }
    setSelectedDate({ day, dateKey, displayDate: `${MONTH_NAMES[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}` })
    setModalData({ ...existingData })
  }

  const closeModal = () => {
    setSelectedDate(null)
    setModalData({})
  }

  const saveModalData = () => {
    setCalendarData(prev => ({
      ...prev,
      [selectedDate.dateKey]: modalData
    }))
    closeModal()
  }

  const updateModalCategory = (categoryId, value) => {
    setModalData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: value
      }
    }))
  }

  const getSavingsLevel = (amount) => {
    if (amount >= 100) return 'high'
    if (amount >= 50) return 'medium'
    if (amount > 0) return 'low'
    return ''
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const { daysInMonth, startingDay } = getMonthDays(year, month)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const days = []

    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      const dayTotal = getDayTotal(dateKey)
      const isToday = isCurrentMonth && today.getDate() === day
      const savingsLevel = getSavingsLevel(dayTotal)

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${dayTotal > 0 ? 'has-entry' : ''} ${savingsLevel}`}
          onClick={() => openDateModal(day)}
        >
          <span className="day-number">{day}</span>
          {dayTotal > 0 && (
            <span className="day-total">${dayTotal.toFixed(0)}</span>
          )}
        </div>
      )
    }

    return days
  }

  const monthTotal = getMonthTotal()
  const daysWithEntries = getDaysWithEntries()
  const avgDaily = daysWithEntries > 0 ? monthTotal / daysWithEntries : 0

  return (
    <div className="app">
      <header className="header">
        <h1>Hogan Budget Tracker</h1>
        <p className="subtitle">Track savings across 11 categories</p>
      </header>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <span className="tab-icon">📋</span>
          Categories
        </button>
        <button
          className={`nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <span className="tab-icon">📅</span>
          Calendar
        </button>
      </div>

      {/* Categories View */}
      {activeTab === 'categories' && (
        <>
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
        </>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="calendar-container">
          {/* Monthly Summary */}
          <div className="calendar-summary">
            <div className="summary-card">
              <span className="summary-icon">💰</span>
              <div className="summary-content">
                <span className="summary-label">Month Total</span>
                <span className="summary-value">${monthTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">📊</span>
              <div className="summary-content">
                <span className="summary-label">Daily Average</span>
                <span className="summary-value">${avgDaily.toFixed(2)}</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">📅</span>
              <div className="summary-content">
                <span className="summary-label">Days with Entries</span>
                <span className="summary-value">{daysWithEntries}</span>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="calendar-nav">
            <button className="nav-btn" onClick={prevMonth}>◀ Prev</button>
            <h2 className="calendar-title">
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button className="nav-btn" onClick={nextMonth}>Next ▶</button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day Headers */}
            {DAY_NAMES.map(day => (
              <div key={day} className="calendar-header">{day}</div>
            ))}
            {/* Calendar Days */}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot high"></span>
              <span>$100+</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot medium"></span>
              <span>$50-99</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot low"></span>
              <span>$1-49</span>
            </div>
          </div>
        </div>
      )}

      {/* Date Entry Modal */}
      {selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 {selectedDate.displayDate}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Savings by Category</h4>
                <div className="modal-categories">
                  {CATEGORIES.map(category => (
                    <div key={category.id} className="modal-category">
                      <span className="modal-cat-icon">{category.icon}</span>
                      <span className="modal-cat-name">{category.name}</span>
                      <div className="modal-cat-input">
                        <span className="input-prefix">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={modalData.categories?.[category.id] || ''}
                          onChange={(e) => updateModalCategory(category.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4>Notes for this day</h4>
                <textarea
                  placeholder="Add notes for this date..."
                  value={modalData.notes || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="modal-total">
                <span>Day Total:</span>
                <span className="modal-total-value">
                  ${Object.values(modalData.categories || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-btn save" onClick={saveModalData}>Save</button>
            </div>
          </div>
        </div>
      )}

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
