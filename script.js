document.addEventListener('DOMContentLoaded', function() {
    // --- Constants and Elements ---
    const root = document.documentElement; // For CSS variables
    const postsContainer = document.getElementById('blog-posts');
    const categoryListContainer = document.getElementById('category-menu-content');
    const archiveListContainer = document.getElementById('archive-menu-content');
    const navigation = document.querySelector('.navigation'); // For filter event delegation
    const themeControlsSection = document.querySelector('.theme-controls'); // For theme controls

    // Ensure essential elements exist before proceeding
    if (!postsContainer || !categoryListContainer || !archiveListContainer || !navigation || !themeControlsSection) {
        console.error("Essential elements for blog script not found. Exiting.");
        return; // Stop script if key parts are missing
    }

    const allPosts = Array.from(postsContainer.querySelectorAll('.blog-post'));
    let activeFilterLink = null; // Keep track of the active filter link

    // --- Helper Functions ---
    const getMonthYearString = (dateString) => {
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return 'Invalid Date';
        const [year, month] = dateString.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    };

    const getCssVariable = (variableName) => getComputedStyle(root).getPropertyValue(variableName).trim();

    // --- Dynamic Menu Generation ---
    const generateMenus = () => {
        console.log("Generating menus..."); // Debug log
        const categories = {};
        const archives = {};

        allPosts.forEach(post => {
            const category = post.dataset.category;
            const date = post.dataset.date;

            if (category) {
                if (!categories[category]) categories[category] = [];
                categories[category].push(post);
            }
            if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                const monthYearKey = date.substring(0, 7);
                if (!archives[monthYearKey]) archives[monthYearKey] = [];
                archives[monthYearKey].push(post);
            }
        });

        const generateListItems = (dataMap, container, filterType, isArchive = false) => {
            container.innerHTML = ''; // Clear static content

            const showAllLi = document.createElement('li');
            // showAllLi.classList.add('nav-item'); // No submenu for "Show All"
            const showAllLink = document.createElement('a');
            showAllLink.href = '#filter-all';
            showAllLink.textContent = 'Show All Posts';
            showAllLink.dataset.filterType = 'all';
            showAllLi.appendChild(showAllLink);
            container.appendChild(showAllLi);

            const sortedKeys = Object.keys(dataMap).sort((a, b) => {
                 if (isArchive) return b.localeCompare(a); // Newest first
                 return a.localeCompare(b); // Alphabetical
            });

            sortedKeys.forEach(key => {
                const postsInGroup = dataMap[key];
                if (!postsInGroup || postsInGroup.length === 0) return; // Skip empty groups

                const count = postsInGroup.length;
                const displayKey = isArchive ? getMonthYearString(postsInGroup[0].dataset.date) : key;
                const filterValue = key; // Category name or YYYY-MM

                const li = document.createElement('li');
                li.classList.add('nav-item'); // Add class for submenu CSS

                const link = document.createElement('a');
                link.href = `#filter-${filterType}-${filterValue.replace(/\s+/g, '-').toLowerCase()}`;
                link.dataset.filterType = filterType;
                link.dataset.filterValue = filterValue;

                const countSpan = document.createElement('span');
                countSpan.classList.add('post-count');
                countSpan.textContent = `(${count})`;

                link.textContent = displayKey + ' ';
                link.appendChild(countSpan);
                li.appendChild(link);

                const subMenu = document.createElement('ul');
                subMenu.classList.add('submenu');
                postsInGroup.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));

                postsInGroup.forEach(post => {
                    const postLi = document.createElement('li');
                    const postLink = document.createElement('a');
                    const postTitle = post.querySelector('h3 a');
                    if (postTitle && postTitle.href && postTitle.textContent) {
                        postLink.href = postTitle.href;
                        postLink.textContent = postTitle.textContent;
                        postLi.appendChild(postLink);
                        subMenu.appendChild(postLi);
                    } else {
                         console.warn("Could not find title/link for post in submenu generation:", post);
                    }
                });

                if (subMenu.children.length > 0) { // Only add submenu if it has items
                    li.appendChild(subMenu);
                }
                container.appendChild(li);
            });
            // Set initial active filter link after generation
             activeFilterLink = container.querySelector('a[data-filter-type="all"]');
             if (activeFilterLink) {
                 activeFilterLink.classList.add('active');
             }
        };

        generateListItems(categories, categoryListContainer, 'category');
        generateListItems(archives, archiveListContainer, 'archive', true);
        console.log("Menus generated."); // Debug log
    };

    // --- Filtering Logic ---
    const filterPosts = (type, value) => {
        console.log(`Filtering posts: type=${type}, value=${value}`); // Debug log
        allPosts.forEach(post => {
            let show = false;
            if (type === 'all') {
                show = true;
            } else if (type === 'category' && post.dataset.category === value) {
                show = true;
            } else if (type === 'archive' && post.dataset.date && post.dataset.date.startsWith(value)) {
                show = true;
            }
            post.style.display = show ? '' : 'none';
        });
    };

    // --- Theme Controls Logic ---
    const initializeThemeControls = () => {
        console.log("Initializing theme controls..."); // Debug log
        const swatchContainers = themeControlsSection.querySelectorAll('.swatch-container');
        const speedSlider = themeControlsSection.querySelector('#speed-slider');
        const speedValueDisplay = themeControlsSection.querySelector('#speed-value');

        // Function to update active swatch in a group
        const updateActiveSwatch = (container, newColor) => {
            if (!container) return;
            const swatches = container.querySelectorAll('.swatch');
            swatches.forEach(swatch => {
                // Compare colors case-insensitively and handle potential shorthand hex
                const swatchColor = swatch.dataset.color.toLowerCase();
                const targetColor = newColor.toLowerCase();
                if (swatchColor === targetColor ||
                    (swatchColor.length === 4 && swatchColor[1] === swatchColor[2] && swatchColor[3] === swatchColor[4] && swatchColor === `#${targetColor[1]}${targetColor[3]}${targetColor[5]}`) || // Basic shorthand check
                    (targetColor.length === 4 && targetColor[1] === targetColor[2] && targetColor[3] === targetColor[4] && targetColor === `#${swatchColor[1]}${swatchColor[3]}${swatchColor[5]}`)
                   ) {
                    swatch.classList.add('active');
                } else {
                    swatch.classList.remove('active');
                }
            });
        };

        // Set initial values and add swatch listeners
        swatchContainers.forEach(container => {
            const cssVar = container.dataset.cssVar;
            if (!cssVar) {
                console.warn("Swatch container missing data-css-var:", container);
                return;
            }
            try {
                const initialColor = getCssVariable(cssVar);
                if (initialColor) {
                    updateActiveSwatch(container, initialColor);
                } else {
                     console.warn(`Could not get initial value for CSS variable: ${cssVar}`);
                }
            } catch (e) {
                 console.error(`Error getting initial CSS variable ${cssVar}:`, e);
            }


            const swatches = container.querySelectorAll('.swatch');
            swatches.forEach(swatch => {
                swatch.addEventListener('click', (event) => {
                    const newColor = event.target.dataset.color;
                    if (newColor && cssVar) {
                        try {
                            root.style.setProperty(cssVar, newColor);
                            updateActiveSwatch(container, newColor);
                            console.log(`Set ${cssVar} to ${newColor}`); // Debug log
                        } catch (e) {
                             console.error(`Error setting CSS variable ${cssVar}:`, e);
                        }
                    } else {
                         console.warn("Swatch missing data-color or container missing data-css-var:", event.target);
                    }
                });
            });
        });

        // Set initial speed slider value and add listener
        if (speedSlider && speedValueDisplay) {
            try {
                const initialDuration = getCssVariable('--animation-duration');
                const initialSpeed = initialDuration ? initialDuration.replace('s', '') : '18'; // Default fallback
                speedSlider.value = initialSpeed;
                speedValueDisplay.textContent = initialSpeed;

                speedSlider.addEventListener('input', (event) => {
                    const newSpeed = event.target.value;
                    try {
                        root.style.setProperty('--animation-duration', newSpeed + 's');
                        speedValueDisplay.textContent = newSpeed;
                        console.log(`Set --animation-duration to ${newSpeed}s`); // Debug log
                    } catch (e) {
                         console.error(`Error setting --animation-duration:`, e);
                    }
                });
            } catch (e) {
                 console.error("Error initializing speed slider:", e);
            }
        } else {
            console.warn("Speed slider or value display element not found.");
        }
        console.log("Theme controls initialized."); // Debug log
    };


    // --- Event Listeners (Filtering) ---
    navigation.addEventListener('click', function(event) {
        // Use .closest() to handle clicks on the span inside the link
        const targetLink = event.target.closest('a[data-filter-type]');

        if (targetLink) {
            event.preventDefault(); // Prevent hash jump

            const filterType = targetLink.dataset.filterType;
            const filterValue = targetLink.dataset.filterValue || ''; // Handle 'all'

            // Update active link state visually
            if (activeFilterLink) {
                activeFilterLink.classList.remove('active');
            }
            targetLink.classList.add('active');
            activeFilterLink = targetLink; // Update the tracker

            filterPosts(filterType, filterValue);
        }
    });

    // --- Initialization ---
    try {
        generateMenus();
        initializeThemeControls();
        filterPosts('all', ''); // Initial display
    } catch (error) {
         console.error("Error during script initialization:", error);
    }

}); // End DOMContentLoaded