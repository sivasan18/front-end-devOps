/**
 * Front-End Developer Roadmap 2025
 * Enhanced with Confirmation Modal, Locking System, & Edit Mode
 */

// ===================================
// Constants
// ===================================
const STORAGE_KEY = 'frontend_roadmap_progress';
const LOCKED_KEY = 'frontend_roadmap_locked';
const PASSPHRASE_KEY = 'frontend_roadmap_passphrase';
const AUDIT_LOG_KEY = 'frontend_roadmap_audit';
const CIRCUMFERENCE = 2 * Math.PI * 26; // Circle radius = 26
const DEFAULT_PASSPHRASE = 'admin123'; // Default passphrase

// ===================================
// State Management
// ===================================
class RoadmapManager {
    constructor() {
        this.checkboxes = document.querySelectorAll('input[type="checkbox"]');
        this.currentCheckbox = null;
        this.isEditMode = false;
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadLockedStates();
        this.setupPassphrase();
        this.attachEventListeners();
        this.attachModalListeners();
        this.attachEditModeListeners();
        this.updateAllProgress();
        this.initIntersectionObserver();
    }

    // ===================================
    // LocalStorage Operations
    // ===================================

    loadProgress() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const progress = JSON.parse(saved);
                this.checkboxes.forEach((checkbox, index) => {
                    if (progress[index]) {
                        checkbox.checked = true;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    saveProgress() {
        try {
            const progress = {};
            this.checkboxes.forEach((checkbox, index) => {
                progress[index] = checkbox.checked;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    loadLockedStates() {
        try {
            const locked = JSON.parse(localStorage.getItem(LOCKED_KEY) || '{}');
            this.checkboxes.forEach((checkbox, index) => {
                if (locked[index]) {
                    this.lockCheckbox(checkbox, index, false); // Load without  logging
                }
            });
        } catch (error) {
            console.error('Error loading locked states:', error);
        }
    }

    saveLockedState(index, isLocked) {
        try {
            const locked = JSON.parse(localStorage.getItem(LOCKED_KEY) || '{}');
            locked[index] = isLocked;
            localStorage.setItem(LOCKED_KEY, JSON.stringify(locked));
        } catch (error) {
            console.error('Error saving locked state:', error);
        }
    }

    lockCheckbox(checkbox, index, addLog = true) {
        const item = checkbox.closest('.checkbox-item');
        if (item) {
            item.classList.add('locked');

            if (!this.isEditMode) {
                item.setAttribute('data-locked-message', 'Locked — completion saved');
                checkbox.disabled = true;
            } else {
                // In Edit Mode, keep enabled and no tooltip
                item.removeAttribute('data-locked-message');
                checkbox.disabled = false;
            }

            this.saveLockedState(index, true);

            if (addLog) {
                this.addAuditLog('lock', index, checkbox.nextElementSibling.textContent.trim());
            }
        }
    }

    unlockCheckbox(checkbox, index) {
        const item = checkbox.closest('.checkbox-item');
        if (item) {
            item.classList.remove('locked');
            item.removeAttribute('data-locked-message');
            checkbox.disabled = false;
            this.saveLockedState(index, false);
            this.addAuditLog('unlock', index, checkbox.nextElementSibling.textContent.trim());
        }
    }

    // ===================================
    // Passphrase Management
    // ===================================

    setupPassphrase() {
        const stored = localStorage.getItem(PASSPHRASE_KEY);
        if (!stored) {
            localStorage.setItem(PASSPHRASE_KEY, DEFAULT_PASSPHRASE);
            console.log('🔒 Default passphrase set. Use "admin123" to access Edit Mode.');
            console.log('💡 Tip: Change it via console: localStorage.setItem("frontend_roadmap_passphrase", "your_new_password")');
        }
    }

    verifyPassphrase(input) {
        const stored = localStorage.getItem(PASSPHRASE_KEY);
        return input === stored;
    }

    // ===================================
    // Audit Trail
    // ===================================

    addAuditLog(action, checkboxIndex, topicName) {
        try {
            const logs = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
            logs.push({
                timestamp: new Date().toISOString(),
                action, // 'lock' or 'unlock'
                checkboxIndex,
                topicName,
                editMode: this.isEditMode
            });
            localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error('Error adding audit log:', error);
        }
    }

    getAuditLogs() {
        try {
            return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
        } catch (error) {
            console.error('Error reading audit logs:', error);
            return [];
        }
    }

    // ===================================
    // Event Listeners
    // ===================================

    attachEventListeners() {
        this.checkboxes.forEach((checkbox, index) => {
            // Use 'click' event to intercept state changes before they finalize
            checkbox.addEventListener('click', (e) => {
                const item = checkbox.closest('.checkbox-item');
                const isLocked = item.classList.contains('locked');

                // Handle Edit Mode
                if (this.isEditMode) {
                    // Single-click behavior: just update state based on new checked status
                    if (checkbox.checked) {
                        // Became checked -> Lock it (Edit Mode keeps it enabled/no tooltip)
                        this.lockCheckbox(checkbox, index);
                    } else {
                        // Became unchecked -> Unlock it
                        this.unlockCheckbox(checkbox, index);
                    }

                    this.saveProgress();
                    this.updateAllProgress();
                    return;
                }

                // Handle Normal Completion (Locking)
                if (checkbox.checked && !checkbox.disabled && !isLocked) {
                    e.preventDefault(); // Prevent immediate checking
                    this.currentCheckbox = checkbox;
                    this.showConfirmModal(checkbox);
                }
            });
        });

        // Certificate Button Listener
        const certBtn = document.getElementById('claimCertBtn');
        if (certBtn) {
            certBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (certBtn.classList.contains('disabled')) {
                    const stats = getStatistics();
                    alert(`🚫 Certificate Locked!\n\nYou have completed ${stats.percentage} of the roadmap.\nYou must complete ALL topics (100%) to claim your certificate.\n\nKeep going! 🚀`);
                } else {
                    window.open('certificate.html', '_blank');
                }
            });
        }
    }

    attachModalListeners() {
        const confirmModal = document.getElementById('confirmModal');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');

        modalCancel.addEventListener('click', () => {
            this.hideConfirmModal();
            this.currentCheckbox = null;
        });

        modalConfirm.addEventListener('click', () => {
            if (this.currentCheckbox) {
                this.confirmCompletion();
            }
        });

        // Close modal on overlay click
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                this.hideConfirmModal();
                this.currentCheckbox = null;
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideConfirmModal();
                this.hidePassphraseModal();
            }
        });
    }

    attachEditModeListeners() {
        const editModeBtn = document.getElementById('editModeBtn');
        const passphraseModal = document.getElementById('passphraseModal');
        const passphraseCancel = document.getElementById('passphraseCancel');
        const passphraseConfirm = document.getElementById('passphraseConfirm');
        const passphraseInput = document.getElementById('passphraseInput');

        editModeBtn.addEventListener('click', () => {
            if (this.isEditMode) {
                this.disableEditMode();
            } else {
                this.showPassphraseModal();
            }
        });

        passphraseCancel.addEventListener('click', () => {
            this.hidePassphraseModal();
            passphraseInput.value = '';
        });

        passphraseConfirm.addEventListener('click', () => {
            const input = passphraseInput.value;
            if (this.verifyPassphrase(input)) {
                this.enableEditMode();
                this.hidePassphraseModal();
                passphraseInput.value = '';
            } else {
                const hint = document.getElementById('passphraseHint');
                hint.textContent = '❌ Incorrect passphrase. Try again.';
                hint.style.color = '#ef4444';
                passphraseInput.value = '';
                passphraseInput.focus();

                setTimeout(() => {
                    hint.textContent = '';
                }, 3000);
            }
        });

        // Enter key in passphrase input
        passphraseInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passphraseConfirm.click();
            }
        });

        // Close passphrase modal on overlay click
        passphraseModal.addEventListener('click', (e) => {
            if (e.target === passphraseModal) {
                this.hidePassphraseModal();
                passphraseInput.value = '';
            }
        });
    }

    // ===================================
    // Modal Operations
    // ===================================

    showConfirmModal(checkbox) {
        const modal = document.getElementById('confirmModal');
        const topicName = checkbox.nextElementSibling.textContent.trim();
        document.getElementById('modalTopicName').textContent = `"${topicName}"`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showPassphraseModal() {
        const modal = document.getElementById('passphraseModal');
        const hint = document.getElementById('passphraseHint');
        hint.textContent = 'First time? Default passphrase is "admin123"';
        hint.style.color = 'var(--text-muted)';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus input after animation
        setTimeout(() => {
            document.getElementById('passphraseInput').focus();
        }, 300);
    }

    hidePassphraseModal() {
        const modal = document.getElementById('passphraseModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    confirmCompletion() {
        if (this.currentCheckbox) {
            const index = Array.from(this.checkboxes).indexOf(this.currentCheckbox);
            this.currentCheckbox.checked = true;
            this.lockCheckbox(this.currentCheckbox, index);
            this.saveProgress();
            this.updateAllProgress();
            this.animateCheckbox(this.currentCheckbox);
            this.hideConfirmModal();
            this.currentCheckbox = null;
        }
    }

    // ===================================
    // Edit Mode
    // ===================================

    enableEditMode() {
        this.isEditMode = true;
        document.body.classList.add('edit-mode');
        const btn = document.getElementById('editModeBtn');
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Exit Edit Mode';

        // Enable all locked checkboxes
        this.checkboxes.forEach(checkbox => {
            const item = checkbox.closest('.checkbox-item');
            if (item && item.classList.contains('locked')) {
                checkbox.disabled = false; // Enable interaction
                item.removeAttribute('data-locked-message'); // Remove tooltip
            }
        });

        console.log('🔓 Edit Mode ENABLED - You can now unlock completed items');
        this.addAuditLog('edit_mode_enabled', -1, 'System');
    }

    disableEditMode() {
        this.isEditMode = false;
        document.body.classList.remove('edit-mode');
        const btn = document.getElementById('editModeBtn');
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Edit Mode';

        // Re-lock all completed checkboxes
        this.checkboxes.forEach(checkbox => {
            const item = checkbox.closest('.checkbox-item');
            if (item && item.classList.contains('locked')) {
                checkbox.disabled = true; // Disable interaction
                item.setAttribute('data-locked-message', 'Locked — completion saved'); // Restore tooltip
            }
        });

        console.log('🔓 Edit Mode DISABLED');
        this.addAuditLog('edit_mode_disabled', -1, 'System');
    }

    // ===================================
    // Progress Tracking
    // ===================================

    animateCheckbox(checkbox) {
        const item = checkbox.closest('.checkbox-item');
        if (item) {
            item.style.transform = 'scale(1.05)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateAllProgress() {
        this.updateOverallProgress();
        this.updatePhaseProgress();
    }

    updateOverallProgress() {
        const total = this.checkboxes.length;
        const checked = Array.from(this.checkboxes).filter(cb => cb.checked).length;
        const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

        const progressFill = document.getElementById('overallProgress');
        const progressText = document.getElementById('overallPercentage');

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }

        // Handle Certificate Button
        const certBtn = document.getElementById('claimCertBtn');
        if (certBtn) {
            if (percentage === 100) {
                certBtn.classList.remove('disabled');
                certBtn.classList.add('pulse-animation'); // Optional: add pulse when ready
            } else {
                certBtn.classList.add('disabled');
                certBtn.classList.remove('pulse-animation');
            }
        }
    }

    updatePhaseProgress() {
        const phases = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'bonus'];

        phases.forEach(phaseId => {
            const phaseCheckboxes = document.querySelectorAll(`input[data-phase="${phaseId}"]`);
            const total = phaseCheckboxes.length;
            const checked = Array.from(phaseCheckboxes).filter(cb => cb.checked).length;
            const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

            const circle = document.querySelector(`circle[data-phase-id="${phaseId}"]`);
            const text = document.querySelector(`text[data-phase-text="${phaseId}"]`);

            if (circle) {
                const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
                circle.style.strokeDashoffset = offset;

                if (percentage === 100) {
                    circle.style.stroke = '#f59e0b'; // Saffron for complete
                } else if (percentage > 0) {
                    circle.style.stroke = '#dc2626'; // Red for in progress
                } else {
                    circle.style.stroke = '#451a03'; // Dark brown for not started
                }
            }

            if (text) {
                text.textContent = `${percentage}%`;
            }
        });
    }

    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        document.querySelectorAll('.phase-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// ===================================
// Utility Functions
// ===================================

function resetProgress() {
    if (confirm('⚠️ DANGER: Reset ALL progress and locked states?\n\nThis will:\n- Clear all completed items\n- Unlock all locked topics\n- Delete audit logs\n\nThis CANNOT be undone!')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOCKED_KEY);
        localStorage.removeItem(AUDIT_LOG_KEY);
        console.log('✅ All progress reset. Reloading page...');
        setTimeout(() => window.location.reload(), 500);
    }
}

function viewAuditLog() {
    const logs = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');

    if (logs.length === 0) {
        console.log('📋 Audit log is empty');
        return;
    }

    console.log(`📋 Audit Log (${logs.length} entries):\n`);
    console.table(logs.map((log, index) => ({
        '#': index + 1,
        Time: new Date(log.timestamp).toLocaleString(),
        Action: log.action,
        Topic: log.topicName,
        'Edit Mode': log.editMode ? 'Yes' : 'No'
    })));
}

function exportProgress() {
    try {
        const progress = localStorage.getItem(STORAGE_KEY);
        const locked = localStorage.getItem(LOCKED_KEY);
        const audit = localStorage.getItem(AUDIT_LOG_KEY);

        const exportData = {
            exportDate: new Date().toISOString(),
            progress: progress ? JSON.parse(progress) : {},
            locked: locked ? JSON.parse(locked) : {},
            auditLog: audit ? JSON.parse(audit) : []
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportName = `roadmap-backup-${new Date().toISOString().split('T')[0]}.json`;

        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportName);
        link.click();

        console.log('✅ Progress exported successfully!');
    } catch (error) {
        console.error('❌ Export failed:', error);
    }
}

function changePassphrase(newPassphrase) {
    if (!newPassphrase || newPassphrase.length < 4) {
        console.error('❌ Passphrase must be at least 4 characters');
        return;
    }

    localStorage.setItem(PASSPHRASE_KEY, newPassphrase);
    console.log('✅ Passphrase updated successfully!');
    console.log('🔒 New passphrase:', newPassphrase);
}

function getStatistics() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const locked = JSON.parse(localStorage.getItem(LOCKED_KEY) || '{}');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const lockedCount = Object.values(locked).filter(Boolean).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    const stats = {
        total,
        completed: checked,
        locked: lockedCount,
        remaining: total - checked,
        percentage: `${percentage}%`
    };

    console.table(stats);
    return stats;
}

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K - Statistics
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const stats = getStatistics();
        alert(`📊 Progress Statistics\n\nCompleted: ${stats.completed}/${stats.total}\nLocked: ${stats.locked}\nRemaining: ${stats.remaining}\nProgress: ${stats.percentage}`);
    }

    // Ctrl/Cmd + L - View Audit Log
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        viewAuditLog();
    }
});

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const manager = new RoadmapManager();

    // Expose globally for debugging
    window.roadmapUtils = {
        resetProgress,
        exportProgress,
        viewAuditLog,
        changePassphrase,
        getStatistics,
        manager
    };

    console.log('🚀 Front-End Roadmap with Locking System initialized!');
    console.log('📌 Available commands:');
    console.log('  - roadmapUtils.getStatistics() - View progress stats');
    console.log('  - roadmapUtils.viewAuditLog() - View all lock/unlock actions');
    console.log('  - roadmapUtils.exportProgress() - Download backup');
    console.log('  - roadmapUtils.changePassphrase("new_password") - Change passphrase');
    console.log('  - roadmapUtils.resetProgress() - Reset everything (dangerous!)');
    console.log('⌨️  Keyboard shortcuts:');
    console.log('  - Ctrl/Cmd + K - View statistics');
    console.log('  - Ctrl/Cmd + L - View audit log');
    console.log('🔒 Default Edit Mode passphrase: "admin123"');
});
