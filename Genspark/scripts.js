// Blog System Main JavaScript
// This consolidated script handles all functionality for the blog
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize common elements
    initializeCommonElements();
    
    // Check if specific page functionality should be initialized
    if (document.querySelector('.blog-posts')) {
        initializeBlogFiltering();
    }
    
    if (document.querySelector('.theme-controls')) {
        initializeThemeControls();
    }
    
    if (document.querySelector('.call-tracker-form')) {
        initializeCallTracker();
    }
    
    if (document.querySelector('.metacognition-journal')) {
        initializeMetacognitionJournal();
    }
});

// ===========================================
// COMMON FUNCTIONALITY FOR ALL PAGES
// ===========================================
function initializeCommonElements() {
    // Initialize mobile navigation toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Set current page as active in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Initialize dark mode toggle if present
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Handle toggle changes
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// ===========================================
// BLOG POST FILTERING FUNCTIONALITY
// ===========================================
function initializeBlogFiltering() {
    const postsContainer = document.querySelector('.blog-posts');
    const allPosts = Array.from(postsContainer.querySelectorAll('.blog-post'));
    const categoryLinks = document.querySelectorAll('.category-filter');
    
    // Set up category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Show/hide posts based on category
            allPosts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = '';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
    
    // Initialize search functionality if search input exists
    const searchInput = document.querySelector('.blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            allPosts.forEach(post => {
                const postTitle = post.querySelector('h2, h3').textContent.toLowerCase();
                const postContent = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
                
                if (searchTerm === '' || 
                    postTitle.includes(searchTerm) || 
                    postContent.includes(searchTerm)) {
                    post.style.display = '';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
}

// ===========================================
// THEME CONTROLS FUNCTIONALITY
// ===========================================
function initializeThemeControls() {
    const root = document.documentElement;
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const fontSelector = document.querySelector('#font-selector');
    const animationToggle = document.querySelector('#animation-toggle');
    
    // Handle color swatch selection
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const colorVariable = this.dataset.variable;
            const colorValue = this.dataset.color;
            
            if (colorVariable && colorValue) {
                // Remove active class from all swatches in this group
                const swatchGroup = this.closest('.swatch-group');
                if (swatchGroup) {
                    swatchGroup.querySelectorAll('.color-swatch').forEach(s => {
                        s.classList.remove('active');
                    });
                }
                
                // Set as active
                this.classList.add('active');
                
                // Set the CSS variable
                root.style.setProperty(colorVariable, colorValue);
                
                // Save preference
                localStorage.setItem(colorVariable, colorValue);
            }
        });
        
        // Set initial active state based on saved preference or current value
        const colorVariable = swatch.dataset.variable;
        if (colorVariable) {
            const savedColor = localStorage.getItem(colorVariable);
            const currentColor = getComputedStyle(root).getPropertyValue(colorVariable).trim();
            
            if ((savedColor && savedColor === swatch.dataset.color) || 
                (!savedColor && currentColor === swatch.dataset.color)) {
                swatch.classList.add('active');
            }
        }
    });
    
    // Handle font selection if present
    if (fontSelector) {
        fontSelector.addEventListener('change', function() {
            const fontFamily = this.value;
            root.style.setProperty('--font-family', fontFamily);
            localStorage.setItem('font-family', fontFamily);
        });
        
        // Set initial font based on saved preference
        const savedFont = localStorage.getItem('font-family');
        if (savedFont) {
            fontSelector.value = savedFont;
            root.style.setProperty('--font-family', savedFont);
        }
    }
    
    // Handle animation toggle if present
    if (animationToggle) {
        animationToggle.addEventListener('change', function() {
            if (this.checked) {
                root.classList.remove('reduce-motion');
                localStorage.setItem('reduce-motion', 'false');
            } else {
                root.classList.add('reduce-motion');
                localStorage.setItem('reduce-motion', 'true');
            }
        });
        
        // Set initial state based on saved preference
        const savedMotionPreference = localStorage.getItem('reduce-motion');
        if (savedMotionPreference === 'true') {
            animationToggle.checked = false;
            root.classList.add('reduce-motion');
        } else if (savedMotionPreference === 'false') {
            animationToggle.checked = true;
            root.classList.remove('reduce-motion');
        } else {
            // If no preference saved, check for OS-level preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                animationToggle.checked = false;
                root.classList.add('reduce-motion');
            }
        }
    }
}

// ===========================================
// CALL TRACKER FUNCTIONALITY
// ===========================================
function initializeCallTracker() {
    const callForm = document.querySelector('.call-tracker-form');
    const callTable = document.querySelector('.calls-table tbody');
    const notification = document.querySelector('.notification');
    
    // Load saved calls from localStorage
    let savedCalls = JSON.parse(localStorage.getItem('call-tracker-data')) || [];
    
    // Render saved calls to table
    renderCallsTable();
    
    // Handle form submission for new calls
    if (callForm) {
        callForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(callForm);
            const newCall = {
                id: Date.now(), // Use timestamp as unique ID
                name: formData.get('name'),
                phone: formData.get('phone'),
                followUpDate: formData.get('followup-date'),
                status: formData.get('status') || 'Pending',
                conversation: formData.get('conversation') || 'No notes',
                createdAt: new Date().toISOString()
            };
            
            // Validate required fields
            if (!newCall.name || !newCall.phone || !newCall.followUpDate) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Add to calls array
            savedCalls.push(newCall);
            
            // Save to localStorage
            localStorage.setItem('call-tracker-data', JSON.stringify(savedCalls));
            
            // Update table
            renderCallsTable();
            
            // Reset form
            callForm.reset();
            
            // Show success notification
            showNotification('Call logged successfully', 'success');
        });
    }
    
    // Function to render calls table
    function renderCallsTable() {
        if (!callTable) return;
        
        // Clear current table rows
        callTable.innerHTML = '';
        
        // Sort calls by follow-up date (ascending)
        savedCalls.sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
        
        if (savedCalls.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="6" class="empty-state">No calls logged yet. Add some using the form.</td>`;
            callTable.appendChild(emptyRow);
            return;
        }
        
        // Add each call to table
        savedCalls.forEach(call => {
            const row = document.createElement('tr');
            
            // Highlight overdue follow-ups
            const followUpDate = new Date(call.followUpDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Strip time part for date comparison
            
            if (followUpDate < today && call.status !== 'Completed') {
                row.classList.add('overdue');
            }
            
            row.innerHTML = `
                <td>${call.name}</td>
                <td>${call.phone}</td>
                <td>${new Date(call.followUpDate).toLocaleDateString()}</td>
                <td>
                    <select class="status-select" data-id="${call.id}">
                        <option value="Pending" ${call.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${call.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${call.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td>${call.conversation}</td>
                <td>
                    <button class="edit-button" data-id="${call.id}">
                        <span class="sr-only">Edit</span>
                        ✏️
                    </button>
                    <button class="delete-button" data-id="${call.id}">
                        <span class="sr-only">Delete</span>
                        🗑️
                    </button>
                </td>
            `;
            
            callTable.appendChild(row);
        });
        
        // Add event listeners to buttons and status selects
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', function() {
                const callId = parseInt(this.dataset.id);
                const call = savedCalls.find(c => c.id === callId);
                
                if (call) {
                    call.status = this.value;
                    localStorage.setItem('call-tracker-data', JSON.stringify(savedCalls));
                    
                    // Re-render to update any highlighting
                    renderCallsTable();
                }
            });
        });
        
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const callId = parseInt(this.dataset.id);
                const call = savedCalls.find(c => c.id === callId);
                
                if (call && callForm) {
                    // Populate form with call data
                    callForm.elements['name'].value = call.name;
                    callForm.elements['phone'].value = call.phone;
                    callForm.elements['followup-date'].value = call.followUpDate;
                    if (callForm.elements['status']) {
                        callForm.elements['status'].value = call.status;
                    }
                    if (callForm.elements['conversation']) {
                        callForm.elements['conversation'].value = call.conversation;
                    }
                    
                    // Scroll to form
                    callForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // Change button text and add edit mode
                    const submitButton = callForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.textContent = 'Update Call';
                        submitButton.dataset.editId = callId;
                    }
                    
                    // Add cancel button if it doesn't exist
                    if (!callForm.querySelector('.cancel-edit')) {
                        const cancelButton = document.createElement('button');
                        cancelButton.type = 'button';
                        cancelButton.textContent = 'Cancel';
                        cancelButton.classList.add('cancel-edit', 'button', 'secondary');
                        cancelButton.addEventListener('click', () => {
                            callForm.reset();
                            submitButton.textContent = 'Log Call';
                            delete submitButton.dataset.editId;
                            cancelButton.remove();
                        });
                        submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
                    }
                    
                    // Change form submit handler to update instead of create
                    callForm.onsubmit = function(e) {
                        e.preventDefault();
                        
                        const formData = new FormData(callForm);
                        const editId = parseInt(submitButton.dataset.editId);
                        const callIndex = savedCalls.findIndex(c => c.id === editId);
                        
                        if (callIndex !== -1) {
                            // Update call data
                            savedCalls[callIndex] = {
                                ...savedCalls[callIndex],
                                name: formData.get('name'),
                                phone: formData.get('phone'),
                                followUpDate: formData.get('followup-date'),
                                status: formData.get('status') || savedCalls[callIndex].status,
                                conversation: formData.get('conversation') || savedCalls[callIndex].conversation,
                                updatedAt: new Date().toISOString()
                            };
                            
                            // Save updated calls
                            localStorage.setItem('call-tracker-data', JSON.stringify(savedCalls));
                            
                            // Reset form and render table
                            callForm.reset();
                            renderCallsTable();
                            
                            // Reset form to normal add mode
                            submitButton.textContent = 'Log Call';
                            delete submitButton.dataset.editId;
                            
                            // Remove cancel button
                            const cancelButton = callForm.querySelector('.cancel-edit');
                            if (cancelButton) cancelButton.remove();
                            
                            // Restore normal submit behavior
                            callForm.onsubmit = null;
                            
                            // Show success notification
                            showNotification('Call updated successfully', 'success');
                        }
                    };
                }
            });
        });
        
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                if (!confirm('Are you sure you want to delete this call?')) return;
                
                const callId = parseInt(this.dataset.id);
                savedCalls = savedCalls.filter(call => call.id !== callId);
                
                // Save updated calls
                localStorage.setItem('call-tracker-data', JSON.stringify(savedCalls));
                
                // Re-render table
                renderCallsTable();
                
                // Show notification
                showNotification('Call deleted', 'info');
            });
        });
    }
    
    // Function to show notifications
    function showNotification(message, type = 'info') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification'; // Reset classes
        notification.classList.add(type);
        notification.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// ===========================================
// METACOGNITION JOURNAL FUNCTIONALITY
// ===========================================
function initializeMetacognitionJournal() {
    const journalForm = document.querySelector('.journal-form');
    const journalEntries = document.querySelector('.journal-entries');
    
    // Load saved journal entries
    let savedEntries = JSON.parse(localStorage.getItem('metacognition-journal')) || [];
    let userScore = parseInt(localStorage.getItem('metacognition-score')) || 0;
    
    // Update the score display
    updateScoreDisplay();
    
    // Render saved journal entries
    renderJournalEntries();
    
    // Handle journal form submission
    if (journalForm) {
        journalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(journalForm);
            const newEntry = {
                id: Date.now(),
                text: formData.get('thought-text'),
                category: formData.get('thought-category') || 'Uncategorized',
                basis: formData.get('thought-basis') || 'Unknown',
                origin: formData.get('thought-origin') || 'Unknown',
                analysis: formData.get('thought-analysis') || '',
                timestamp: new Date().toISOString()
            };
            
            // Validate required field
            if (!newEntry.text) {
                showJournalFeedback('Please enter your thought', 'error');
                return;
            }
            
            // Add to entries array
            savedEntries.unshift(newEntry); // Add to beginning
            
            // Save to localStorage
            localStorage.setItem('metacognition-journal', JSON.stringify(savedEntries));
            
            // Increase user score
            userScore += 5; // Award points for logging a thought
            localStorage.setItem('metacognition-score', userScore);
            
            // Update score display
            updateScoreDisplay();
            
            // Reset form
            journalForm.reset();
            
            // Re-render entries
            renderJournalEntries();
            
            // Show success message
            showJournalFeedback('Thought logged successfully', 'success');
        });
    }
    
    // Handle scenario challenges if present
    const scenarioForm = document.querySelector('.scenario-form');
    if (scenarioForm) {
        scenarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(scenarioForm);
            const selectedAnswer = formData.get('scenario-answer');
            const correctAnswer = scenarioForm.dataset.correctAnswer;
            
            if (selectedAnswer === correctAnswer) {
                // Correct answer
                userScore += 10;
                localStorage.setItem('metacognition-score', userScore);
                updateScoreDisplay();
                
                showJournalFeedback('Correct! You\'ve earned 10 points.', 'success');
            } else {
                // Incorrect answer
                showJournalFeedback('That\'s not quite right. Try again!', 'error');
            }
        });
    }
    
    // Function to render journal entries
    function renderJournalEntries() {
        if (!journalEntries) return;
        
        journalEntries.innerHTML = '';
        
        if (savedEntries.length === 0) {
            journalEntries.innerHTML = '<div class="empty-state">No entries yet. Start tracking your thoughts!</div>';
            return;
        }
        
        savedEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('journal-entry');
            
            const formattedDate = new Date(entry.timestamp).toLocaleString();
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <h4>${entry.text}</h4>
                    <span class="entry-date">${formattedDate}</span>
                </div>
                <div class="entry-meta">
                    <span class="category">${entry.category}</span>
                    <span class="basis">${entry.basis}</span>
                    <span class="origin">${entry.origin}</span>
                </div>
                <div class="entry-analysis">
                    <p>${entry.analysis || 'No analysis provided.'}</p>
                </div>
                <div class="entry-actions">
                    <button class="delete-entry" data-id="${entry.id}">Delete</button>
                </div>
            `;
            
            journalEntries.appendChild(entryElement);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-entry').forEach(button => {
            button.addEventListener('click', function() {
                if (!confirm('Are you sure you want to delete this journal entry?')) return;
                
                const entryId = parseInt(this.dataset.id);
                savedEntries = savedEntries.filter(entry => entry.id !== entryId);
                
                // Save updated entries
                localStorage.setItem('metacognition-journal', JSON.stringify(savedEntries));
                
                // Re-render entries
                renderJournalEntries();
                
                showJournalFeedback('Entry deleted', 'info');
            });
        });
    }
    
    // Function to update score display
    function updateScoreDisplay() {
        const scoreDisplay = document.querySelector('.user-score');
        const progressDisplay = document.querySelector('.progress-bar');
        const levelDisplay = document.querySelector('.mastery-level');
        
        if (scoreDisplay) {
            scoreDisplay.textContent = userScore;
        }
        
        if (progressDisplay) {
            // Calculate level and progress
            let level = 'Novice';
            let progressPercentage = 0;
            
            if (userScore <= 20) {
                level = 'Novice';
                progressPercentage = (userScore / 20) * 100;
            } else if (userScore <= 50) {
                level = 'Apprentice';
                progressPercentage = ((userScore - 20) / 30) * 100;
            } else if (userScore <= 100) {
                level = 'Adept';
                progressPercentage = ((userScore - 50) / 50) * 100;
            } else if (userScore <= 200) {
                level = 'Strategist';
                progressPercentage = ((userScore - 100) / 100) * 100;
            } else {
                level = 'Mastermind';
                progressPercentage = 100;
            }
            
            progressDisplay.style.width = `${progressPercentage}%`;
            
            if (levelDisplay) {
                levelDisplay.textContent = level;
            }
        }
    }
    
    // Function for feedback messages
    function showJournalFeedback(message, type = 'info') {
        const feedbackArea = document.querySelector('.journal-feedback');
        if (!feedbackArea) return;
        
        feedbackArea.textContent = message;
        feedbackArea.className = 'journal-feedback'; // Reset classes
        feedbackArea.classList.add(type);
        feedbackArea.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedbackArea.classList.remove('show');
        }, 3000);
    }
    
    // Data import/export functionality
    const exportButton = document.querySelector('.export-data');
    const importButton = document.querySelector('.import-data');
    const fileInput = document.querySelector('#import-file');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            const exportData = {
                entries: savedEntries,
                score: userScore,
                timestamp: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(exportData);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'metacognition-journal-export.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showJournalFeedback('Data exported successfully', 'success');
        });
    }
    
    if (importButton && fileInput) {
        importButton.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const importData = JSON.parse(e.target.result);
                        
                        if (importData.entries && Array.isArray(importData.entries)) {
                            if (!confirm('This will replace your current entries and score. Continue?')) {
                                return;
                            }
                            
                            // Import entries and score
                            savedEntries = importData.entries;
                            userScore = importData.score || 0;
                            
                            // Save to localStorage
                            localStorage.setItem('metacognition-journal', JSON.stringify(savedEntries));
                            localStorage.setItem('metacognition-score', userScore);
                            
                            // Update display
                            updateScoreDisplay();
                            renderJournalEntries();
                            
                            showJournalFeedback('Data imported successfully', 'success');
                        } else {
                            showJournalFeedback('Invalid import file format', 'error');
                        }
                    } catch (error) {
                        showJournalFeedback('Error reading import file', 'error');
                        console.error('Import error:', error);
                    }
                };
                
                reader.readAsText(file);
            }
        });
    }
}
