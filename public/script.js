// ==================== CONFIGURATION ====================
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'sylvainbetty91-sys/Family';
const GITHUB_FILE_PATH = 'users.json';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ==================== TRANSLATIONS ====================
const translations = {
  fr: {
    loginTitle: 'Connexion', registerTitle: 'Inscription', email: 'Email', password: 'Mot de passe',
    name: 'Nom', loginBtn: 'Se connecter', registerBtn: 'Créer mon compte', noAccount: 'Pas de compte ?',
    haveAccount: 'Déjà un compte ?', registerLink: "S'inscrire", loginLink: 'Se connecter',
    siteName: 'Rhum Danou', cart: 'Panier', emptyCart: '🛒 Panier vide', emptyPosts: '🥃 Aucune publication',
    navHome: 'Accueil', navCart: 'Panier', navPartner: 'Partenariat', navCreator: 'Créateur', navAdmin: 'Admin',
    cartTitle: '🛒 Mon Panier', partnerTitle: '🤝 Espace Partenariat', adminTitle: '⚙️ Administration',
    adminPublish: '📸 Publier', adminUsers: '👥 Utilisateurs',
    publishBtn: '✨ Publier', creatorProfile: '👑 Profil Créateur', logout: '🚪 Déconnexion', loading: 'Chargement...',
    chatPlaceholder: 'Pose ta question...', partnerPlaceholder: 'Écris ton message...',
    welcomeMessage: '👋 Bonjour ! Je suis votre assistant intelligent Rhum Danou.'
  },
  en: {
    loginTitle: 'Login', registerTitle: 'Sign Up', email: 'Email', password: 'Password',
    name: 'Name', loginBtn: 'Login', registerBtn: 'Create account', noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?', registerLink: 'Sign up', loginLink: 'Login',
    siteName: 'Rhum Danou', cart: 'Cart', emptyCart: '🛒 Empty cart', emptyPosts: '🥃 No posts',
    navHome: 'Home', navCart: 'Cart', navPartner: 'Partnership', navCreator: 'Creator', navAdmin: 'Admin',
    cartTitle: '🛒 My Cart', partnerTitle: '🤝 Partnership Space', adminTitle: '⚙️ Admin',
    adminPublish: '📸 Publish', adminUsers: '👥 Users',
    publishBtn: '✨ Publish', creatorProfile: '👑 Creator Profile', logout: '🚪 Logout', loading: 'Loading...',
    chatPlaceholder: 'Ask your question...', partnerPlaceholder: 'Write your message...',
    welcomeMessage: '👋 Hello! I am your Rhum Danou smart assistant.'
  },
  ht: {
    loginTitle: 'Koneksyon', registerTitle: 'Enskripsyon', email: 'Imèl', password: 'Modpas',
    name: 'Non', loginBtn: 'Konekte', registerBtn: 'Kreye kont', noAccount: 'Pa gen kont ?',
    haveAccount: 'Gen kont deja ?', registerLink: 'Enskri', loginLink: 'Konekte',
    siteName: 'Rhum Danou', cart: 'Panyen', emptyCart: '🛒 Panyen vid', emptyPosts: '🥃 Pa gen piblikasyon',
    navHome: 'Akèy', navCart: 'Panyen', navPartner: 'Patenarya', navCreator: 'Kreyatè', navAdmin: 'Admin',
    cartTitle: '🛒 Panyen mwen', partnerTitle: '🤝 Espas Patenarya', adminTitle: '⚙️ Administrasyon',
    adminPublish: '📸 Pibliye', adminUsers: '👥 Itilizatè',
    publishBtn: '✨ Pibliye', creatorProfile: '👑 Pwofil Kreyatè', logout: '🚪 Dekonekte', loading: 'Chajman...',
    chatPlaceholder: 'Poze kesyon w...', partnerPlaceholder: 'Ekri mesaj w...',
    welcomeMessage: '👋 Bonjou! Mwen se asistan Rhum Danou.'
  },
  es: {
    loginTitle: 'Iniciar Sesión', registerTitle: 'Registrarse', email: 'Correo', password: 'Contraseña',
    name: 'Nombre', loginBtn: 'Iniciar sesión', registerBtn: 'Crear cuenta', noAccount: '¿No tienes cuenta?',
    haveAccount: '¿Ya tienes cuenta?', registerLink: 'Registrarse', loginLink: 'Iniciar sesión',
    siteName: 'Rhum Danou', cart: 'Carrito', emptyCart: '🛒 Carrito vacío', emptyPosts: '🥃 Sin publicaciones',
    navHome: 'Inicio', navCart: 'Carrito', navPartner: 'Asociación', navCreator: 'Creador', navAdmin: 'Admin',
    cartTitle: '🛒 Mi Carrito', partnerTitle: '🤝 Espacio Asociación', adminTitle: '⚙️ Administración',
    adminPublish: '📸 Publicar', adminUsers: '👥 Usuarios',
    publishBtn: '✨ Publicar', creatorProfile: '👑 Perfil Creador', logout: '🚪 Cerrar sesión', loading: 'Cargando...',
    chatPlaceholder: 'Haz tu pregunta...', partnerPlaceholder: 'Escribe tu mensaje...',
    welcomeMessage: '👋 ¡Hola! Soy tu asistente inteligente de Rhum Danou.'
  }
};

// ==================== STATE ====================
let currentUser = null;
let posts = [];
let cart = [];
let userLang = 'fr';
let userTheme = 'dark';
let creatorLinks = {
  instagram: 'https://instagram.com/rhumdanou',
  whatsappChannel: '',
  telegram: '',
  phone: '+50933324695'
};
let creatorInfo = {
  name: 'Danou',
  avatar: null,
  bio: '🥃 Créateur de Rhum Danou | Artisan distillateur'
};
let totalLikes = 0, totalComments = 0, totalUsers = 0;
let allUsers = [];
let chatHistory = [];
let partnerMessages = [];
let stories = [];

// ==================== LANGUAGE & THEME ====================
function applyLanguage() {
  const t = translations[userLang] || translations.fr;
  const elements = {
    loginTitle: 'loginTitle', registerTitle: 'registerTitle',
    loginBtn: 'loginBtn', registerBtn: 'registerBtn', noAccountText: 'noAccountText', haveAccountText: 'haveAccountText',
    registerLink: 'registerLink', loginLink: 'loginLink', siteName: 'siteName',
    cartTitle: 'cartTitle', partnerTitle: 'partnerTitle', adminTitle: 'adminTitle',
    adminPublishTab: 'adminPublishTab', adminUsersTab: 'adminUsersTab',
    publishBtn: 'publishBtn', creatorProfileBtn: 'creatorProfileBtn', logoutBtn: 'logoutBtn',
    loadingText: 'loadingText', navHomeText: 'navHomeText', navCartText: 'navCartText',
    navPartnerText: 'navPartnerText', navCreatorText: 'navCreatorText', navAdminText: 'navAdminText'
  };
  for (const [key, id] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el && t[key]) el.textContent = t[key];
  }
  const partnerInput = document.getElementById('partnerMessageInput');
  if (partnerInput) partnerInput.placeholder = t.partnerPlaceholder;
  
  if (document.getElementById('panel-cart')?.classList.contains('active')) renderCart();
  if (document.getElementById('panel-creator')?.classList.contains('active')) renderCreatorProfile();
  if (document.getElementById('panel-partner')?.classList.contains('active')) renderPartnerMessages();
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

function toggleThemeLangMenu() { document.getElementById('themeLangMenu')?.classList.toggle('open'); }
function toggleProfileMenu(force) {
  const dd = document.getElementById('profileDropdown');
  if (force === false) { dd?.classList.remove('open'); return; }
  dd?.classList.toggle('open');
}

// ==================== GITHUB SYNC ====================
async function loadUsersFromGithub() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });
    if (res.ok) {
      const data = await res.json();
      allUsers = JSON.parse(atob(data.content));
      return allUsers;
    }
  } catch(e) {}
  return [];
}

async function saveUsersToGithub(users) {
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(users, null, 2))));
    let sha = null;
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      if (res.ok) sha = (await res.json()).sha;
    } catch(e) {}
    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Users update ${new Date().toISOString()}`, content, sha })
    });
  } catch(e) {}
}

async function syncUserToGithub(user) {
  await loadUsersFromGithub();
  const idx = allUsers.findIndex(u => u.id === user.id);
  if (idx !== -1) allUsers[idx] = user;
  else allUsers.push(user);
  await saveUsersToGithub(allUsers);
}

// ==================== AUTH ====================
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    currentUser = data.user;
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    enterApp();
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

// ==================== ENTER APP ====================
async function enterApp() {
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('dropdownEmail').textContent = currentUser.email;
  
  if (currentUser.role === 'creator') {
    document.getElementById('bnav-creator').style.display = 'flex';
  }
  if (['creator', 'admin'].includes(currentUser.role)) {
    document.getElementById('bnav-admin').style.display = 'flex';
  }
  
  await loadUsersFromGithub();
  const githubUser = allUsers.find(u => u.id === currentUser.id);
  if (githubUser) { currentUser.role = githubUser.role; currentUser.banned = githubUser.banned; }
  else await syncUserToGithub(currentUser);
  
  loadCreatorInfo();
  loadPartnerMessages();
  loadStories();
  loadFeed();
  loadCart();
  renderUsersList();
  initChat();
  applyLanguage();
}

// ==================== CHAT INTELLIGENT ====================
function initChat() {
  const t = translations[userLang] || translations.fr;
  chatHistory = [{ role: 'assistant', content: t.welcomeMessage }];
  renderChatMessages();
}

function renderChatMessages() {
  const el = document.getElementById('chatWindow');
  if (!el) return;
  el.innerHTML = chatHistory.map(m => `<div class="msg-bubble msg-${m.role === 'user' ? 'user' : 'bot'}">${escapeHtml(m.content)}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function detectLanguage(text) {
  const lower = text.toLowerCase();
  if (lower.includes('bonjou') || lower.includes('kijan') || lower.includes('mwen')) return 'ht';
  if (lower.includes('hola') || lower.includes('como') || lower.includes('qué')) return 'es';
  if (lower.includes('bonjour') || lower.includes('comment') || lower.includes('je')) return 'fr';
  return 'en';
}

async function sendSmartMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  chatHistory.push({ role: 'user', content: text });
  renderChatMessages();
  
  const detectedLang = detectLanguage(text);
  const systemPrompt = `Tu es un assistant pour "Rhum Danou". Réponds en ${detectedLang === 'ht' ? 'créole' : detectedLang === 'es' ? 'espagnol' : detectedLang === 'fr' ? 'français' : 'anglais'}. Sois amical et concis. Téléphone: ${creatorLinks.phone}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'system', content: systemPrompt }, ...chatHistory.slice(-10)],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    if (response.ok) {
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content;
      if (botReply) chatHistory.push({ role: 'assistant', content: botReply });
      else chatHistory.push({ role: 'assistant', content: getFallbackResponse(text, detectedLang) });
    } else {
      chatHistory.push({ role: 'assistant', content: getFallbackResponse(text, detectedLang) });
    }
  } catch(e) {
    chatHistory.push({ role: 'assistant', content: getFallbackResponse(text, detectedLang) });
  }
  renderChatMessages();
}

function getFallbackResponse(text, lang) {
  const lower = text.toLowerCase();
  if (lower.includes('philo') || lower.includes('vie')) {
    return lang === 'fr' ? '📚 La philosophie ? C\'est l\'art de déguster chaque instant comme un bon rhum ! 🥃' :
           lang === 'en' ? '📚 Philosophy? It\'s the art of enjoying every moment like a good rum! 🥃' :
           '📚 Filozofi? Se atizay degoute chak moman tankou yon bon wonm! 🥃';
  }
  return lang === 'fr' ? 'Je suis votre assistant Rhum Danou. Que voulez-vous savoir ?' :
         lang === 'en' ? 'I am your Rhum Danou assistant. What would you like to know?' :
         'Mwen se asistan Rhum Danou w. Kisa ou vle konnen?';
}

// ==================== FEED ====================
async function loadFeed() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    posts = data.posts || [];
    renderFeed();
    renderStories();
  } catch(e) { document.getElementById('feedContent').innerHTML = '<div class="empty-state">Erreur</div>'; }
}

function renderFeed() {
  const el = document.getElementById('feedContent');
  if (!posts.length) { el.innerHTML = `<div class="empty-state"><span class="icon">🥃</span><p>${translations[userLang]?.emptyPosts || 'Aucune publication'}</p></div>`; return; }
  el.innerHTML = posts.map(post => renderPost(post)).join('');
}

function renderPost(post) {
  const isAdmin = ['creator', 'admin'].includes(currentUser?.role);
  const liked = post.likes?.includes(currentUser?.id);
  const isTextOnly = !post.media || post.media.length === 0;
  
  let mediaHTML = '';
  if (!isTextOnly && post.media) {
    mediaHTML = `<div class="post-media-wrapper"><div class="media-slider">${post.media.map(m => m.type === 'video' ? `<div class="media-item"><video src="${m.url}" controls></video></div>` : `<div class="media-item"><img src="${m.url}" loading="lazy"></div>`).join('')}</div><div class="views-badge">👁️ ${post.views || 0}</div></div>`;
  } else if (post.caption) {
    mediaHTML = `<div class="text-post">📢 ${escapeHtml(post.caption)}</div>`;
  }
  
  const priceBadge = post.price && post.priceVisible ? `<div class="price-badge">💰 ${post.price} ${post.currency}</div>` : '';
  const commentsHTML = (post.comments || []).slice(-3).map(c => `<div class="comment-item"><span><strong>${escapeHtml(c.userName)}</strong> ${escapeHtml(c.text)}</span>${isAdmin ? `<button class="del-comment-btn" onclick="deleteComment('${post.id}','${c.id}')">✕</button>` : ''}</div>`).join('');
  const adminControls = isAdmin ? `<div class="admin-post-controls"><button class="btn-admin-sm btn-edit" onclick="openEditModal('${post.id}')">✏️ Modifier</button><button class="btn-admin-sm btn-delete" onclick="deletePost('${post.id}')">🗑 Supprimer</button></div>` : '';
  const cartBtn = post.price ? `<button class="btn-cart" onclick="addToCart('${post.id}')">🛒 ×3</button>` : '';
  
  return `<div class="post-card"><div class="post-header"><div class="post-author"><div class="post-avatar">${post.authorName?.[0]?.toUpperCase() || 'D'}</div><div><div class="post-author-name">${escapeHtml(post.authorName)}</div><div class="post-author-badge">${post.authorRole === 'creator' ? '👑 Créateur' : '⭐ Admin'}</div></div></div><div class="post-time">${timeAgo(post.createdAt)}</div></div>${mediaHTML}${priceBadge}<div class="post-actions"><button class="action-btn ${liked?'liked':''}" onclick="likePost('${post.id}',this)">❤️ <span id="likes-${post.id}">${post.likes?.length||0}</span></button><button class="action-btn">💬 ${post.comments?.length||0}</button>${cartBtn}</div>${!isTextOnly && post.caption ? `<div class="post-caption"><strong>${escapeHtml(post.authorName)}</strong> ${escapeHtml(post.caption)}</div>` : ''}<div class="comments-section">${commentsHTML}</div><div class="comment-form"><input class="comment-input" placeholder="Ajouter..." onkeydown="if(event.key==='Enter')submitComment('${post.id}',this)"><button class="comment-submit" onclick="submitComment('${post.id}',this.previousElementSibling)">➤</button></div>${adminControls}</div>`;
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
  document.getElementById('likes-' + postId).textContent = data.likes;
}

async function submitComment(postId, input) {
  const text = input.value.trim();
  if (!text) return;
  await fetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
  input.value = '';
  loadFeed();
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

// ==================== CART ====================
async function loadCart() {
  const res = await fetch('/api/cart');
  const data = await res.json();
  cart = data.cart || [];
  updateCartBadge();
}

async function addToCart(postId) {
  const res = await fetch('/api/cart/add', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId }) });
  const data = await res.json();
  cart = data.cart || [];
  updateCartBadge();
  showToast('×3 ajoutés au panier');
  if (document.getElementById('panel-cart').classList.contains('active')) renderCart();
}

function updateCartBadge() {
  const total = cart.reduce((s,i) => s + (i.quantity || 3), 0);
  document.getElementById('cartBadge').textContent = total;
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!cart.length) { el.innerHTML = `<div class="empty-state">${translations[userLang]?.emptyCart || 'Panier vide'}</div>`; return; }
  const totals = {};
  cart.forEach(i => { if(!totals[i.currency]) totals[i.currency]=0; totals[i.currency] += i.price * (i.quantity||3); });
  const totalStr = Object.entries(totals).map(([c,a]) => `${a.toFixed(2)} ${c}`).join(' + ');
  el.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-info"><div class="cart-name">${escapeHtml(item.productName)}</div><div class="cart-qty">×${item.quantity||3}</div></div><div class="cart-price">${((item.price||0)*(item.quantity||3)).toFixed(2)} ${item.currency}</div><button class="btn-remove-cart" onclick="removeFromCart('${item.id}')">🗑</button></div>`).join('') + `<div class="cart-total"><span>Total</span><span>${totalStr}</span></div><button class="btn-whatsapp" onclick="orderViaWhatsApp()">📲 Commander via WhatsApp</button>`;
}

async function removeFromCart(itemId) {
  const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
  const data = await res.json();
  cart = data.cart || [];
  updateCartBadge();
  renderCart();
}

function orderViaWhatsApp() {
  let msg = '🥃 *Commande Rhum Danou* 🥃\n\n';
  let total = 0;
  cart.forEach(i => { 
    const itemTotal = (i.price || 0) * (i.quantity || 3);
    total += itemTotal;
    msg += `• ${i.productName} ×${i.quantity || 3} — ${itemTotal.toFixed(2)} ${i.currency}\n`;
  });
  msg += `\n💰 *TOTAL: ${total.toFixed(2)} ${cart[0]?.currency || 'HTG'}*\n\n👤 Nom: ${currentUser.name}\n📧 Email: ${currentUser.email}`;
  window.open(`https://wa.me/${creatorLinks.phone.replace(/[^0-9]/g, '') || '50933324695'}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ==================== ESPACE PARTENARIAT ====================
function loadPartnerMessages() {
  const saved = localStorage.getItem('partner_messages');
  if (saved) partnerMessages = JSON.parse(saved);
  renderPartnerMessages();
}

function renderPartnerMessages() {
  const el = document.getElementById('partnerChatWindow');
  if (!el) return;
  const isCreator = currentUser?.role === 'creator';
  el.innerHTML = partnerMessages.map(m => `
    <div class="partner-message ${m.senderId === 'creator' ? 'partner-message-creator' : 'partner-message-user'}">
      <div><strong>${escapeHtml(m.senderName)}</strong> <span style="font-size:0.6rem;color:var(--grey)">${new Date(m.createdAt).toLocaleTimeString()}</span></div>
      <div>${escapeHtml(m.text)}</div>
      ${m.media ? (m.mediaType === 'audio' ? `<audio controls src="${m.media}" style="max-width:200px"></audio>` : `<img src="${m.media}" class="partner-message-media">`) : ''}
      <div class="message-status">${m.read ? '✓✓ Lu' : '✓ Envoyé'}</div>
    </div>
  `).join('');
  el.scrollTop = el.scrollHeight;
  if (isCreator && partnerMessages.some(m => !m.read && m.senderId !== 'creator')) {
    markMessagesAsRead();
  }
}

function markMessagesAsRead() {
  partnerMessages.forEach(m => { if (m.senderId !== 'creator') m.read = true; });
  localStorage.setItem('partner_messages', JSON.stringify(partnerMessages));
  renderPartnerMessages();
}

async function sendPartnerMessage() {
  const input = document.getElementById('partnerMessageInput');
  const text = input.value.trim();
  if (!text) return;
  const newMsg = {
    id: Date.now(),
    senderId: currentUser.id,
    senderName: currentUser.name,
    text: text,
    media: null,
    mediaType: null,
    read: false,
    createdAt: new Date().toISOString()
  };
  partnerMessages.push(newMsg);
  localStorage.setItem('partner_messages', JSON.stringify(partnerMessages));
  input.value = '';
  renderPartnerMessages();
  showToast('Message envoyé !');
}

async function sendPartnerAudio(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: '🎤 Message audio',
      media: e.target.result,
      mediaType: 'audio',
      read: false,
      createdAt: new Date().toISOString()
    };
    partnerMessages.push(newMsg);
    localStorage.setItem('partner_messages', JSON.stringify(partnerMessages));
    renderPartnerMessages();
    showToast('Audio envoyé !');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

async function sendPartnerImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: '🖼️ Image',
      media: e.target.result,
      mediaType: 'image',
      read: false,
      createdAt: new Date().toISOString()
    };
    partnerMessages.push(newMsg);
    localStorage.setItem('partner_messages', JSON.stringify(partnerMessages));
    renderPartnerMessages();
    showToast('Image envoyée !');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ==================== STORIES ====================
function loadStories() {
  const saved = localStorage.getItem('stories');
  if (saved) stories = JSON.parse(saved);
  stories = stories.filter(s => new Date(s.expiresAt) > new Date());
  renderStories();
}

function renderStories() {
  const container = document.getElementById('storiesContainer');
  if (!container) return;
  const activeStories = stories.filter(s => new Date(s.expiresAt) > new Date());
  if (activeStories.length === 0 && currentUser?.role !== 'creator') {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = activeStories.map(s => `
    <div class="story-item" onclick="viewStory(${s.id})">
      <div class="story-ring"><div class="story-avatar">${s.mediaType === 'image' ? `<img src="${s.media}">` : '📹'}</div></div>
      <span class="story-name">${escapeHtml(s.authorName)}</span>
    </div>
  `).join('');
}

function openStoryModal() {
  document.getElementById('storyModal').style.display = 'flex';
}

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
      id: Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      media: e.target.result,
      mediaType: file.type.startsWith('video') ? 'video' : 'image',
      caption: caption,
      createdAt: new Date().toISOString(),
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
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

// ==================== PROFIL CREATEUR ====================
function loadCreatorInfo() {
  const saved = localStorage.getItem('creator_info');
  if (saved) {
    try { creatorInfo = JSON.parse(saved); } catch(e) {}
  }
  renderCreatorProfile();
}

function renderCreatorProfile() {
  const el = document.getElementById('creatorProfileContent');
  if (!el) return;
  const savedStatus = localStorage.getItem('creator_status') || '🥃 Nouvelle distillation en cours !';
  el.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar" onclick="openEditProfileModal()" style="cursor:pointer">
        ${creatorInfo.avatar ? `<img src="${creatorInfo.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : (creatorInfo.name?.[0]?.toUpperCase() || 'D')}
      </div>
      <h2>${escapeHtml(creatorInfo.name)}</h2>
      <p style="color:var(--gold)">👑 Créateur</p>
      <p style="font-size:0.8rem;color:var(--grey)">${escapeHtml(creatorInfo.bio)}</p>
    </div>
    <div class="profile-stats">
      <div class="stat-item"><div class="stat-number">${allUsers.length + 1}</div><div class="stat-label">Abonnés</div></div>
      <div class="stat-item"><div class="stat-number">${totalLikes}</div><div class="stat-label">J\'aime</div></div>
      <div class="stat-item"><div class="stat-number">${totalComments}</div><div class="stat-label">Commentaires</div></div>
    </div>
    <div class="profile-links">
      ${creatorLinks.instagram ? `<a href="${creatorLinks.instagram}" target="_blank" class="profile-link">📷 Instagram</a>` : ''}
      ${creatorLinks.whatsappChannel ? `<a href="${creatorLinks.whatsappChannel}" target="_blank" class="profile-link">📱 WhatsApp</a>` : ''}
      ${creatorLinks.telegram ? `<a href="${creatorLinks.telegram}" target="_blank" class="profile-link">✈️ Télégram</a>` : ''}
      ${creatorLinks.phone ? `<a href="tel:${creatorLinks.phone}" class="profile-link">📞 ${creatorLinks.phone}</a>` : ''}
    </div>
    <div class="creator-status">
      <h3>📌 Status</h3>
      <div class="status-text" id="creatorStatusText">${escapeHtml(savedStatus)}</div>
      ${currentUser?.role === 'creator' ? '<button class="btn-primary" onclick="editCreatorStatus()" style="margin-top:0.5rem;">✏️ Modifier</button>' : ''}
    </div>
  `;
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
  document.getElementById('editProfileModal').style.display = 'flex';
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function updateProfile() {
  const newName = document.getElementById('profileName').value;
  const newBio = document.getElementById('profileBio').value;
  const avatarInput = document.getElementById('profileAvatarInput');
  const file = avatarInput.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      creatorInfo.avatar = e.target.result;
      creatorInfo.name = newName;
      creatorInfo.bio = newBio;
      localStorage.setItem('creator_info', JSON.stringify(creatorInfo));
      renderCreatorProfile();
      document.getElementById('dropdownName').textContent = newName;
      closeEditProfileModal();
      showToast('Profil mis à jour !');
    };
    reader.readAsDataURL(file);
  } else {
    creatorInfo.name = newName;
    creatorInfo.bio = newBio;
    localStorage.setItem('creator_info', JSON.stringify(creatorInfo));
    renderCreatorProfile();
    document.getElementById('dropdownName').textContent = newName;
    closeEditProfileModal();
    showToast('Profil mis à jour !');
  }
}

// ==================== ADMIN ====================
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('admin-' + tab).classList.add('active');
  if (tab === 'users') renderUsersList();
}

function renderUsersList() {
  const el = document.getElementById('usersList');
  if (!el) return;
  if (!allUsers.length) { el.innerHTML = '<div class="empty-state">Aucun utilisateur</div>'; return; }
  el.innerHTML = allUsers.map(u => `
    <div class="user-row">
      <div class="user-info">
        <div class="user-avatar">${u.name?.[0]?.toUpperCase() || '?'}</div>
        <div><div class="user-name">${escapeHtml(u.name)}</div><div class="user-email">${escapeHtml(u.email)}</div></div>
        <span class="user-role-badge ${u.banned ? 'banned' : ''}">${u.banned ? 'Banni' : (u.role === 'admin' ? 'Admin' : 'Utilisateur')}</span>
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
  if (res.ok) { showToast('Promu admin'); await loadUsersFromGithub(); renderUsersList(); }
}
async function demoteUser(id) {
  const res = await fetch('/api/admin/demote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Rétrogradé'); await loadUsersFromGithub(); renderUsersList(); }
}
async function banUser(id) {
  if (confirm('Bannir ?')) {
    const res = await fetch('/api/admin/ban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
    if (res.ok) { showToast('Banni'); await loadUsersFromGithub(); renderUsersList(); }
  }
}
async function unbanUser(id) {
  const res = await fetch('/api/admin/unban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Débanni'); await loadUsersFromGithub(); renderUsersList(); }
}

// ==================== POST CREATION ====================
let selectedFiles = [];
function previewMedia(input) {
  selectedFiles = Array.from(input.files);
  const container = document.getElementById('mediaPreviews');
  container.innerHTML = '';
  selectedFiles.forEach(f => { const img = document.createElement('img'); img.src = URL.createObjectURL(f); container.appendChild(img); });
}

async function createPost() {
  if (!selectedFiles.length) { showToast('Ajoute au moins une image/vidéo'); return; }
  const formData = new FormData();
  selectedFiles.forEach(f => formData.append('media', f));
  formData.append('caption', document.getElementById('postCaption').value);
  formData.append('price', document.getElementById('postPrice').value);
  formData.append('currency', document.getElementById('postCurrency').value);
  formData.append('priceVisible', 'true');
  const res = await fetch('/api/posts', { method: 'POST', body: formData });
  if (res.ok) { 
    showToast('Publié !'); 
    loadFeed(); 
    showPanel('feed'); 
    document.getElementById('postCaption').value = ''; 
    document.getElementById('postPrice').value = ''; 
    document.getElementById('mediaPreviews').innerHTML = ''; 
    selectedFiles = []; 
  }
}

// ==================== PANELS ====================
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  const btnId = name === 'partner' ? 'bnav-partner' : `bnav-${name}`;
  document.getElementById(btnId)?.classList.add('active');
  if (name === 'cart') renderCart();
  if (name === 'creator') renderCreatorProfile();
  if (name === 'partner') renderPartnerMessages();
  if (name === 'admin' && currentUser?.role !== 'creator') showPanel('feed');
  document.getElementById('profileDropdown')?.classList.remove('open');
  document.getElementById('themeLangMenu')?.classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ==================== INIT ====================
(async function init() {
  const savedTheme = localStorage.getItem('rhum_theme');
  if (savedTheme) { userTheme = savedTheme; changeTheme(userTheme); }
  const savedLang = localStorage.getItem('rhum_lang');
  if (savedLang) { userLang = savedLang; changeLanguage(userLang); } else { changeLanguage('fr'); }
  
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.user) {
      currentUser = data.user;
      document.getElementById('landing').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      enterApp();
    }
  } catch(e) {}
})();

document.addEventListener('click', e => {
  if (!e.target.closest('#profileDropdown') && !e.target.closest('#profileBtn')) {
    document.getElementById('profileDropdown')?.classList.remove('open');
  }
  if (!e.target.closest('#themeLangMenu') && !e.target.closest('.nav-btn[title*="Thème"]')) {
    document.getElementById('themeLangMenu')?.classList.remove('open');
  }
});
