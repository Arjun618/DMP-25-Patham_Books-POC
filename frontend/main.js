let persona = 'default';
let isLoading = false;

// Update UI based on loading state
function setLoading(loading) {
  isLoading = loading;
  const buttons = document.querySelectorAll('.btn');
  
  if (loading) {
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'wait';
      
      // Save original text and add loading spinner if not already there
      if (!btn.getAttribute('data-original-text')) {
        btn.setAttribute('data-original-text', btn.innerHTML);
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      }
    });
  } else {
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      
      // Restore original text
      const originalText = btn.getAttribute('data-original-text');
      if (originalText) {
        btn.innerHTML = originalText;
        btn.removeAttribute('data-original-text');
      }
    });
  }
}

// Display results with formatting
function displayResults(data, type = 'json') {
  const resultsContainer = document.getElementById('results');
  
  // Remove placeholder if it exists
  const placeholder = resultsContainer.querySelector('.results-placeholder');
  if (placeholder) {
    resultsContainer.removeChild(placeholder);
  }
  
  if (type === 'transcript') {
    resultsContainer.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">Transcript:</div>
        <div style="padding: 0.75rem; background-color: #eff6ff; border-radius: 6px; margin-bottom: 1rem;">${data.transcript}</div>
        <div style="font-weight: 600; margin-bottom: 0.5rem;">Results:</div>
        <pre>${JSON.stringify(data.results, null, 2)}</pre>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
  
  // Add animation
  resultsContainer.style.opacity = '0';
  resultsContainer.style.transform = 'translateY(10px)';
  resultsContainer.style.transition = 'all 0.3s ease';
  
  setTimeout(() => {
    resultsContainer.style.opacity = '1';
    resultsContainer.style.transform = 'translateY(0)';
  }, 50);
}

// Show error message
function showError(message) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = `
    <div style="color: #ef4444; padding: 1rem; text-align: center;">
      <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
      <p>${message}</p>
    </div>
  `;
}

// Update persona selection UI
function setPersona(p) {
  persona = p;
  
  // Update the current persona text with proper capitalization
  const displayName = p.charAt(0).toUpperCase() + p.slice(1);
  document.getElementById('current-persona').innerText = displayName;
  
  // Update the active persona badge
  const badges = document.querySelectorAll('.persona-badge');
  badges.forEach(badge => {
    if (badge.textContent.trim().toLowerCase().includes(p.toLowerCase())) {
      badge.classList.add('active');
    } else {
      badge.classList.remove('active');
    }
  });
}

// Perform text search
async function textSearch() {
  const query = document.getElementById("query").value.trim();
  
  if (!query) {
    showError("Please enter a search query");
    return;
  }
  
  try {
    setLoading(true);
    
    const res = await fetch("/text-search", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query})
    });
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    displayResults(data.results);
  } catch (error) {
    console.error("Search error:", error);
    showError(`Error performing search: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

// Generate tags for story text
async function generateTags() {
  const text = document.getElementById('storyText').value.trim();
  
  if (!text) {
    showError("Please enter story text to generate tags");
    return;
  }
  
  try {
    setLoading(true);
    
    const res = await fetch('/generate-tags', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text, persona})
    });
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    displayResults(data);
  } catch (error) {
    console.error("Tag generation error:", error);
    showError(`Error generating tags: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

// Perform voice search with audio file
async function voiceSearch() {
  const input = document.getElementById('audioInput');
  
  if (!input.files.length) {
    showError('Please select an audio file');
    return;
  }
  
  try {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('audio', input.files[0]);
    formData.append('lang', 'hi'); // Default to Hindi; change as needed
    
    const res = await fetch('/voice-search', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    displayResults(data, 'transcript');
  } catch (error) {
    console.error("Voice search error:", error);
    showError(`Error with voice search: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

// Add event listeners for keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
  // Add Enter key support for search input
  const queryInput = document.getElementById('query');
  queryInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      textSearch();
    }
  });
  
  // Add Enter key support for story text input
  const storyTextArea = document.getElementById('storyText');
  storyTextArea.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateTags();
      e.preventDefault();
    }
  });
  
  // Show file name when selected
  const audioInput = document.getElementById('audioInput');
  audioInput.addEventListener('change', function() {
    if (this.files.length) {
      const fileBtn = this.previousElementSibling;
      const fileName = this.files[0].name;
      fileBtn.innerHTML = `<i class="fas fa-file-audio"></i> ${fileName}`;
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set initial state
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '<div class="results-placeholder">Your results will appear here</div>';
});
