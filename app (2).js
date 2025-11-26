// Application State
let currentUser = null;
let beneficiaries = [];
let transactions = [];
let filteredTransactions = [];
let pendingTransfer = null;

// Login Credentials
const LOGIN_CREDENTIALS = {
    customerId: "123456",
    pin: "1234",
    transferPassword: "mypassword123"
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const navItems = document.querySelectorAll('.nav-item');
const contentPages = document.querySelectorAll('.content-page');
const breadcrumbs = document.getElementById('breadcrumbs');
const notification = document.getElementById('notification');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    console.log('Initializing app...');
    // Load mock data
    loadMockData();
    
    // Always start with login page
    showLoginPage();
    
    console.log('App initialized successfully');
}

function loadMockData() {
    console.log('Loading mock data...');
    
    // Load user account data
    currentUser = {
        accountNumber: "1234567890123456",
        accountHolderName: "Mittapalli Yashaswini", 
        email: "mittapalliyashaswini@gmail.com",
        phone: "+91 9876543219",
        address: "123 Main Street, Kazipet, Telangana 500003",
        ifscCode: "HDFC0000375",
        branchName: "Hanamkonda Main Branch",
        accountType: "Savings Account",
        balance: 458299.50,
        availableBalance: 458299.50,
        accountStatus: "Active"
    };

    // Load beneficiaries
    beneficiaries = [
        {
            id: 1,
            name: "Chunnu",
            accountNumber: "9876543210987654",
            ifscCode: "ICICI0005678",
            bankName: "ICICI Bank",
            branch: "Mumbai Branch",
            nickname: "Sister"
        },
        {
            id: 2,
            name: "Manoj",
            accountNumber: "5678901234567890",
            ifscCode: "HDFC0000375",
            bankName: "HDFC",
            branch: "Hanamkonda Branch",
            nickname: "Business Partner"
        },
        {
            id: 3,
            name: "Tejaswini",
            accountNumber: "3456789012345678",
            ifscCode: "AXIS0001111",
            bankName: "Axis Bank",
            branch: "Bangalore Branch",
            nickname: "Friend"
        },
        {
            id: 4,
            name: "Sai Suraj",
            accountNumber: "7890123456789012",
            ifscCode: "KOTAK000222",
            bankName: "Kotak Mahindra Bank",
            branch: "Chennai Branch",
            nickname: "Colleague"
        }
    ];

    // Load transactions - using the exact data provided
    transactions = [
        {
            id: 1,
            date: "2025-10-06",
            description: "Salary Credit",
            type: "Credit",
            amount: 85000,
            balance: 458299.50,
            reference: "SAL202510060001"
        },
        {
            id: 2,
            date: "2025-10-05",
            description: "Transfer to Manoj",
            type: "Debit", 
            amount: -15000,
            balance: 373299.50,
            reference: "TXN001234567890"
        },
        {
            id: 3,
            date: "2025-10-04",
            description: "UPI Payment - Amazon",
            type: "Debit",
            amount: -1299,
            balance: 388299.50,
            reference: "UPI202510040123"
        },
        {
            id: 4,
            date: "2025-10-03",
            description: "ATM Withdrawal",
            type: "Debit",
            amount: -5000,
            balance: 389598.50,
            reference: "ATM202510030567"
        },
        {
            id: 5,
            date: "2025-10-02",
            description: "Interest Credit",
            type: "Credit",
            amount: 425.75,
            balance: 394598.50,
            reference: "INT202510020001"
        }
    ];

    filteredTransactions = [...transactions];
    
    console.log('Mock data loaded successfully');
    console.log('Beneficiaries loaded:', beneficiaries.length);
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form - CRITICAL: Make sure this event listener is attached correctly
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener attached');
    } else {
        console.error('Login form not found!');
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            console.log('Navigating to page:', page);
            navigateToPage(page);
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Profile management
    setupProfileEventListeners();
    
    // Statements functionality
    setupStatementsEventListeners();
    
    // Transfers functionality
    setupTransfersEventListeners();
    
    // Beneficiaries management
    setupBeneficiariesEventListeners();
    
    // Modal handlers
    setupModalEventListeners();
    
    console.log('Event listeners setup completed');
}

// Login/Logout Functions
function handleLogin(e) {
    console.log('Login form submitted');
    e.preventDefault();
    
    const customerId = document.getElementById('customerId').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    console.log('Login attempt with Customer ID:', customerId, 'PIN:', pin);
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate inputs
    let hasErrors = false;
    
    if (!customerId) {
        showFieldError('customerIdError', 'Customer ID is required');
        hasErrors = true;
    } else if (customerId !== LOGIN_CREDENTIALS.customerId) {
        showFieldError('customerIdError', 'Invalid Customer ID. Use 123456 for demo.');
        hasErrors = true;
    }
    
    if (!pin) {
        showFieldError('pinError', 'PIN is required');
        hasErrors = true;
    } else if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showFieldError('pinError', 'PIN must be 4 digits');
        hasErrors = true;
    } else if (pin !== LOGIN_CREDENTIALS.pin) {
        showFieldError('pinError', 'Invalid PIN. Use 1234 for demo.');
        hasErrors = true;
    }
    
    if (hasErrors) {
        console.log('Login validation failed');
        return;
    }
    
    console.log('Login validation passed, showing loading...');
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        console.log('Processing login...');
        hideLoading();
        
        // Check credentials exactly
        if (customerId === LOGIN_CREDENTIALS.customerId && pin === LOGIN_CREDENTIALS.pin) {
            console.log('Login successful!');
            showMainApp();
            showNotification('Login successful! Welcome to OneBank.', 'success');
        } else {
            console.log('Login failed - invalid credentials');
            showFieldError('pinError', 'Invalid credentials. Use Customer ID: 123456 and PIN: 1234');
        }
    }, 1000);
}

function handleLogout() {
    console.log('Logging out...');
    showLoginPage();
    // Reset form
    loginForm.reset();
    clearFormErrors();
    showNotification('Logged out successfully', 'info');
}

function showLoginPage() {
    console.log('Showing login page');
    loginPage.classList.add('active');
    loginPage.classList.remove('hidden');
    mainApp.classList.add('hidden');
    mainApp.classList.remove('active');
}

function showMainApp() {
    console.log('Showing main app');
    loginPage.classList.remove('active');
    loginPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
    mainApp.classList.add('active');
    
    // Initialize dashboard data
    populateRecentTransactions();
    renderBeneficiaries();
    renderTransactionsTable();
    updateStatementsSummary();
    updateDashboardStats();
    
    // Set default date range for statements
    setDefaultDateRange();
    
    // CRITICAL FIX: Populate beneficiary select immediately after main app is shown
    setTimeout(() => {
        populateBeneficiarySelect();
        console.log('Beneficiary select populated after main app load');
    }, 100);
    
    // Navigate to dashboard
    navigateToPage('dashboard');
    
    console.log('Main app initialized');
}

// Navigation Functions
function navigateToPage(pageName) {
    console.log('Navigating to page:', pageName);
    
    // Update navigation
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === pageName);
    });
    
    // Update content pages
    contentPages.forEach(page => {
        if (page.id === pageName + 'Page') {
            page.classList.add('active');
            page.classList.remove('hidden');
        } else {
            page.classList.remove('active');
            page.classList.add('hidden');
        }
    });
    
    // Update breadcrumbs
    updateBreadcrumbs(pageName);
    
    // Page-specific initialization
    switch(pageName) {
        case 'statements':
            renderTransactionsTable();
            updateStatementsSummary();
            setDefaultDateRange();
            break;
        case 'beneficiaries':
            renderBeneficiaries();
            break;
        case 'transfers':
            // CRITICAL FIX: Always populate beneficiary select when navigating to transfers
            setTimeout(() => {
                populateBeneficiarySelect();
                console.log('Beneficiary select populated on transfers page navigation');
            }, 50);
            break;
    }
}

function updateBreadcrumbs(pageName) {
    const pageNames = {
        'dashboard': 'Dashboard',
        'profile': 'Profile Management',
        'statements': 'Account Statements',
        'transfers': 'Money Transfer',
        'beneficiaries': 'Manage Beneficiaries',
        'success': 'Transfer Successful'
    };
    
    breadcrumbs.innerHTML = `
        <span class="breadcrumb-item">Home</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item active">${pageNames[pageName] || 'Dashboard'}</span>
    `;
}

// Dashboard Functions
function updateDashboardStats() {
    const credits = transactions.filter(t => t.type === 'Credit');
    const debits = transactions.filter(t => t.type === 'Debit');
    
    const totalCredits = credits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDebits = debits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    document.getElementById('totalTransactions').textContent = transactions.length;
    document.getElementById('totalCredits').textContent = formatCurrency(totalCredits);
    document.getElementById('totalDebits').textContent = formatCurrency(totalDebits);
    document.getElementById('totalBeneficiaries').textContent = beneficiaries.length;
}

// Profile Management Functions
function setupProfileEventListeners() {
    // Profile tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.getAttribute('data-tab');
            switchProfileTab(tab);
        });
    });
    
    // Edit profile
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileForm = document.getElementById('profileForm');
    const uploadBtn = document.getElementById('uploadPicBtn');
    const changePassBtn = document.getElementById('changePasswordBtn');
    const prefForm = document.getElementById('preferencesForm');
    
    if (editBtn) editBtn.addEventListener('click', enableProfileEdit);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelProfileEdit);
    if (profileForm) profileForm.addEventListener('submit', saveProfile);
    if (uploadBtn) uploadBtn.addEventListener('click', () => {
        showNotification('Profile picture upload feature coming soon!', 'info');
    });
    if (changePassBtn) changePassBtn.addEventListener('click', () => {
        showModal('changePasswordModal');
    });
    if (prefForm) prefForm.addEventListener('submit', savePreferences);
}

function switchProfileTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === tabName + 'Tab') {
            content.classList.add('active');
            content.classList.remove('hidden');
        } else {
            content.classList.remove('active');
            content.classList.add('hidden');
        }
    });
}

function enableProfileEdit() {
    const formElements = ['fullName', 'email', 'phone', 'address'];
    formElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.removeAttribute('readonly');
    });
    
    const editBtn = document.getElementById('editProfileBtn');
    const actions = document.getElementById('profileFormActions');
    if (editBtn) editBtn.classList.add('hidden');
    if (actions) actions.classList.remove('hidden');
}

function cancelProfileEdit() {
    const formElements = ['fullName', 'email', 'phone', 'address'];
    formElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('readonly', true);
            // Reset to original values
            switch(id) {
                case 'fullName':
                    element.value = currentUser.accountHolderName;
                    break;
                case 'email':
                    element.value = currentUser.email;
                    break;
                case 'phone':
                    element.value = currentUser.phone;
                    break;
                case 'address':
                    element.value = currentUser.address;
                    break;
            }
        }
    });
    
    const editBtn = document.getElementById('editProfileBtn');
    const actions = document.getElementById('profileFormActions');
    if (editBtn) editBtn.classList.remove('hidden');
    if (actions) actions.classList.add('hidden');
}

function saveProfile(e) {
    e.preventDefault();
    showLoading();
    
    setTimeout(() => {
        // Update user data
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        
        if (fullName) currentUser.accountHolderName = fullName.value;
        if (email) currentUser.email = email.value;
        if (phone) currentUser.phone = phone.value;
        if (address) currentUser.address = address.value;
        
        // Update UI
        if (userName) userName.textContent = currentUser.accountHolderName;
        
        // Disable editing
        cancelProfileEdit();
        
        hideLoading();
        showNotification('Profile updated successfully!', 'success');
    }, 1000);
}

function savePreferences(e) {
    e.preventDefault();
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification('Preferences saved successfully!', 'success');
    }, 1000);
}

// Statements Functions
function setupStatementsEventListeners() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const searchInput = document.getElementById('transactionSearch');
    const sortSelect = document.getElementById('sortBy');
    const periodSelect = document.getElementById('statementPeriod');
    
    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (searchInput) searchInput.addEventListener('input', searchTransactions);
    if (sortSelect) sortSelect.addEventListener('change', sortTransactions);
    if (periodSelect) periodSelect.addEventListener('change', handlePeriodChange);
    
    // Export buttons
    const pdfBtn = document.getElementById('downloadPdfBtn');
    const excelBtn = document.getElementById('exportExcelBtn');
    
    if (pdfBtn) pdfBtn.addEventListener('click', () => downloadStatement('pdf'));
    if (excelBtn) excelBtn.addEventListener('click', () => downloadStatement('excel'));
}

function setDefaultDateRange() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (fromDate) fromDate.value = oneMonthAgo.toISOString().split('T')[0];
    if (toDate) toDate.value = today.toISOString().split('T')[0];
}

function handlePeriodChange() {
    const period = document.getElementById('statementPeriod').value;
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (period !== 'custom' && fromDate && toDate) {
        const today = new Date();
        let startDate = new Date();
        
        switch(period) {
            case '1month':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(today.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(today.getMonth() - 6);
                break;
            case '1year':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
        }
        
        fromDate.value = startDate.toISOString().split('T')[0];
        toDate.value = today.toISOString().split('T')[0];
    }
}

function applyFilters() {
    let filtered = [...transactions];
    
    const fromDateEl = document.getElementById('fromDate');
    const toDateEl = document.getElementById('toDate');
    const typeEl = document.getElementById('transactionType');
    const minAmountEl = document.getElementById('minAmount');
    const maxAmountEl = document.getElementById('maxAmount');
    
    const fromDate = fromDateEl ? fromDateEl.value : '';
    const toDate = toDateEl ? toDateEl.value : '';
    const transactionType = typeEl ? typeEl.value : '';
    const minAmount = minAmountEl ? parseFloat(minAmountEl.value) || 0 : 0;
    const maxAmount = maxAmountEl ? parseFloat(maxAmountEl.value) || Infinity : Infinity;
    
    // Filter by date range
    if (fromDate) {
        filtered = filtered.filter(t => t.date >= fromDate);
    }
    if (toDate) {
        filtered = filtered.filter(t => t.date <= toDate);
    }
    
    // Filter by transaction type
    if (transactionType) {
        filtered = filtered.filter(t => t.type === transactionType);
    }
    
    // Filter by amount range
    filtered = filtered.filter(t => {
        const amount = Math.abs(t.amount);
        return amount >= minAmount && amount <= maxAmount;
    });
    
    filteredTransactions = filtered;
    renderTransactionsTable();
    updateStatementsSummary();
    
    showNotification(`Found ${filtered.length} transactions matching your criteria`, 'success');
}

function resetFilters() {
    const elements = [
        'statementPeriod', 'fromDate', 'toDate', 'transactionType', 
        'minAmount', 'maxAmount', 'transactionSearch'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const periodEl = document.getElementById('statementPeriod');
    if (periodEl) periodEl.value = '1month';
    
    filteredTransactions = [...transactions];
    renderTransactionsTable();
    updateStatementsSummary();
    setDefaultDateRange();
    
    showNotification('Filters reset', 'info');
}

function searchTransactions() {
    const searchEl = document.getElementById('transactionSearch');
    const searchTerm = searchEl ? searchEl.value.toLowerCase() : '';
    
    if (!searchTerm) {
        filteredTransactions = [...transactions];
    } else {
        filteredTransactions = transactions.filter(t => 
            t.description.toLowerCase().includes(searchTerm) ||
            t.reference.toLowerCase().includes(searchTerm)
        );
    }
    
    renderTransactionsTable();
    updateStatementsSummary();
}

function sortTransactions() {
    const sortEl = document.getElementById('sortBy');
    const sortBy = sortEl ? sortEl.value : 'date-desc';
    
    filteredTransactions.sort((a, b) => {
        switch(sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return Math.abs(b.amount) - Math.abs(a.amount);
            case 'amount-asc':
                return Math.abs(a.amount) - Math.abs(b.amount);
            default:
                return 0;
        }
    });
    
    renderTransactionsTable();
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredTransactions.map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td><span class="status status--${transaction.type.toLowerCase() === 'credit' ? 'success' : 'error'}">${transaction.type}</span></td>
            <td class="amount ${transaction.type.toLowerCase()}">${formatCurrency(transaction.amount)}</td>
            <td>${formatCurrency(transaction.balance)}</td>
            <td class="detail-value">${transaction.reference}</td>
        </tr>
    `).join('');
}

function updateStatementsSummary() {
    const credits = filteredTransactions.filter(t => t.type === 'Credit');
    const debits = filteredTransactions.filter(t => t.type === 'Debit');
    
    const totalCredits = credits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDebits = debits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netAmount = totalCredits - totalDebits;
    
    const creditsEl = document.getElementById('totalCreditsSum');
    const debitsEl = document.getElementById('totalDebitsSum');
    const netEl = document.getElementById('netAmount');
    const countEl = document.getElementById('transactionCount');
    
    if (creditsEl) creditsEl.textContent = formatCurrency(totalCredits);
    if (debitsEl) debitsEl.textContent = formatCurrency(totalDebits);
    if (netEl) netEl.textContent = formatCurrency(netAmount);
    if (countEl) countEl.textContent = filteredTransactions.length;
}

function downloadStatement(format) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification(`Statement downloaded as ${format.toUpperCase()}`, 'success');
    }, 2000);
}

// Transfers Functions
function setupTransfersEventListeners() {
    // Transfer option buttons
    document.querySelectorAll('.transfer-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const option = e.currentTarget.getAttribute('data-option');
            switchTransferOption(option);
        });
    });
    
    // Transfer forms
    const existingForm = document.getElementById('existingTransferForm');
    const newForm = document.getElementById('newTransferForm');
    
    if (existingForm) existingForm.addEventListener('submit', handleExistingTransfer);
    if (newForm) newForm.addEventListener('submit', handleNewTransfer);
    
    // Transfer password confirmation
    const confirmBtn = document.getElementById('confirmTransferBtn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmTransfer);
}

function switchTransferOption(option) {
    // Update option buttons
    document.querySelectorAll('.transfer-option-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-option') === option);
    });
    
    // Update form containers
    document.querySelectorAll('.transfer-form-container').forEach(container => {
        if (container.id === option + 'Transfer') {
            container.classList.add('active');
            container.classList.remove('hidden');
        } else {
            container.classList.remove('active');
            container.classList.add('hidden');
        }
    });
    
    // Re-populate beneficiary select when switching to existing transfer
    if (option === 'existing') {
        setTimeout(() => {
            populateBeneficiarySelect();
            console.log('Beneficiary select populated after switching to existing transfer');
        }, 50);
    }
}

function populateBeneficiarySelect() {
    const select = document.getElementById('beneficiarySelect');
    console.log('Attempting to populate beneficiary select...');
    console.log('Select element found:', !!select);
    console.log('Number of beneficiaries:', beneficiaries.length);
    
    if (!select) {
        console.error('Beneficiary select element not found!');
        return;
    }
    
    if (beneficiaries.length === 0) {
        console.warn('No beneficiaries to populate');
        select.innerHTML = '<option value="">No beneficiaries found</option>';
        return;
    }
    
    // Clear and populate select options
    select.innerHTML = '<option value="">Choose beneficiary...</option>';
    
    beneficiaries.forEach(beneficiary => {
        const option = document.createElement('option');
        option.value = beneficiary.id;
        option.textContent = `${beneficiary.name} (${beneficiary.nickname})`;
        select.appendChild(option);
    });
    
    console.log('Beneficiary select populated with', beneficiaries.length, 'options');
    console.log('Select innerHTML after population:', select.innerHTML.substring(0, 100) + '...');
}

function handleExistingTransfer(e) {
    e.preventDefault();
    
    const beneficiaryIdEl = document.getElementById('beneficiarySelect');
    const amountEl = document.getElementById('existingAmount');
    const modeEl = document.getElementById('existingTransferMode');
    const remarksEl = document.getElementById('existingRemarks');
    
    const beneficiaryId = beneficiaryIdEl ? beneficiaryIdEl.value : '';
    const amount = amountEl ? parseFloat(amountEl.value) : 0;
    const mode = modeEl ? modeEl.value : '';
    const remarks = remarksEl ? remarksEl.value : '';
    
    console.log('Transfer attempt - Beneficiary ID:', beneficiaryId, 'Amount:', amount);
    
    if (!beneficiaryId || !amount || amount <= 0) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (amount > currentUser.availableBalance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    const beneficiary = beneficiaries.find(b => b.id == beneficiaryId);
    if (!beneficiary) {
        showNotification('Beneficiary not found', 'error');
        return;
    }
    
    // Store transfer details
    pendingTransfer = {
        type: 'existing',
        amount,
        recipient: beneficiary,
        mode,
        remarks
    };
    
    // Show transfer confirmation modal
    showTransferConfirmation();
}

function handleNewTransfer(e) {
    e.preventDefault();
    
    const nameEl = document.getElementById('newBeneficiaryName');
    const accountEl = document.getElementById('newAccountNumber');
    const ifscEl = document.getElementById('newIfscCode');
    const bankEl = document.getElementById('newBankName');
    const amountEl = document.getElementById('newAmount');
    const modeEl = document.getElementById('newTransferMode');
    const remarksEl = document.getElementById('newRemarks');
    const addBeneficiaryEl = document.getElementById('addToBeneficiaries');
    
    const name = nameEl ? nameEl.value.trim() : '';
    const accountNumber = accountEl ? accountEl.value.trim() : '';
    const ifscCode = ifscEl ? ifscEl.value.trim() : '';
    const bankName = bankEl ? bankEl.value.trim() : '';
    const amount = amountEl ? parseFloat(amountEl.value) : 0;
    const mode = modeEl ? modeEl.value : '';
    const remarks = remarksEl ? remarksEl.value : '';
    const addToBeneficiaries = addBeneficiaryEl ? addBeneficiaryEl.checked : false;
    
    if (!name || !accountNumber || !ifscCode || !bankName || !amount || amount <= 0) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (amount > currentUser.availableBalance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    const recipient = { name, accountNumber, ifscCode, bankName };
    
    // Store transfer details
    pendingTransfer = {
        type: 'new',
        amount,
        recipient,
        mode,
        remarks,
        addToBeneficiaries
    };
    
    // Show transfer confirmation modal
    showTransferConfirmation();
}

function showTransferConfirmation() {
    if (!pendingTransfer) return;
    
    const summary = document.getElementById('transferSummary');
    if (summary) {
        summary.innerHTML = `
            <div class="transfer-summary">
                <h4>Transfer Details</h4>
                <div class="summary-row">
                    <span>To:</span>
                    <span>${pendingTransfer.recipient.name}</span>
                </div>
                <div class="summary-row">
                    <span>Amount:</span>
                    <span>${formatCurrency(pendingTransfer.amount)}</span>
                </div>
                <div class="summary-row">
                    <span>Mode:</span>
                    <span>${pendingTransfer.mode}</span>
                </div>
                ${pendingTransfer.remarks ? `
                <div class="summary-row">
                    <span>Remarks:</span>
                    <span>${pendingTransfer.remarks}</span>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    // Clear previous password
    const passwordEl = document.getElementById('transferPassword');
    if (passwordEl) passwordEl.value = '';
    
    // Clear any previous error
    const errorEl = document.getElementById('transferPasswordError');
    if (errorEl) errorEl.textContent = '';
    
    showModal('transferPasswordModal');
}

function confirmTransfer() {
    const passwordEl = document.getElementById('transferPassword');
    const password = passwordEl ? passwordEl.value.trim() : '';
    
    // Clear previous error
    const errorEl = document.getElementById('transferPasswordError');
    if (errorEl) errorEl.textContent = '';
    
    if (!password) {
        if (errorEl) errorEl.textContent = 'Transfer password is required';
        return;
    }
    
    if (password !== LOGIN_CREDENTIALS.transferPassword) {
        if (errorEl) errorEl.textContent = 'Invalid transfer password. Use mypassword123 for demo.';
        return;
    }
    
    // Hide modal and process transfer
    hideModal('transferPasswordModal');
    processTransfer();
}

function processTransfer() {
    if (!pendingTransfer) return;
    
    showLoading();
    
    setTimeout(() => {
        // Update balance
        currentUser.availableBalance -= pendingTransfer.amount;
        const balanceEl = document.getElementById('availableBalance');
        if (balanceEl) balanceEl.textContent = formatCurrency(currentUser.availableBalance);
        
        // Add transaction record
        const newTransaction = {
            id: transactions.length + 1,
            date: new Date().toISOString().split('T')[0],
            description: `Transfer to ${pendingTransfer.recipient.name}`,
            type: 'Debit',
            amount: -pendingTransfer.amount,
            balance: currentUser.availableBalance,
            reference: `TXN${Date.now()}`
        };
        
        transactions.unshift(newTransaction);
        filteredTransactions = [...transactions];
        
        // Add to beneficiaries if requested
        if (pendingTransfer.type === 'new' && pendingTransfer.addToBeneficiaries) {
            addNewBeneficiary({
                name: pendingTransfer.recipient.name,
                accountNumber: pendingTransfer.recipient.accountNumber,
                ifscCode: pendingTransfer.recipient.ifscCode,
                bankName: pendingTransfer.recipient.bankName,
                branch: 'Unknown',
                nickname: ''
            });
        }
        
        // Update displays
        populateRecentTransactions();
        renderTransactionsTable();
        updateStatementsSummary();
        updateDashboardStats();
        
        // Reset forms
        const existingForm = document.getElementById('existingTransferForm');
        const newForm = document.getElementById('newTransferForm');
        if (existingForm) existingForm.reset();
        if (newForm) newForm.reset();
        
        hideLoading();
        
        // Show success page
        showSuccessPage();
    }, 2000);
}

function showSuccessPage() {
    if (!pendingTransfer) return;
    
    const successDetails = document.getElementById('successDetails');
    if (successDetails) {
        successDetails.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Transfer Amount:</span>
                <span class="detail-value">${formatCurrency(pendingTransfer.amount)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">To:</span>
                <span class="detail-value">${pendingTransfer.recipient.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Account Number:</span>
                <span class="detail-value">****${pendingTransfer.recipient.accountNumber.slice(-4)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Transfer Mode:</span>
                <span class="detail-value">${pendingTransfer.mode}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reference Number:</span>
                <span class="detail-value">TXN${Date.now()}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status status--success">Completed</span>
            </div>
        `;
    }
    
    // Setup success page action buttons
    document.querySelectorAll('.success-actions [data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.currentTarget.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    navigateToPage('success');
    
    // Clear pending transfer
    pendingTransfer = null;
}

// Beneficiaries Functions
function setupBeneficiariesEventListeners() {
    const addBtn = document.getElementById('addBeneficiaryBtn');
    const beneficiaryForm = document.getElementById('beneficiaryForm');
    
    if (addBtn) addBtn.addEventListener('click', () => openBeneficiaryModal());
    if (beneficiaryForm) beneficiaryForm.addEventListener('submit', saveBeneficiary);
}

function renderBeneficiaries() {
    const grid = document.getElementById('beneficiariesGrid');
    if (!grid) return;
    
    if (beneficiaries.length === 0) {
        grid.innerHTML = '<p>No beneficiaries found. Add your first beneficiary to get started.</p>';
        return;
    }
    
    grid.innerHTML = beneficiaries.map(beneficiary => `
        <div class="beneficiary-card">
            <div class="beneficiary-header">
                <div class="beneficiary-info">
                    <h3>${beneficiary.name}</h3>
                    <p class="beneficiary-nickname">${beneficiary.nickname || 'No nickname'}</p>
                </div>
                <div class="beneficiary-actions">
                    <button class="icon-btn" onclick="editBeneficiary(${beneficiary.id})" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="icon-btn" onclick="deleteBeneficiary(${beneficiary.id})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="beneficiary-details">
                <div class="detail-row">
                    <span class="detail-label">Account Number</span>
                    <span class="detail-value">****${beneficiary.accountNumber.slice(-4)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">IFSC Code</span>
                    <span class="detail-value">${beneficiary.ifscCode}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Bank</span>
                    <span class="detail-value">${beneficiary.bankName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Branch</span>
                    <span class="detail-value">${beneficiary.branch}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function openBeneficiaryModal(beneficiary = null) {
    const modal = document.getElementById('beneficiaryModal');
    const title = document.getElementById('beneficiaryModalTitle');
    const form = document.getElementById('beneficiaryForm');
    
    if (!modal || !form) return;
    
    if (beneficiary) {
        if (title) title.textContent = 'Edit Beneficiary';
        
        const fields = [
            'beneficiaryId', 'beneficiaryName', 'beneficiaryNickname', 
            'beneficiaryAccount', 'beneficiaryIfsc', 'beneficiaryBank', 'beneficiaryBranch'
        ];
        
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                switch(fieldId) {
                    case 'beneficiaryId':
                        element.value = beneficiary.id;
                        break;
                    case 'beneficiaryName':
                        element.value = beneficiary.name;
                        break;
                    case 'beneficiaryNickname':
                        element.value = beneficiary.nickname || '';
                        break;
                    case 'beneficiaryAccount':
                        element.value = beneficiary.accountNumber;
                        break;
                    case 'beneficiaryIfsc':
                        element.value = beneficiary.ifscCode;
                        break;
                    case 'beneficiaryBank':
                        element.value = beneficiary.bankName;
                        break;
                    case 'beneficiaryBranch':
                        element.value = beneficiary.branch;
                        break;
                }
            }
        });
    } else {
        if (title) title.textContent = 'Add New Beneficiary';
        form.reset();
        const idField = document.getElementById('beneficiaryId');
        if (idField) idField.value = '';
    }
    
    showModal('beneficiaryModal');
}

function editBeneficiary(id) {
    const beneficiary = beneficiaries.find(b => b.id === id);
    if (beneficiary) {
        openBeneficiaryModal(beneficiary);
    }
}

function deleteBeneficiary(id) {
    const beneficiary = beneficiaries.find(b => b.id === id);
    if (beneficiary) {
        showConfirmation(
            'Delete Beneficiary',
            `Are you sure you want to delete ${beneficiary.name}?`,
            () => {
                beneficiaries = beneficiaries.filter(b => b.id !== id);
                renderBeneficiaries();
                populateBeneficiarySelect();
                updateDashboardStats();
                showNotification('Beneficiary deleted successfully', 'success');
            }
        );
    }
}

function saveBeneficiary(e) {
    e.preventDefault();
    
    const fields = {
        id: document.getElementById('beneficiaryId'),
        name: document.getElementById('beneficiaryName'),
        nickname: document.getElementById('beneficiaryNickname'),
        accountNumber: document.getElementById('beneficiaryAccount'),
        ifscCode: document.getElementById('beneficiaryIfsc'),
        bankName: document.getElementById('beneficiaryBank'),
        branch: document.getElementById('beneficiaryBranch')
    };
    
    const values = {};
    let hasError = false;
    
    Object.keys(fields).forEach(key => {
        if (fields[key]) {
            values[key] = fields[key].value.trim();
        } else {
            hasError = true;
        }
    });
    
    if (hasError || !values.name || !values.accountNumber || !values.ifscCode || !values.bankName || !values.branch) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        if (values.id) {
            // Edit existing beneficiary
            const index = beneficiaries.findIndex(b => b.id == values.id);
            if (index !== -1) {
                beneficiaries[index] = {
                    ...beneficiaries[index],
                    name: values.name,
                    nickname: values.nickname,
                    accountNumber: values.accountNumber,
                    ifscCode: values.ifscCode,
                    bankName: values.bankName,
                    branch: values.branch
                };
            }
        } else {
            // Add new beneficiary
            const newBeneficiary = {
                id: Math.max(...beneficiaries.map(b => b.id), 0) + 1,
                name: values.name,
                nickname: values.nickname,
                accountNumber: values.accountNumber,
                ifscCode: values.ifscCode,
                bankName: values.bankName,
                branch: values.branch
            };
            beneficiaries.push(newBeneficiary);
        }
        
        renderBeneficiaries();
        populateBeneficiarySelect();
        updateDashboardStats();
        hideModal('beneficiaryModal');
        hideLoading();
        
        showNotification(`Beneficiary ${values.id ? 'updated' : 'added'} successfully!`, 'success');
    }, 1000);
}

function addNewBeneficiary(beneficiaryData) {
    const newBeneficiary = {
        id: Math.max(...beneficiaries.map(b => b.id), 0) + 1,
        ...beneficiaryData
    };
    
    beneficiaries.push(newBeneficiary);
    renderBeneficiaries();
    populateBeneficiarySelect();
    updateDashboardStats();
    
    showNotification('Beneficiary added successfully!', 'success');
}

// Modal Functions
function setupModalEventListeners() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.currentTarget.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });
    
    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        
        // Focus first input
        const firstInput = modal.querySelector('input:not([type="hidden"])');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        
        // Reset form if it exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function showConfirmation(title, message, onConfirm) {
    const titleEl = document.getElementById('confirmationTitle');
    const messageEl = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            onConfirm();
            hideModal('confirmationModal');
        };
    }
    
    showModal('confirmationModal');
}

function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPasswordEl = document.getElementById('currentPassword');
    const newPasswordEl = document.getElementById('newPassword');
    const confirmPasswordEl = document.getElementById('confirmPassword');
    
    const currentPassword = currentPasswordEl ? currentPasswordEl.value : '';
    const newPassword = newPasswordEl ? newPasswordEl.value : '';
    const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        hideModal('changePasswordModal');
        showNotification('Password changed successfully!', 'success');
    }, 1500);
}

// Utility Functions
function populateRecentTransactions() {
    const container = document.getElementById('recentTransactionsList');
    if (!container) return;
    
    const recentTransactions = transactions.slice(0, 5);
    
    container.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${transaction.description}</h4>
                <p>${transaction.reference}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount ${transaction.type.toLowerCase()}">${formatCurrency(transaction.amount)}</span>
                <span class="date">${formatDate(transaction.date)}</span>
            </div>
        </div>
    `).join('');
}

function formatCurrency(amount) {
    return '₹' + Math.abs(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) errorElement.textContent = message;
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
}
