/**
 * Enterprise AI & MLOps Academy - Personal Learning Tracker
 * Main Application File
 * 
 * Architecture:
 * - Modular class-based design
 * - Single Responsibility Principle
 * - Event-driven state management
 * - Local Storage persistence
 * - Dynamic DOM rendering
 */

// =====================================================
// CONSTANTS
// =====================================================
const TOTAL_LEARNING_DAYS = 200;
const ACHIEVEMENTS = [
    { day: 7, title: 'AI Explorer', emoji: '🤖', description: 'Completed 7 learning days' },
    { day: 42, title: 'Python Engineer', emoji: '🐍', description: 'Completed 42 learning days' },
    { day: 70, title: 'SQL Engineer', emoji: '🗄️', description: 'Completed 70 learning days' },
    { day: 100, title: 'Machine Learning Engineer', emoji: '🧠', description: 'Completed 100 learning days' },
    { day: 140, title: 'Docker Engineer', emoji: '🐳', description: 'Completed 140 learning days' },
    { day: 160, title: 'Kubernetes Engineer', emoji: '☸️', description: 'Completed 160 learning days' },
    { day: 180, title: 'GenAI Engineer', emoji: '✨', description: 'Completed 180 learning days' },
    { day: 200, title: 'Enterprise AI & MLOps Engineer', emoji: '🏆', description: 'Completed all 200 learning days' }
];

// =====================================================
// UTILITIES
// =====================================================

/**
 * Utility functions for common operations
 */
class Utils {
    /**
     * Parse JSON safely and return null on error
     */
    static parseJSON(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON Parse Error:', error);
            return null;
        }
    }

    /**
     * Format date as readable string
     */
    static formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Get element safely
     */
    static getElement(selector) {
        return document.querySelector(selector);
    }

    /**
     * Get all elements matching selector
     */
    static getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Create element with optional attributes
     */
    static createElement(tag, attributes = {}, text = '') {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        if (text) element.textContent = text;
        return element;
    }

    /**
     * Calculate percentage
     */
    static calculatePercentage(current, total) {
        return Math.round((current / total) * 100);
    }

    /**
     * Estimate completion date based on completion rate
     */
    static estimateCompletionDate(completedDays) {
        if (completedDays === 0) return 'Not started';
        const now = new Date();
        const daysRemaining = TOTAL_LEARNING_DAYS - completedDays;
        const completionDate = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
        return this.formatDate(completionDate);
    }

    /**
     * Calculate streak from completion array
     */
    static calculateCurrentStreak(completedDays) {
        if (completedDays.length === 0) return 0;
        
        completedDays.sort((a, b) => a - b);
        let streak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < completedDays.length; i++) {
            if (completedDays[i] === completedDays[i - 1] + 1) {
                currentStreak++;
                streak = Math.max(streak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        return streak;
    }

    /**
     * Show confirmation dialog
     */
    static confirm(message) {
        return window.confirm(message);
    }

    /**
     * Show alert message
     */
    static alert(message) {
        window.alert(message);
    }
}

// =====================================================
// STORAGE MANAGER
// =====================================================

/**
 * Manages Local Storage operations
 * Handles persistence of progress, settings, and achievements
 */
class StorageManager {
    constructor() {
        this.prefix = 'mlops-academy-';
        this.keys = {
            completedDays: this.prefix + 'completed-days',
            currentModule: this.prefix + 'current-module',
            currentWeek: this.prefix + 'current-week',
            currentDay: this.prefix + 'current-day',
            settings: this.prefix + 'settings',
            achievements: this.prefix + 'achievements',
            lastUpdated: this.prefix + 'last-updated',
            currentStreak: this.prefix + 'current-streak',
            longestStreak: this.prefix + 'longest-streak'
        };
    }

    /**
     * Check if Local Storage is available
     */
    isAvailable() {
        try {
            const test = '__storage-test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('Local Storage unavailable:', error);
            return false;
        }
    }

    /**
     * Save completed days
     */
    saveCompletedDays(days) {
        if (!this.isAvailable()) return false;
        localStorage.setItem(this.keys.completedDays, JSON.stringify(days));
        localStorage.setItem(this.keys.lastUpdated, new Date().toISOString());
        return true;
    }

    /**
     * Load completed days
     */
    loadCompletedDays() {
        if (!this.isAvailable()) return [];
        const data = localStorage.getItem(this.keys.completedDays);
        return data ? Utils.parseJSON(data) || [] : [];
    }

    /**
     * Save current position
     */
    savePosition(module, week, day) {
        if (!this.isAvailable()) return false;
        localStorage.setItem(this.keys.currentModule, JSON.stringify(module));
        localStorage.setItem(this.keys.currentWeek, JSON.stringify(week));
        localStorage.setItem(this.keys.currentDay, JSON.stringify(day));
        return true;
    }

    /**
     * Load current position
     */
    loadPosition() {
        if (!this.isAvailable()) return null;
        return {
            module: Utils.parseJSON(localStorage.getItem(this.keys.currentModule)) || null,
            week: Utils.parseJSON(localStorage.getItem(this.keys.currentWeek)) || null,
            day: Utils.parseJSON(localStorage.getItem(this.keys.currentDay)) || 1
        };
    }

    /**
     * Save settings
     */
    saveSettings(settings) {
        if (!this.isAvailable()) return false;
        localStorage.setItem(this.keys.settings, JSON.stringify(settings));
        return true;
    }

    /**
     * Load settings
     */
    loadSettings() {
        if (!this.isAvailable()) return {};
        const data = localStorage.getItem(this.keys.settings);
        return data ? Utils.parseJSON(data) || {} : {};
    }

    /**
     * Save achievements
     */
    saveAchievements(achievements) {
        if (!this.isAvailable()) return false;
        localStorage.setItem(this.keys.achievements, JSON.stringify(achievements));
        return true;
    }

    /**
     * Load achievements
     */
    loadAchievements() {
        if (!this.isAvailable()) return [];
        const data = localStorage.getItem(this.keys.achievements);
        return data ? Utils.parseJSON(data) || [] : [];
    }

    /**
     * Save streak information
     */
    saveStreaks(current, longest) {
        if (!this.isAvailable()) return false;
        localStorage.setItem(this.keys.currentStreak, JSON.stringify(current));
        localStorage.setItem(this.keys.longestStreak, JSON.stringify(longest));
        return true;
    }

    /**
     * Load streak information
     */
    loadStreaks() {
        if (!this.isAvailable()) return { current: 0, longest: 0 };
        return {
            current: Utils.parseJSON(localStorage.getItem(this.keys.currentStreak)) || 0,
            longest: Utils.parseJSON(localStorage.getItem(this.keys.longestStreak)) || 0
        };
    }

    /**
     * Clear all data
     */
    clear() {
        if (!this.isAvailable()) return false;
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    }

    /**
     * Export all data as JSON
     */
    exportData() {
        return {
            completedDays: this.loadCompletedDays(),
            position: this.loadPosition(),
            settings: this.loadSettings(),
            achievements: this.loadAchievements(),
            streaks: this.loadStreaks(),
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Import data from JSON
     */
    importData(data) {
        if (!data || typeof data !== 'object') return false;

        try {
            if (data.completedDays) this.saveCompletedDays(data.completedDays);
            if (data.position) this.savePosition(data.position.module, data.position.week, data.position.day);
            if (data.settings) this.saveSettings(data.settings);
            if (data.achievements) this.saveAchievements(data.achievements);
            if (data.streaks) this.saveStreaks(data.streaks.current, data.streaks.longest);
            return true;
        } catch (error) {
            console.error('Import Error:', error);
            return false;
        }
    }
}

// =====================================================
// DATA MANAGER
// =====================================================

/**
 * Manages roadmap data loading and structure
 */
class DataManager {
    constructor() {
        this.roadmap = null;
        this.flatLearningDays = [];
    }

    /**
     * Load roadmap from JSON file
     */
    async load() {
        try {
            const response = await fetch('data/roadmap.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.roadmap = await response.json();
            this.buildFlatLearningDays();
            return true;
        } catch (error) {
            console.error('Error loading roadmap:', error);
            return false;
        }
    }

    /**
     * Build flat array of all learning days for quick access
     */
    buildFlatLearningDays() {
        this.flatLearningDays = [];
        if (!this.roadmap || !this.roadmap.modules) return;

        this.roadmap.modules.forEach(module => {
            if (!module.weeks) return;
            module.weeks.forEach(week => {
                if (!week.learningDays) return;
                week.learningDays.forEach(day => {
                    this.flatLearningDays.push({
                        ...day,
                        moduleIndex: this.roadmap.modules.indexOf(module),
                        moduleName: module.name,
                        weekIndex: module.weeks.indexOf(week),
                        weekName: week.name
                    });
                });
            });
        });
    }

    /**
     * Get learning day by number
     */
    getLearningDay(dayNumber) {
        return this.flatLearningDays.find(day => day.number === dayNumber);
    }

    /**
     * Get module by index
     */
    getModule(index) {
        return this.roadmap?.modules?.[index] || null;
    }

    /**
     * Get week within module
     */
    getWeek(moduleIndex, weekIndex) {
        return this.roadmap?.modules?.[moduleIndex]?.weeks?.[weekIndex] || null;
    }
}

// =====================================================
// APP STATE MANAGER
// =====================================================

/**
 * Manages application state
 */
class StateManager {
    constructor() {
        this.completedDays = [];
        this.currentPosition = { module: null, week: null, day: 1 };
        this.achievedAchievements = [];
        this.settings = {
            studentName: '',
            targetRole: '',
            github: '',
            linkedin: ''
        };
        this.streaks = { current: 0, longest: 0 };
    }

    /**
     * Initialize state from storage and data
     */
    initialize(storage, data) {
        this.completedDays = storage.loadCompletedDays();
        this.currentPosition = storage.loadPosition() || this.currentPosition;
        this.achievedAchievements = storage.loadAchievements();
        this.settings = storage.loadSettings();
        this.streaks = storage.loadStreaks();

        // Calculate current position based on completed days
        if (this.completedDays.length > 0) {
            const lastCompleted = Math.max(...this.completedDays);
            const nextDay = Math.min(lastCompleted + 1, TOTAL_LEARNING_DAYS);
            const learningDay = data.getLearningDay(nextDay);
            if (learningDay) {
                this.currentPosition = {
                    module: learningDay.moduleName,
                    week: learningDay.weekName,
                    day: nextDay
                };
            }
        }

        this.updateStreaks();
    }

    /**
     * Mark learning day as completed
     */
    markDayCompleted(dayNumber) {
        if (!this.completedDays.includes(dayNumber)) {
            this.completedDays.push(dayNumber);
            this.completedDays.sort((a, b) => a - b);
            this.updateStreaks();
            return true;
        }
        return false;
    }

    /**
     * Mark learning day as incomplete
     */
    markDayIncomplete(dayNumber) {
        const index = this.completedDays.indexOf(dayNumber);
        if (index > -1) {
            this.completedDays.splice(index, 1);
            this.updateStreaks();
            return true;
        }
        return false;
    }

    /**
     * Check if learning day is completed
     */
    isDayCompleted(dayNumber) {
        return this.completedDays.includes(dayNumber);
    }

    /**
     * Check if learning day is locked
     */
    isDayLocked(dayNumber) {
        // First day is always unlocked
        if (dayNumber === 1) return false;
        // Day is locked if not completed and previous day is not completed
        return !this.completedDays.includes(dayNumber - 1);
    }

    /**
     * Update streak information
     */
    updateStreaks() {
        this.streaks.current = Utils.calculateCurrentStreak(this.completedDays);
        this.streaks.longest = Math.max(this.streaks.longest, this.streaks.current);
    }

    /**
     * Get current streak
     */
    getCurrentStreak() {
        return this.streaks.current;
    }

    /**
     * Get longest streak
     */
    getLongestStreak() {
        return this.streaks.longest;
    }

    /**
     * Get completed days count
     */
    getCompletedCount() {
        return this.completedDays.length;
    }

    /**
     * Get remaining days count
     */
    getRemainingCount() {
        return TOTAL_LEARNING_DAYS - this.completedDays.length;
    }

    /**
     * Get progress percentage
     */
    getProgress() {
        return Utils.calculatePercentage(this.completedDays.length, TOTAL_LEARNING_DAYS);
    }

    /**
     * Check and unlock new achievements
     */
    checkAchievements() {
        const completed = this.completedDays.length;
        ACHIEVEMENTS.forEach(achievement => {
            if (completed >= achievement.day && !this.achievedAchievements.includes(achievement.day)) {
                this.achievedAchievements.push(achievement.day);
            }
        });
    }

    /**
     * Update settings
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    /**
     * Update current position
     */
    updatePosition(module, week, day) {
        this.currentPosition = { module, week, day };
    }
}

// =====================================================
// DASHBOARD MANAGER
// =====================================================

/**
 * Manages dashboard rendering and updates
 */
class DashboardManager {
    constructor(state, data) {
        this.state = state;
        this.data = data;
        this.container = Utils.getElement('#dashboard');
    }

    /**
     * Render dashboard
     */
    render() {
        if (!this.container) return;

        const completed = this.state.getCompletedCount();
        const remaining = this.state.getRemainingCount();
        const progress = this.state.getProgress();
        const currentStreak = this.state.getCurrentStreak();
        const longestStreak = this.state.getLongestStreak();

        // Update metric cards
        this.updateElement('#dashboard-current-module', this.state.currentPosition.module || 'Not started');
        this.updateElement('#dashboard-current-week', this.state.currentPosition.week || 'Not started');
        this.updateElement('#dashboard-current-day', `Day ${this.state.currentPosition.day}`);
        this.updateElement('#dashboard-target-role', this.state.settings.targetRole || 'Production Engineer');

        // Update progress
        this.updateElement('#dashboard-progress-percentage', `${progress}%`);
        this.updateProgressBar(progress);
        this.updateElement('#dashboard-completed-days', completed);
        this.updateElement('#dashboard-remaining-days', remaining);

        // Update streaks
        this.updateElement('#dashboard-current-streak', currentStreak);
        this.updateElement('#dashboard-longest-streak', longestStreak);

        // Update completion date
        const completionDate = Utils.estimateCompletionDate(completed);
        this.updateElement('#dashboard-completion-date', completionDate);
    }

    /**
     * Update element text safely
     */
    updateElement(selector, text) {
        const element = Utils.getElement(selector);
        if (element) element.textContent = text;
    }

    /**
     * Update progress bar width
     */
    updateProgressBar(percentage) {
        const progressBar = Utils.getElement('#dashboard-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
}

// =====================================================
// ROADMAP MANAGER
// =====================================================

/**
 * Manages roadmap rendering with accordion functionality
 */
class RoadmapManager {
    constructor(state, data) {
        this.state = state;
        this.data = data;
        this.container = Utils.getElement('#roadmap-content');
        this.expandAllBtn = Utils.getElement('#expand-all-btn');
        this.collapseAllBtn = Utils.getElement('#collapse-all-btn');
        this.searchInput = Utils.getElement('#roadmap-search');
        this.registerEvents();
    }

    /**
     * Register event listeners
     */
    registerEvents() {
        if (this.expandAllBtn) {
            this.expandAllBtn.addEventListener('click', () => this.expandAll());
        }
        if (this.collapseAllBtn) {
            this.collapseAllBtn.addEventListener('click', () => this.collapseAll());
        }
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    /**
     * Render roadmap
     */
    render() {
        if (!this.container || !this.data.roadmap) return;

        const fragment = document.createDocumentFragment();
        this.data.roadmap.modules.forEach((module, moduleIndex) => {
            const moduleElement = this.createModuleElement(module, moduleIndex);
            fragment.appendChild(moduleElement);
        });

        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }

    /**
     * Create module element
     */
    createModuleElement(module, moduleIndex) {
        const moduleDiv = Utils.createElement('div', { className: 'accordion-module' });
        
        // Module header
        const header = Utils.createElement('button', { className: 'accordion-header' });
        header.innerHTML = `
            ${module.name}
            <span class="accordion-toggle">▼</span>
        `;
        
        // Module content
        const content = Utils.createElement('div', { className: 'accordion-content' });
        const weekFragment = document.createDocumentFragment();
        
        module.weeks.forEach((week, weekIndex) => {
            const weekElement = this.createWeekElement(week, moduleIndex, weekIndex);
            weekFragment.appendChild(weekElement);
        });
        
        content.appendChild(weekFragment);
        
        // Toggle functionality
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
        
        moduleDiv.appendChild(header);
        moduleDiv.appendChild(content);
        
        return moduleDiv;
    }

    /**
     * Create week element
     */
    createWeekElement(week, moduleIndex, weekIndex) {
        const weekDiv = Utils.createElement('div', { className: 'accordion-week' });
        
        // Week header
        const header = Utils.createElement('button', { className: 'accordion-header' });
        header.innerHTML = `
            ${week.name}
            <span class="accordion-toggle">▼</span>
        `;
        
        // Week content
        const content = Utils.createElement('div', { className: 'accordion-content' });
        const dayFragment = document.createDocumentFragment();
        
        week.learningDays.forEach((day) => {
            const dayElement = this.createLearningDayElement(day);
            dayFragment.appendChild(dayElement);
        });
        
        content.appendChild(dayFragment);
        
        // Toggle functionality
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
        
        weekDiv.appendChild(header);
        weekDiv.appendChild(content);
        
        return weekDiv;
    }

    /**
     * Create learning day element
     */
    createLearningDayElement(day) {
        const isCompleted = this.state.isDayCompleted(day.number);
        const isLocked = this.state.isDayLocked(day.number);
        
        const dayDiv = Utils.createElement('div', { 
            className: `learning-day-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`
        });
        
        const checkbox = Utils.createElement('input', {
            type: 'checkbox',
            className: 'learning-day-checkbox',
            checked: isCompleted,
            disabled: isLocked,
            dataset: { dayNumber: day.number }
        });
        
        const info = Utils.createElement('div', { className: 'learning-day-info' });
        info.innerHTML = `
            <div class="learning-day-number">Day ${day.number}</div>
            <div class="learning-day-title">${day.title}</div>
            <div class="learning-day-time">⏱️ ${day.estimatedHours}h</div>
        `;
        
        const status = Utils.createElement('div', { className: 'learning-day-status' });
        status.textContent = isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Ready';
        
        dayDiv.appendChild(checkbox);
        dayDiv.appendChild(info);
        dayDiv.appendChild(status);
        
        // Checkbox change event
        checkbox.addEventListener('change', () => {
            this.handleDayCheckboxChange(day.number, checkbox.checked);
        });
        
        return dayDiv;
    }

    /**
     * Handle day checkbox change
     */
    handleDayCheckboxChange(dayNumber, isChecked) {
        if (isChecked) {
            this.state.markDayCompleted(dayNumber);
        } else {
            this.state.markDayIncomplete(dayNumber);
        }
        // Trigger update event
        window.dispatchEvent(new CustomEvent('dayUpdated', { detail: { dayNumber, isChecked } }));
    }

    /**
     * Expand all accordions
     */
    expandAll() {
        const headers = Utils.getElements('#roadmap-content .accordion-header');
        const contents = Utils.getElements('#roadmap-content .accordion-content');
        
        headers.forEach(header => header.classList.add('active'));
        contents.forEach(content => content.classList.add('active'));
    }

    /**
     * Collapse all accordions
     */
    collapseAll() {
        const headers = Utils.getElements('#roadmap-content .accordion-header');
        const contents = Utils.getElements('#roadmap-content .accordion-content');
        
        headers.forEach(header => header.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
    }

    /**
     * Handle search
     */
    handleSearch(searchTerm) {
        const allDays = Utils.getElements('.learning-day-item');
        const searchLower = searchTerm.toLowerCase();
        
        allDays.forEach(dayElement => {
            const title = dayElement.querySelector('.learning-day-title')?.textContent || '';
            const dayNum = dayElement.querySelector('.learning-day-number')?.textContent || '';
            
            const matches = title.toLowerCase().includes(searchLower) || 
                          dayNum.toLowerCase().includes(searchLower);
            
            dayElement.style.display = matches ? 'flex' : 'none';
        });
    }
}

// =====================================================
// PROGRESS MANAGER
// =====================================================

/**
 * Manages progress section rendering
 */
class ProgressManager {
    constructor(state, data) {
        this.state = state;
        this.data = data;
        this.container = Utils.getElement('#progress');
    }

    /**
     * Render progress section
     */
    render() {
        if (!this.container) return;

        const completed = this.state.getCompletedCount();
        const remaining = this.state.getRemainingCount();
        const progress = this.state.getProgress();

        // Update stat cards
        this.updateElement('#progress-total-completed', `${completed} days`);
        this.updateElement('#progress-remaining', `${remaining} days`);
        this.updateElement('#progress-percentage', `${progress}%`);

        // Calculate estimated hours
        const completedHours = this.calculateCompletedHours();
        this.updateElement('#progress-hours-completed', `${completedHours} hrs`);

        // Update current focus
        this.updateElement('#progress-current-module', this.state.currentPosition.module || 'Not started');
        this.updateElement('#progress-current-week', this.state.currentPosition.week || 'Not started');
        this.updateElement('#progress-current-day', `Day ${this.state.currentPosition.day} of ${TOTAL_LEARNING_DAYS}`);
    }

    /**
     * Calculate completed hours
     */
    calculateCompletedHours() {
        let completed = 0;
        this.state.completedDays.forEach(dayNum => {
            const day = this.data.getLearningDay(dayNum);
            completed += day?.estimatedHours || 0;
        });
        return completed;
    }

    /**
     * Update element text safely
     */
    updateElement(selector, text) {
        const element = Utils.getElement(selector);
        if (element) element.textContent = text;
    }
}

// =====================================================
// ACHIEVEMENT MANAGER
// =====================================================

/**
 * Manages achievements rendering
 */
class AchievementManager {
    constructor(state) {
        this.state = state;
        this.container = Utils.getElement('#achievements-grid');
    }

    /**
     * Render achievements
     */
    render() {
        if (!this.container) return;

        const fragment = document.createDocumentFragment();
        
        ACHIEVEMENTS.forEach(achievement => {
            const isUnlocked = this.state.achievedAchievements.includes(achievement.day);
            const badgeElement = this.createBadgeElement(achievement, isUnlocked);
            fragment.appendChild(badgeElement);
        });

        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }

    /**
     * Create badge element
     */
    createBadgeElement(achievement, isUnlocked) {
        const badge = Utils.createElement('div', {
            className: `achievement-badge ${isUnlocked ? 'unlocked' : ''}`
        });

        badge.innerHTML = `
            <div class="achievement-icon">${achievement.emoji}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-unlock-at">Day ${achievement.day}</div>
        `;

        return badge;
    }
}

// =====================================================
// STATISTICS MANAGER
// =====================================================

/**
 * Manages statistics section rendering
 */
class StatisticsManager {
    constructor(state, data) {
        this.state = state;
        this.data = data;
        this.container = Utils.getElement('#statistics');
    }

    /**
     * Render statistics
     */
    render() {
        if (!this.container) return;

        const completed = this.state.getCompletedCount();
        const remaining = this.state.getRemainingCount();
        const progress = this.state.getProgress();
        const achievementCount = this.state.achievedAchievements.length;

        // Update overview boxes
        this.updateElement('#stats-completed', completed);
        this.updateElement('#stats-remaining', remaining);
        this.updateElement('#stats-progress', progress);
        this.updateElement('#stats-badges', `${achievementCount}`);

        // Update module statistics
        this.renderModuleStats();

        // Update insights
        this.renderInsights(completed);
    }

    /**
     * Render module statistics
     */
    renderModuleStats() {
        const moduleStatsContainer = Utils.getElement('#module-stats');
        if (!moduleStatsContainer) return;

        const fragment = document.createDocumentFragment();
        
        this.data.roadmap?.modules.forEach(module => {
            const moduleLearningDays = this.data.flatLearningDays.filter(
                day => day.moduleName === module.name
            );
            
            const completedInModule = moduleLearningDays.filter(
                day => this.state.isDayCompleted(day.number)
            ).length;

            const statItem = Utils.createElement('div', { className: 'module-stat-item' });
            statItem.innerHTML = `
                <span class="module-stat-name">${module.name}</span>
                <span class="module-stat-value">${completedInModule}/${moduleLearningDays.length}</span>
            `;
            
            fragment.appendChild(statItem);
        });

        moduleStatsContainer.innerHTML = '';
        moduleStatsContainer.appendChild(fragment);
    }

    /**
     * Render insights
     */
    renderInsights(completed) {
        const insightsList = Utils.getElement('#insights-list');
        if (!insightsList) return;

        const insights = [];

        if (completed === 0) {
            insights.push('Start completing learning days to see insights');
        } else if (completed < 10) {
            insights.push('💪 Great start! Keep the momentum going');
        } else if (completed < 50) {
            insights.push('🚀 You\'re making excellent progress!');
        } else if (completed < 100) {
            insights.push('⭐ You\'re halfway there! Amazing persistence');
        } else if (completed < 150) {
            insights.push('🏆 Over 100 days! You\'re unstoppable');
        } else if (completed < 200) {
            insights.push('👑 Legendary! Almost at the finish line');
        } else {
            insights.push('🎉 You did it! Enterprise AI & MLOps Engineer!');
        }

        insights.push(`Current Streak: ${this.state.getCurrentStreak()} days`);
        insights.push(`Longest Streak: ${this.state.getLongestStreak()} days`);

        const fragment = document.createDocumentFragment();
        insights.forEach(insight => {
            const li = Utils.createElement('li');
            li.textContent = insight;
            fragment.appendChild(li);
        });

        insightsList.innerHTML = '';
        insightsList.appendChild(fragment);
    }

    /**
     * Update element text safely
     */
    updateElement(selector, text) {
        const element = Utils.getElement(selector);
        if (element) element.textContent = text;
    }
}

// =====================================================
// SETTINGS MANAGER
// =====================================================

/**
 * Manages settings section
 */
class SettingsManager {
    constructor(state, storage) {
        this.state = state;
        this.storage = storage;
        this.container = Utils.getElement('#settings');
        this.registerEvents();
    }

    /**
     * Register event listeners
     */
    registerEvents() {
        // Profile form
        const profileForm = Utils.getElement('#profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }

        // Export button
        const exportBtn = Utils.getElement('#export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }

        // Import button
        const importBtn = Utils.getElement('#import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const fileInput = Utils.getElement('#import-file');
                fileInput?.click();
            });
        }

        // Import file input
        const fileInput = Utils.getElement('#import-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleImport(e));
        }

        // Reset button
        const resetBtn = Utils.getElement('#reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        // Load initial values
        this.loadSettings();
    }

    /**
     * Load settings into form
     */
    loadSettings() {
        const studentNameInput = Utils.getElement('#settings-student-name');
        const targetRoleInput = Utils.getElement('#settings-target-role');
        const githubInput = Utils.getElement('#settings-github');
        const linkedinInput = Utils.getElement('#settings-linkedin');

        if (studentNameInput) studentNameInput.value = this.state.settings.studentName || '';
        if (targetRoleInput) targetRoleInput.value = this.state.settings.targetRole || '';
        if (githubInput) githubInput.value = this.state.settings.github || '';
        if (linkedinInput) linkedinInput.value = this.state.settings.linkedin || '';

        // Update display names
        const displayName = Utils.getElement('#student-name-display');
        const displayRole = Utils.getElement('#target-role-display');
        if (displayName) displayName.textContent = this.state.settings.studentName || 'Welcome';
        if (displayRole) displayRole.textContent = this.state.settings.targetRole || 'Senior Azure DevOps Engineer';
    }

    /**
     * Handle profile form submission
     */
    handleProfileSubmit(e) {
        e.preventDefault();

        const settings = {
            studentName: Utils.getElement('#settings-student-name')?.value || '',
            targetRole: Utils.getElement('#settings-target-role')?.value || '',
            github: Utils.getElement('#settings-github')?.value || '',
            linkedin: Utils.getElement('#settings-linkedin')?.value || ''
        };

        this.state.updateSettings(settings);
        this.storage.saveSettings(settings);
        this.loadSettings();

        Utils.alert('Profile saved successfully!');
        window.dispatchEvent(new CustomEvent('settingsUpdated'));
    }

    /**
     * Handle export
     */
    handleExport() {
        const data = this.storage.exportData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mlops-academy-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Handle import
     */
    handleImport(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = Utils.parseJSON(event.target.result);
                if (data && this.storage.importData(data)) {
                    Utils.alert('Progress imported successfully!');
                    window.location.reload();
                } else {
                    Utils.alert('Invalid import file format');
                }
            } catch (error) {
                console.error('Import error:', error);
                Utils.alert('Error importing file');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Handle reset
     */
    handleReset() {
        if (Utils.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.storage.clear();
            Utils.alert('All progress has been reset');
            window.location.reload();
        }
    }
}

// =====================================================
// MAIN APPLICATION
// =====================================================

/**
 * Main application controller
 * Orchestrates all components and manages the application lifecycle
 */
class App {
    constructor() {
        this.storage = new StorageManager();
        this.dataManager = new DataManager();
        this.state = new StateManager();
        this.dashboardManager = null;
        this.roadmapManager = null;
        this.progressManager = null;
        this.achievementManager = null;
        this.statisticsManager = null;
        this.settingsManager = null;
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            // Load roadmap data
            const dataLoaded = await this.dataManager.load();
            if (!dataLoaded) {
                console.error('Failed to load roadmap data');
                Utils.alert('Error loading roadmap. Please refresh the page.');
                return;
            }

            // Initialize state from storage
            this.state.initialize(this.storage, this.dataManager);

            // Check for new achievements
            this.state.checkAchievements();

            // Create managers
            this.dashboardManager = new DashboardManager(this.state, this.dataManager);
            this.roadmapManager = new RoadmapManager(this.state, this.dataManager);
            this.progressManager = new ProgressManager(this.state, this.dataManager);
            this.achievementManager = new AchievementManager(this.state);
            this.statisticsManager = new StatisticsManager(this.state, this.dataManager);
            this.settingsManager = new SettingsManager(this.state, this.storage);

            // Render all sections
            this.renderAll();

            // Register navigation events
            this.registerNavigationEvents();

            // Register update events
            this.registerUpdateEvents();

            // Save initial state
            this.saveState();
        } catch (error) {
            console.error('Application initialization error:', error);
            Utils.alert('An error occurred. Please refresh the page.');
        }
    }

    /**
     * Register navigation events
     */
    registerNavigationEvents() {
        const navButtons = Utils.getElements('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Register update events
     */
    registerUpdateEvents() {
        window.addEventListener('dayUpdated', () => {
            this.state.checkAchievements();
            this.renderAll();
            this.saveState();
        });

        window.addEventListener('settingsUpdated', () => {
            this.dashboardManager.render();
            this.saveState();
        });
    }

    /**
     * Switch section
     */
    switchSection(sectionName) {
        const sections = Utils.getElements('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = Utils.getElement(`#${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    /**
     * Render all components
     */
    renderAll() {
        this.dashboardManager.render();
        this.roadmapManager.render();
        this.progressManager.render();
        this.achievementManager.render();
        this.statisticsManager.render();
    }

    /**
     * Save application state to storage
     */
    saveState() {
        this.storage.saveCompletedDays(this.state.completedDays);
        this.storage.savePosition(
            this.state.currentPosition.module,
            this.state.currentPosition.week,
            this.state.currentPosition.day
        );
        this.storage.saveAchievements(this.state.achievedAchievements);
        this.storage.saveSettings(this.state.settings);
        this.storage.saveStreaks(this.state.streaks.current, this.state.streaks.longest);
    }
}

// =====================================================
// APPLICATION STARTUP
// =====================================================

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
