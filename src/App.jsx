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

const BILL_CATEGORIES = [
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️' },
  { id: 'transportation', name: 'Transportation', icon: '🚗' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱' },
  { id: 'debt', name: 'Debt Payments', icon: '💳' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'other', name: 'Other', icon: '📋' },
]

const RECURRING_OPTIONS = [
  { id: 'once', name: 'One-time' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'annually', name: 'Annually' },
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
  const [billsData, setBillsData] = useState(() => {
    const saved = localStorage.getItem('hoganBillsData')
    return saved ? JSON.parse(saved) : []
  })
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [billsDate, setBillsDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalData, setModalData] = useState({})
  const [billModalOpen, setBillModalOpen] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [billFormData, setBillFormData] = useState({
    name: '',
    category: 'other',
    amount: '',
    dueDate: '',
    recurring: 'once',
    paid: false,
    notes: ''
  })
  const [billsViewMode, setBillsViewMode] = useState('calendar')
  const [billsFilter, setBillsFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('hoganBudgetData', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('hoganCalendarData', JSON.stringify(calendarData))
  }, [calendarData])

  useEffect(() => {
    localStorage.setItem('hoganBillsData', JSON.stringify(billsData))
  }, [billsData])

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
      setBillsData([])
      localStorage.removeItem('hoganBudgetData')
      localStorage.removeItem('hoganCalendarData')
      localStorage.removeItem('hoganBillsData')
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

  const prevBillsMonth = () => {
    setBillsDate(new Date(billsDate.getFullYear(), billsDate.getMonth() - 1, 1))
  }

  const nextBillsMonth = () => {
    setBillsDate(new Date(billsDate.getFullYear(), billsDate.getMonth() + 1, 1))
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

  // Bills functions
  const generateBillId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const getBillsForDate = (dateKey) => {
    return billsData.filter(bill => {
      if (bill.dueDate === dateKey) return true
      if (bill.recurring === 'once') return false

      const billDate = new Date(bill.dueDate)
      const checkDate = new Date(dateKey)

      if (bill.recurring === 'monthly') {
        return billDate.getDate() === checkDate.getDate() && checkDate >= billDate
      }
      if (bill.recurring === 'quarterly') {
        const monthDiff = (checkDate.getFullYear() - billDate.getFullYear()) * 12 +
                         (checkDate.getMonth() - billDate.getMonth())
        return billDate.getDate() === checkDate.getDate() &&
               monthDiff >= 0 && monthDiff % 3 === 0
      }
      if (bill.recurring === 'annually') {
        return billDate.getMonth() === checkDate.getMonth() &&
               billDate.getDate() === checkDate.getDate() &&
               checkDate >= billDate
      }
      return false
    })
  }

  const getMonthBills = () => {
    const year = billsDate.getFullYear()
    const month = billsDate.getMonth()
    const { daysInMonth } = getMonthDays(year, month)
    const monthBills = []

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      const dayBills = getBillsForDate(dateKey)
      dayBills.forEach(bill => {
        monthBills.push({ ...bill, displayDate: dateKey })
      })
    }

    return monthBills
  }

  const getUpcomingBills = () => {
    const today = new Date()
    const upcoming = []

    for (let i = 0; i <= 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + i)
      const dateKey = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())
      const dayBills = getBillsForDate(dateKey).filter(b => !b.paid)
      dayBills.forEach(bill => {
        upcoming.push({ ...bill, displayDate: dateKey, daysUntil: i })
      })
    }

    return upcoming
  }

  const getDaysUntilDue = (dateKey) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateKey)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const openBillModal = (dateKey = null, bill = null) => {
    if (bill) {
      setEditingBill(bill)
      setBillFormData({
        name: bill.name,
        category: bill.category,
        amount: bill.amount,
        dueDate: bill.dueDate,
        recurring: bill.recurring,
        paid: bill.paid,
        notes: bill.notes || ''
      })
    } else {
      setEditingBill(null)
      setBillFormData({
        name: '',
        category: 'other',
        amount: '',
        dueDate: dateKey || formatDateKey(billsDate.getFullYear(), billsDate.getMonth(), 1),
        recurring: 'once',
        paid: false,
        notes: ''
      })
    }
    setBillModalOpen(true)
  }

  const closeBillModal = () => {
    setBillModalOpen(false)
    setEditingBill(null)
    setBillFormData({
      name: '',
      category: 'other',
      amount: '',
      dueDate: '',
      recurring: 'once',
      paid: false,
      notes: ''
    })
  }

  const saveBill = () => {
    if (!billFormData.name || !billFormData.amount || !billFormData.dueDate) {
      alert('Please fill in bill name, amount, and due date')
      return
    }

    if (editingBill) {
      setBillsData(prev => prev.map(b =>
        b.id === editingBill.id ? { ...billFormData, id: editingBill.id } : b
      ))
    } else {
      setBillsData(prev => [...prev, { ...billFormData, id: generateBillId() }])
    }
    closeBillModal()
  }

  const deleteBill = () => {
    if (editingBill && confirm('Are you sure you want to delete this bill?')) {
      setBillsData(prev => prev.filter(b => b.id !== editingBill.id))
      closeBillModal()
    }
  }

  const toggleBillPaid = (billId) => {
    setBillsData(prev => prev.map(b =>
      b.id === billId ? { ...b, paid: !b.paid } : b
    ))
  }

  const getFilteredBills = () => {
    let filtered = getMonthBills()

    if (billsFilter === 'paid') {
      filtered = filtered.filter(b => b.paid)
    } else if (billsFilter === 'unpaid') {
      filtered = filtered.filter(b => !b.paid)
    }

    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(a.displayDate) - new Date(b.displayDate))
  }

  const exportBillsCSV = () => {
    const headers = ['Name', 'Category', 'Amount', 'Due Date', 'Recurring', 'Paid', 'Notes']
    const rows = billsData.map(b => [
      b.name,
      BILL_CATEGORIES.find(c => c.id === b.category)?.name || b.category,
      b.amount,
      b.dueDate,
      RECURRING_OPTIONS.find(r => r.id === b.recurring)?.name || b.recurring,
      b.paid ? 'Yes' : 'No',
      b.notes || ''
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hogan-bills-${formatDateKey(billsDate.getFullYear(), billsDate.getMonth(), 1)}.csv`
    a.click()
  }

  const monthBills = getMonthBills()
  const totalBillsDue = monthBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const totalPaid = monthBills.filter(b => b.paid).reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const totalUnpaid = monthBills.filter(b => !b.paid).reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const upcomingBills = getUpcomingBills()

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const { daysInMonth, startingDay } = getMonthDays(year, month)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const days = []

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

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

  const renderBillsCalendar = () => {
    const year = billsDate.getFullYear()
    const month = billsDate.getMonth()
    const { daysInMonth, startingDay } = getMonthDays(year, month)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const days = []

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="bills-calendar-day empty"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      const dayBills = getBillsForDate(dateKey)
      const isToday = isCurrentMonth && today.getDate() === day
      const daysUntil = getDaysUntilDue(dateKey)
      const hasUnpaid = dayBills.some(b => !b.paid)
      const allPaid = dayBills.length > 0 && dayBills.every(b => b.paid)
      const isDueSoon = hasUnpaid && daysUntil >= 0 && daysUntil <= 3
      const isOverdue = hasUnpaid && daysUntil < 0

      days.push(
        <div
          key={day}
          className={`bills-calendar-day ${isToday ? 'today' : ''} ${dayBills.length > 0 ? 'has-bills' : ''} ${allPaid ? 'all-paid' : ''} ${isDueSoon ? 'due-soon' : ''} ${isOverdue ? 'overdue' : ''}`}
          onClick={() => openBillModal(dateKey)}
        >
          <span className="day-number">{day}</span>
          {dayBills.length > 0 && (
            <div className="day-bills">
              {dayBills.slice(0, 2).map((bill, idx) => (
                <div
                  key={idx}
                  className={`day-bill-item ${bill.paid ? 'paid' : 'unpaid'}`}
                  onClick={(e) => { e.stopPropagation(); openBillModal(dateKey, bill) }}
                >
                  <span className="bill-amount">${parseFloat(bill.amount).toFixed(0)}</span>
                  {bill.paid && <span className="paid-check">✓</span>}
                </div>
              ))}
              {dayBills.length > 2 && (
                <span className="more-bills">+{dayBills.length - 2}</span>
              )}
            </div>
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

      {/* Upcoming Bills Alert */}
      {upcomingBills.length > 0 && activeTab !== 'bills' && (
        <div className="upcoming-alert" onClick={() => setActiveTab('bills')}>
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">
            {upcomingBills.length} bill{upcomingBills.length > 1 ? 's' : ''} due in next 7 days
            (${upcomingBills.reduce((sum, b) => sum + parseFloat(b.amount), 0).toFixed(2)})
          </span>
          <span className="alert-arrow">→</span>
        </div>
      )}

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
          Savings
        </button>
        <button
          className={`nav-tab ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          <span className="tab-icon">💵</span>
          Bills
          {upcomingBills.length > 0 && (
            <span className="tab-badge">{upcomingBills.length}</span>
          )}
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

          <div className="calendar-nav">
            <button className="nav-btn" onClick={prevMonth}>◀ Prev</button>
            <h2 className="calendar-title">
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button className="nav-btn" onClick={nextMonth}>Next ▶</button>
          </div>

          <div className="calendar-grid">
            {DAY_NAMES.map(day => (
              <div key={day} className="calendar-header">{day}</div>
            ))}
            {renderCalendar()}
          </div>

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

      {/* Bills View */}
      {activeTab === 'bills' && (
        <div className="bills-container">
          {/* Bills Summary */}
          <div className="bills-summary">
            <div className="summary-card">
              <span className="summary-icon">💵</span>
              <div className="summary-content">
                <span className="summary-label">Total Due</span>
                <span className="summary-value">${totalBillsDue.toFixed(2)}</span>
              </div>
            </div>
            <div className="summary-card paid">
              <span className="summary-icon">✅</span>
              <div className="summary-content">
                <span className="summary-label">Paid</span>
                <span className="summary-value paid-value">${totalPaid.toFixed(2)}</span>
              </div>
            </div>
            <div className="summary-card unpaid">
              <span className="summary-icon">⏳</span>
              <div className="summary-content">
                <span className="summary-label">Unpaid</span>
                <span className="summary-value unpaid-value">${totalUnpaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Bills Banner */}
          {upcomingBills.length > 0 && (
            <div className="upcoming-bills-banner">
              <h4>⚠️ Upcoming Bills (Next 7 Days)</h4>
              <div className="upcoming-list">
                {upcomingBills.slice(0, 5).map((bill, idx) => (
                  <div key={idx} className={`upcoming-item ${bill.daysUntil === 0 ? 'due-today' : bill.daysUntil <= 3 ? 'due-soon' : ''}`}>
                    <span className="upcoming-name">{bill.name}</span>
                    <span className="upcoming-amount">${parseFloat(bill.amount).toFixed(2)}</span>
                    <span className="upcoming-days">
                      {bill.daysUntil === 0 ? 'Today' : bill.daysUntil === 1 ? 'Tomorrow' : `${bill.daysUntil} days`}
                    </span>
                    <button
                      className="quick-pay-btn"
                      onClick={() => toggleBillPaid(bill.id)}
                    >
                      Mark Paid
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Toggle & Controls */}
          <div className="bills-controls">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${billsViewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setBillsViewMode('calendar')}
              >
                📅 Calendar
              </button>
              <button
                className={`toggle-btn ${billsViewMode === 'list' ? 'active' : ''}`}
                onClick={() => setBillsViewMode('list')}
              >
                📋 List
              </button>
            </div>
            <button className="add-bill-btn" onClick={() => openBillModal()}>
              + Add Bill
            </button>
          </div>

          {billsViewMode === 'calendar' ? (
            <>
              {/* Bills Calendar Navigation */}
              <div className="calendar-nav">
                <button className="nav-btn" onClick={prevBillsMonth}>◀ Prev</button>
                <h2 className="calendar-title">
                  {MONTH_NAMES[billsDate.getMonth()]} {billsDate.getFullYear()}
                </h2>
                <button className="nav-btn" onClick={nextBillsMonth}>Next ▶</button>
              </div>

              {/* Bills Calendar Grid */}
              <div className="bills-calendar-grid">
                {DAY_NAMES.map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {renderBillsCalendar()}
              </div>

              {/* Bills Legend */}
              <div className="bills-legend">
                <div className="legend-item">
                  <span className="legend-dot paid-dot"></span>
                  <span>Paid</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot unpaid-dot"></span>
                  <span>Unpaid</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot due-soon-dot"></span>
                  <span>Due Soon</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot overdue-dot"></span>
                  <span>Overdue</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* List View Controls */}
              <div className="list-controls">
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${billsFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setBillsFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${billsFilter === 'unpaid' ? 'active' : ''}`}
                    onClick={() => setBillsFilter('unpaid')}
                  >
                    Unpaid
                  </button>
                  <button
                    className={`filter-btn ${billsFilter === 'paid' ? 'active' : ''}`}
                    onClick={() => setBillsFilter('paid')}
                  >
                    Paid
                  </button>
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="export-btn" onClick={exportBillsCSV}>
                  📥 Export CSV
                </button>
              </div>

              {/* Bills List */}
              <div className="bills-list">
                {getFilteredBills().length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No bills found for this month</p>
                    <button className="add-bill-btn" onClick={() => openBillModal()}>
                      + Add Your First Bill
                    </button>
                  </div>
                ) : (
                  getFilteredBills().map((bill, idx) => {
                    const daysUntil = getDaysUntilDue(bill.displayDate)
                    const catInfo = BILL_CATEGORIES.find(c => c.id === bill.category)

                    return (
                      <div
                        key={idx}
                        className={`bill-item ${bill.paid ? 'paid' : 'unpaid'} ${!bill.paid && daysUntil < 0 ? 'overdue' : ''} ${!bill.paid && daysUntil >= 0 && daysUntil <= 3 ? 'due-soon' : ''}`}
                      >
                        <div className="bill-icon">{catInfo?.icon || '📋'}</div>
                        <div className="bill-info">
                          <h4>{bill.name}</h4>
                          <p>{catInfo?.name || 'Other'} • Due {bill.displayDate}</p>
                        </div>
                        <div className="bill-amount">${parseFloat(bill.amount).toFixed(2)}</div>
                        <div className="bill-actions">
                          <button
                            className={`paid-toggle ${bill.paid ? 'is-paid' : ''}`}
                            onClick={() => toggleBillPaid(bill.id)}
                          >
                            {bill.paid ? '✓ Paid' : 'Mark Paid'}
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => openBillModal(bill.displayDate, bill)}
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Date Entry Modal (Savings Calendar) */}
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

      {/* Bill Entry Modal */}
      {billModalOpen && (
        <div className="modal-overlay" onClick={closeBillModal}>
          <div className="modal bill-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💵 {editingBill ? 'Edit Bill' : 'Add New Bill'}</h3>
              <button className="modal-close" onClick={closeBillModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Bill Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Rent, Electric Bill, Internet"
                  value={billFormData.name}
                  onChange={(e) => setBillFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={billFormData.category}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {BILL_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount *</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={billFormData.amount}
                      onChange={(e) => setBillFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={billFormData.dueDate}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Recurring</label>
                  <select
                    value={billFormData.recurring}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, recurring: e.target.value }))}
                  >
                    {RECURRING_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={billFormData.paid}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, paid: e.target.checked }))}
                  />
                  <span className="checkmark"></span>
                  Mark as Paid
                </label>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  placeholder="Add any notes about this bill..."
                  value={billFormData.notes}
                  onChange={(e) => setBillFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <div className="modal-footer">
              {editingBill && (
                <button className="modal-btn delete" onClick={deleteBill}>Delete</button>
              )}
              <button className="modal-btn cancel" onClick={closeBillModal}>Cancel</button>
              <button className="modal-btn save" onClick={saveBill}>Save Bill</button>
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
