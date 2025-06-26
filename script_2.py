# Now create the modern, attractive frontend with improved CSS

frontend_files = {
    "public/index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quizzicles Contest Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <!-- Login Page -->
        <div id="login-page" class="page active">
            <div class="login-container">
                <div class="login-card">
                    <div class="logo-section">
                        <div class="logo">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h1>Quizzicles</h1>
                        <p>Contest Portal</p>
                    </div>
                    
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user"></i>
                                <input type="text" id="username" name="username" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password" name="password" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="login-btn">
                            <span>Sign In</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    
                    <div id="login-error" class="error-message"></div>
                </div>
            </div>
        </div>

        <!-- Dashboard Page -->
        <div id="dashboard-page" class="page">
            <nav class="navbar">
                <div class="nav-brand">
                    <i class="fas fa-brain"></i>
                    <span>Quizzicles</span>
                </div>
                
                <div class="user-info">
                    <div class="user-details">
                        <span id="user-name" class="user-name"></span>
                        <span id="team-name" class="team-name"></span>
                    </div>
                    <div class="user-score">
                        <i class="fas fa-trophy"></i>
                        <span id="user-score">0</span>
                    </div>
                    <button id="logout-btn" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </nav>

            <div class="dashboard-content">
                <div class="sidebar">
                    <div class="nav-menu">
                        <button class="nav-item active" data-page="submit">
                            <i class="fas fa-edit"></i>
                            <span>Submit Answers</span>
                        </button>
                        <button class="nav-item" data-page="leaderboard">
                            <i class="fas fa-trophy"></i>
                            <span>Leaderboard</span>
                        </button>
                        <button class="nav-item" data-page="announcements">
                            <i class="fas fa-bullhorn"></i>
                            <span>Announcements</span>
                        </button>
                        <button class="nav-item" data-page="question-paper">
                            <i class="fas fa-file-alt"></i>
                            <span>Question Paper</span>
                        </button>
                    </div>
                </div>

                <div class="main-content">
                    <!-- Submit Answers Section -->
                    <div id="submit-section" class="content-section active">
                        <div class="section-header">
                            <h2><i class="fas fa-edit"></i> Submit Your Answers</h2>
                            <p>Enter your answers below. Each question has different attempt limits.</p>
                        </div>
                        
                        <div class="questions-grid" id="questions-container">
                            <!-- Questions will be dynamically generated -->
                        </div>
                    </div>

                    <!-- Leaderboard Section -->
                    <div id="leaderboard-section" class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-trophy"></i> Live Leaderboard</h2>
                            <p>Real-time rankings updated automatically</p>
                            <div class="refresh-indicator">
                                <i class="fas fa-sync-alt"></i>
                                <span>Auto-refresh: ON</span>
                            </div>
                        </div>
                        
                        <div class="leaderboard-container">
                            <div class="leaderboard-table">
                                <div class="table-header">
                                    <div class="rank-col">Rank</div>
                                    <div class="team-col">Team</div>
                                    <div class="user-col">Username</div>
                                    <div class="score-col">Score</div>
                                </div>
                                <div id="leaderboard-content" class="table-content">
                                    <!-- Leaderboard entries will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Announcements Section -->
                    <div id="announcements-section" class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-bullhorn"></i> Announcements & Updates</h2>
                            <p>Important contest information and corrections</p>
                        </div>
                        
                        <div id="announcements-container" class="announcements-container">
                            <!-- Announcements will be populated here -->
                        </div>
                    </div>

                    <!-- Question Paper Section -->
                    <div id="question-paper-section" class="content-section">
                        <div class="section-header">
                            <h2><i class="fas fa-file-alt"></i> Question Paper</h2>
                            <p>Contest questions and problem statements</p>
                        </div>
                        
                        <div class="question-paper-container">
                            <div class="paper-notice">
                                <i class="fas fa-info-circle"></i>
                                <p>The question paper link will be provided separately by the organizers.</p>
                                <p>Keep this portal open for answer submission and updates.</p>
                            </div>
                            
                            <div class="external-links">
                                <a href="#" class="external-link" target="_blank">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>Download Question Paper (PDF)</span>
                                </a>
                                <a href="#" class="external-link" target="_blank">
                                    <i class="fas fa-globe"></i>
                                    <span>View Online Question Paper</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Public Leaderboard Page -->
        <div id="public-leaderboard-page" class="page">
            <div class="public-header">
                <div class="logo-section">
                    <div class="logo">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h1>Quizzicles Contest</h1>
                    <p>Live Leaderboard</p>
                </div>
                
                <div class="contest-info">
                    <div class="refresh-indicator">
                        <i class="fas fa-sync-alt spinning"></i>
                        <span>Live Updates</span>
                    </div>
                </div>
            </div>
            
            <div class="public-leaderboard-container">
                <div class="leaderboard-table large">
                    <div class="table-header">
                        <div class="rank-col">Rank</div>
                        <div class="team-col">Team Name</div>
                        <div class="user-col">Username</div>
                        <div class="score-col">Score</div>
                    </div>
                    <div id="public-leaderboard-content" class="table-content">
                        <!-- Public leaderboard entries -->
                    </div>
                </div>
            </div>
            
            <div class="public-footer">
                <p>Visit the contest portal to participate | Updates every 30 seconds</p>
                <a href="/" class="portal-link">
                    <i class="fas fa-sign-in-alt"></i>
                    Contest Portal
                </a>
            </div>
        </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="app.js"></script>
</body>
</html>""",

    "public/styles.css": """/* Modern CSS for Quizzicles Contest Portal */
:root {
    /* Color Palette */
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #8b5cf6;
    --secondary: #06b6d4;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Neutral Colors */
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    --gradient-secondary: linear-gradient(135deg, var(--secondary) 0%, var(--info) 100%);
    --gradient-surface: linear-gradient(135deg, var(--white) 0%, var(--gray-50) 100%);
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    
    /* Transitions */
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--gray-800);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
}

/* Page Management */
.page {
    display: none;
    min-height: 100vh;
}

.page.active {
    display: block;
}

/* Login Page */
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
}

.login-card {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    padding: 3rem 2.5rem;
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-section {
    text-align: center;
    margin-bottom: 2.5rem;
}

.logo {
    width: 80px;
    height: 80px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: var(--shadow-lg);
}

.logo i {
    font-size: 2rem;
    color: var(--white);
}

.logo-section h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
}

.logo-section p {
    color: var(--gray-600);
    font-weight: 500;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--gray-700);
}

.input-wrapper {
    position: relative;
}

.input-wrapper i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    font-size: 1rem;
}

.input-wrapper input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: var(--transition);
    background: var(--gray-50);
}

.input-wrapper input:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.login-btn {
    width: 100%;
    background: var(--gradient-primary);
    color: var(--white);
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-md);
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.login-btn:active {
    transform: translateY(0);
}

.error-message {
    color: var(--error);
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    margin-top: 1rem;
    font-size: 0.875rem;
    display: none;
}

.error-message.show {
    display: block;
}

/* Dashboard Layout */
.navbar {
    background: var(--white);
    box-shadow: var(--shadow-md);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-900);
}

.nav-brand i {
    color: var(--primary);
    font-size: 1.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.user-details {
    text-align: right;
}

.user-name {
    display: block;
    font-weight: 600;
    color: var(--gray-900);
    font-size: 0.875rem;
}

.team-name {
    display: block;
    color: var(--gray-600);
    font-size: 0.75rem;
}

.user-score {
    background: var(--gradient-primary);
    color: var(--white);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    box-shadow: var(--shadow-md);
}

.logout-btn {
    background: var(--gray-100);
    border: none;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    color: var(--gray-600);
}

.logout-btn:hover {
    background: var(--gray-200);
    color: var(--gray-800);
}

.dashboard-content {
    display: flex;
    min-height: calc(100vh - 80px);
}

.sidebar {
    width: 280px;
    background: var(--gray-50);
    border-right: 1px solid var(--gray-200);
    padding: 2rem 1rem;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav-item {
    background: transparent;
    border: none;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--gray-700);
    text-align: left;
}

.nav-item:hover {
    background: var(--gray-100);
    color: var(--gray-900);
}

.nav-item.active {
    background: var(--primary);
    color: var(--white);
}

.nav-item i {
    font-size: 1rem;
    width: 1.25rem;
}

.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.content-section {
    display: none;
}

.content-section.active {
    display: block;
}

.section-header {
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--gray-200);
    padding-bottom: 1rem;
}

.section-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.section-header p {
    color: var(--gray-600);
    margin-bottom: 1rem;
}

.refresh-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--success);
    font-size: 0.875rem;
    font-weight: 500;
}

.refresh-indicator i {
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Questions Grid */
.questions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
}

.question-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: 1.5rem;
    border: 1px solid var(--gray-200);
    transition: var(--transition);
}

.question-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.question-number {
    font-weight: 600;
    color: var(--primary);
    font-size: 1.125rem;
}

.attempts-info {
    background: var(--gray-100);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    color: var(--gray-600);
}

.question-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.answer-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: var(--transition);
}

.answer-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.submit-btn {
    background: var(--gradient-primary);
    color: var(--white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.submit-btn:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    color: var(--gray-500);
}

.question-status {
    padding: 0.5rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.5rem;
    text-align: center;
}

.status-correct {
    background: #d1fae5;
    color: var(--success);
    border: 1px solid #a7f3d0;
}

.status-incorrect {
    background: #fee2e2;
    color: var(--error);
    border: 1px solid #fecaca;
}

.status-no-attempts {
    background: #fef3c7;
    color: var(--warning);
    border: 1px solid #fde68a;
}

/* Leaderboard */
.leaderboard-container {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    border: 1px solid var(--gray-200);
}

.leaderboard-table {
    width: 100%;
}

.leaderboard-table.large {
    font-size: 1.125rem;
}

.table-header {
    background: var(--gradient-primary);
    color: var(--white);
    display: grid;
    grid-template-columns: 80px 1fr 200px 120px;
    padding: 1rem;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.table-content {
    max-height: 600px;
    overflow-y: auto;
}

.leaderboard-row {
    display: grid;
    grid-template-columns: 80px 1fr 200px 120px;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
    transition: var(--transition);
    align-items: center;
}

.leaderboard-row:hover {
    background: var(--gray-50);
}

.leaderboard-row:nth-child(odd) {
    background: rgba(99, 102, 241, 0.02);
}

.rank-badge {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--primary);
}

.rank-badge.first {
    color: #fbbf24;
}

.rank-badge.second {
    color: #9ca3af;
}

.rank-badge.third {
    color: #cd7c2f;
}

.team-name {
    font-weight: 600;
    color: var(--gray-900);
}

.username {
    color: var(--gray-600);
    font-size: 0.875rem;
}

.score {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--success);
}

/* Announcements */
.announcements-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 800px;
}

.announcement-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: 1.5rem;
    border-left: 4px solid var(--primary);
    transition: var(--transition);
}

.announcement-card:hover {
    box-shadow: var(--shadow-lg);
}

.announcement-card.urgent {
    border-left-color: var(--error);
}

.announcement-card.correction {
    border-left-color: var(--warning);
}

.announcement-header {
    display: flex;
    justify-content: between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    gap: 1rem;
}

.announcement-title {
    font-weight: 600;
    color: var(--gray-900);
    font-size: 1.125rem;
    flex: 1;
}

.announcement-type {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.announcement-type.general {
    background: var(--gray-100);
    color: var(--gray-700);
}

.announcement-type.urgent {
    background: #fee2e2;
    color: var(--error);
}

.announcement-type.correction {
    background: #fef3c7;
    color: var(--warning);
}

.announcement-content {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: 0.75rem;
}

.announcement-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--gray-500);
    border-top: 1px solid var(--gray-200);
    padding-top: 0.75rem;
}

/* Question Paper */
.question-paper-container {
    max-width: 600px;
}

.paper-notice {
    background: var(--info);
    color: var(--white);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    margin-bottom: 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.paper-notice i {
    font-size: 1.25rem;
    margin-top: 0.125rem;
}

.paper-notice p {
    margin-bottom: 0.5rem;
}

.paper-notice p:last-child {
    margin-bottom: 0;
}

.external-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.external-link {
    background: var(--white);
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 1rem 1.5rem;
    text-decoration: none;
    color: var(--gray-800);
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 500;
}

.external-link:hover {
    border-color: var(--primary);
    background: var(--gray-50);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.external-link i {
    color: var(--primary);
    font-size: 1.25rem;
}

/* Public Leaderboard */
.public-header {
    background: var(--gradient-primary);
    color: var(--white);
    padding: 3rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.public-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(255,255,255,.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>');
    opacity: 0.1;
}

.public-header .logo-section {
    position: relative;
    z-index: 2;
}

.public-header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.public-header p {
    font-size: 1.25rem;
    opacity: 0.9;
}

.contest-info {
    position: absolute;
    top: 2rem;
    right: 2rem;
    z-index: 2;
}

.public-leaderboard-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.public-footer {
    background: var(--gray-900);
    color: var(--white);
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.portal-link {
    background: var(--primary);
    color: var(--white);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.portal-link:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-content {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        order: 2;
        padding: 1rem;
    }
    
    .nav-menu {
        flex-direction: row;
        overflow-x: auto;
        gap: 0.5rem;
    }
    
    .nav-item {
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .main-content {
        order: 1;
        padding: 1rem;
    }
    
    .questions-grid {
        grid-template-columns: 1fr;
    }
    
    .table-header,
    .leaderboard-row {
        grid-template-columns: 60px 1fr 100px;
    }
    
    .user-col {
        display: none;
    }
    
    .navbar {
        padding: 1rem;
    }
    
    .user-info {
        gap: 1rem;
    }
    
    .user-details {
        display: none;
    }
    
    .public-header h1 {
        font-size: 2rem;
    }
    
    .public-header p {
        font-size: 1rem;
    }
    
    .contest-info {
        position: static;
        margin-top: 1rem;
    }
}

@media (max-width: 480px) {
    .login-card {
        padding: 2rem 1.5rem;
        margin: 1rem;
    }
    
    .public-leaderboard-container {
        padding: 1rem;
    }
    
    .announcement-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}

/* Loading States */
.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--gray-500);
}

.loading i {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
}

/* Success/Error States */
.success-message {
    background: #d1fae5;
    color: var(--success);
    border: 1px solid #a7f3d0;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.spinning {
    animation: spin 2s linear infinite;
}

/* Custom Scrollbar */
.table-content::-webkit-scrollbar {
    width: 6px;
}

.table-content::-webkit-scrollbar-track {
    background: var(--gray-100);
}

.table-content::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 3px;
}

.table-content::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
}""",

    "public/app.js": """// Quizzicles Contest Portal - Frontend Application
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
}"""
}

# Create public directory and files
import os
os.makedirs('public', exist_ok=True)

for filename, content in frontend_files.items():
    with open(filename, 'w') as f:
        f.write(content)

print("✅ Modern frontend with improved CSS created successfully!")
print("\nCreated files:")
for filename in frontend_files.keys():
    print(f"  - {filename}")