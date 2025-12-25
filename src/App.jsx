import { useState, useEffect, useRef } from 'react'
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
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#ff6b6b' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#ffd93d' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#6bcb77' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#4d96ff' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#9b59b6' },
  { id: 'debt', name: 'Debt Payments', icon: '💳', color: '#e74c3c' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#1abc9c' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#f39c12' },
  { id: 'education', name: 'Education', icon: '📚', color: '#3498db' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#e91e63' },
  { id: 'other', name: 'Other', icon: '📋', color: '#95a5a6' },
]

const RECURRING_OPTIONS = [
  { id: 'once', name: 'One-time', icon: '1️⃣' },
  { id: 'weekly', name: 'Weekly', icon: '📅' },
  { id: 'biweekly', name: 'Bi-weekly', icon: '📆' },
  { id: 'monthly', name: 'Monthly', icon: '🗓️' },
  { id: 'quarterly', name: 'Quarterly', icon: '📊' },
  { id: 'annually', name: 'Annually', icon: '🎯' },
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
  const [paymentHistory, setPaymentHistory] = useState(() => {
    const saved = localStorage.getItem('hoganPaymentHistory')
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
    dueTime: '',
    recurring: 'once',
    autoPay: false,
    paid: false,
    notes: '',
    confirmationNumber: ''
  })
  const [sidebarFilter, setSidebarFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [daySummaryModal, setDaySummaryModal] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('hoganBudgetData', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('hoganCalendarData', JSON.stringify(calendarData))
  }, [calendarData])

  useEffect(() => {
    localStorage.setItem('hoganBillsData', JSON.stringify(billsData))
  }, [billsData])

  useEffect(() => {
    localStorage.setItem('hoganPaymentHistory', JSON.stringify(paymentHistory))
  }, [paymentHistory])

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
      setPaymentHistory([])
      localStorage.removeItem('hoganBudgetData')
      localStorage.removeItem('hoganCalendarData')
      localStorage.removeItem('hoganBillsData')
      localStorage.removeItem('hoganPaymentHistory')
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

  const goToToday = () => {
    setBillsDate(new Date())
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

      if (checkDate < billDate) return false

      if (bill.recurring === 'weekly') {
        const diffTime = checkDate - billDate
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        return diffDays % 7 === 0
      }
      if (bill.recurring === 'biweekly') {
        const diffTime = checkDate - billDate
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        return diffDays % 14 === 0
      }
      if (bill.recurring === 'monthly') {
        return billDate.getDate() === checkDate.getDate()
      }
      if (bill.recurring === 'quarterly') {
        const monthDiff = (checkDate.getFullYear() - billDate.getFullYear()) * 12 +
                         (checkDate.getMonth() - billDate.getMonth())
        return billDate.getDate() === checkDate.getDate() && monthDiff % 3 === 0
      }
      if (bill.recurring === 'annually') {
        return billDate.getMonth() === checkDate.getMonth() &&
               billDate.getDate() === checkDate.getDate()
      }
      return false
    }).map(bill => {
      // Check if this specific instance is paid
      const instanceKey = `${bill.id}-${dateKey}`
      const paidInstance = paymentHistory.find(p => p.instanceKey === instanceKey)
      return {
        ...bill,
        instancePaid: paidInstance ? true : bill.paid,
        instanceKey,
        displayDate: dateKey
      }
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

  const getFilteredMonthBills = () => {
    let bills = getMonthBills()

    if (sidebarFilter === 'paid') {
      bills = bills.filter(b => b.instancePaid)
    } else if (sidebarFilter === 'unpaid') {
      bills = bills.filter(b => !b.instancePaid)
    }

    if (categoryFilter !== 'all') {
      bills = bills.filter(b => b.category === categoryFilter)
    }

    return bills
  }

  const getUpcomingBills = (days = 14) => {
    const today = new Date()
    const upcoming = []

    for (let i = 0; i <= days; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + i)
      const dateKey = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())
      const dayBills = getBillsForDate(dateKey).filter(b => !b.instancePaid)
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
        dueTime: bill.dueTime || '',
        recurring: bill.recurring,
        autoPay: bill.autoPay || false,
        paid: bill.paid,
        notes: bill.notes || '',
        confirmationNumber: bill.confirmationNumber || ''
      })
    } else {
      setEditingBill(null)
      setBillFormData({
        name: '',
        category: 'other',
        amount: '',
        dueDate: dateKey || formatDateKey(billsDate.getFullYear(), billsDate.getMonth(), 1),
        dueTime: '',
        recurring: 'once',
        autoPay: false,
        paid: false,
        notes: '',
        confirmationNumber: ''
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
      dueTime: '',
      recurring: 'once',
      autoPay: false,
      paid: false,
      notes: '',
      confirmationNumber: ''
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

  const toggleBillPaid = (bill, dateKey) => {
    const instanceKey = `${bill.id}-${dateKey}`
    const existingPayment = paymentHistory.find(p => p.instanceKey === instanceKey)

    if (existingPayment) {
      // Remove from payment history (mark as unpaid)
      setPaymentHistory(prev => prev.filter(p => p.instanceKey !== instanceKey))
    } else {
      // Add to payment history (mark as paid)
      setPaymentHistory(prev => [...prev, {
        instanceKey,
        billId: bill.id,
        dateKey,
        paidAt: new Date().toISOString(),
        amount: bill.amount
      }])
    }
  }

  const quickTogglePaid = (e, bill, dateKey) => {
    e.stopPropagation()
    toggleBillPaid(bill, dateKey)
  }

  const exportBillsCSV = () => {
    const headers = ['Name', 'Category', 'Amount', 'Due Date', 'Due Time', 'Recurring', 'Auto-Pay', 'Paid', 'Notes', 'Confirmation']
    const rows = billsData.map(b => [
      b.name,
      BILL_CATEGORIES.find(c => c.id === b.category)?.name || b.category,
      b.amount,
      b.dueDate,
      b.dueTime || '',
      RECURRING_OPTIONS.find(r => r.id === b.recurring)?.name || b.recurring,
      b.autoPay ? 'Yes' : 'No',
      b.paid ? 'Yes' : 'No',
      b.notes || '',
      b.confirmationNumber || ''
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hogan-bills-${formatDateKey(billsDate.getFullYear(), billsDate.getMonth(), 1)}.csv`
    a.click()
  }

  const importBillsCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())

      const newBills = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
        if (!values) continue

        const cleanValues = values.map(v => v.replace(/"/g, '').trim())
        const bill = {
          id: generateBillId(),
          name: cleanValues[0] || '',
          category: BILL_CATEGORIES.find(c => c.name.toLowerCase() === (cleanValues[1] || '').toLowerCase())?.id || 'other',
          amount: cleanValues[2] || '',
          dueDate: cleanValues[3] || '',
          dueTime: cleanValues[4] || '',
          recurring: RECURRING_OPTIONS.find(r => r.name.toLowerCase() === (cleanValues[5] || '').toLowerCase())?.id || 'once',
          autoPay: (cleanValues[6] || '').toLowerCase() === 'yes',
          paid: (cleanValues[7] || '').toLowerCase() === 'yes',
          notes: cleanValues[8] || '',
          confirmationNumber: cleanValues[9] || ''
        }

        if (bill.name && bill.amount && bill.dueDate) {
          newBills.push(bill)
        }
      }

      if (newBills.length > 0) {
        setBillsData(prev => [...prev, ...newBills])
        alert(`Imported ${newBills.length} bills successfully!`)
      } else {
        alert('No valid bills found in CSV file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const openDaySummary = (day, dateKey, bills) => {
    const total = bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
    const paid = bills.filter(b => b.instancePaid).reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
    const unpaid = total - paid
    setDaySummaryModal({
      day,
      dateKey,
      displayDate: `${MONTH_NAMES[billsDate.getMonth()]} ${day}, ${billsDate.getFullYear()}`,
      bills,
      total,
      paid,
      unpaid
    })
  }

  const monthBills = getFilteredMonthBills()
  const allMonthBills = getMonthBills()
  const totalBillsDue = allMonthBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const totalPaid = allMonthBills.filter(b => b.instancePaid).reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const totalUnpaid = allMonthBills.filter(b => !b.instancePaid).reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)
  const upcomingBills = getUpcomingBills(14)
  const billCount = allMonthBills.length

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

  const renderBigBillsCalendar = () => {
    const year = billsDate.getFullYear()
    const month = billsDate.getMonth()
    const { daysInMonth, startingDay } = getMonthDays(year, month)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const days = []

    // Empty cells for days before the 1st
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="big-calendar-day empty"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day)
      let dayBills = getBillsForDate(dateKey)

      // Apply filters
      if (sidebarFilter === 'paid') {
        dayBills = dayBills.filter(b => b.instancePaid)
      } else if (sidebarFilter === 'unpaid') {
        dayBills = dayBills.filter(b => !b.instancePaid)
      }
      if (categoryFilter !== 'all') {
        dayBills = dayBills.filter(b => b.category === categoryFilter)
      }

      const isToday = isCurrentMonth && today.getDate() === day
      const isWeekend = (startingDay + day - 1) % 7 === 0 || (startingDay + day - 1) % 7 === 6
      const daysUntil = getDaysUntilDue(dateKey)
      const hasUnpaid = dayBills.some(b => !b.instancePaid)
      const allPaid = dayBills.length > 0 && dayBills.every(b => b.instancePaid)
      const isDueSoon = hasUnpaid && daysUntil >= 0 && daysUntil <= 3
      const isOverdue = hasUnpaid && daysUntil < 0
      const dayTotal = dayBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)

      // Determine background intensity based on total
      let amountClass = ''
      if (dayTotal >= 2000) amountClass = 'amount-very-high'
      else if (dayTotal >= 1000) amountClass = 'amount-high'
      else if (dayTotal >= 500) amountClass = 'amount-medium'
      else if (dayTotal > 0) amountClass = 'amount-low'

      days.push(
        <div
          key={day}
          className={`big-calendar-day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${dayBills.length > 0 ? 'has-bills' : ''} ${allPaid ? 'all-paid' : ''} ${isDueSoon ? 'due-soon' : ''} ${isOverdue ? 'overdue' : ''} ${amountClass}`}
        >
          <div className="big-day-header">
            <span
              className="big-day-number"
              onClick={() => openDaySummary(day, dateKey, dayBills)}
              title="Click for day summary"
            >
              {day}
            </span>
            <button
              className="add-bill-to-day"
              onClick={() => openBillModal(dateKey)}
              title="Add bill to this date"
            >
              +
            </button>
          </div>

          <div className="big-day-bills">
            {dayBills.map((bill, idx) => {
              const catInfo = BILL_CATEGORIES.find(c => c.id === bill.category)
              const isPaid = bill.instancePaid

              return (
                <div
                  key={`${bill.id}-${idx}`}
                  className={`big-bill-card ${isPaid ? 'paid' : 'unpaid'}`}
                  style={{ borderLeftColor: catInfo?.color || '#95a5a6' }}
                  onClick={() => openBillModal(dateKey, bill)}
                >
                  <div className="big-bill-top">
                    <span className="big-bill-icon">{catInfo?.icon || '📋'}</span>
                    <span className="big-bill-name">{bill.name}</span>
                    {bill.recurring !== 'once' && (
                      <span className="recurring-indicator" title={`Recurring: ${RECURRING_OPTIONS.find(r => r.id === bill.recurring)?.name}`}>🔄</span>
                    )}
                    {bill.autoPay && (
                      <span className="autopay-indicator" title="Auto-pay enabled">⚡</span>
                    )}
                  </div>
                  <div className="big-bill-middle">
                    <span className="big-bill-amount">${parseFloat(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    {bill.dueTime && (
                      <span className="big-bill-time">{bill.dueTime}</span>
                    )}
                  </div>
                  <div className="big-bill-bottom">
                    <span className={`big-bill-status ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
                      {isPaid ? '✓ PAID' : '⚠ DUE'}
                    </span>
                    <button
                      className={`quick-toggle ${isPaid ? 'is-paid' : ''}`}
                      onClick={(e) => quickTogglePaid(e, bill, dateKey)}
                      title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      {isPaid ? '↩' : '✓'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {dayBills.length > 0 && (
            <div className="big-day-total">
              Total: ${dayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            (${upcomingBills.slice(0, 7).reduce((sum, b) => sum + parseFloat(b.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })})
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
          {upcomingBills.filter(b => b.daysUntil <= 7).length > 0 && (
            <span className="tab-badge">{upcomingBills.filter(b => b.daysUntil <= 7).length}</span>
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

      {/* Big Bills Calendar View */}
      {activeTab === 'bills' && (
        <div className="bills-page-layout">
          {/* Sidebar */}
          <div className="bills-sidebar">
            {/* Month Summary */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">📊 Month Summary</h3>
              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <span className="stat-label">Total Due</span>
                  <span className="stat-value">${totalBillsDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="sidebar-stat paid">
                  <span className="stat-label">Paid</span>
                  <span className="stat-value">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="sidebar-stat unpaid">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value">${totalUnpaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="sidebar-stat">
                  <span className="stat-label">Bills This Month</span>
                  <span className="stat-value">{billCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">🔍 Filters</h3>
              <div className="sidebar-filters">
                <button
                  className={`sidebar-filter-btn ${sidebarFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('all')}
                >
                  Show All
                </button>
                <button
                  className={`sidebar-filter-btn ${sidebarFilter === 'unpaid' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('unpaid')}
                >
                  ⚠ Unpaid Only
                </button>
                <button
                  className={`sidebar-filter-btn ${sidebarFilter === 'paid' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('paid')}
                >
                  ✓ Paid Only
                </button>
              </div>

              <div className="category-filter">
                <label>By Category:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {BILL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Legend */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">🎨 Categories</h3>
              <div className="category-legend">
                {BILL_CATEGORIES.map(cat => (
                  <div key={cat.id} className="legend-category" onClick={() => setCategoryFilter(cat.id === categoryFilter ? 'all' : cat.id)}>
                    <span className="legend-color" style={{ backgroundColor: cat.color }}></span>
                    <span className="legend-icon">{cat.icon}</span>
                    <span className="legend-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Bills */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">📅 Upcoming (14 days)</h3>
              <div className="upcoming-sidebar-list">
                {upcomingBills.length === 0 ? (
                  <p className="no-upcoming">No upcoming bills</p>
                ) : (
                  upcomingBills.slice(0, 10).map((bill, idx) => {
                    const catInfo = BILL_CATEGORIES.find(c => c.id === bill.category)
                    return (
                      <div
                        key={`${bill.id}-${idx}`}
                        className={`upcoming-sidebar-item ${bill.daysUntil === 0 ? 'due-today' : bill.daysUntil <= 3 ? 'due-soon' : ''}`}
                        onClick={() => openBillModal(bill.displayDate, bill)}
                      >
                        <span className="upcoming-icon">{catInfo?.icon || '📋'}</span>
                        <div className="upcoming-info">
                          <span className="upcoming-name">{bill.name}</span>
                          <span className="upcoming-due">
                            {bill.daysUntil === 0 ? 'Today' : bill.daysUntil === 1 ? 'Tomorrow' : `${bill.daysUntil} days`}
                          </span>
                        </div>
                        <span className="upcoming-amount">${parseFloat(bill.amount).toFixed(2)}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">⚡ Actions</h3>
              <div className="sidebar-actions">
                <button className="sidebar-action-btn primary" onClick={() => openBillModal()}>
                  + Add New Bill
                </button>
                <button className="sidebar-action-btn" onClick={exportBillsCSV}>
                  📥 Export CSV
                </button>
                <button className="sidebar-action-btn" onClick={() => fileInputRef.current?.click()}>
                  📤 Import CSV
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={importBillsCSV}
                />
              </div>
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className="bills-main">
            {/* Calendar Header */}
            <div className="big-calendar-header">
              <div className="big-calendar-nav">
                <button className="nav-btn" onClick={prevBillsMonth}>◀ Prev</button>
                <h2 className="big-calendar-title">
                  {MONTH_NAMES[billsDate.getMonth()]} {billsDate.getFullYear()}
                </h2>
                <button className="nav-btn" onClick={nextBillsMonth}>Next ▶</button>
                <button className="nav-btn today-btn" onClick={goToToday}>Today</button>
              </div>
            </div>

            {/* Day Names Header */}
            <div className="big-calendar-weekdays">
              {DAY_NAMES.map(day => (
                <div key={day} className="big-weekday">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="big-calendar-grid">
              {renderBigBillsCalendar()}
            </div>

            {/* Legend */}
            <div className="big-calendar-legend">
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
                <span>Due Soon (3 days)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot overdue-dot"></span>
                <span>Overdue</span>
              </div>
            </div>
          </div>
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
                  <label>Due Time (Optional)</label>
                  <input
                    type="time"
                    value={billFormData.dueTime}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Recurring</label>
                  <select
                    value={billFormData.recurring}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, recurring: e.target.value }))}
                  >
                    {RECURRING_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.icon} {opt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group checkbox-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={billFormData.autoPay}
                      onChange={(e) => setBillFormData(prev => ({ ...prev, autoPay: e.target.checked }))}
                    />
                    <span>⚡ Auto-Pay</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={billFormData.paid}
                      onChange={(e) => setBillFormData(prev => ({ ...prev, paid: e.target.checked }))}
                    />
                    <span>✓ Mark as Paid</span>
                  </label>
                </div>
              </div>

              {billFormData.paid && (
                <div className="form-group">
                  <label>Confirmation Number</label>
                  <input
                    type="text"
                    placeholder="Enter confirmation or reference number"
                    value={billFormData.confirmationNumber}
                    onChange={(e) => setBillFormData(prev => ({ ...prev, confirmationNumber: e.target.value }))}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Notes / Details</label>
                <textarea
                  placeholder="Add any notes about this bill..."
                  value={billFormData.notes}
                  onChange={(e) => setBillFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              {editingBill && (
                <button className="modal-btn delete" onClick={deleteBill}>🗑️ Delete</button>
              )}
              <button className="modal-btn cancel" onClick={closeBillModal}>Cancel</button>
              <button className="modal-btn save" onClick={saveBill}>💾 Save Bill</button>
            </div>
          </div>
        </div>
      )}

      {/* Day Summary Modal */}
      {daySummaryModal && (
        <div className="modal-overlay" onClick={() => setDaySummaryModal(null)}>
          <div className="modal day-summary-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 {daySummaryModal.displayDate}</h3>
              <button className="modal-close" onClick={() => setDaySummaryModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="day-summary-stats">
                <div className="summary-stat-card">
                  <span className="stat-icon">💵</span>
                  <span className="stat-label">Total</span>
                  <span className="stat-value">${daySummaryModal.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-stat-card paid">
                  <span className="stat-icon">✅</span>
                  <span className="stat-label">Paid</span>
                  <span className="stat-value">${daySummaryModal.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-stat-card unpaid">
                  <span className="stat-icon">⚠️</span>
                  <span className="stat-label">Unpaid</span>
                  <span className="stat-value">${daySummaryModal.unpaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <h4 className="bills-list-title">Bills on this date ({daySummaryModal.bills.length})</h4>
              <div className="day-summary-bills">
                {daySummaryModal.bills.map((bill, idx) => {
                  const catInfo = BILL_CATEGORIES.find(c => c.id === bill.category)
                  return (
                    <div
                      key={`${bill.id}-${idx}`}
                      className={`summary-bill-item ${bill.instancePaid ? 'paid' : 'unpaid'}`}
                      style={{ borderLeftColor: catInfo?.color }}
                    >
                      <div className="summary-bill-info">
                        <span className="summary-bill-icon">{catInfo?.icon}</span>
                        <div className="summary-bill-details">
                          <span className="summary-bill-name">{bill.name}</span>
                          <span className="summary-bill-category">{catInfo?.name}</span>
                        </div>
                      </div>
                      <div className="summary-bill-right">
                        <span className="summary-bill-amount">${parseFloat(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <button
                          className={`summary-toggle ${bill.instancePaid ? 'is-paid' : ''}`}
                          onClick={() => toggleBillPaid(bill, daySummaryModal.dateKey)}
                        >
                          {bill.instancePaid ? '✓ Paid' : 'Mark Paid'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn primary" onClick={() => { setDaySummaryModal(null); openBillModal(daySummaryModal.dateKey); }}>
                + Add Bill
              </button>
              <button className="modal-btn cancel" onClick={() => setDaySummaryModal(null)}>Close</button>
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
