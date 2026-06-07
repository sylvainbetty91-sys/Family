// ==================== CONFIGURATION ====================
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'sylvainbetty91-sys/Family';
const GITHUB_FILE_PATH = 'users.json';

// ==================== FONCTIONS DE VÉRIFICATION DES RÔLES ====================
function isAdmin() {
  return currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin');
}
function isCreator() {
  return currentUser && currentUser.role === 'creator';
}

// ==================== STATE ====================
let currentUser = null;
let posts = [];
let cart = [];
let userLang = 'fr';
let userTheme = 'dark';
let allUsers = [];
let stories = [];
let conversations = [];
let currentConversationUserId = null;
let totalUnreadMessages = 0;

let creatorInfo = {
  name: 'Danou',
  avatar: null,
  bio: '🥃 Créateur de Rhum Danou | Artisan distillateur',
  followers: 1240,
  tiktok: '',
  instagram: 'https://instagram.com/rhumdanou',
  whatsapp: '',
  telegram: '',
  phone: '+50933324695',
  customLinks: []
};

// ==================== TRANSLATIONS ====================
const translations = {
  fr: {
    emptyCart: '🛒 Panier vide', emptyPosts: '🥃 Aucune publication',
    navHome: 'Accueil', navCart: 'Panier', navMessages: 'Messages', navCreator: 'Créateur', navAdmin: 'Admin',
    cartTitle: '🛒 Mon Panier', messagingTitle: '💬 Messagerie', adminTitle: '⚙️ Administration',
    adminPublish: '📸 Publier média', adminText: '📝 Message texte', adminUsers: '👥 Utilisateurs',
    publishBtn: '✨ Publier', publishMessageBtn: '📢 Publier le message',
    creatorProfile: '👑 Profil Créateur', logout: '🚪 Déconnexion', loading: 'Chargement...',
    placeholder: 'Écrivez votre message...'
  },
  en: {
    emptyCart: '🛒 Empty cart', emptyPosts: '🥃 No posts',
    navHome: 'Home', navCart: 'Cart', navMessages: 'Messages', navCreator: 'Creator', navAdmin: 'Admin',
    cartTitle: '🛒 My Cart', messagingTitle: '💬 Messaging', adminTitle: '⚙️ Admin',
    adminPublish: '📸 Publish media', adminText: '📝 Text message', adminUsers: '👥 Users',
    publishBtn: '✨ Publish', publishMessageBtn: '📢 Publish message',
    creatorProfile: '👑 Creator Profile', logout: '🚪 Logout', loading: 'Loading...',
    placeholder: 'Write your message...'
  }
};

// ==================== INIT ====================
async function init() {
  const savedTheme = localStorage.getItem('rhum_theme');
  if (savedTheme) { userTheme = savedTheme; changeTheme(userTheme); }
  const savedLang = localStorage.getItem('rhum_lang');
  if (savedLang) { userLang = savedLang; applyLanguage(); }

  const savedCreatorInfo = localStorage.getItem('creator_info');
  if (savedCreatorInfo) {
    try { creatorInfo = { ...creatorInfo, ...JSON.parse(savedCreatorInfo) }; } catch(e) {}
  }

  await loadFeedPublic();
  loadStories();
  updateCartBadge();
  updateMessageBadge();

  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.user) {
      currentUser = data.user;
      enterAppConnected();
    }
  } catch(e) { console.log('Pas de session:', e); }
}
init();

async function loadFeedPublic() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    posts = data.posts || [];
    renderFeed();
  } catch(e) {
    const el = document.getElementById('feedContent');
    if (el) el.innerHTML = '<div class="empty-state">Erreur de chargement</div>';
  }
}

async function enterAppConnected() {
  const nameEl = document.getElementById('dropdownName');
  const emailEl = document.getElementById('dropdownEmail');
  if (nameEl) nameEl.textContent = currentUser.name;
  if (emailEl) emailEl.textContent = currentUser.email;

  const connEl = document.getElementById('profileDropdownConnected');
  const guestEl = document.getElementById('profileDropdownGuest');
  if (connEl) connEl.style.display = 'block';
  if (guestEl) guestEl.style.display = 'none';

  if (isCreator()) {
    const el = document.getElementById('bnav-creator');
    if (el) el.style.display = 'flex';
  }
  if (isAdmin()) {
    const el = document.getElementById('bnav-admin');
    if (el) el.style.display = 'flex';
  }

  await loadUsersFromGithub();
  await loadFeed();
  await loadCart();
  loadConversations();
  renderUsersList();
  applyLanguage();
  updateMessageBadge();
}

// ==================== AUTH ====================
function showAuthModal(type) {
  const modal = document.getElementById('authModal');
  const login = document.getElementById('loginForm');
  const reg = document.getElementById('registerForm');
  if (modal) modal.style.display = 'flex';
  if (login) login.style.display = type === 'login' ? 'block' : 'none';
  if (reg) reg.style.display = type === 'register' ? 'block' : 'none';
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    currentUser = data.user;
    document.getElementById('authModal').style.display = 'none';
    enterAppConnected();
  } catch(e) { errEl.textContent = 'Erreur'; errEl.style.display = 'block'; }
}

async function doRegister() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const errEl = document.getElementById('registerError');
  errEl.style.display = 'none';
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    currentUser = data.user;
    document.getElementById('authModal').style.display = 'none';
    enterAppConnected();
  } catch(e) { errEl.textContent = 'Erreur'; errEl.style.display = 'block'; }
}

async function doLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  currentUser = null;
  const adminBtn = document.getElementById('bnav-admin');
  const creatorBtn = document.getElementById('bnav-creator');
  if (adminBtn) adminBtn.style.display = 'none';
  if (creatorBtn) creatorBtn.style.display = 'none';
  const connEl = document.getElementById('profileDropdownConnected');
  const guestEl = document.getElementById('profileDropdownGuest');
  if (connEl) connEl.style.display = 'none';
  if (guestEl) guestEl.style.display = 'block';
  document.getElementById('profileDropdown')?.classList.remove('open');
  showPanel('feed');
  showToast('Déconnecté');
}

// ==================== GITHUB SYNC ====================
async function loadUsersFromGithub() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    allUsers = data.users || [];
    return allUsers;
  } catch(e) { return []; }
}

// ==================== FEED ====================
async function loadFeed() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    posts = data.posts || [];
    renderFeed();
  } catch(e) {
    const el = document.getElementById('feedContent');
    if (el) el.innerHTML = '<div class="empty-state">Erreur</div>';
  }
}

function renderFeed() {
  const el = document.getElementById('feedContent');
  if (!el) return;
  if (!posts.length) {
    el.innerHTML = `<div class="empty-state"><span class="icon">🥃</span><p>${translations[userLang]?.emptyPosts || 'Aucune publication'}</p></div>`;
    return;
  }
  el.innerHTML = posts.map(post => renderPost(post)).join('');
}

function renderPost(post) {
  const userIsAdmin = isAdmin();
  const liked = post.likes?.includes(currentUser?.id);
  const isTextOnly = !post.media || post.media.length === 0;

  let mediaHTML = '';
  if (!isTextOnly && post.media) {
    mediaHTML = `<div class="post-media-wrapper"><div class="media-slider">${post.media.map(m =>
      m.type === 'video'
        ? `<div class="media-item"><video src="${m.url}" controls></video></div>`
        : `<div class="media-item"><img src="${m.url}" loading="lazy"></div>`
    ).join('')}</div><div class="views-badge">👁️ ${post.views || 0}</div></div>`;
  } else if (post.caption) {
    mediaHTML = `<div class="text-post">📢 ${escapeHtml(post.caption)}</div>`;
  }

  const priceBadge = post.price && post.priceVisible
    ? `<div class="price-badge">💰 ${post.price} ${post.currency}</div>` : '';
  const commentsHTML = (post.comments || []).slice(-3).map(c =>
    `<div class="comment-item"><span><strong>${escapeHtml(c.userName)}</strong> ${escapeHtml(c.text)}</span>${userIsAdmin ? `<button class="del-comment-btn" onclick="deleteComment('${post.id}','${c.id}')">✕</button>` : ''}</div>`
  ).join('');
  const adminControls = userIsAdmin
    ? `<div class="admin-post-controls"><button class="btn-admin-sm btn-edit" onclick="openEditModal('${post.id}')">✏️ Modifier</button><button class="btn-admin-sm btn-delete" onclick="deletePost('${post.id}')">🗑 Supprimer</button></div>` : '';
  const cartBtn = post.price ? `<button class="btn-cart" onclick="addToCart('${post.id}')">🛒 ×3</button>` : '';

  return `<div class="post-card">
    <div class="post-header">
      <div class="post-author">
        <div class="post-avatar">${post.authorName?.[0]?.toUpperCase() || 'D'}</div>
        <div>
          <div class="post-author-name">${escapeHtml(post.authorName)}</div>
          <div class="post-author-badge">${post.authorRole === 'creator' ? '👑 Créateur' : '⭐ Admin'}</div>
        </div>
      </div>
      <div class="post-time">${timeAgo(post.createdAt)}</div>
    </div>
    ${mediaHTML}
    ${priceBadge}
    <div class="post-actions">
      <button class="action-btn ${liked ? 'liked' : ''}" onclick="likePost('${post.id}',this)">❤️ <span id="likes-${post.id}">${post.likes?.length || 0}</span></button>
      <button class="action-btn">💬 ${post.comments?.length || 0}</button>
      ${cartBtn}
    </div>
    ${!isTextOnly && post.caption ? `<div class="post-caption"><strong>${escapeHtml(post.authorName)}</strong> ${escapeHtml(post.caption)}</div>` : ''}
    <div class="comments-section">${commentsHTML}</div>
    <div class="comment-form">
      <input class="comment-input" placeholder="Ajouter..." onkeydown="if(event.key==='Enter')submitComment('${post.id}',this)">
      <button class="comment-submit" onclick="submitComment('${post.id}',this.previousElementSibling)">➤</button>
    </div>
    ${adminControls}
  </div>`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}j`;
}

async function likePost(postId, btn) {
  try {
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    if (res.status === 401) { showToast('Connecte-toi pour liker'); return; }
    const data = await res.json();
    btn.classList.toggle('liked', data.liked);
    document.getElementById('likes-' + postId).textContent = data.likes;
  } catch(e) { showToast('Erreur réseau'); }
}

async function submitComment(postId, input) {
  const text = input.value.trim();
  if (!text) return;
  try {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, visitorName: 'Visiteur' })
    });
    if (!res.ok) { showToast('Erreur commentaire'); return; }
    input.value = '';
    loadFeed();
  } catch(e) { showToast('Erreur réseau'); }
}

async function deleteComment(postId, commentId) {
  await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
  loadFeed();
}

async function deletePost(postId) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  loadFeed();
}

function openEditModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const newCaption = prompt('Nouvelle description:', post.caption);
  const newPrice = prompt('Nouveau prix:', post.price);
  if (newCaption !== null) {
    fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: newCaption, price: newPrice, currency: post.currency, priceVisible: true })
    }).then(() => loadFeed());
  }
}

// ==================== TEXT POST ====================
async function publishTextPost() {
  const message = document.getElementById('textMessage').value.trim();
  if (!message) { showToast('Écris un message'); return; }
  const formData = new FormData();
  formData.append('caption', message);
  formData.append('priceVisible', 'false');
  try {
    const res = await fetch('/api/posts', { method: 'POST', body: formData });
    if (res.ok) {
      showToast('Message publié !');
      document.getElementById('textMessage').value = '';
      await loadFeed();
      showPanel('feed');
    } else {
      const d = await res.json();
      showToast('Erreur: ' + (d.error || res.status));
    }
  } catch(e) { showToast('Erreur de connexion'); }
}

// ==================== CART ====================
async function loadCart() {
  if (currentUser) {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      cart = data.cart || [];
    } catch(e) { cart = []; }
  } else {
    const saved = localStorage.getItem('guest_cart');
    cart = saved ? JSON.parse(saved) : [];
  }
  updateCartBadge();
}

async function addToCart(postId) {
  if (currentUser) {
    try {
      const res = await fetch('/api/cart/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId }) });
      if (res.status === 401) { addToCartLocal(postId); return; }
      const data = await res.json();
      cart = data.cart || [];
    } catch(e) { addToCartLocal(postId); return; }
  } else {
    addToCartLocal(postId);
    return;
  }
  updateCartBadge();
  showToast('×3 ajoutés au panier 🛒');
  if (document.getElementById('panel-cart')?.classList.contains('active')) renderCart();
}

function addToCartLocal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post || !post.price) { showToast('Produit sans prix'); return; }
  const saved = localStorage.getItem('guest_cart');
  let localCart = saved ? JSON.parse(saved) : [];
  const existing = localCart.find(i => i.postId === postId);
  if (existing) { existing.quantity += 3; }
  else {
    localCart.push({
      id: 'local_' + Date.now(), postId,
      productName: post.caption || 'Produit Danou',
      price: post.price, currency: post.currency,
      image: post.media?.[0]?.url || null, quantity: 3
    });
  }
  localStorage.setItem('guest_cart', JSON.stringify(localCart));
  cart = localCart;
  updateCartBadge();
  showToast('×3 ajoutés au panier 🛒');
  if (document.getElementById('panel-cart')?.classList.contains('active')) renderCart();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + (i.quantity || 3), 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;
  if (!cart.length) { el.innerHTML = `<div class="empty-state">${translations[userLang]?.emptyCart || 'Panier vide'}</div>`; return; }
  const totals = {};
  cart.forEach(i => { if (!totals[i.currency]) totals[i.currency] = 0; totals[i.currency] += i.price * (i.quantity || 3); });
  const totalStr = Object.entries(totals).map(([c, a]) => `${a.toFixed(2)} ${c}`).join(' + ');
  el.innerHTML = cart.map(item =>
    `<div class="cart-item">
      <div class="cart-info"><div class="cart-name">${escapeHtml(item.productName)}</div><div class="cart-qty">×${item.quantity || 3}</div></div>
      <div class="cart-price">${((item.price || 0) * (item.quantity || 3)).toFixed(2)} ${item.currency}</div>
      <button class="btn-remove-cart" onclick="removeFromCart('${item.id}')">🗑</button>
    </div>`
  ).join('') + `<div class="cart-total"><span>Total</span><span>${totalStr}</span></div>
  <button class="btn-whatsapp" onclick="orderViaWhatsApp()">📲 Commander via WhatsApp</button>`;
}

async function removeFromCart(itemId) {
  if (currentUser && !itemId.startsWith('local_')) {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      const data = await res.json();
      cart = data.cart || [];
    } catch(e) {}
  } else {
    cart = cart.filter(i => i.id !== itemId);
    localStorage.setItem('guest_cart', JSON.stringify(cart));
  }
  updateCartBadge();
  renderCart();
}

function orderViaWhatsApp() { openDeliveryModal(); }

function openDeliveryModal() {
  if (currentUser) {
    document.getElementById('deliveryName').value = currentUser.name || '';
    document.getElementById('deliveryEmail').value = currentUser.email || '';
  } else {
    document.getElementById('deliveryName').value = '';
    document.getElementById('deliveryEmail').value = '';
  }
  document.getElementById('deliveryPhone').value = '';
  document.getElementById('deliveryAddress').value = '';
  document.getElementById('deliveryCity').value = '';
  document.getElementById('deliveryNote').value = '';
  document.getElementById('deliveryModal').style.display = 'flex';
}

function closeDeliveryModal() {
  document.getElementById('deliveryModal').style.display = 'none';
}

function confirmOrder() {
  const name = document.getElementById('deliveryName').value.trim();
  const phone = document.getElementById('deliveryPhone').value.trim();
  const address = document.getElementById('deliveryAddress').value.trim();
  const city = document.getElementById('deliveryCity').value.trim();
  const email = document.getElementById('deliveryEmail').value.trim();
  const note = document.getElementById('deliveryNote').value.trim();

  if (!name) { showToast('❗ Entre ton nom'); return; }
  if (!phone) { showToast('❗ Entre ton numéro de téléphone'); return; }
  if (!address) { showToast('❗ Entre ton adresse'); return; }
  if (!city) { showToast('❗ Entre ta ville'); return; }

  let msg = '🛒 *Nouvelle Commande — Les Produits de Danou* 🛒\n\n';
  msg += '📦 *Produits commandés :*\n';
  let total = 0;
  cart.forEach(i => {
    const itemTotal = (i.price || 0) * (i.quantity || 3);
    total += itemTotal;
    msg += `  • ${i.productName} ×${i.quantity || 3} — ${itemTotal.toFixed(2)} ${i.currency}\n`;
  });
  msg += `\n💰 *TOTAL: ${total.toFixed(2)} ${cart[0]?.currency || 'HTG'}*\n`;
  msg += `\n─────────────────────\n`;
  msg += `👤 *Nom :* ${name}\n`;
  if (email) msg += `📧 *Email :* ${email}\n`;
  msg += `📞 *Téléphone :* ${phone}\n`;
  msg += `📍 *Adresse :* ${address}\n`;
  msg += `🏙️ *Ville :* ${city}\n`;
  if (note) msg += `📝 *Note :* ${note}\n`;
  msg += `─────────────────────\n\n✅ Merci pour votre commande !`;

  const waNumber = (creatorInfo.phone || '50933324695').replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  closeDeliveryModal();
  showToast('✅ Redirection WhatsApp...');
}

// ==================== MESSAGERIE + NOTIFICATIONS ====================
function updateMessageBadge() {
  totalUnreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const badge = document.getElementById('msgBadge');
  if (badge) {
    badge.textContent = totalUnreadMessages > 0 ? totalUnreadMessages : '';
    badge.style.display = totalUnreadMessages > 0 ? 'flex' : 'none';
  }
  // Badge sur la nav bulle
  const navBadge = document.getElementById('navMsgBadge');
  if (navBadge) {
    navBadge.textContent = totalUnreadMessages > 0 ? totalUnreadMessages : '';
    navBadge.style.display = totalUnreadMessages > 0 ? 'flex' : 'none';
  }
}

function loadConversations() {
  const saved = localStorage.getItem('conversations');
  if (saved) {
    try { conversations = JSON.parse(saved); } catch(e) { conversations = []; }
  }
  updateMessageBadge();
  renderConversationsList();
}

function saveConversations() {
  localStorage.setItem('conversations', JSON.stringify(conversations));
  updateMessageBadge();
}

function renderConversationsList() {
  const container = document.getElementById('conversationsList');
  if (!container) return;

  let visibleConversations = isAdmin()
    ? conversations
    : conversations.filter(c => c.userId === currentUser?.id);

  if (!currentUser) {
    container.innerHTML = '<div class="empty-state">💬 Connecte-toi pour voir tes messages</div>';
    return;
  }

  if (visibleConversations.length === 0) {
    container.innerHTML = '<div class="empty-state">💬 Aucune conversation</div>';
    return;
  }

  container.innerHTML = visibleConversations.map(conv => `
    <div class="conversation-item" onclick="openConversation('${conv.userId}')">
      <div class="conversation-avatar">${conv.userName?.[0]?.toUpperCase() || '?'}</div>
      <div class="conversation-info">
        <div class="conversation-name">${escapeHtml(conv.userName)}</div>
        <div class="conversation-last-msg">${escapeHtml((conv.lastMessage || '').substring(0, 40))}</div>
      </div>
      ${conv.unreadCount > 0 ? `<div class="conversation-unread">${conv.unreadCount}</div>` : ''}
    </div>
  `).join('');
}

function openConversation(userId) {
  currentConversationUserId = userId;
  const conv = conversations.find(c => c.userId === userId);
  if (conv) {
    conv.unreadCount = 0;
    saveConversations();
    renderConversationsList();
    renderMessagesForUser(userId);
  }
  const messagesView = document.getElementById('messagesView');
  const convList = document.getElementById('conversationsList');
  const convName = document.getElementById('currentConversationName');
  if (messagesView) messagesView.style.display = 'flex';
  if (convList) convList.style.display = 'none';
  if (convName) convName.textContent = conv?.userName || 'Discussion';
}

function backToConversations() {
  const messagesView = document.getElementById('messagesView');
  const convList = document.getElementById('conversationsList');
  if (messagesView) messagesView.style.display = 'none';
  if (convList) convList.style.display = 'block';
  renderConversationsList();
}

function renderMessagesForUser(userId) {
  const conv = conversations.find(c => c.userId === userId);
  const container = document.getElementById('partnerMessagesContainer');
  if (!conv || !container) return;

  container.innerHTML = conv.messages.map(m => `
    <div class="partner-message ${m.senderId === currentUser?.id ? 'partner-message-creator' : 'partner-message-user'}">
      <div><strong>${escapeHtml(m.senderName)}</strong> <span style="font-size:0.6rem;opacity:0.6">${new Date(m.createdAt).toLocaleTimeString()}</span></div>
      <div>${escapeHtml(m.text)}</div>
      ${m.media ? (m.mediaType === 'audio' ? `<audio controls src="${m.media}"></audio>` : `<img src="${m.media}" class="partner-message-media">`) : ''}
      <div class="message-status">${m.read ? '✓✓ Lu' : '✓ Envoyé'}</div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

function startConversationWithUser(userId, userName) {
  let conv = conversations.find(c => c.userId === userId);
  if (!conv) {
    conv = { userId, userName, userAvatar: null, messages: [], unreadCount: 0, lastMessage: '', lastMessageTime: null };
    conversations.push(conv);
    saveConversations();
  }
  showPanel('messaging');
  openConversation(userId);
}

function simulateIncomingMessage(userId, userName, text) {
  let conv = conversations.find(c => c.userId === userId);
  if (!conv) {
    conv = { userId, userName, userAvatar: null, messages: [], unreadCount: 0, lastMessage: '', lastMessageTime: null };
    conversations.push(conv);
  }
  const newMsg = {
    id: Date.now(), senderId: userId, senderName: userName,
    text, media: null, mediaType: null, read: false, createdAt: new Date().toISOString()
  };
  conv.messages.push(newMsg);
  conv.lastMessage = text;
  conv.lastMessageTime = new Date().toISOString();
  if (currentConversationUserId !== userId) {
    conv.unreadCount = (conv.unreadCount || 0) + 1;
  }
  saveConversations();
  renderConversationsList();
  if (currentConversationUserId === userId) renderMessagesForUser(userId);
  showNotifToast(`💬 ${userName}: ${text.substring(0, 30)}...`);
}

function showNotifToast(msg) {
  let notif = document.getElementById('notifToast');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notifToast';
    notif.style.cssText = `position:fixed;top:70px;left:50%;transform:translateX(-50%);background:var(--dark2);border:1px solid var(--gold);padding:0.6rem 1.2rem;border-radius:30px;font-size:0.75rem;z-index:9999;opacity:0;transition:0.3s;font-family:'Space Mono',monospace;cursor:pointer;max-width:90%;`;
    notif.onclick = () => showPanel('messaging');
    document.body.appendChild(notif);
  }
  notif.textContent = msg;
  notif.style.opacity = '1';
  setTimeout(() => { notif.style.opacity = '0'; }, 4000);
}

async function sendPartnerMessageToCurrent() {
  if (!currentConversationUserId) { showToast('Sélectionnez une conversation'); return; }
  const input = document.getElementById('partnerMessageInput');
  const text = input.value.trim();
  if (!text) return;

  let conv = conversations.find(c => c.userId === currentConversationUserId);
  if (!conv) {
    const targetUser = allUsers.find(u => u.id === currentConversationUserId) || { name: 'Utilisateur', id: currentConversationUserId };
    conv = { userId: currentConversationUserId, userName: targetUser.name, userAvatar: null, messages: [], unreadCount: 0, lastMessage: '', lastMessageTime: null };
    conversations.push(conv);
  }

  const newMsg = { id: Date.now(), senderId: currentUser.id, senderName: currentUser.name, text, media: null, mediaType: null, read: false, createdAt: new Date().toISOString() };
  conv.messages.push(newMsg);
  conv.lastMessage = text;
  conv.lastMessageTime = new Date().toISOString();
  saveConversations();
  renderMessagesForUser(currentConversationUserId);
  renderConversationsList();
  input.value = '';
}

async function sendPartnerAudioToCurrent(input) {
  const file = input.files[0];
  if (!file || !currentConversationUserId) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    let conv = conversations.find(c => c.userId === currentConversationUserId);
    if (!conv) {
      const tu = allUsers.find(u => u.id === currentConversationUserId) || { name: 'Utilisateur', id: currentConversationUserId };
      conv = { userId: currentConversationUserId, userName: tu.name, userAvatar: null, messages: [], unreadCount: 0, lastMessage: '', lastMessageTime: null };
      conversations.push(conv);
    }
    const newMsg = { id: Date.now(), senderId: currentUser.id, senderName: currentUser.name, text: '🎤 Message audio', media: e.target.result, mediaType: 'audio', read: false, createdAt: new Date().toISOString() };
    conv.messages.push(newMsg);
    conv.lastMessage = '🎤 Audio';
    conv.lastMessageTime = new Date().toISOString();
    saveConversations();
    renderMessagesForUser(currentConversationUserId);
    renderConversationsList();
    showToast('Audio envoyé');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

async function sendPartnerImageToCurrent(input) {
  const file = input.files[0];
  if (!file || !currentConversationUserId) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    let conv = conversations.find(c => c.userId === currentConversationUserId);
    if (!conv) {
      const tu = allUsers.find(u => u.id === currentConversationUserId) || { name: 'Utilisateur', id: currentConversationUserId };
      conv = { userId: currentConversationUserId, userName: tu.name, userAvatar: null, messages: [], unreadCount: 0, lastMessage: '', lastMessageTime: null };
      conversations.push(conv);
    }
    const newMsg = { id: Date.now(), senderId: currentUser.id, senderName: currentUser.name, text: '🖼️ Image', media: e.target.result, mediaType: 'image', read: false, createdAt: new Date().toISOString() };
    conv.messages.push(newMsg);
    conv.lastMessage = '🖼️ Image';
    conv.lastMessageTime = new Date().toISOString();
    saveConversations();
    renderMessagesForUser(currentConversationUserId);
    renderConversationsList();
    showToast('Image envoyée');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ==================== STORIES ====================
function loadStories() {
  const saved = localStorage.getItem('stories');
  if (saved) { try { stories = JSON.parse(saved); } catch(e) { stories = []; } }
  stories = stories.filter(s => new Date(s.expiresAt) > new Date());
  renderStories();
}

function renderStories() {
  const container = document.getElementById('storiesContainer');
  if (!container) return;
  const activeStories = stories.filter(s => new Date(s.expiresAt) > new Date());
  if (activeStories.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = activeStories.map(s => `
    <div class="story-item" onclick="viewStory(${s.id})">
      <div class="story-ring"><div class="story-avatar">${s.mediaType === 'image' ? `<img src="${s.media}">` : '📹'}</div></div>
      <span class="story-name">${escapeHtml(s.authorName)}</span>
    </div>
  `).join('');
}

function openStoryModal() { document.getElementById('storyModal').style.display = 'flex'; }
function closeStoryModal() {
  document.getElementById('storyModal').style.display = 'none';
  document.getElementById('storyFile').value = '';
  document.getElementById('storyCaption').value = '';
}

async function addStory() {
  const fileInput = document.getElementById('storyFile');
  const caption = document.getElementById('storyCaption').value;
  const file = fileInput.files[0];
  if (!file) { showToast('Choisissez une image ou vidéo'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const newStory = {
      id: Date.now(), authorId: currentUser.id, authorName: currentUser.name,
      media: e.target.result, mediaType: file.type.startsWith('video') ? 'video' : 'image',
      caption, createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    stories.push(newStory);
    localStorage.setItem('stories', JSON.stringify(stories));
    renderStories();
    closeStoryModal();
    showToast('Story publiée !');
  };
  reader.readAsDataURL(file);
}

function viewStory(storyId) {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.zIndex = '2000';
  modal.innerHTML = `
    <div class="modal" style="max-width:400px;text-align:center">
      ${story.mediaType === 'image' ? `<img src="${story.media}" style="max-width:100%;border-radius:12px">` : `<video src="${story.media}" controls style="max-width:100%;border-radius:12px"></video>`}
      ${story.caption ? `<p style="margin-top:1rem">${escapeHtml(story.caption)}</p>` : ''}
      <button class="btn-primary" style="margin-top:1rem" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
    </div>`;
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// ==================== PROFIL CRÉATEUR STYLE TIKTOK ====================
async function renderCreatorProfile() {
  const el = document.getElementById('creatorProfileContent');
  if (!el) return;

  const savedStatus = localStorage.getItem('creator_status') || '🥃 Nouvelle distillation en cours !';
  const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.comments?.length || 0), 0);

  let totalVisitors = allUsers.length + 1;
  try {
    const statsRes = await fetch('/api/admin/stats');
    if (statsRes.ok) { const stats = await statsRes.json(); totalVisitors = stats.totalVisitors; }
  } catch(e) {}

  // Liens sociaux
  const socialLinks = [];
  if (creatorInfo.tiktok) socialLinks.push(`<a href="${creatorInfo.tiktok}" target="_blank" class="tiktok-social-link tiktok-link">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
    TikTok</a>`);
  if (creatorInfo.instagram) socialLinks.push(`<a href="${creatorInfo.instagram}" target="_blank" class="tiktok-social-link insta-link">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    Instagram</a>`);
  if (creatorInfo.phone) socialLinks.push(`<a href="tel:${creatorInfo.phone}" class="tiktok-social-link phone-link">📞 ${escapeHtml(creatorInfo.phone)}</a>`);

  // Champs personnalisés
  const customLinksHTML = (creatorInfo.customLinks || []).map(l =>
    `<a href="${escapeHtml(l.url)}" target="_blank" class="tiktok-social-link custom-link">🔗 ${escapeHtml(l.label)}</a>`
  ).join('');

  // Publications du créateur
  const myPosts = posts.filter(p => p.authorRole === 'creator' || p.authorRole === 'admin');
  const postsGridHTML = myPosts.length > 0
    ? `<div class="tiktok-posts-grid">${myPosts.map(p => {
        const thumb = p.media?.[0];
        return `<div class="tiktok-post-thumb" onclick="showPanel('feed')">
          ${thumb ? (thumb.type === 'video' ? `<video src="${thumb.url}" muted></video>` : `<img src="${thumb.url}">`) : `<div class="tiktok-text-thumb">📢</div>`}
          <div class="tiktok-post-views">👁 ${p.views || 0}</div>
        </div>`;
      }).join('')}</div>`
    : `<div class="empty-state" style="margin-top:2rem">📷 Aucune publication</div>`;

  const canEdit = isCreator() || isAdmin();

  el.innerHTML = `
    <!-- Couverture -->
    <div class="tiktok-cover">
      <div class="tiktok-cover-bg"></div>
      ${canEdit ? `<button class="tiktok-edit-cover-btn" onclick="openEditProfileModal()">✏️ Modifier le profil</button>` : ''}
    </div>

    <!-- Avatar + infos principales -->
    <div class="tiktok-profile-top">
      <div class="tiktok-avatar-wrap" onclick="${canEdit ? 'openEditProfileModal()' : ''}">
        ${creatorInfo.avatar
          ? `<img src="${creatorInfo.avatar}" class="tiktok-avatar-img">`
          : `<div class="tiktok-avatar-placeholder">${creatorInfo.name?.[0]?.toUpperCase() || 'D'}</div>`}
        ${canEdit ? `<div class="tiktok-avatar-edit">📷</div>` : ''}
      </div>
      <h2 class="tiktok-username">@${escapeHtml(creatorInfo.name)}</h2>
      <p class="tiktok-bio">${escapeHtml(creatorInfo.bio)}</p>
    </div>

    <!-- Stats style TikTok -->
    <div class="tiktok-stats-row">
      <div class="tiktok-stat">
        <div class="tiktok-stat-num">${formatNum(myPosts.length)}</div>
        <div class="tiktok-stat-lbl">Publications</div>
      </div>
      <div class="tiktok-stat">
        <div class="tiktok-stat-num">${formatNum(creatorInfo.followers || totalVisitors)}</div>
        <div class="tiktok-stat-lbl">Abonnés</div>
      </div>
      <div class="tiktok-stat">
        <div class="tiktok-stat-num">${formatNum(totalLikes)}</div>
        <div class="tiktok-stat-lbl">J'aime</div>
      </div>
    </div>

    <!-- Liens sociaux -->
    <div class="tiktok-social-links">
      ${socialLinks.join('')}
      ${customLinksHTML}
    </div>

    <!-- Status -->
    <div class="tiktok-status">
      <span id="creatorStatusText">${escapeHtml(savedStatus)}</span>
      ${canEdit ? `<button class="tiktok-status-edit" onclick="editCreatorStatus()">✏️</button>` : ''}
    </div>

    ${canEdit ? `<div style="display:flex;gap:0.5rem;margin:1rem 0;">
      <button class="btn-primary" style="flex:1" onclick="openStoryModal()">📸 Story</button>
      <button class="btn-secondary" style="flex:1" onclick="openEditProfileModal()">✏️ Modifier</button>
    </div>` : ''}

    <!-- Grille publications -->
    <div class="tiktok-section-title">📱 Publications</div>
    ${postsGridHTML}
  `;
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function editCreatorStatus() {
  const newStatus = prompt('Nouveau status:', document.getElementById('creatorStatusText')?.textContent || '');
  if (newStatus) {
    document.getElementById('creatorStatusText').textContent = newStatus;
    localStorage.setItem('creator_status', newStatus);
    showToast('Status mis à jour');
  }
}

function openEditProfileModal() {
  document.getElementById('profileName').value = creatorInfo.name;
  document.getElementById('profileBio').value = creatorInfo.bio;
  document.getElementById('profileTiktok').value = creatorInfo.tiktok || '';
  document.getElementById('profileInstagram').value = creatorInfo.instagram || '';
  document.getElementById('profilePhone').value = creatorInfo.phone || '';
  document.getElementById('profileFollowers').value = creatorInfo.followers || '';
  renderCustomLinksEditor();
  document.getElementById('editProfileModal').style.display = 'flex';
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function renderCustomLinksEditor() {
  const container = document.getElementById('customLinksContainer');
  if (!container) return;
  container.innerHTML = (creatorInfo.customLinks || []).map((l, i) => `
    <div class="custom-link-row">
      <input type="text" value="${escapeHtml(l.label)}" placeholder="Nom" onchange="creatorInfo.customLinks[${i}].label=this.value">
      <input type="text" value="${escapeHtml(l.url)}" placeholder="URL" onchange="creatorInfo.customLinks[${i}].url=this.value">
      <button onclick="removeCustomLink(${i})" style="background:var(--red);border:none;color:white;padding:0.3rem 0.6rem;border-radius:6px;cursor:pointer;">✕</button>
    </div>
  `).join('');
}

function addCustomLink() {
  if (!creatorInfo.customLinks) creatorInfo.customLinks = [];
  creatorInfo.customLinks.push({ label: '', url: '' });
  renderCustomLinksEditor();
}

function removeCustomLink(i) {
  creatorInfo.customLinks.splice(i, 1);
  renderCustomLinksEditor();
}

function updateProfile() {
  creatorInfo.name = document.getElementById('profileName').value || creatorInfo.name;
  creatorInfo.bio = document.getElementById('profileBio').value || creatorInfo.bio;
  creatorInfo.tiktok = document.getElementById('profileTiktok').value;
  creatorInfo.instagram = document.getElementById('profileInstagram').value;
  creatorInfo.phone = document.getElementById('profilePhone').value || creatorInfo.phone;
  const followersVal = document.getElementById('profileFollowers').value;
  if (followersVal) creatorInfo.followers = parseInt(followersVal);

  const avatarInput = document.getElementById('profileAvatarInput');
  const file = avatarInput?.files[0];

  const save = () => {
    localStorage.setItem('creator_info', JSON.stringify(creatorInfo));
    renderCreatorProfile();
    const nameEl = document.getElementById('dropdownName');
    if (nameEl) nameEl.textContent = creatorInfo.name;
    closeEditProfileModal();
    showToast('Profil mis à jour !');
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { creatorInfo.avatar = e.target.result; save(); };
    reader.readAsDataURL(file);
  } else { save(); }
}

// ==================== ADMIN ====================
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  event.target.classList.add('active');
  const section = document.getElementById('admin-' + tab);
  if (section) section.classList.add('active');
  if (tab === 'users') renderUsersList();
}

function renderUsersList() {
  const el = document.getElementById('usersList');
  if (!el) return;
  const users = allUsers.filter(u => u.id !== currentUser?.id);
  if (!users.length) { el.innerHTML = '<div class="empty-state">Aucun utilisateur</div>'; return; }
  el.innerHTML = users.map(u => `
    <div class="user-row">
      <div class="user-info">
        <div class="user-avatar">${u.name?.[0]?.toUpperCase() || '?'}</div>
        <div>
          <div class="user-name">${escapeHtml(u.name)}</div>
          <div class="user-email">${escapeHtml(u.email)}</div>
        </div>
        <span class="user-role-badge ${u.banned ? 'banned' : ''}">${u.banned ? 'Banni' : (u.role === 'admin' ? 'Admin' : 'Utilisateur')}</span>
      </div>
      <div class="user-actions">
        ${isCreator() && u.role === 'user' && !u.banned ? `<button class="btn-xs btn-promote" onclick="promoteUser('${u.id}')">⭐ Admin</button>` : ''}
        ${isCreator() && u.role === 'admin' ? `<button class="btn-xs btn-demote" onclick="demoteUser('${u.id}')">↓ User</button>` : ''}
        ${!u.banned ? `<button class="btn-xs btn-ban" onclick="banUser('${u.id}')">🚫 Bannir</button>` : `<button class="btn-xs btn-promote" onclick="unbanUser('${u.id}')">✓ Débannir</button>`}
        <button class="btn-xs btn-promote" onclick="startConversationWithUser('${u.id}', '${escapeHtml(u.name)}')">💬 Message</button>
      </div>
    </div>`).join('');
}

async function promoteUser(id) {
  const res = await fetch('/api/admin/promote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) });
  if (res.ok) { showToast('Promu admin'); await loadUsersFromGithub(); renderUsersList(); }
}
async function demoteUser(id) {
  const res = await fetch('/api/admin/demote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) });
  if (res.ok) { showToast('Rétrogradé'); await loadUsersFromGithub(); renderUsersList(); }
}
async function banUser(id) {
  if (confirm('Bannir ?')) {
    const res = await fetch('/api/admin/ban', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) });
    if (res.ok) { showToast('Banni'); await loadUsersFromGithub(); renderUsersList(); }
  }
}
async function unbanUser(id) {
  const res = await fetch('/api/admin/unban', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) });
  if (res.ok) { showToast('Débanni'); await loadUsersFromGithub(); renderUsersList(); }
}

// ==================== POST CREATION ====================
let selectedFiles = [];
function previewMedia(input) {
  selectedFiles = Array.from(input.files);
  const container = document.getElementById('mediaPreviews');
  if (!container) return;
  container.innerHTML = '';
  selectedFiles.forEach(f => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    container.appendChild(img);
  });
}

async function createPost() {
  if (!isAdmin()) { showToast('Connexion admin requise'); return; }
  const caption = document.getElementById('postCaption').value.trim();
  const price = document.getElementById('postPrice').value;
  const currency = document.getElementById('postCurrency').value;

  if (!selectedFiles.length && !caption) {
    showToast('Ajoute une image/vidéo ou écris une description');
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach(f => formData.append('media', f));
  formData.append('caption', caption);
  formData.append('price', price || '');
  formData.append('currency', currency);
  formData.append('priceVisible', price ? 'true' : 'false');

  try {
    showToast('Publication en cours...');
    const res = await fetch('/api/posts', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) { showToast('Erreur : ' + (data.error || res.status)); return; }
    showToast('✅ Publié avec succès !');
    await loadFeed();
    showPanel('feed');
    document.getElementById('postCaption').value = '';
    document.getElementById('postPrice').value = '';
    const prevEl = document.getElementById('mediaPreviews');
    if (prevEl) prevEl.innerHTML = '';
    selectedFiles = [];
  } catch(e) { showToast('Erreur de connexion'); }
}

// ==================== THEME & LANGUE ====================
function changeTheme(theme) {
  userTheme = theme;
  document.body.classList.remove('theme-dark', 'theme-white', 'theme-red', 'theme-gold');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('rhum_theme', theme);
  document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector(`.theme-option[data-theme="${theme}"]`)?.classList.add('selected');
  showToast(`Thème: ${theme}`);
  document.getElementById('themeLangMenu')?.classList.remove('open');
}

function changeLanguage(lang) {
  userLang = lang;
  localStorage.setItem('rhum_lang', lang);
  document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector(`.lang-option[data-lang="${lang}"]`)?.classList.add('selected');
  applyLanguage();
  showToast(`Langue: ${lang}`);
  document.getElementById('themeLangMenu')?.classList.remove('open');
}

function applyLanguage() {
  const t = translations[userLang] || translations.fr;
  const elements = {
    cartTitle: 'cartTitle', messagingTitle: 'messagingTitle', adminTitle: 'adminTitle'
  };
  for (const [key, id] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el && t[key]) el.textContent = t[key];
  }
  const msgInput = document.getElementById('partnerMessageInput');
  if (msgInput) msgInput.placeholder = t.placeholder;
  if (document.getElementById('panel-cart')?.classList.contains('active')) renderCart();
}

function toggleThemeLangMenu() { document.getElementById('themeLangMenu')?.classList.toggle('open'); }
function toggleProfileMenu(force) {
  const dd = document.getElementById('profileDropdown');
  if (force === false) { dd?.classList.remove('open'); return; }
  dd?.classList.toggle('open');
}

function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');
  const btnId = `bnav-${name}`;
  document.getElementById(btnId)?.classList.add('active');
  if (name === 'cart') renderCart();
  if (name === 'creator') renderCreatorProfile();
  if (name === 'messaging') {
    renderConversationsList();
    const mv = document.getElementById('messagesView');
    const cl = document.getElementById('conversationsList');
    if (mv) mv.style.display = 'none';
    if (cl) cl.style.display = 'block';
  }
  if (name === 'admin') {
    if (!isAdmin()) { showPanel('feed'); showToast('Accès refusé'); return; }
    loadUsersFromGithub().then(() => renderUsersList());
  }
  document.getElementById('profileDropdown')?.classList.remove('open');
  document.getElementById('themeLangMenu')?.classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#profileDropdown') && !e.target.closest('#profileBtn')) {
    document.getElementById('profileDropdown')?.classList.remove('open');
  }
  if (!e.target.closest('#themeLangMenu') && !e.target.closest('.nav-btn[title*="Thème"]')) {
    document.getElementById('themeLangMenu')?.classList.remove('open');
  }
});

// ==================== DANOU ASSISTANT ====================
let chatHistory = [];

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChatBubble('user', text);
  chatHistory.push({ role: 'user', content: text });
  const typingDiv = appendChatBubble('bot', '...');
  typingDiv.classList.add('chat-typing');
  try {
    const res = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Je suis indisponible pour le moment.';
    typingDiv.textContent = reply;
    typingDiv.classList.remove('chat-typing');
    chatHistory.push({ role: 'assistant', content: reply });
  } catch(e) { typingDiv.textContent = 'Erreur de connexion.'; }
}

function appendChatBubble(role, text) {
  const container = document.getElementById('chatMessages');
  if (!container) return document.createElement('div');
  const div = document.createElement('div');
  div.textContent = text;
  div.className = role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}
