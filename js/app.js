/**
 * Enterprise AI and MLOps Academy - Personal Learning Tracker
 * Application logic for Phase -> Module -> Week -> Learning Day hierarchy.
 */

const DEFAULT_TOTAL_LEARNING_DAYS = 200;

const ACHIEVEMENTS = [
    { day: 7, title: '7-Day Starter', emoji: '🔥', description: 'Completed 7 learning days' },
    { day: 14, title: '14-Day Builder', emoji: '⚙️', description: 'Completed 14 learning days' },
    { day: 30, title: '30-Day Consistency', emoji: '📈', description: 'Completed 30 learning days' },
    { day: 60, title: '60-Day Practitioner', emoji: '🧪', description: 'Completed 60 learning days' },
    { day: 100, title: '100-Day Engineer', emoji: '🧠', description: 'Completed 100 learning days' },
    { day: 150, title: '150-Day Architect', emoji: '🏗️', description: 'Completed 150 learning days' },
    { day: 200, title: 'Bootcamp Complete', emoji: '🏆', description: 'Completed all 200 learning days' }
];

class Utils {
    static parseJSON(value, fallback = null) {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    static getElement(selector) {
        return document.querySelector(selector);
    }

    static getElements(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, attrs = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attrs);
        return element;
    }

    static calculatePercentage(current, total) {
        if (!total) return 0;
        return Math.round((current / total) * 100);
    }

    static formatDate(date) {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    static startOfDay(date) {
        const d = date instanceof Date ? new Date(date.getTime()) : new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    static daysBetween(startDate, endDate) {
        const start = this.startOfDay(startDate).getTime();
        const end = this.startOfDay(endDate).getTime();
        return Math.floor((end - start) / (24 * 60 * 60 * 1000));
    }

    static estimateCompletionDate(completedDays, totalDays) {
        if (completedDays <= 0) return 'Not started';
        const remaining = Math.max(totalDays - completedDays, 0);
        const completion = new Date(Date.now() + remaining * 24 * 60 * 60 * 1000);
        return this.formatDate(completion);
    }

    static alert(message) {
        window.alert(message);
    }

    static confirm(message) {
        return window.confirm(message);
    }
}

class StorageManager {
    constructor() {
        this.prefix = 'mlops-academy-';
        this.keys = {
            completedDays: this.prefix + 'completed-days',
            completionDates: this.prefix + 'completion-dates',
            position: this.prefix + 'position',
            settings: this.prefix + 'settings',
            achievements: this.prefix + 'achievements',
            currentStreak: this.prefix + 'current-streak',
            longestStreak: this.prefix + 'longest-streak',
            lastUpdated: this.prefix + 'last-updated'
        };
    }

    isAvailable() {
        try {
            const key = '__storage_test__';
            localStorage.setItem(key, key);
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }

    saveCompletedDays(days) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.completedDays, JSON.stringify(days));
        localStorage.setItem(this.keys.lastUpdated, new Date().toISOString());
    }

    loadCompletedDays() {
        if (!this.isAvailable()) return [];
        const raw = localStorage.getItem(this.keys.completedDays);
        const parsed = raw ? Utils.parseJSON(raw, []) : [];
        return Array.isArray(parsed) ? parsed : [];
    }

    saveCompletionDates(completionDates) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.completionDates, JSON.stringify(completionDates || {}));
    }

    loadCompletionDates() {
        if (!this.isAvailable()) return {};
        const raw = localStorage.getItem(this.keys.completionDates);
        const parsed = raw ? Utils.parseJSON(raw, {}) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    }

    savePosition(position) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.position, JSON.stringify(position));
    }

    loadPosition() {
        if (!this.isAvailable()) return null;
        const raw = localStorage.getItem(this.keys.position);
        return raw ? Utils.parseJSON(raw, null) : null;
    }

    saveSettings(settings) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.settings, JSON.stringify(settings));
    }

    loadSettings() {
        if (!this.isAvailable()) return {};
        const raw = localStorage.getItem(this.keys.settings);
        return raw ? Utils.parseJSON(raw, {}) : {};
    }

    saveAchievements(achievements) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.achievements, JSON.stringify(achievements));
    }

    loadAchievements() {
        if (!this.isAvailable()) return [];
        const raw = localStorage.getItem(this.keys.achievements);
        const parsed = raw ? Utils.parseJSON(raw, []) : [];
        return Array.isArray(parsed) ? parsed : [];
    }

    saveStreaks(current, longest) {
        if (!this.isAvailable()) return;
        localStorage.setItem(this.keys.currentStreak, JSON.stringify(current));
        localStorage.setItem(this.keys.longestStreak, JSON.stringify(longest));
    }

    loadStreaks() {
        if (!this.isAvailable()) return { current: 0, longest: 0 };
        return {
            current: Utils.parseJSON(localStorage.getItem(this.keys.currentStreak), 0) || 0,
            longest: Utils.parseJSON(localStorage.getItem(this.keys.longestStreak), 0) || 0
        };
    }

    clear() {
        if (!this.isAvailable()) return;
        Object.values(this.keys).forEach((key) => localStorage.removeItem(key));
    }

    exportData() {
        return {
            completedDays: this.loadCompletedDays(),
            completionDates: this.loadCompletionDates(),
            position: this.loadPosition(),
            settings: this.loadSettings(),
            achievements: this.loadAchievements(),
            streaks: this.loadStreaks(),
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        if (!data || typeof data !== 'object') return false;
        try {
            if (Array.isArray(data.completedDays)) this.saveCompletedDays(data.completedDays);
            if (data.completionDates && typeof data.completionDates === 'object') this.saveCompletionDates(data.completionDates);
            if (data.position) this.savePosition(data.position);
            if (data.settings) this.saveSettings(data.settings);
            if (Array.isArray(data.achievements)) this.saveAchievements(data.achievements);
            if (data.streaks) this.saveStreaks(data.streaks.current || 0, data.streaks.longest || 0);
            return true;
        } catch {
            return false;
        }
    }
}

class DataManager {
    constructor() {
        this.roadmap = null;
        this.flatLearningDays = [];
        this.totalLearningDays = DEFAULT_TOTAL_LEARNING_DAYS;
    }

    async load() {
        const response = await fetch('data/roadmap.json');
        if (!response.ok) {
            throw new Error('Unable to load roadmap.json');
        }

        this.roadmap = await response.json();
        this.totalLearningDays = this.roadmap?.academy?.totalLearningDays || DEFAULT_TOTAL_LEARNING_DAYS;
        this.buildFlatLearningDays();
        return true;
    }

    buildFlatLearningDays() {
        this.flatLearningDays = [];
        if (!Array.isArray(this.roadmap?.phases)) return;

        this.roadmap.phases.forEach((phase) => {
            (phase.modules || []).forEach((module) => {
                (module.weeks || []).forEach((week) => {
                    (week.learningDays || []).forEach((day) => {
                        this.flatLearningDays.push({
                            ...day,
                            phaseNumber: phase.phaseNumber,
                            phaseTitle: phase.title,
                            moduleNumber: module.moduleNumber,
                            moduleTitle: module.title,
                            weekNumber: week.weekNumber,
                            weekTitle: week.title
                        });
                    });
                });
            });
        });

        this.flatLearningDays.sort((a, b) => a.dayNumber - b.dayNumber);
    }

    getLearningDay(dayNumber) {
        return this.flatLearningDays.find((d) => d.dayNumber === dayNumber) || null;
    }

    getPathForDay(dayNumber) {
        const day = this.getLearningDay(dayNumber);
        if (!day) return null;
        return {
            phaseNumber: day.phaseNumber,
            phaseTitle: day.phaseTitle,
            moduleNumber: day.moduleNumber,
            moduleTitle: day.moduleTitle,
            weekNumber: day.weekNumber,
            weekTitle: day.weekTitle,
            dayNumber: day.dayNumber,
            dayTitle: day.title
        };
    }

    getWeeksForPhase(phase) {
        const weeks = [];
        (phase.modules || []).forEach((module) => {
            (module.weeks || []).forEach((week) => {
                weeks.push({
                    ...week,
                    moduleNumber: module.moduleNumber,
                    moduleTitle: module.title
                });
            });
        });
        return weeks.sort((a, b) => a.weekNumber - b.weekNumber);
    }
}

class StateManager {
    constructor(totalDays) {
        this.totalDays = totalDays;
        this.completedDays = [];
        this.completionDates = {};
        this.settings = {
            studentName: '',
            targetRole: ''
        };
        this.achievedAchievements = [];
        this.streaks = { current: 0, longest: 0 };
        this.currentPosition = {
            phaseNumber: 1,
            phaseTitle: 'Not started',
            moduleNumber: 1,
            moduleTitle: 'Not started',
            weekNumber: 1,
            weekTitle: 'Not started',
            dayNumber: 1,
            dayTitle: 'Day 1'
        };
    }

    initialize(storage, dataManager) {
        this.completedDays = this.normalizeCompletedDays(storage.loadCompletedDays(), dataManager.totalLearningDays);
        this.completionDates = this.normalizeCompletionDates(storage.loadCompletionDates(), dataManager.totalLearningDays);
        this.settings = { ...this.settings, ...(storage.loadSettings() || {}) };
        this.achievedAchievements = storage.loadAchievements();
        this.streaks = storage.loadStreaks();
        this.totalDays = dataManager.totalLearningDays;

        // Backfill missing dates for previously completed days.
        this.completedDays.forEach((dayNumber) => {
            if (!this.completionDates[dayNumber]) {
                this.completionDates[dayNumber] = new Date().toISOString();
            }
        });

        const storedPos = storage.loadPosition();
        if (storedPos && typeof storedPos.dayNumber === 'number') {
            this.currentPosition = { ...this.currentPosition, ...storedPos };
        }

        this.updateCurrentPosition(dataManager);
        this.updateStreaks();
        this.checkAchievements();
    }

    normalizeCompletedDays(days, maxDays) {
        if (!Array.isArray(days)) return [];
        const unique = [...new Set(days.filter((d) => Number.isInteger(d) && d >= 1 && d <= maxDays))];
        return unique.sort((a, b) => a - b);
    }

    normalizeCompletionDates(completionDates, maxDays) {
        if (!completionDates || typeof completionDates !== 'object') return {};

        const normalized = {};
        Object.keys(completionDates).forEach((key) => {
            const dayNumber = Number(key);
            if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > maxDays) return;

            const parsed = new Date(completionDates[key]);
            if (!Number.isNaN(parsed.getTime())) {
                normalized[dayNumber] = parsed.toISOString();
            }
        });

        return normalized;
    }

    getNextUnlockedDay() {
        for (let i = 1; i <= this.totalDays; i++) {
            if (!this.completedDays.includes(i)) return i;
        }
        return this.totalDays;
    }

    isDayCompleted(dayNumber) {
        return this.completedDays.includes(dayNumber);
    }

    isDayLocked(dayNumber) {
        if (dayNumber === 1) return false;
        return !this.completedDays.includes(dayNumber - 1);
    }

    markDayCompleted(dayNumber) {
        if (this.isDayLocked(dayNumber)) return false;
        if (this.completedDays.includes(dayNumber)) return false;
        this.completedDays.push(dayNumber);
        this.completedDays.sort((a, b) => a - b);
        this.completionDates[dayNumber] = new Date().toISOString();
        this.updateStreaks();
        this.checkAchievements();
        return true;
    }

    markDayIncomplete(dayNumber) {
        if (!this.completedDays.includes(dayNumber)) return false;

        this.completedDays = this.completedDays.filter((d) => d < dayNumber);
        Object.keys(this.completionDates).forEach((key) => {
            if (Number(key) >= dayNumber) {
                delete this.completionDates[key];
            }
        });
        this.updateStreaks();
        this.checkAchievements();
        return true;
    }

    getCompletionDate(dayNumber) {
        return this.completionDates[dayNumber] || null;
    }

    getLatestCompletionDate() {
        if (this.completedDays.length === 0) return null;

        const latestDay = Math.max(...this.completedDays);
        return this.getCompletionDate(latestDay);
    }

    getEstimatedCompletionDateLabel() {
        const completed = this.getCompletedCount();
        if (completed <= 0) return 'Not started';

        if (completed >= this.totalDays) {
            const latest = this.getLatestCompletionDate();
            return latest ? `Completed on ${Utils.formatDate(latest)}` : 'Completed';
        }

        const sortedDays = [...this.completedDays].sort((a, b) => a - b);
        const firstDay = sortedDays[0];
        const latestDay = sortedDays[sortedDays.length - 1];

        const firstDateRaw = this.getCompletionDate(firstDay) || new Date().toISOString();
        const latestDateRaw = this.getCompletionDate(latestDay) || new Date().toISOString();

        const firstDate = Utils.startOfDay(firstDateRaw);
        const latestDate = Utils.startOfDay(latestDateRaw);
        const today = Utils.startOfDay(new Date());
        const paceBaseDate = latestDate > today ? latestDate : today;

        let learningDaysPerCalendarDay = 1;
        if (completed > 1) {
            const elapsedDays = Math.max(1, Utils.daysBetween(firstDate, paceBaseDate) + 1);
            learningDaysPerCalendarDay = Math.max(0.2, completed / elapsedDays);
        }

        const remaining = this.getRemainingCount();
        const etaCalendarDays = Math.ceil(remaining / learningDaysPerCalendarDay);
        const etaDate = new Date(paceBaseDate.getTime());
        etaDate.setDate(etaDate.getDate() + etaCalendarDays);
        return Utils.formatDate(etaDate);
    }

    updateCurrentPosition(dataManager) {
        const nextDay = this.getNextUnlockedDay();
        const path = dataManager.getPathForDay(nextDay) || dataManager.getPathForDay(this.totalDays);
        if (path) {
            this.currentPosition = path;
        }
    }

    updateStreaks() {
        if (this.completedDays.length === 0) {
            this.streaks.current = 0;
            this.streaks.longest = 0;
            return;
        }

        const sorted = [...this.completedDays].sort((a, b) => a - b);

        let longest = 1;
        let running = 1;
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === sorted[i - 1] + 1) {
                running++;
                longest = Math.max(longest, running);
            } else {
                running = 1;
            }
        }

        let current = 1;
        for (let i = sorted.length - 1; i > 0; i--) {
            if (sorted[i] === sorted[i - 1] + 1) {
                current++;
            } else {
                break;
            }
        }

        this.streaks.current = current;
        this.streaks.longest = Math.max(this.streaks.longest || 0, longest);
    }

    checkAchievements() {
        const completed = this.completedDays.length;
        this.achievedAchievements = ACHIEVEMENTS
            .filter((a) => completed >= a.day)
            .map((a) => a.day);
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    getCompletedCount() {
        return this.completedDays.length;
    }

    getRemainingCount() {
        return Math.max(this.totalDays - this.completedDays.length, 0);
    }

    getProgressPercent() {
        return Utils.calculatePercentage(this.getCompletedCount(), this.totalDays);
    }

    getLearningHours(dataManager) {
        return this.completedDays.reduce((sum, dayNum) => {
            const day = dataManager.getLearningDay(dayNum);
            return sum + (day?.estimatedHours || 0);
        }, 0);
    }
}

class DashboardManager {
    constructor(state, dataManager) {
        this.state = state;
        this.dataManager = dataManager;
    }

    render() {
        const completed = this.state.getCompletedCount();
        const remaining = this.state.getRemainingCount();
        const progress = this.state.getProgressPercent();

        const phaseText = `Phase ${this.state.currentPosition.phaseNumber}: ${this.state.currentPosition.phaseTitle}`;
        const moduleText = `Module ${this.state.currentPosition.moduleNumber}: ${this.state.currentPosition.moduleTitle}`;
        const weekText = `Week ${this.state.currentPosition.weekNumber}`;

        this.updateText('#dashboard-current-module', phaseText);
        this.updateText('#dashboard-current-week', moduleText);
        this.updateText('#dashboard-current-day', `Day ${this.state.currentPosition.dayNumber}`);
        this.updateText('#dashboard-target-role', this.state.settings.targetRole || this.dataManager.roadmap?.academy?.targetRole || 'Production AI and MLOps Engineer');

        const metricSubtexts = Utils.getElements('#dashboard .metric-subtext');
        if (metricSubtexts[0]) metricSubtexts[0].textContent = 'Current Phase';
        if (metricSubtexts[1]) metricSubtexts[1].textContent = weekText;
        if (metricSubtexts[2]) metricSubtexts[2].textContent = `of ${this.state.totalDays}`;

        this.updateText('#dashboard-progress-percentage', `${progress}%`);
        this.updateText('#dashboard-completed-days', `${completed}`);
        this.updateText('#dashboard-remaining-days', `${remaining}`);

        const bar = Utils.getElement('#dashboard-progress-bar');
        if (bar) bar.style.width = `${progress}%`;

        this.updateText('#dashboard-current-streak', `${this.state.streaks.current}`);
        this.updateText('#dashboard-longest-streak', `${this.state.streaks.longest}`);
        this.updateText('#dashboard-completion-date', this.state.getEstimatedCompletionDateLabel());

        const completionNote = Utils.getElement('#dashboard .completion-note');
        if (completionNote) {
            const latestDate = this.state.getLatestCompletionDate();
            completionNote.textContent = latestDate
                ? `Calendar synced. Last completed on ${Utils.formatDate(latestDate)}`
                : 'Calendar synced. Mark Day 1 to start ETA updates';
        }
    }

    updateText(selector, value) {
        const el = Utils.getElement(selector);
        if (el) el.textContent = value;
    }
}

class RoadmapManager {
    constructor(state, dataManager) {
        this.state = state;
        this.dataManager = dataManager;
        this.container = Utils.getElement('#roadmap-content');
        this.expandAllBtn = Utils.getElement('#expand-all-btn');
        this.collapseAllBtn = Utils.getElement('#collapse-all-btn');
        this.searchInput = Utils.getElement('#roadmap-search');
        this.registerEvents();
    }

    registerEvents() {
        this.expandAllBtn?.addEventListener('click', () => this.expandAll());
        this.collapseAllBtn?.addEventListener('click', () => this.collapseAll());
        this.searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value || ''));
    }

    render() {
        if (!this.container || !Array.isArray(this.dataManager.roadmap?.phases)) return;

        const expandedKeys = this.captureExpandedKeys();
        const activeSearch = this.searchInput?.value || '';

        const fragment = document.createDocumentFragment();

        this.dataManager.roadmap.phases.forEach((phase) => {
            const phaseEl = Utils.createElement('div', { className: 'accordion-module' });

            const phaseHeader = Utils.createElement('button', { className: 'accordion-header', type: 'button' });
            const phaseKey = `phase-${phase.phaseNumber}`;
            phaseHeader.dataset.nodeKey = phaseKey;
            const phaseDays = this.countPhaseDays(phase);
            phaseHeader.innerHTML = `
                <span>Phase ${phase.phaseNumber}: ${phase.title}</span>
                <span class="accordion-toggle">▼</span>
            `;

            const phaseContent = Utils.createElement('div', { className: 'accordion-content' });
            phaseContent.dataset.nodeKey = phaseKey;
            const phaseInfo = Utils.createElement('div', { className: 'learning-day-time' });
            phaseInfo.textContent = `${phaseDays} learning days`;
            phaseContent.appendChild(phaseInfo);

            const weeks = this.dataManager.getWeeksForPhase(phase);
            weeks.forEach((week) => {
                const weekEl = this.createWeekElement(week);
                phaseContent.appendChild(weekEl);
            });

            phaseHeader.addEventListener('click', () => {
                phaseHeader.classList.toggle('active');
                phaseContent.classList.toggle('active');
            });

            phaseEl.appendChild(phaseHeader);
            phaseEl.appendChild(phaseContent);
            fragment.appendChild(phaseEl);
        });

        this.container.innerHTML = '';
        this.container.appendChild(fragment);
        this.restoreExpandedKeys(expandedKeys);
        if (activeSearch) {
            this.handleSearch(activeSearch);
        }
    }

    captureExpandedKeys() {
        if (!this.container) return [];

        const keys = new Set();
        this.container.querySelectorAll('.active[data-node-key]').forEach((element) => {
            if (element.dataset.nodeKey) {
                keys.add(element.dataset.nodeKey);
            }
        });

        return [...keys];
    }

    restoreExpandedKeys(keys) {
        if (!this.container || !Array.isArray(keys) || keys.length === 0) return;

        keys.forEach((key) => {
            this.container.querySelectorAll(`[data-node-key="${key}"]`).forEach((element) => {
                element.classList.add('active');
            });
        });
    }

    countPhaseDays(phase) {
        return (phase.modules || []).reduce((phaseAcc, module) => {
            return phaseAcc + (module.weeks || []).reduce((weekAcc, week) => weekAcc + (week.learningDays || []).length, 0);
        }, 0);
    }

    createWeekElement(week) {
        const weekEl = Utils.createElement('div', { className: 'accordion-week' });
        const weekHeader = Utils.createElement('button', { className: 'accordion-header', type: 'button' });
        const weekKey = `week-${week.weekNumber}`;
        weekHeader.dataset.nodeKey = weekKey;
        weekHeader.innerHTML = `
            <span>Week ${week.weekNumber}: ${week.title}</span>
            <span class="accordion-toggle">▼</span>
        `;

        const weekContent = Utils.createElement('div', { className: 'accordion-content' });
        weekContent.dataset.nodeKey = weekKey;
        const moduleHint = Utils.createElement('div', { className: 'learning-day-time' });
        moduleHint.textContent = `Module ${week.moduleNumber}: ${week.moduleTitle}`;
        weekContent.appendChild(moduleHint);

        (week.learningDays || []).forEach((day) => {
            weekContent.appendChild(this.createLearningDayElement(day));
        });

        weekHeader.addEventListener('click', () => {
            weekHeader.classList.toggle('active');
            weekContent.classList.toggle('active');
        });

        weekEl.appendChild(weekHeader);
        weekEl.appendChild(weekContent);
        return weekEl;
    }

    createLearningDayElement(day) {
        const isCompleted = this.state.isDayCompleted(day.dayNumber);
        const isLocked = this.state.isDayLocked(day.dayNumber);
        const dayKey = `day-${day.dayNumber}`;

        const wrapper = Utils.createElement('div', { className: 'accordion-day' });
        const row = Utils.createElement('div', {
            className: `learning-day-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`,
            tabIndex: isLocked ? -1 : 0
        });
        row.dataset.nodeKey = dayKey;

        const checkbox = Utils.createElement('input', {
            className: 'learning-day-checkbox',
            type: 'checkbox',
            checked: isCompleted,
            disabled: isLocked,
            'aria-label': `Mark day ${day.dayNumber} as completed`
        });

        checkbox.addEventListener('change', (e) => {
            this.handleDayCheckboxChange(day.dayNumber, e.target.checked);
        });

        const info = Utils.createElement('div', { className: 'learning-day-info' });
        const number = Utils.createElement('div', { className: 'learning-day-number' });
        number.textContent = `Day ${day.dayNumber}`;

        const title = Utils.createElement('div', { className: 'learning-day-title' });
        title.textContent = day.title;

        const time = Utils.createElement('div', { className: 'learning-day-time' });
        time.textContent = `${day.estimatedHours} hrs | ${day.difficulty} | ${day.type}`;

        info.appendChild(number);
        info.appendChild(title);
        info.appendChild(time);

        const status = Utils.createElement('div', { className: 'learning-day-status' });
        if (isLocked) {
            status.textContent = 'Locked';
        } else if (isCompleted) {
            const completedOn = this.state.getCompletionDate(day.dayNumber);
            status.textContent = completedOn ? `Completed ${Utils.formatDate(completedOn)}` : 'Completed';
        } else {
            status.textContent = 'Not Started';
        }

        row.appendChild(checkbox);
        row.appendChild(info);
        row.appendChild(status);

        const details = Utils.createElement('div', { className: 'accordion-content' });
        details.dataset.nodeKey = dayKey;
        details.innerHTML = this.buildDayDetails(day);

        row.addEventListener('click', (e) => {
            if (e.target === checkbox || isLocked) return;
            row.classList.toggle('active');
            details.classList.toggle('active');
        });

        row.addEventListener('keydown', (e) => {
            if (isLocked) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                row.classList.toggle('active');
                details.classList.toggle('active');
            }
        });

        wrapper.appendChild(row);
        wrapper.appendChild(details);
        return wrapper;
    }

    buildDayDetails(day) {
        const objectives = (day.learningObjectives || []).map((o) => `<li>${o}</li>`).join('');
        const interviews = (day.interviewTopics || []).map((q) => `<li>${q}</li>`).join('');
        const tags = (day.tags || []).join(', ');

        return `
            <div class="day-detail-grid">
                <h4>Learning Objectives</h4>
                <ul>${objectives}</ul>
                <h4>Assignment</h4>
                <p>${day.assignmentTitle || 'N/A'}</p>
                <h4>Mini Project</h4>
                <p>${day.miniProject || 'N/A'}</p>
                <h4>Interview Questions</h4>
                <ul>${interviews}</ul>
                <p><strong>Tags:</strong> ${tags}</p>
            </div>
        `;
    }

    handleDayCheckboxChange(dayNumber, isChecked) {
        if (isChecked) {
            this.state.markDayCompleted(dayNumber);
        } else {
            this.state.markDayIncomplete(dayNumber);
        }

        this.state.updateCurrentPosition(this.dataManager);
        window.dispatchEvent(new CustomEvent('dayUpdated'));
    }

    expandAll() {
        Utils.getElements('#roadmap-content .accordion-header').forEach((el) => el.classList.add('active'));
        Utils.getElements('#roadmap-content .accordion-content').forEach((el) => el.classList.add('active'));
    }

    collapseAll() {
        Utils.getElements('#roadmap-content .accordion-header').forEach((el) => el.classList.remove('active'));
        Utils.getElements('#roadmap-content .accordion-content').forEach((el) => el.classList.remove('active'));
    }

    handleSearch(value) {
        const term = value.trim().toLowerCase();
        const dayItems = Utils.getElements('.accordion-day');

        dayItems.forEach((item) => {
            const title = item.querySelector('.learning-day-title')?.textContent?.toLowerCase() || '';
            const number = item.querySelector('.learning-day-number')?.textContent?.toLowerCase() || '';
            const tags = item.querySelector('.day-detail-grid p:last-child')?.textContent?.toLowerCase() || '';
            const show = !term || title.includes(term) || number.includes(term) || tags.includes(term);
            item.style.display = show ? '' : 'none';
        });
    }
}

class ProgressManager {
    constructor(state, dataManager) {
        this.state = state;
        this.dataManager = dataManager;

        this.resizeHandler = () => {
            this.renderProgressChart();
        };
        window.addEventListener('resize', this.resizeHandler);
    }

    render() {
        this.updateText('#progress-total-completed', `${this.state.getCompletedCount()} days`);
        this.updateText('#progress-remaining', `${this.state.getRemainingCount()} days`);
        this.updateText('#progress-percentage', `${this.state.getProgressPercent()}%`);
        this.updateText('#progress-hours-completed', `${this.state.getLearningHours(this.dataManager)} hrs`);

        this.updateText('#progress-current-module', this.state.currentPosition.moduleTitle || 'Not started');
        this.updateText('#progress-current-week', `Week ${this.state.currentPosition.weekNumber}`);
        this.updateText('#progress-current-day', `Day ${this.state.currentPosition.dayNumber} of ${this.state.totalDays}`);

        this.renderProgressChart();
    }

    renderProgressChart() {
        const canvas = Utils.getElement('#progress-chart');
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const parentWidth = canvas.parentElement?.clientWidth || 0;
        const cssWidth = Math.max(320, parentWidth ? Math.floor(parentWidth - 4) : 780);
        const cssHeight = 220;
        const dpr = window.devicePixelRatio || 1;

        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.width = Math.floor(cssWidth * dpr);
        canvas.height = Math.floor(cssHeight * dpr);

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, cssWidth, cssHeight);

        const padding = { top: 18, right: 16, bottom: 28, left: 36 };
        const chartWidth = cssWidth - padding.left - padding.right;
        const chartHeight = cssHeight - padding.top - padding.bottom;
        if (chartWidth <= 0 || chartHeight <= 0) return;

        context.strokeStyle = '#d6e1fb';
        context.lineWidth = 1;

        [0, 25, 50, 75, 100].forEach((value) => {
            const y = padding.top + chartHeight - (value / 100) * chartHeight;
            context.beginPath();
            context.moveTo(padding.left, y);
            context.lineTo(padding.left + chartWidth, y);
            context.stroke();
        });

        const values = this.buildProgressSeries();
        if (values.length === 0) return;

        const gradient = context.createLinearGradient(padding.left, 0, padding.left + chartWidth, 0);
        gradient.addColorStop(0, '#0f6fff');
        gradient.addColorStop(1, '#00b894');

        context.beginPath();
        values.forEach((value, index) => {
            const x = padding.left + (index / (values.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - (value / 100) * chartHeight;
            if (index === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        });
        context.strokeStyle = gradient;
        context.lineWidth = 3;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.stroke();

        context.beginPath();
        values.forEach((value, index) => {
            const x = padding.left + (index / (values.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - (value / 100) * chartHeight;
            if (index === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        });
        context.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        context.lineTo(padding.left, padding.top + chartHeight);
        context.closePath();

        const fillGradient = context.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        fillGradient.addColorStop(0, 'rgba(15, 111, 255, 0.22)');
        fillGradient.addColorStop(1, 'rgba(15, 111, 255, 0.02)');
        context.fillStyle = fillGradient;
        context.fill();

        const currentProgress = this.state.getProgressPercent();
        const markerX = padding.left + chartWidth;
        const markerY = padding.top + chartHeight - (currentProgress / 100) * chartHeight;

        context.beginPath();
        context.arc(markerX, markerY, 5, 0, Math.PI * 2);
        context.fillStyle = '#0f6fff';
        context.fill();

        context.fillStyle = '#1e3e87';
        context.font = '600 12px "Sora", "Segoe UI", sans-serif';
        context.fillText(`${currentProgress}%`, markerX - 34, Math.max(14, markerY - 10));
    }

    buildProgressSeries() {
        const total = Math.max(1, this.state.totalDays || 200);
        const completedSet = new Set(this.state.completedDays || []);
        const cumulativePercentages = [];
        let completed = 0;

        for (let day = 1; day <= total; day += 1) {
            if (completedSet.has(day)) completed += 1;
            cumulativePercentages.push((completed / total) * 100);
        }

        const maxPoints = 48;
        const step = Math.max(1, Math.ceil(cumulativePercentages.length / maxPoints));
        const sampled = [];

        for (let i = 0; i < cumulativePercentages.length; i += step) {
            sampled.push(cumulativePercentages[i]);
        }

        const finalValue = cumulativePercentages[cumulativePercentages.length - 1];
        if (sampled[sampled.length - 1] !== finalValue) {
            sampled.push(finalValue);
        }

        return sampled;
    }

    updateText(selector, value) {
        const el = Utils.getElement(selector);
        if (el) el.textContent = value;
    }
}

class AchievementManager {
    constructor(state) {
        this.state = state;
        this.container = Utils.getElement('#achievements-grid');
    }

    render() {
        if (!this.container) return;

        const fragment = document.createDocumentFragment();
        ACHIEVEMENTS.forEach((achievement) => {
            const unlocked = this.state.achievedAchievements.includes(achievement.day);
            const badge = Utils.createElement('div', {
                className: `achievement-badge ${unlocked ? 'unlocked' : ''}`
            });
            badge.innerHTML = `
                <div class="achievement-icon">${achievement.emoji}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-unlock-at">Day ${achievement.day}</div>
            `;
            fragment.appendChild(badge);
        });

        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}

class StatisticsManager {
    constructor(state, dataManager) {
        this.state = state;
        this.dataManager = dataManager;
    }

    render() {
        this.updateText('#stats-completed', `${this.state.getCompletedCount()}`);
        this.updateText('#stats-remaining', `${this.state.getRemainingCount()}`);
        this.updateText('#stats-progress', `${this.state.getProgressPercent()}`);
        this.updateText('#stats-badges', `${this.state.achievedAchievements.length}`);

        this.renderModuleStats();
        this.renderInsights();
    }

    renderModuleStats() {
        const container = Utils.getElement('#module-stats');
        if (!container) return;

        const rows = [];
        (this.dataManager.roadmap?.phases || []).forEach((phase) => {
            (phase.modules || []).forEach((module) => {
                const days = this.dataManager.flatLearningDays.filter((d) => d.moduleTitle === module.title);
                const done = days.filter((d) => this.state.isDayCompleted(d.dayNumber)).length;
                rows.push(`<div class="module-stat-item"><span class="module-stat-name">Phase ${phase.phaseNumber} - ${module.title}</span><span class="module-stat-value">${done}/${days.length}</span></div>`);
            });
        });

        container.innerHTML = rows.join('');
    }

    renderInsights() {
        const container = Utils.getElement('#insights-list');
        if (!container) return;

        const completed = this.state.getCompletedCount();
        const insights = [];

        if (completed === 0) insights.push('Start Day 1 to unlock your learning streak.');
        if (completed > 0 && completed < 30) insights.push('Early consistency matters more than speed. Focus on daily completion.');
        if (completed >= 30 && completed < 100) insights.push('You are building strong engineering depth. Keep assignments hands-on.');
        if (completed >= 100) insights.push('You are in advanced execution stage. Emphasize production readiness and interviews.');

        insights.push(`Current streak: ${this.state.streaks.current} days`);
        insights.push(`Longest streak: ${this.state.streaks.longest} days`);
        insights.push(`Learning hours completed: ${this.state.getLearningHours(this.dataManager)} hrs`);

        container.innerHTML = insights.map((i) => `<li>${i}</li>`).join('');
    }

    updateText(selector, value) {
        const el = Utils.getElement(selector);
        if (el) el.textContent = value;
    }
}

class SettingsManager {
    constructor(state, storage) {
        this.state = state;
        this.storage = storage;
        this.registerEvents();
        this.loadSettings();
    }

    registerEvents() {
        const profileForm = Utils.getElement('#profile-form');
        profileForm?.addEventListener('submit', (e) => this.handleProfileSubmit(e));

        Utils.getElement('#export-btn')?.addEventListener('click', () => this.handleExport());

        Utils.getElement('#import-btn')?.addEventListener('click', () => {
            Utils.getElement('#import-file')?.click();
        });

        Utils.getElement('#import-file')?.addEventListener('change', (e) => this.handleImport(e));
        Utils.getElement('#reset-btn')?.addEventListener('click', () => this.handleReset());
    }

    loadSettings() {
        const studentName = this.state.settings.studentName || '';
        const targetRole = this.state.settings.targetRole || '';

        const studentInput = Utils.getElement('#settings-student-name');
        const roleInput = Utils.getElement('#settings-target-role');
        const githubInput = Utils.getElement('#settings-github');
        const linkedinInput = Utils.getElement('#settings-linkedin');

        if (studentInput) studentInput.value = studentName;
        if (roleInput) roleInput.value = targetRole;
        if (githubInput) githubInput.value = this.state.settings.github || '';
        if (linkedinInput) linkedinInput.value = this.state.settings.linkedin || '';

        const displayName = Utils.getElement('#student-name-display');
        const displayRole = Utils.getElement('#target-role-display');
        if (displayName) displayName.textContent = studentName || 'Welcome Saisuresh';
        if (displayRole) displayRole.textContent = targetRole || 'Here is your course to become an MLOps Engineer';
    }

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

    handleExport() {
        const data = this.storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mlops-academy-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    handleImport(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = Utils.parseJSON(event.target.result, null);
            if (!data) {
                Utils.alert('Invalid import file format.');
                return;
            }
            const ok = this.storage.importData(data);
            if (ok) {
                Utils.alert('Progress imported successfully!');
                window.location.reload();
            } else {
                Utils.alert('Unable to import progress file.');
            }
        };
        reader.readAsText(file);
    }

    handleReset() {
        if (!Utils.confirm('Are you sure you want to reset all progress? This cannot be undone.')) return;
        this.storage.clear();
        Utils.alert('All progress has been reset.');
        window.location.reload();
    }
}

class App {
    constructor() {
        this.storage = new StorageManager();
        this.dataManager = new DataManager();
        this.state = new StateManager(DEFAULT_TOTAL_LEARNING_DAYS);
        this.notesKey = 'mlops-academy-notes';

        this.dashboardManager = null;
        this.roadmapManager = null;
        this.progressManager = null;
        this.achievementManager = null;
        this.statisticsManager = null;
        this.settingsManager = null;
    }

    async init() {
        try {
            await this.dataManager.load();
            this.state.initialize(this.storage, this.dataManager);

            this.dashboardManager = new DashboardManager(this.state, this.dataManager);
            this.roadmapManager = new RoadmapManager(this.state, this.dataManager);
            this.progressManager = new ProgressManager(this.state, this.dataManager);
            this.achievementManager = new AchievementManager(this.state);
            this.statisticsManager = new StatisticsManager(this.state, this.dataManager);
            this.settingsManager = new SettingsManager(this.state, this.storage);

            this.applyArchitectureLayout();

            this.registerNavigationEvents();
            this.registerUpdateEvents();

            this.renderAll();
            this.saveState();
        } catch (error) {
            console.error('Initialization failed:', error);
            Utils.alert('Unable to initialize portal. Please refresh the page.');
        }
    }

    registerNavigationEvents() {
        const navButtons = Utils.getElements('.nav-btn');
        navButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.switchSection(section);

                navButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    registerUpdateEvents() {
        window.addEventListener('dayUpdated', () => {
            this.state.updateCurrentPosition(this.dataManager);
            this.renderAll();
            this.renderExtendedSections();
            this.saveState();
        });

        window.addEventListener('settingsUpdated', () => {
            this.dashboardManager.render();
            this.saveState();
        });
    }

    switchSection(sectionName) {
        Utils.getElements('.section').forEach((section) => section.classList.remove('active'));
        const active = Utils.getElement(`#${sectionName}`);
        if (active) active.classList.add('active');

        if (sectionName === 'progress' && this.progressManager) {
            this.progressManager.render();
        }
    }

    renderAll() {
        this.dashboardManager.render();
        this.roadmapManager.render();
        this.progressManager.render();
        this.achievementManager.render();
        this.statisticsManager.render();
        this.renderExtendedSections();
    }

    saveState() {
        this.storage.saveCompletedDays(this.state.completedDays);
        this.storage.saveCompletionDates(this.state.completionDates);
        this.storage.savePosition(this.state.currentPosition);
        this.storage.saveSettings(this.state.settings);
        this.storage.saveAchievements(this.state.achievedAchievements);
        this.storage.saveStreaks(this.state.streaks.current, this.state.streaks.longest);
    }

    applyArchitectureLayout() {
        // Rename Roadmap section to Curriculum while keeping existing section id.
        const roadmapButton = Utils.getElement('.nav-btn[data-section="roadmap"]');
        if (roadmapButton) roadmapButton.textContent = 'Curriculum';

        const roadmapTitle = Utils.getElement('#roadmap .section-header h2');
        const roadmapDescription = Utils.getElement('#roadmap .section-description');
        if (roadmapTitle) roadmapTitle.textContent = 'Curriculum';
        if (roadmapDescription) roadmapDescription.textContent = 'Phase -> Week -> Day learning structure';

        this.ensureExtraSection('notes', 'Notes', 'Capture daily learning reflections and blockers', `
            <div class="settings-section">
                <h3>Daily Notes</h3>
                <textarea id="learning-notes-text" class="form-input" rows="10" placeholder="Write daily notes, blockers, and learnings..."></textarea>
                <div style="margin-top: 1rem;">
                    <button id="save-notes-btn" class="btn btn-primary" type="button">Save Notes</button>
                </div>
            </div>
        `);

        this.ensureExtraSection('resources', 'Resources', 'Reference map by phase and core domain', `
            <div class="settings-section">
                <h3>Phase Resource Index</h3>
                <div id="resources-content" class="module-stats"></div>
            </div>
        `);

        this.ensureExtraSection('github-portfolio', 'GitHub Portfolio', 'Track deliverables for your public engineering profile', `
            <div class="settings-section">
                <h3>Portfolio Tracks</h3>
                <div id="portfolio-content" class="module-stats"></div>
            </div>
        `);

        this.ensureExtraSection('capstone', 'Capstone', 'Enterprise capstone readiness and completion checklist', `
            <div class="settings-section">
                <h3>Capstone Status</h3>
                <div id="capstone-content" class="module-stats"></div>
            </div>
        `);

        this.registerNotesEvents();
    }

    ensureExtraSection(sectionId, title, description, bodyHtml) {
        const navList = Utils.getElement('.nav-list');
        const mainContent = Utils.getElement('.main-content');
        const settingsSection = Utils.getElement('#settings');
        const settingsNavButton = Utils.getElement('.nav-btn[data-section="settings"]');

        if (!navList || !mainContent || !settingsSection || !settingsNavButton) return;

        if (!Utils.getElement(`#${sectionId}`)) {
            const section = Utils.createElement('section', { id: sectionId, className: 'section' });
            section.innerHTML = `
                <div class="section-header">
                    <h2>${title}</h2>
                    <p class="section-description">${description}</p>
                </div>
                <div class="settings-container">${bodyHtml}</div>
            `;
            mainContent.insertBefore(section, settingsSection);
        }

        if (!Utils.getElement(`.nav-btn[data-section="${sectionId}"]`)) {
            const li = Utils.createElement('li');
            const button = Utils.createElement('button', {
                className: 'nav-btn',
                type: 'button'
            });
            button.setAttribute('data-section', sectionId);
            button.textContent = title;
            li.appendChild(button);

            const settingsLi = settingsNavButton.closest('li');
            if (settingsLi) {
                navList.insertBefore(li, settingsLi);
            } else {
                navList.appendChild(li);
            }
        }
    }

    registerNotesEvents() {
        const notesText = Utils.getElement('#learning-notes-text');
        const saveButton = Utils.getElement('#save-notes-btn');
        if (!notesText || !saveButton) return;

        notesText.value = localStorage.getItem(this.notesKey) || '';
        saveButton.addEventListener('click', () => {
            localStorage.setItem(this.notesKey, notesText.value || '');
            Utils.alert('Notes saved.');
        });
    }

    renderExtendedSections() {
        this.renderResources();
        this.renderPortfolio();
        this.renderCapstone();
    }

    renderResources() {
        const container = Utils.getElement('#resources-content');
        if (!container) return;

        const rows = (this.dataManager.roadmap?.phases || []).map((phase) => {
            const weekCount = (phase.modules || []).reduce((sum, module) => sum + (module.weeks || []).length, 0);
            return `<div class="module-stat-item"><span class="module-stat-name">Phase ${phase.phaseNumber}: ${phase.title}</span><span class="module-stat-value">${weekCount} weeks</span></div>`;
        });

        container.innerHTML = rows.join('');
    }

    renderPortfolio() {
        const container = Utils.getElement('#portfolio-content');
        if (!container) return;

        const tracks = this.dataManager.roadmap?.academy?.portfolioTracks || [];
        container.innerHTML = tracks.map((track) => `<div class="module-stat-item"><span class="module-stat-name">${track}</span><span class="module-stat-value">Track</span></div>`).join('');
    }

    renderCapstone() {
        const container = Utils.getElement('#capstone-content');
        if (!container) return;

        const completed = this.state.getCompletedCount();
        const progress = this.state.getProgressPercent();
        const capstoneStart = 171;
        const capstoneComplete = this.state.completedDays.filter((d) => d >= capstoneStart).length;

        container.innerHTML = `
            <div class="module-stat-item"><span class="module-stat-name">Overall Completion</span><span class="module-stat-value">${completed}/${this.state.totalDays}</span></div>
            <div class="module-stat-item"><span class="module-stat-name">Overall Progress</span><span class="module-stat-value">${progress}%</span></div>
            <div class="module-stat-item"><span class="module-stat-name">Enterprise Platform Days</span><span class="module-stat-value">${capstoneComplete}/30</span></div>
            <div class="module-stat-item"><span class="module-stat-name">Capstone Focus</span><span class="module-stat-value">Phase 15-16</span></div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
});

window.addEventListener('error', (e) => {
    console.error('Unhandled app error:', e.error || e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
