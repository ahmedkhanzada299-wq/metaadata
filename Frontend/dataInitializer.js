// Data initialization script
// This script checks if data exists for a country and generates it if needed

// Base URL for the backend
const BASE_URL = "https://metaadata.com";  // Update with your backend URL

// Function to check if data exists for a country
async function checkCountryData(countryID) {
  try {
    console.log(`Checking data for country ID: ${countryID}`);
    const response = await axios.get(`${BASE_URL}/api/generator/check/${countryID}`);
    return response.data;
  } catch (error) {
    console.error(`Error checking data for country ID ${countryID}:`, error);
    return { hasData: false, count: 0 };
  }
}

// Function to generate data for a country
async function generateCountryData(countryID, count = 10) {
  try {
    console.log(`Generating data for country ID: ${countryID}`);
    
    // Create loading indicator
    showLoadingIndicator(`Generating data for this country...`);
    
    const response = await axios.post(`${BASE_URL}/api/generator/generate/${countryID}`, { count });
    
    // Remove loading indicator
    hideLoadingIndicator();
    
    console.log(`Data generated for country ID ${countryID}:`, response.data);
    return response.data;
  } catch (error) {
    // Remove loading indicator
    hideLoadingIndicator();
    
    console.error(`Error generating data for country ID ${countryID}:`, error);
    throw error;
  }
}

// Function to ensure data exists for a country before proceeding
async function ensureCountryData(countryID, callback) {
  try {
    // Check if data exists
    const checkResult = await checkCountryData(countryID);
    
    if (!checkResult.hasData) {
      // If no data exists, generate it
      await generateCountryData(countryID, 15); // Generate 15 records
      
      // Show notification
      showNotification('Data has been generated successfully!', 'success');
    }
    
    // Call the callback function (e.g., fetch specific details)
    if (typeof callback === 'function') {
      callback(countryID);
    }
  } catch (error) {
    console.error(`Failed to ensure data for country ID ${countryID}:`, error);
    showNotification('Could not generate data. Please try again.', 'error');
  }
}

// Loading indicator functions
function showLoadingIndicator(message) {
  // Create loading overlay if it doesn't exist
  if (!document.getElementById('loading-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.style.textAlign = 'center';
    spinner.style.color = 'white';
    
    const spinnerImg = document.createElement('div');
    spinnerImg.style.border = '5px solid #f3f3f3';
    spinnerImg.style.borderTop = '5px solid #3498db';
    spinnerImg.style.borderRadius = '50%';
    spinnerImg.style.width = '50px';
    spinnerImg.style.height = '50px';
    spinnerImg.style.animation = 'spin 2s linear infinite';
    spinnerImg.style.margin = '0 auto 20px auto';
    
    // Add the animation keyframes
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    const messageEl = document.createElement('div');
    messageEl.id = 'loading-message';
    messageEl.textContent = message || 'Loading...';
    messageEl.style.marginTop = '10px';
    messageEl.style.fontSize = '18px';
    
    spinner.appendChild(spinnerImg);
    spinner.appendChild(messageEl);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
  } else {
    // Update existing message
    document.getElementById('loading-message').textContent = message || 'Loading...';
    document.getElementById('loading-overlay').style.display = 'flex';
  }
}

function hideLoadingIndicator() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Notification functions
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.data-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'data-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.zIndex = '9998';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    document.body.appendChild(notification);
  }
  
  // Set notification style based on type
  switch (type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)';
  }
  
  // Set message
  notification.textContent = message;
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
  }, 5000);
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add click handlers to flag items
  initializeFlagHandlers();
});

// Function to initialize flag handlers
function initializeFlagHandlers() {
  const flagLinks = document.querySelectorAll(".flag-item a");
  
  flagLinks.forEach((link) => {
    const originalClickListener = link.onclick;
    
    // Replace the click handler with our own that checks/generates data first
    link.onclick = async function(event) {
      event.preventDefault();
      
      const countryID = this.id;
      console.log(`Flag clicked for country ID: ${countryID}`);
      
      // Ensure data exists before calling the original functionality
      await ensureCountryData(countryID, () => {
        // Execute the original click handler if it exists
        if (typeof originalClickListener === 'function') {
          originalClickListener.call(this, event);
        }
      });
    };
  });
} 