const API_BASE = '/api';

// =========================================
// TAB SWITCHING
// =========================================
function showTab(tabName) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`tab-${tabName}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick').includes(tabName)) b.classList.add('active');
  });

  if (tabName === 'browse') loadReviews();
}

// =========================================
// STAR RATING
// =========================================
let selectedRating = 0;

document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.value);
    highlightStars(val);
  });

  star.addEventListener('mouseleave', () => highlightStars(selectedRating));

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    document.getElementById('rv-rating').value = selectedRating;
    highlightStars(selectedRating);
  });
});

function highlightStars(count) {
  document.querySelectorAll('.star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.value) <= count);
  });
}

// =========================================
// SHOW RESPONSE MESSAGE
// =========================================
function showResponse(elemId, message, type) {
  const el = document.getElementById(elemId);
  el.textContent = message;
  el.className = `response-msg ${type}`;
  setTimeout(() => { el.className = 'response-msg'; el.textContent = ''; }, 5000);
}

// =========================================
// FEEDBACK FORM SUBMISSION
// =========================================
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('fbSubmitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  const payload = {
    name:     document.getElementById('fb-name').value.trim(),
    email:    document.getElementById('fb-email').value.trim(),
    category: document.getElementById('fb-category').value,
    message:  document.getElementById('fb-message').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      showResponse('fb-response', '✅ Feedback submitted! Thank you.', 'success');
      e.target.reset();
    } else {
      showResponse('fb-response', `❌ Error: ${data.message}`, 'error');
    }
  } catch (err) {
    showResponse('fb-response', '❌ Could not reach server. Is it running?', 'error');
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Feedback';
  }
});

// =========================================
// REVIEW FORM SUBMISSION
// =========================================
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (selectedRating === 0) {
    showResponse('rv-response', '❌ Please select a star rating.', 'error');
    return;
  }

  const btn = document.getElementById('rvSubmitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Submitting...';

  const payload = {
    reviewer:    document.getElementById('rv-reviewer').value.trim(),
    email:       document.getElementById('rv-email').value.trim(),
    productName: document.getElementById('rv-product').value.trim(),
    rating:      selectedRating,
    title:       document.getElementById('rv-title').value.trim(),
    body:        document.getElementById('rv-body').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      showResponse('rv-response', '✅ Review submitted! It will appear after approval.', 'success');
      e.target.reset();
      selectedRating = 0;
      highlightStars(0);
    } else {
      showResponse('rv-response', `❌ Error: ${data.message}`, 'error');
    }
  } catch (err) {
    showResponse('rv-response', '❌ Could not reach server. Is it running?', 'error');
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Submit Review';
  }
});

// =========================================
// LOAD & RENDER REVIEWS
// =========================================
async function loadReviews() {
  const container = document.getElementById('reviewsList');
  container.innerHTML = '<p class="loading-text">Loading reviews...</p>';

  try {
    const res = await fetch(`${API_BASE}/reviews`);
    const data = await res.json();

    if (!data.success || data.data.length === 0) {
      container.innerHTML = '<p class="no-reviews">No approved reviews yet. Be the first!</p>';
      return;
    }

    container.innerHTML = data.data.map(r => `
      <div class="review-item">
        <div class="review-top">
          <div>
            <span class="review-reviewer">${escHtml(r.reviewer)}</span>
            <span class="review-product">${escHtml(r.productName)}</span>
          </div>
          <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        ${r.title ? `<div class="review-title">${escHtml(r.title)}</div>` : ''}
        <div class="review-body">${escHtml(r.body)}</div>
        <div class="review-date">${new Date(r.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="no-reviews">⚠️ Could not load reviews. Check server connection.</p>';
  }
}

function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
