// Copy functionality and notifications

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded - initializing copy functionality");
    
    // Create the notification element
    const notificationEl = document.createElement('div');
    notificationEl.className = 'copy-notification';
    document.body.appendChild(notificationEl);

    // Add copy icons to all table cells with data
    addCopyIconsToTables();
    
    // Set multiple attempts to add icons in case data loads after page load
    setTimeout(addCopyIconsToTables, 1000);
    setTimeout(addCopyIconsToTables, 2000);
    setTimeout(addCopyIconsToTables, 3000);

    // Handle dynamic content updates (after refresh buttons are clicked)
    const refreshButtons = document.querySelectorAll('.refresh-button');
    refreshButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("Refresh button clicked - waiting to add copy icons");
            // Multiple attempts after refresh
            setTimeout(addCopyIconsToTables, 300);
            setTimeout(addCopyIconsToTables, 800);
            setTimeout(addCopyIconsToTables, 1500);
        });
    });
    
    // Fail-safe in case some other script loads data later
    document.addEventListener('DOMSubtreeModified', function(e) {
        if (e.target.tagName === 'TD' || e.target.tagName === 'TABLE') {
            setTimeout(addCopyIconsToTables, 100);
        }
    });
});

// Function to add copy icons to all tables
function addCopyIconsToTables() {
    console.log("Adding copy icons to tables");
    const tables = document.querySelectorAll('.table');
    let iconCount = 0;
    
    tables.forEach(table => {
        const dataCells = table.querySelectorAll('td');
        console.log(`Found ${dataCells.length} cells in table`);
        
        dataCells.forEach(cell => {
            // Skip cells that already have copy icons
            if (cell.querySelector('.copy-icon')) {
                return;
            }
            
            // Skip empty cells or cells with only images
            if (!cell.textContent.trim()) {
                return;
            }
            
            // Skip cells that contain only images (like credit card logo)
            if (cell.querySelector('img') && cell.textContent.trim() === '') {
                return;
            }
            
            // Create the copy icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-copy copy-icon';
            icon.title = 'Copy to clipboard';
            icon.setAttribute('aria-label', 'Copy to clipboard');
            
            // Add animation to make the icon more noticeable when initially added
            icon.style.animation = 'pulseIcon 1s ease-in-out';
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
            
            // Add click event
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get text label for the cell from the preceding header
                let cellLabel = 'value';
                try {
                    const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
                    const headerRow = cell.closest('table').querySelector('tr');
                    if (headerRow) {
                        const th = headerRow.querySelector(`th:nth-child(${cellIndex + 1})`);
                        if (th) {
                            cellLabel = th.textContent.trim();
                        }
                    }
                } catch (err) {
                    console.log('Could not get label', err);
                }
                
                // Get the text content, excluding the icon
                let text = cell.textContent.trim();
                
                // Handle links
                const link = cell.querySelector('a');
                if (link) {
                    text = link.textContent.trim();
                }
                
                // Copy to clipboard
                navigator.clipboard.writeText(text)
                    .then(() => {
                        // Show success style
                        icon.className = 'fas fa-check copy-icon copy-success';
                        
                        // Add a subtle animation
                        icon.style.animation = 'successPulse 0.5s ease-in-out';
                        
                        // Show notification
                        showNotification(`Copied "${text}"`, cellLabel);
                        
                        // Reset after delay
                        setTimeout(() => {
                            icon.className = 'fas fa-copy copy-icon';
                            icon.style.animation = '';
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                        showNotification('Failed to copy to clipboard', null, true);
                    });
            });
            
            // Make cell position relative if not already
            const computedStyle = window.getComputedStyle(cell);
            if (computedStyle.position !== 'relative') {
                cell.style.position = 'relative';
            }
            
            // Add the icon to the cell
            cell.appendChild(icon);
            iconCount++;
        });
    });
    
    // Add keyframe animations if they don't exist
    if (!document.getElementById('copy-animations')) {
        const style = document.createElement('style');
        style.id = 'copy-animations';
        style.textContent = `
            @keyframes pulseIcon {
                0% { transform: translateY(-50%) scale(0.8); opacity: 0; }
                50% { transform: translateY(-50%) scale(1.2); opacity: 1; }
                100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
            }
            @keyframes successPulse {
                0% { transform: translateY(-50%) scale(1); }
                50% { transform: translateY(-50%) scale(1.3); }
                100% { transform: translateY(-50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log(`Added ${iconCount} copy icons to tables`);
}

// Function to show notification
function showNotification(message, label = null, isError = false) {
    const notification = document.querySelector('.copy-notification');
    
    if (isError) {
        notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        notification.style.borderLeft = '4px solid #ff6b6b';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)';
        notification.style.borderLeft = '4px solid #11cdef';
    }
    
    // Format the notification message with the label if available
    if (label && !isError) {
        notification.innerHTML = `<span class="copy-label">${label}:</span> ${message}`;
    } else {
        notification.textContent = message;
    }
    
    notification.classList.add('show');
    
    // Hide the notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
} 