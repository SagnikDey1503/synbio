// Quizzicles Contest Portal - Frontend Application
class QuizziclesApp {
    constructor() {
        this.currentUser = null;
        this.socket = null;
        this.apiBase = '/api';
        this.currentPage = 'submit';
        this.questions = [];
        this.leaderboard = [];
        this.announcements = [];

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupSocketConnection();

        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await this.validateToken(token);
                this.showDashboard();
            } catch (error) {
                localStorage.removeItem('token');
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // Setup questions event listeners
        this.setupQuestionsEventListeners();
    }

    setupSocketConnection() {
        this.socket = io();

        this.socket.on('leaderboard-update', (data) => {
            this.updateLeaderboardRealtime(data);
        });

        this.socket.on('new-announcement', (announcement) => {
            this.addAnnouncementRealtime(announcement);
        });
    }

    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            errorDiv.classList.remove('show');

            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                this.currentUser = data.user;
                this.showDashboard();
            } else {
                this.showError(errorDiv, data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError(errorDiv, 'Network error. Please try again.');
        }
    }

    async validateToken(token) {
        const response = await fetch(`${this.apiBase}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            this.currentUser = await response.json();
            return true;
        } else {
            throw new Error('Invalid token');
        }
    }

    handleLogout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        this.socket?.disconnect();
        this.showLogin();
    }

    showLogin() {
        this.showPage('login-page');
    }

    showDashboard() {
        this.showPage('dashboard-page');
        this.updateUserInfo();
        this.loadDashboardData();
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.username;
            document.getElementById('team-name').textContent = this.currentUser.teamName;
            document.getElementById('user-score').textContent = this.currentUser.score;
        }
    }

    async loadDashboardData() {
        await Promise.all([
            this.loadQuestions(),
            this.loadLeaderboard(),
            this.loadAnnouncements()
        ]);
    }

    navigateTo(page) {
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show corresponding content section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${page}-section`).classList.add('active');

        this.currentPage = page;

        // Load data if needed
        if (page === 'leaderboard') {
            this.loadLeaderboard();
        } else if (page === 'announcements') {
            this.loadAnnouncements();
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch(`${this.apiBase}/contest/questions/limits`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                this.questions = await response.json();
                this.renderQuestions();
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        if (!container) return;

        container.innerHTML = '';

        for (let i = 1; i <= 30; i++) {
            const questionData = this.questions.find(q => q.id === i) || { id: i, maxAttempts: 1 };
            const questionCard = this.createQuestionCard(questionData);
            container.appendChild(questionCard);
        }
    }

    createQuestionCard(question) {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${question.id}</span>
                <span class="attempts-info">Max attempts: ${question.maxAttempts}</span>
            </div>
            <form class="question-form" data-question-id="${question.id}">
                <input 
                    type="number" 
                    class="answer-input" 
                    placeholder="Enter answer (0-9999)" 
                    min="0" 
                    max="9999" 
                    required
                >
                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i>
                    Submit Answer
                </button>
            </form>
            <div class="question-status" id="status-${question.id}"></div>
        `;

        const form = card.querySelector('.question-form');
        form.addEventListener('submit', this.handleAnswerSubmit.bind(this));

        // Load existing attempts
        this.loadQuestionAttempts(question.id);

        return card;
    }

    async loadQuestionAttempts(questionId) {
        try {
            const response = await fetch(`${this.apiBase}/contest/attempts/${questionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateQuestionStatus(questionId, data);
            }
        } catch (error) {
            console.error('Error loading question attempts:', error);
        }
    }

    updateQuestionStatus(questionId, data) {
        const statusDiv = document.getElementById(`status-${questionId}`);
        const form = document.querySelector(`[data-question-id="${questionId}"]`);
        const submitBtn = form.querySelector('.submit-btn');

        if (data.submissions.length > 0) {
            const lastSubmission = data.submissions[0];
            if (lastSubmission.isCorrect) {
                statusDiv.className = 'question-status status-correct';
                statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Correct! Points: ${lastSubmission.pointsAwarded}`;
                submitBtn.disabled = true;
            } else if (data.remainingAttempts === 0) {
                statusDiv.className = 'question-status status-no-attempts';
                statusDiv.innerHTML = `<i class="fas fa-times-circle"></i> No attempts remaining`;
                submitBtn.disabled = true;
            } else {
                statusDiv.className = 'question-status status-incorrect';
                statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Incorrect. ${data.remainingAttempts} attempts left`;
            }
        }
    }

    async handleAnswerSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const questionId = parseInt(form.dataset.questionId);
        const answerInput = form.querySelector('.answer-input');
        const answer = parseInt(answerInput.value);
        const submitBtn = form.querySelector('.submit-btn');

        if (isNaN(answer) || answer < 0 || answer > 9999) {
            this.showQuestionError(questionId, 'Please enter a valid number between 0 and 9999');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            const response = await fetch(`${this.apiBase}/contest/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ questionId, answer })
            });

            const data = await response.json();

            if (response.ok) {
                this.updateQuestionStatus(questionId, {
                    submissions: [data],
                    remainingAttempts: data.remainingAttempts
                });

                // Update user score
                this.currentUser.score = data.totalScore;
                this.updateUserInfo();

                // Clear input if correct
                if (data.isCorrect) {
                    answerInput.value = '';
                }
            } else {
                this.showQuestionError(questionId, data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
            this.showQuestionError(questionId, 'Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Answer';
        }
    }

    showQuestionError(questionId, message) {
        const statusDiv = document.getElementById(`status-${questionId}`);
        statusDiv.className = 'question-status status-incorrect';
        statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    }

    async loadLeaderboard() {
        try {
            const response = await fetch(`${this.apiBase}/leaderboard`);

            if (response.ok) {
                this.leaderboard = await response.json();
                this.renderLeaderboard();
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboard-content');
        if (!container) return;

        container.innerHTML = '';

        this.leaderboard.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';

            let rankClass = 'rank-badge';
            if (entry.rank === 1) rankClass += ' first';
            else if (entry.rank === 2) rankClass += ' second';
            else if (entry.rank === 3) rankClass += ' third';

            row.innerHTML = `
                <div class="${rankClass}">#${entry.rank}</div>
                <div class="team-name">${entry.teamName}</div>
                <div class="username">${entry.username}</div>
                <div class="score">${entry.score}</div>
            `;

            container.appendChild(row);
        });
    }

    updateLeaderboardRealtime(data) {
        // Update the leaderboard in real-time
        this.loadLeaderboard();

        // Show notification if it's for current user
        if (data.userId === this.currentUser?.id) {
            this.showSuccessMessage(`Correct answer for Question ${data.questionId}! Your score: ${data.score}`);
        }
    }

    async loadAnnouncements() {
        try {
            const response = await fetch(`${this.apiBase}/announcements`);

            if (response.ok) {
                this.announcements = await response.json();
                this.renderAnnouncements();
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }

    renderAnnouncements() {
        const container = document.getElementById('announcements-container');
        if (!container) return;

        container.innerHTML = '';

        if (this.announcements.length === 0) {
            container.innerHTML = `
                <div class="announcement-card">
                    <div class="announcement-content">
                        <i class="fas fa-info-circle"></i>
                        No announcements yet. Check back later for updates and corrections.
                    </div>
                </div>
            `;
            return;
        }

        this.announcements.forEach(announcement => {
            const card = document.createElement('div');
            card.className = `announcement-card ${announcement.type}`;

            const date = new Date(announcement.createdAt).toLocaleString();

            card.innerHTML = `
                <div class="announcement-header">
                    <div class="announcement-title">${announcement.title}</div>
                    <div class="announcement-type ${announcement.type}">${announcement.type}</div>
                </div>
                <div class="announcement-content">${announcement.content}</div>
                <div class="announcement-meta">
                    <span>By: ${announcement.authorId.username}</span>
                    <span>${date}</span>
                </div>
            `;

            container.appendChild(card);
        });
    }

    addAnnouncementRealtime(announcement) {
        this.announcements.unshift(announcement);
        this.renderAnnouncements();

        // Show notification
        this.showSuccessMessage(`New ${announcement.type} announcement: ${announcement.title}`);
    }

    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }

    showSuccessMessage(message) {
        // Create and show a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(successDiv, mainContent.firstChild);

            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    }

    setupQuestionsEventListeners() {
        // This will be called after questions are rendered
        // Additional event listeners can be added here
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizziclesApp();
});

// Public leaderboard for non-authenticated users
class PublicLeaderboard {
    constructor() {
        this.init();
    }

    async init() {
        if (window.location.pathname === '/leaderboard' || window.location.hash === '#leaderboard') {
            this.showPublicLeaderboard();
            this.startAutoRefresh();
        }
    }

    showPublicLeaderboard() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('public-leaderboard-page').classList.add('active');
        this.loadPublicLeaderboard();
    }

    async loadPublicLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');

            if (response.ok) {
                const leaderboard = await response.json();
                this.renderPublicLeaderboard(leaderboard);
            }
        } catch (error) {
            console.error('Error loading public leaderboard:', error);
        }
    }

    renderPublicLeaderboard(leaderboard) {
        const container = document.getElementById('public-leaderboard-content');
        if (!container) return;

        container.innerHTML = '';

        leaderboard.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';

            let rankClass = 'rank-badge';
            if (entry.rank === 1) rankClass += ' first';
            else if (entry.rank === 2) rankClass += ' second';
            else if (entry.rank === 3) rankClass += ' third';

            row.innerHTML = `
                <div class="${rankClass}">#${entry.rank}</div>
                <div class="team-name">${entry.teamName}</div>
                <div class="username">${entry.username}</div>
                <div class="score">${entry.score}</div>
            `;

            container.appendChild(row);
        });
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadPublicLeaderboard();
        }, 30000); // Refresh every 30 seconds
    }
}

// Initialize public leaderboard if on that page
if (window.location.pathname === '/leaderboard' || window.location.hash === '#leaderboard') {
    document.addEventListener('DOMContentLoaded', () => {
        new PublicLeaderboard();
    });
}