// ===== STATE =====
let currentUser = null;
let posts = [];
let cart = [];
let userLang = 'fr';
let userTheme = 'dark';
let partnershipFormHTML = '<div class="empty-state"><p>Formulaire de partenariat à configurer par l\'administrateur</p></div>';

// Creator links
let creatorLinks = {
  instagram: 'https://instagram.com/rhumdanou',
  whatsappChannel: 'https://whatsapp.com/channel/0029VaXXXXXX',
  telegram: 'https://t.me/rhumdanou',
  phone: '+50933324695'
};

// ===== THEME & LANGUAGE =====
function selectTheme(theme) {
  userTheme = theme;
  document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');
}

function selectLang(lang) {
  userLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');
}

function applyTheme() {
  document.body.classList.remove('theme-dark', 'theme-white', 'theme-red', 'theme-gold');
  document.body.classList.add(`theme-${userTheme}`);
  localStorage.setItem('rhum_theme', userTheme);
}

function confirmConfig() {
  applyTheme();
  localStorage.setItem('rhum_lang', userLang);
  document.getElementById('themeModal').style.display = 'none';
  showToast(`✅ Thème ${userTheme} | Langue: ${userLang}`, 'success');
}

// ===== INIT =====
async function init() {
  const savedTheme = localStorage.getItem('rhum_theme');
  if (savedTheme) { userTheme = savedTheme; applyTheme(); }
  
  loadCreatorLinksFromStorage();
  
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.user) {
      currentUser = data.user;
      document.getElementById('themeModal').style.display = 'flex';
      document.getElementById('landing').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      enterApp();
    }
  } catch(e) {}
}
init();

// ===== CREATOR LINKS STORAGE =====
function loadCreatorLinksFromStorage() {
  const saved = localStorage.getItem('creator_links');
  if (saved) {
    try {
      creatorLinks = JSON.parse(saved);
    } catch(e) {}
  }
}

function saveCreatorLinksToStorage() {
  localStorage.setItem('creator_links', JSON.stringify(creatorLinks));
}

function saveCreatorLinks() {
  creatorLinks = {
    instagram: document.getElementById('creatorInstagram').value || creatorLinks.instagram,
    whatsappChannel: document.getElementById('creatorWhatsAppChannel').value || creatorLinks.whatsappChannel,
    telegram: document.getElementById('creatorTelegram').value || creatorLinks.telegram,
    phone: document.getElementById('creatorPhone').value || creatorLinks.phone
  };
  saveCreatorLinksToStorage();
  showToast('Liens du créateur mis à jour ✓', 'success');
  if (document.getElementById('panel-creator').classList.contains('active')) {
    renderCreatorProfile();
  }
}

// ===== AUTH =====
function showAuthModal(type) {
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    currentUser = data.user;
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('themeModal').style.display = 'flex';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    enterApp();
  } catch(e) { errEl.textContent = 'Erreur de connexion'; errEl.style.display = 'block'; }
}

async function doRegister() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const errEl = document.getElementById('registerError');
  errEl.style.display = 'none';
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    currentUser = data.user;
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('themeModal').style.display = 'flex';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    enterApp();
  } catch(e) { errEl.textContent = 'Erreur'; errEl.style.display = 'block'; }
}

async function doLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  currentUser = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('landing').style.display = 'flex';
  toggleProfileMenu(false);
}

function oauthNote(provider) {
  showToast(`Connexion ${provider} disponible bientôt`, 'error');
}

function toggleProfileMenu(force) {
  const dd = document.getElementById('profileDropdown');
  if (force === false) { dd.classList.remove('open'); return; }
  dd.classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#profileDropdown') && !e.target.closest('#profileBtn')) {
    document.getElementById('profileDropdown').classList.remove('open');
  }
});

// ===== ENTER APP =====
function enterApp() {
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('dropdownEmail').textContent = currentUser.email;
  
  if (currentUser.role === 'creator') {
    document.getElementById('bnav-creator').style.display = 'flex';
  }
  if (['creator', 'admin'].includes(currentUser.role)) {
    document.getElementById('bnav-admin').style.display = 'flex';
  }
  
  loadFeed();
  loadCart();
  loadPartnershipForm();
  loadCreatorStats();
  initSmartChat();
  
  // Load creator links into admin form if admin
  if (currentUser.role === 'creator') {
    document.getElementById('creatorInstagram').value = creatorLinks.instagram;
    document.getElementById('creatorWhatsAppChannel').value = creatorLinks.whatsappChannel;
    document.getElementById('creatorTelegram').value = creatorLinks.telegram;
    document.getElementById('creatorPhone').value = creatorLinks.phone;
  }
}

// ===== SMART CHAT WITH API =====
let chatHistory = [];

async function initSmartChat() {
  const welcomeMsg = userLang === 'fr' ? 'Bonjour ! Je suis l\'assistant intelligent de Rhum Danou. Comment puis-je vous aider ?' :
                      (userLang === 'en' ? 'Hello! I am Rhum Danou\'s smart assistant. How can I help you?' :
                      'Bonjou! Mwen se asistan entelijan Rhum Danou. Ki jan mwen ka ede w?');
  chatHistory = [{ role: 'assistant', content: welcomeMsg }];
  renderChatMessages();
}

function renderChatMessages() {
  const el = document.getElementById('chatWindow');
  if (!el) return;
  el.innerHTML = chatHistory.map(m => `<div class="msg-bubble msg-${m.role === 'user' ? 'user' : 'bot'}">${escapeHtml(m.content)}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

async function sendSmartMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  chatHistory.push({ role: 'user', content: text });
  renderChatMessages();
  
  const detectedLang = detectLanguage(text);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: `You are a helpful assistant for Rhum Danou rum shop. Respond in ${detectedLang === 'ht' ? 'Haitian Creole' : detectedLang === 'fr' ? 'French' : 'English'}. Be friendly, helpful, and concise.` },
          ...chatHistory.slice(-10)
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || getFallbackResponse(text, detectedLang);
      chatHistory.push({ role: 'assistant', content: botReply });
    } else {
      chatHistory.push({ role: 'assistant', content: getFallbackResponse(text, detectedLang) });
    }
  } catch(e) {
    console.log('API error, using fallback');
    chatHistory.push({ role: 'assistant', content: getFallbackResponse(text, detectedLang) });
  }
  
  renderChatMessages();
}

function detectLanguage(text) {
  const creoleWords = ['bonjou', 'bonswa', 'kijan', 'ki jan', 'mwen', 'ou', 'li', 'nou', 'yo', 'sa', 'pou', 'avek', 'souple', 'mesi', 'kòman', 'koman'];
  const frenchWords = ['bonjour', 'comment', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'merci', 's\'il vous plaît', 'pourquoi', 'quand'];
  
  const lowerText = text.toLowerCase();
  let creoleScore = creoleWords.filter(w => lowerText.includes(w)).length;
  let frenchScore = frenchWords.filter(w => lowerText.includes(w)).length;
  
  if (creoleScore > frenchScore) return 'ht';
  if (frenchScore > creoleScore) return 'fr';
  return userLang;
}

function getFallbackResponse(text, lang) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('prix') || lowerText.includes('price') || lowerText.includes('pri') || lowerText.includes('combien') || lowerText.includes('how much')) {
    return lang === 'fr' ? '💰 Les prix sont affichés sur chaque publication. Consultez notre catalogue !' :
           lang === 'en' ? '💰 Prices are shown on each post. Check our catalog!' :
           '💰 Pri yo parèt sou chak post. Gade katalòg nou an!';
  }
  if (lowerText.includes('livraison') || lowerText.includes('delivery') || lowerText.includes('livrezon') || lowerText.includes('shipping')) {
    return lang === 'fr' ? '🚚 Livraison sous 24-48h après confirmation commande.' :
           lang === 'en' ? '🚚 Delivery within 24-48h after order confirmation.' :
           '🚚 Livrezon an 24-48 èdtan apre konfimasyon kòmand lan.';
  }
  if (lowerText.includes('commande') || lowerText.includes('order') || lowerText.includes('kòmand') || lowerText.includes('buy')) {
    return lang === 'fr' ? '🛒 Ajoutez au panier puis commandez via WhatsApp !' :
           lang === 'en' ? '🛒 Add to cart then order via WhatsApp!' :
           '🛒 Ajoute nan panyen epi kòmande via WhatsApp!';
  }
  if (lowerText.includes('produit') || lowerText.includes('product') || lowerText.includes('pwodwi') || lowerText.includes('rhum')) {
    return lang === 'fr' ? '🥃 Rhum Danou propose plusieurs saveurs : Grenadia, Gingembre, Lanni et plus encore !' :
           lang === 'en' ? '🥃 Rhum Danou offers several flavors: Grenadia, Ginger, Lanni and more!' :
           '🥃 Rhum Danou ofri plizyè saveurs: Grenadia, Jenjanm, Lanni ak plis ankò!';
  }
  return lang === 'fr' ? 'Je suis votre assistant Rhum Danou. Que voulez-vous savoir ? (prix, livraison, commande, produits)' :
         lang === 'en' ? 'I am your Rhum Danou assistant. What would you like to know? (price, delivery, order, products)' :
         'Mwen se asistan Rhum Danou w. Ki sa ou vle konnen? (pri, livrezon, kòmand, pwodwi)';
}

// ===== FEED =====
async function loadFeed() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    posts = data.posts || [];
    renderFeed();
  } catch(e) { document.getElementById('feedContent').innerHTML = '<div class="empty-state">Erreur de chargement</div>'; }
}

function renderFeed() {
  const el = document.getElementById('feedContent');
  if (!posts.length) { el.innerHTML = '<div class="empty-state"><span class="icon">🥃</span><p>Aucune publication</p></div>'; return; }
  el.innerHTML = posts.map(post => renderPost(post)).join('');
  attachSliderListeners();
}

function renderPost(post) {
  const isAdmin = ['creator', 'admin'].includes(currentUser?.role);
  const liked = post.likes?.includes(currentUser?.id);
  const isTextOnly = !post.media || post.media.length === 0;
  
  let mediaHTML = '';
  if (!isTextOnly && post.media) {
    mediaHTML = `<div class="post-media-wrapper"><div class="media-slider" data-postid="${post.id}">${post.media.map((m, idx) => m.type === 'video' ? `<div class="media-item"><video src="${m.url}" controls preload="metadata"></video></div>` : `<div class="media-item"><img src="${m.url}" loading="lazy"></div>`).join('')}</div>${post.media.length > 1 ? `<div class="media-dots" id="dots-${post.id}">${post.media.map((_, i) => `<div class="media-dot ${i===0?'active':''}"></div>`).join('')}</div>` : ''}</div>`;
  } else if (post.caption) {
    mediaHTML = `<div class="text-post">📢 ${escapeHtml(post.caption)}</div>`;
  }
  
  const priceBadge = post.price && post.priceVisible ? `<div class="price-badge">💰 ${post.price} ${post.currency}</div>` : '';
  const commentsHTML = (post.comments || []).slice(-3).map(c => `<div class="comment-item"><span><strong>${escapeHtml(c.userName)}</strong> ${escapeHtml(c.text)}</span>${isAdmin ? `<button class="del-comment-btn" onclick="deleteComment('${post.id}','${c.id}')">✕</button>` : ''}</div>`).join('');
  
  const adminControls = isAdmin ? `<div class="admin-post-controls"><button class="btn-admin-sm btn-edit" onclick="openEditModal('${post.id}')">✏️ Modifier</button><button class="btn-admin-sm btn-delete" onclick="deletePost('${post.id}')">🗑 Supprimer</button></div>` : '';
  
  const cartBtn = post.price ? `<button class="btn-cart" onclick="addToCart('${post.id}')">🛒 ×3</button>` : '';
  
  return `
  <div class="post-card" id="post-${post.id}">
    <div class="post-header">
      <div class="post-author">
        <div class="post-avatar">${post.authorName?.[0]?.toUpperCase() || 'D'}</div>
        <div class="post-author-info">
          <div class="post-author-name">${escapeHtml(post.authorName)}</div>
          <div class="post-author-badge">${post.authorRole === 'creator' ? '👑 Créateur' : '⭐ Admin'}</div>
        </div>
      </div>
      <div class="post-time">${timeAgo(post.createdAt)}</div>
    </div>
    ${mediaHTML}
    ${priceBadge}
    <div class="post-actions">
      <button class="action-btn ${liked?'liked':''}" onclick="likePost('${post.id}',this)">
        <span class="icon">${liked?'❤️':'🤍'}</span>
        <span id="likes-${post.id}">${post.likes?.length || 0}</span>
      </button>
      <button class="action-btn"><span class="icon">💬</span>${post.comments?.length || 0}</button>
      ${cartBtn}
    </div>
    ${!isTextOnly && post.caption ? `<div class="post-caption"><strong>${escapeHtml(post.authorName)}</strong> ${escapeHtml(post.caption)}</div>` : ''}
    <div class="comments-section">${commentsHTML}</div>
    <div class="comment-form">
      <input class="comment-input" placeholder="Ajouter un commentaire..." onkeydown="if(event.key==='Enter')submitComment('${post.id}',this)">
      <button class="comment-submit" onclick="submitComment('${post.id}',this.previousElementSibling)">➤</button>
    </div>
    ${adminControls}
  </div>`;
}

function attachSliderListeners() {
  document.querySelectorAll('.media-slider').forEach(slider => {
    slider.removeEventListener('scroll', () => updateDots(slider));
    slider.addEventListener('scroll', () => updateDots(slider));
  });
}

function updateDots(slider) {
  const postId = slider.dataset.postid;
  if (!postId) return;
  const items = slider.querySelectorAll('.media-item');
  const idx = Math.round(slider.scrollLeft / slider.offsetWidth);
  const dots = document.getElementById(`dots-${postId}`);
  if (dots) {
    dots.querySelectorAll('.media-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs/24)}j`;
}

async function likePost(postId, btn) {
  const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  const data = await res.json();
  btn.classList.toggle('liked', data.liked);
  btn.querySelector('.icon').textContent = data.liked ? '❤️' : '🤍';
  document.getElementById('likes-' + postId).textContent = data.likes;
  loadCreatorStats();
}

async function submitComment(postId, input) {
  const text = input.value.trim();
  if (!text) return;
  await fetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
  input.value = '';
  loadFeed();
  loadCreatorStats();
}

async function deleteComment(postId, commentId) {
  if (!confirm('Supprimer ce commentaire ?')) return;
  await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
  loadFeed();
}

async function deletePost(postId) {
  if (!confirm('Supprimer cette publication ?')) return;
  await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  loadFeed();
  showToast('Publication supprimée', 'success');
}

// ===== TEXT POST =====
async function publishTextPost() {
  const message = document.getElementById('textMessage').value.trim();
  if (!message) { showToast('Écrivez un message', 'error'); return; }
  const formData = new FormData();
  formData.append('caption', message);
  formData.append('priceVisible', 'false');
  try {
    const res = await fetch('/api/posts', { method: 'POST', body: formData });
    if (res.ok) {
      showToast('Message publié ! 📢', 'success');
      document.getElementById('textMessage').value = '';
      loadFeed();
    }
  } catch(e) { showToast('Erreur', 'error'); }
}

// ===== EDIT POST =====
function openEditModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  document.getElementById('editPostId').value = postId;
  document.getElementById('editCaption').value = post.caption || '';
  document.getElementById('editPrice').value = post.price || '';
  document.getElementById('editCurrency').value = post.currency || 'HTG';
  document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

async function saveEditPost() {
  const postId = document.getElementById('editPostId').value;
  const formData = new FormData();
  formData.append('caption', document.getElementById('editCaption').value);
  formData.append('price', document.getElementById('editPrice').value);
  formData.append('currency', document.getElementById('editCurrency').value);
  
  const res = await fetch(`/api/posts/${postId}`, { method: 'PUT', body: formData });
  if (res.ok) {
    closeEditModal();
    loadFeed();
    showToast('Publication modifiée ✓', 'success');
  }
}

// ===== CART =====
async function loadCart() {
  try {
    const res = await fetch('/api/cart');
    const data = await res.json();
    cart = data.cart || [];
    updateCartBadge();
  } catch(e) {}
}

async function addToCart(postId) {
  const res = await fetch('/api/cart/add', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId }) });
  const data = await res.json();
  cart = data.cart || [];
  updateCartBadge();
  showToast('×3 ajoutés au panier 🛒', 'success');
  if (document.getElementById('panel-cart').classList.contains('active')) renderCart();
}

function updateCartBadge() {
  const total = cart.reduce((s,i) => s + (i.quantity || 3), 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!cart.length) { el.innerHTML = '<div class="empty-state">🛒 Panier vide</div>'; return; }
  const totals = {};
  cart.forEach(i => { if(!totals[i.currency]) totals[i.currency]=0; totals[i.currency] += i.price * (i.quantity || 3); });
  const totalStr = Object.entries(totals).map(([c,a]) => `${a.toFixed(2)} ${c}`).join(' + ');
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      ${item.image ? `<img class="cart-thumb" src="${item.image}" alt="">` : '<div class="cart-thumb">🥃</div>'}
      <div class="cart-info"><div class="cart-name">${escapeHtml(item.productName || 'Rhum Danou')}</div><div class="cart-qty">Quantité : ×${item.quantity || 3}</div></div>
      <div><div class="cart-price">${((item.price || 0) * (item.quantity || 3)).toFixed(2)} ${item.currency}</div><button class="btn-remove-cart" onclick="removeFromCart('${item.id}')">🗑</button></div>
    </div>`).join('') + `
    <div class="cart-total"><span class="total-label">Total</span><span class="total-amount">${totalStr}</span></div>
    <button class="btn-whatsapp" onclick="orderViaWhatsApp()">📲 Commander via WhatsApp</button>`;
}

async function removeFromCart(itemId) {
  const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
  const data = await res.json();
  cart = data.cart || [];
  updateCartBadge();
  renderCart();
}

function orderViaWhatsApp() {
  let msg = '🥃 *Commande Rhum Danou*\n\n';
  cart.forEach(i => { msg += `• ${i.productName || 'Rhum Danou'} ×${i.quantity || 3} — ${((i.price || 0) * (i.quantity || 3)).toFixed(2)} ${i.currency}\n`; });
  msg += `\n💰 *Total à payer*\n\nNom : ${currentUser.name}\nEmail : ${currentUser.email}`;
  window.open(`https://wa.me/${creatorLinks.phone.replace(/[^0-9]/g, '') || '50933324695'}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== CREATOR PROFILE =====
let totalLikes = 0;
let totalComments = 0;
let totalUsers = 0;

async function loadCreatorStats() {
  totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    totalUsers = (data.users?.length || 0) + 1;
  } catch(e) { totalUsers = 1; }
  renderCreatorProfile();
}

function renderCreatorProfile() {
  const savedStatus = localStorage.getItem('creator_status') || '🥃 Nouvelle distillation en cours ! Découvrez nos nouvelles saveurs bientôt.';
  const el = document.getElementById('creatorProfileContent');
  
  let telegramLink = creatorLinks.telegram;
  if (telegramLink && !telegramLink.startsWith('http') && telegramLink.startsWith('@')) {
    telegramLink = `https://t.me/${telegramLink.substring(1)}`;
  } else if (telegramLink && !telegramLink.startsWith('http')) {
    telegramLink = `https://t.me/${telegramLink}`;
  }
  
  el.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${currentUser.name?.[0]?.toUpperCase() || 'D'}</div>
      <h2 style="font-family:'Cinzel Decorative'">${escapeHtml(currentUser.name)}</h2>
      <p style="color:var(--gold)">👑 Créateur & Maître Distillateur</p>
    </div>
    <div class="profile-stats">
      <div class="stat-item"><div class="stat-number">${totalUsers}</div><div class="stat-label">Abonnés</div></div>
      <div class="stat-item"><div class="stat-number">${totalLikes}</div><div class="stat-label">J'aime</div></div>
      <div class="stat-item"><div class="stat-number">${totalComments}</div><div class="stat-label">Commentaires</div></div>
    </div>
    <div class="profile-links">
      ${creatorLinks.instagram ? `<a href="${creatorLinks.instagram}" target="_blank" class="profile-link">📷 Instagram</a>` : ''}
      ${creatorLinks.whatsappChannel ? `<a href="${creatorLinks.whatsappChannel}" target="_blank" class="profile-link">📱 Chaîne WhatsApp</a>` : ''}
      ${creatorLinks.telegram ? `<a href="${telegramLink}" target="_blank" class="profile-link">✈️ Télégram</a>` : ''}
      ${creatorLinks.phone ? `<a href="tel:${creatorLinks.phone}" class="profile-link">📞 ${creatorLinks.phone}</a>` : ''}
    </div>
    <div class="creator-status">
      <h3 style="color:var(--gold);margin-bottom:0.5rem;">📌 Status</h3>
      <div class="status-text" id="creatorStatusText">${escapeHtml(savedStatus)}</div>
      ${currentUser?.role === 'creator' ? '<button class="btn-primary" onclick="editCreatorStatus()" style="margin-top:0.5rem;">✏️ Modifier le status</button>' : ''}
    </div>
    ${currentUser?.role === 'creator' ? `
    <div class="creator-actions" style="margin-top:1rem;text-align:center;">
      <button class="btn-secondary" onclick="showPanel('admin'); switchAdminTabManual('creatorLinks')">🔗 Gérer mes liens</button>
    </div>` : ''}
  `;
}

function editCreatorStatus() {
  const currentStatus = document.getElementById('creatorStatusText')?.textContent || '';
  const newStatus = prompt('Nouveau status:', currentStatus);
  if (newStatus) {
    document.getElementById('creatorStatusText').textContent = newStatus;
    localStorage.setItem('creator_status', newStatus);
    showToast('Status mis à jour ✓', 'success');
  }
}

// ===== PARTNERSHIP =====
async function loadPartnershipForm() {
  const saved = localStorage.getItem('partnership_form');
  if (saved) partnershipFormHTML = saved;
  renderPartnership();
}

function renderPartnership() {
  const el = document.getElementById('partnershipContent');
  el.innerHTML = partnershipFormHTML || '<div class="empty-state">Formulaire de partenariat bientôt disponible</div>';
}

function savePartnershipForm() {
  const formHTML = document.getElementById('partnershipFormHTML').value;
  partnershipFormHTML = formHTML;
  localStorage.setItem('partnership_form', formHTML);
  renderPartnership();
  showToast('Formulaire enregistré ✓', 'success');
}

// ===== ADMIN =====
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  document.getElementById('admin-' + tab).classList.add('active');
  if (tab === 'users') loadUsers();
  if (tab === 'partnership') document.getElementById('partnershipFormHTML').value = partnershipFormHTML;
  if (tab === 'creatorLinks' && currentUser?.role === 'creator') {
    document.getElementById('creatorInstagram').value = creatorLinks.instagram;
    document.getElementById('creatorWhatsAppChannel').value = creatorLinks.whatsappChannel;
    document.getElementById('creatorTelegram').value = creatorLinks.telegram;
    document.getElementById('creatorPhone').value = creatorLinks.phone;
  }
}

function switchAdminTabManual(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const targetTab = Array.from(document.querySelectorAll('.admin-tab')).find(t => t.textContent.includes('Liens') || t.getAttribute('onclick')?.includes(tab));
  if (targetTab) targetTab.classList.add('active');
  document.getElementById('admin-' + tab).classList.add('active');
  if (tab === 'creatorLinks') {
    document.getElementById('creatorInstagram').value = creatorLinks.instagram;
    document.getElementById('creatorWhatsAppChannel').value = creatorLinks.whatsappChannel;
    document.getElementById('creatorTelegram').value = creatorLinks.telegram;
    document.getElementById('creatorPhone').value = creatorLinks.phone;
  }
}

async function loadUsers() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    renderUsers(data.users || []);
  } catch(e) {}
}

function renderUsers(users) {
  const el = document.getElementById('usersList');
  if (!users.length) { el.innerHTML = '<div class="empty-state">Aucun utilisateur</div>'; return; }
  el.innerHTML = users.map(u => `
    <div class="user-row">
      <div class="user-info">
        <div class="user-avatar">${u.name?.[0]?.toUpperCase() || '?'}</div>
        <div><div class="user-name">${escapeHtml(u.name)}</div><div class="user-email">${escapeHtml(u.email)}</div></div>
        <span class="user-role-badge ${u.banned ? 'role-banned' : (u.role === 'admin' ? 'role-admin' : 'role-user')}">${u.banned ? 'Banni' : (u.role === 'admin' ? 'Admin' : 'Utilisateur')}</span>
      </div>
      <div class="user-actions">
        ${currentUser?.role === 'creator' && u.role === 'user' && !u.banned ? `<button class="btn-xs btn-promote" onclick="promoteUser('${u.id}')">⭐ Admin</button>` : ''}
        ${currentUser?.role === 'creator' && u.role === 'admin' ? `<button class="btn-xs btn-demote" onclick="demoteUser('${u.id}')">↓ User</button>` : ''}
        ${!u.banned ? `<button class="btn-xs btn-ban" onclick="banUser('${u.id}')">🚫 Bannir</button>` : `<button class="btn-xs btn-promote" onclick="unbanUser('${u.id}')">✓ Débannir</button>`}
      </div>
    </div>`).join('');
}

async function promoteUser(id) {
  const res = await fetch('/api/admin/promote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Utilisateur promu admin ⭐', 'success'); loadUsers(); loadCreatorStats(); }
}

async function demoteUser(id) {
  const res = await fetch('/api/admin/demote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Admin rétrogradé', 'success'); loadUsers(); loadCreatorStats(); }
}

async function banUser(id) {
  if (!confirm('Bannir cet utilisateur ?')) return;
  const res = await fetch('/api/admin/ban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Utilisateur banni 🚫', 'success'); loadUsers(); loadCreatorStats(); }
}

async function unbanUser(id) {
  const res = await fetch('/api/admin/unban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Utilisateur débanni ✓', 'success'); loadUsers(); loadCreatorStats(); }
}

// ===== POST CREATION =====
let selectedFiles = [];

function previewMedia(input) {
  selectedFiles = Array.from(input.files);
  const container = document.getElementById('mediaPreviews');
  container.innerHTML = '';
  selectedFiles.forEach(f => {
    const url = URL.createObjectURL(f);
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    container.appendChild(img);
  });
}

async function createPost() {
  if (!selectedFiles.length) { showToast('Sélectionnez au moins un média', 'error'); return; }
  const caption = document.getElementById('postCaption').value;
  const price = document.getElementById('postPrice').value;
  const currency = document.getElementById('postCurrency').value;
  const formData = new FormData();
  selectedFiles.forEach(f => formData.append('media', f));
  formData.append('caption', caption);
  if (price) formData.append('price', price);
  formData.append('currency', currency);
  formData.append('priceVisible', 'true');
  
  const res = await fetch('/api/posts', { method: 'POST', body: formData });
  if (res.ok) {
    showToast('Publication créée ! 🥃', 'success');
    document.getElementById('postCaption').value = '';
    document.getElementById('postPrice').value = '';
    document.getElementById('mediaPreviews').innerHTML = '';
    document.getElementById('mediaFiles').value = '';
    selectedFiles = [];
    loadFeed();
    showPanel('feed');
  } else {
    const d = await res.json();
    showToast(d.error || 'Erreur', 'error');
  }
}

// ===== PANELS =====
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');
  const btn = document.getElementById('bnav-' + name);
  if (btn) btn.classList.add('active');
  
  if (name === 'cart') renderCart();
  if (name === 'creator') loadCreatorStats();
  if (name === 'partnership') renderPartnership();
  if (name === 'admin' && !['creator','admin'].includes(currentUser?.role)) showPanel('feed');
  if (name === 'chat') setTimeout(() => document.getElementById('chatWindow')?.scrollTo(0, 9999), 100);
  
  document.getElementById('profileDropdown')?.classList.remove('open');
}

// ===== TOAST =====
let toastTimer;
function showToast(msg, type = '') {
  clearTimeout(toastTimer);
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  toastTimer = setTimeout(() => t.className = 'toast', 3000);
}

// ===== UTILS =====
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Load saved status on page load
const savedStatusOnLoad = localStorage.getItem('creator_status');
if (savedStatusOnLoad && document.getElementById('creatorStatusText')) {
  // Will be applied when creator profile renders
        }
