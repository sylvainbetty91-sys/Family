// ==================== CONFIGURATION ====================
// ⚠️ REMPLACE PAR TA VRAIE CLÉ GITHUB TOKEN ⚠️
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'sylvainbetty91-sys/Family';
const GITHUB_FILE_PATH = 'users.json';

// Clé API Groq (GRATUITE) - Va sur https://console.groq.com pour obtenir ta clé
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ==================== TRANSLATIONS ====================
const translations = {
  fr: {
    loginTitle: 'Connexion', registerTitle: 'Inscription', email: 'Email', password: 'Mot de passe',
    name: 'Nom', loginBtn: 'Se connecter', registerBtn: 'Créer mon compte', noAccount: 'Pas de compte ?',
    haveAccount: 'Déjà un compte ?', registerLink: "S'inscrire", loginLink: 'Se connecter',
    siteName: 'Rhum Danou', cart: 'Panier', emptyCart: '🛒 Panier vide', emptyPosts: '🥃 Aucune publication',
    navHome: 'Accueil', navCart: 'Panier', navChat: 'Support', navCreator: 'Créateur', navPartnership: 'Partenariat', navAdmin: 'Admin',
    cartTitle: '🛒 Mon Panier', chatTitle: '💬 Support Intelligent', partnershipTitle: '🤝 Partenariat', adminTitle: '⚙️ Administration',
    adminPublish: '📸 Publier', adminText: '📝 Texte', adminUsers: '👥 Utilisateurs', adminLinks: '🔗 Liens Créateur',
    publishBtn: '✨ Publier', publishMessageBtn: '📢 Publier le message', saveLinksBtn: '💾 Enregistrer',
    instagram: 'Instagram', whatsappChannel: 'WhatsApp Channel', telegram: 'Télégram', phone: 'Téléphone',
    creatorProfile: '👑 Profil Créateur', logout: '🚪 Déconnexion', loading: 'Chargement...',
    chatPlaceholder: 'Pose ta question...', welcomeMessage: '👋 Bonjour ! Je suis votre assistant intelligent Rhum Danou. Posez-moi n\'importe quelle question en français, anglais, créole ou espagnol !'
  },
  en: {
    loginTitle: 'Login', registerTitle: 'Sign Up', email: 'Email', password: 'Password',
    name: 'Name', loginBtn: 'Login', registerBtn: 'Create account', noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?', registerLink: 'Sign up', loginLink: 'Login',
    siteName: 'Rhum Danou', cart: 'Cart', emptyCart: '🛒 Empty cart', emptyPosts: '🥃 No posts',
    navHome: 'Home', navCart: 'Cart', navChat: 'Support', navCreator: 'Creator', navPartnership: 'Partnership', navAdmin: 'Admin',
    cartTitle: '🛒 My Cart', chatTitle: '💬 Smart Support', partnershipTitle: '🤝 Partnership', adminTitle: '⚙️ Admin',
    adminPublish: '📸 Publish', adminText: '📝 Text', adminUsers: '👥 Users', adminLinks: '🔗 Creator Links',
    publishBtn: '✨ Publish', publishMessageBtn: '📢 Publish message', saveLinksBtn: '💾 Save',
    instagram: 'Instagram', whatsappChannel: 'WhatsApp Channel', telegram: 'Telegram', phone: 'Phone',
    creatorProfile: '👑 Creator Profile', logout: '🚪 Logout', loading: 'Loading...',
    chatPlaceholder: 'Ask your question...', welcomeMessage: '👋 Hello! I am your Rhum Danou smart assistant. Ask me anything in English, French, Creole or Spanish!'
  },
  ht: {
    loginTitle: 'Koneksyon', registerTitle: 'Enskripsyon', email: 'Imèl', password: 'Modpas',
    name: 'Non', loginBtn: 'Konekte', registerBtn: 'Kreye kont', noAccount: 'Pa gen kont ?',
    haveAccount: 'Gen kont deja ?', registerLink: 'Enskri', loginLink: 'Konekte',
    siteName: 'Rhum Danou', cart: 'Panyen', emptyCart: '🛒 Panyen vid', emptyPosts: '🥃 Pa gen piblikasyon',
    navHome: 'Akèy', navCart: 'Panyen', navChat: 'Sipò', navCreator: 'Kreyatè', navPartnership: 'Patenarya', navAdmin: 'Admin',
    cartTitle: '🛒 Panyen mwen', chatTitle: '💬 Sipò Entelijan', partnershipTitle: '🤝 Patenarya', adminTitle: '⚙️ Administrasyon',
    adminPublish: '📸 Pibliye', adminText: '📝 Tèks', adminUsers: '👥 Itilizatè', adminLinks: '🔗 Lyen Kreyatè',
    publishBtn: '✨ Pibliye', publishMessageBtn: '📢 Pibliye mesaj', saveLinksBtn: '💾 Anrejistre',
    instagram: 'Instagram', whatsappChannel: 'WhatsApp Channel', telegram: 'Telegram', phone: 'Telefòn',
    creatorProfile: '👑 Pwofil Kreyatè', logout: '🚪 Dekonekte', loading: 'Chajman...',
    chatPlaceholder: 'Poze kesyon w...', welcomeMessage: '👋 Bonjou! Mwen se asistan entelijan Rhum Danou. Poze m tout kesyon ou an kreyòl, franse, angle oswa panyòl!'
  },
  es: {
    loginTitle: 'Iniciar Sesión', registerTitle: 'Registrarse', email: 'Correo', password: 'Contraseña',
    name: 'Nombre', loginBtn: 'Iniciar sesión', registerBtn: 'Crear cuenta', noAccount: '¿No tienes cuenta?',
    haveAccount: '¿Ya tienes cuenta?', registerLink: 'Registrarse', loginLink: 'Iniciar sesión',
    siteName: 'Rhum Danou', cart: 'Carrito', emptyCart: '🛒 Carrito vacío', emptyPosts: '🥃 Sin publicaciones',
    navHome: 'Inicio', navCart: 'Carrito', navChat: 'Soporte', navCreator: 'Creador', navPartnership: 'Asociación', navAdmin: 'Admin',
    cartTitle: '🛒 Mi Carrito', chatTitle: '💬 Soporte Inteligente', partnershipTitle: '🤝 Asociación', adminTitle: '⚙️ Administración',
    adminPublish: '📸 Publicar', adminText: '📝 Texto', adminUsers: '👥 Usuarios', adminLinks: '🔗 Enlaces Creador',
    publishBtn: '✨ Publicar', publishMessageBtn: '📢 Publicar mensaje', saveLinksBtn: '💾 Guardar',
    instagram: 'Instagram', whatsappChannel: 'Canal WhatsApp', telegram: 'Telegram', phone: 'Teléfono',
    creatorProfile: '👑 Perfil Creador', logout: '🚪 Cerrar sesión', loading: 'Cargando...',
    chatPlaceholder: 'Haz tu pregunta...', welcomeMessage: '👋 ¡Hola! Soy tu asistente inteligente de Rhum Danou. ¡Hazme cualquier pregunta en español, inglés, francés o criollo!'
  }
};

// ==================== STATE ====================
let currentUser = null;
let posts = [];
let cart = [];
let userLang = 'fr';
let userTheme = 'dark';
let partnershipFormHTML = '<div class="empty-state"><span class="icon">🤝</span><p>Formulaire de partenariat bientôt disponible</p></div>';
let creatorLinks = {
  instagram: 'https://instagram.com/rhumdanou',
  whatsappChannel: '',
  telegram: '',
  phone: '+50933324695'
};
let totalLikes = 0, totalComments = 0, totalUsers = 0;
let allUsers = [];
let chatHistory = [];

// ==================== LANGUAGE & THEME ====================
function applyLanguage() {
  const t = translations[userLang] || translations.fr;
  const elements = {
    loginTitle: 'h2', registerTitle: 'h2', emailLabel: 'label', passwordLabel: 'label',
    emailLabel2: 'label', passwordLabel2: 'label', nameLabel: 'label',
    loginBtn: 'button', registerBtn: 'button', noAccountText: 'span', haveAccountText: 'span',
    registerLink: 'a', loginLink: 'a', siteName: 'span', cartTitle: 'h2', chatTitle: 'h2',
    partnershipTitle: 'h2', adminTitle: 'h2', adminPublishTab: 'button', adminTextTab: 'button',
    adminUsersTab: 'button', adminLinksTab: 'button', publishBtn: 'button', publishMessageBtn: 'button',
    saveLinksBtn: 'button', instagramLabel: 'label', whatsappChannelLabel: 'label',
    telegramLabel: 'label', phoneLabel: 'label', creatorProfileBtn: 'button', logoutBtn: 'button',
    loadingText: 'span', navHomeText: 'span', navCartText: 'span', navChatText: 'span',
    navCreatorText: 'span', navPartnershipText: 'span', navAdminText: 'span'
  };
  for (const [key, selector] of Object.entries(elements)) {
    const el = document.getElementById(key);
    if (el && t[key]) el.textContent = t[key];
  }
  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.placeholder = t.chatPlaceholder;
  const welcomeDiv = document.getElementById('chatWindow');
  if (welcomeDiv && chatHistory.length === 0) {
    welcomeDiv.innerHTML = `<div class="msg-bubble msg-bot">${t.welcomeMessage}</div>`;
    chatHistory = [{ role: 'assistant', content: t.welcomeMessage }];
  }
  if (document.getElementById('panel-cart').classList.contains('active')) renderCart();
  if (document.getElementById('panel-creator').classList.contains('active')) loadCreatorStats();
}

function changeLanguage(lang) {
  userLang = lang;
  localStorage.setItem('rhum_lang', lang);
  document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector(`.lang-option[data-lang="${lang}"]`)?.classList.add('selected');
  applyLanguage();
  showToast(`Langue changée : ${lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : lang === 'ht' ? 'Kreyòl' : 'Español'}`);
  document.getElementById('themeLangMenu')?.classList.remove('open');
}

function changeTheme(theme) {
  userTheme = theme;
  document.body.classList.remove('theme-dark', 'theme-white', 'theme-red', 'theme-gold');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('rhum_theme', theme);
  document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector(`.theme-option[data-theme="${theme}"]`)?.classList.add('selected');
  showToast(`Thème : ${theme === 'dark' ? 'Noir' : theme === 'white' ? 'Blanc' : theme === 'red' ? 'Rouge' : 'Or'}`);
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
  if (!GITHUB_TOKEN || GITHUB_TOKEN === 'github_pat_votre_token_ici') return [];
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
  if (!GITHUB_TOKEN || GITHUB_TOKEN === 'github_pat_votre_token_ici') return false;
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(users, null, 2))));
    let sha = null;
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      if (res.ok) sha = (await res.json()).sha;
    } catch(e) {}
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Users update ${new Date().toISOString()}`, content, sha })
    });
    return res.ok;
  } catch(e) { return false; }
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
  if (currentUser.role === 'creator') document.getElementById('navCreator').style.display = 'flex';
  if (['creator', 'admin'].includes(currentUser.role)) document.getElementById('navAdmin').style.display = 'flex';
  await loadUsersFromGithub();
  const githubUser = allUsers.find(u => u.id === currentUser.id);
  if (githubUser) { currentUser.role = githubUser.role; currentUser.banned = githubUser.banned; }
  else await syncUserToGithub(currentUser);
  loadFeed();
  loadCart();
  loadCreatorStats();
  initChat();
  if (currentUser.role === 'creator') {
    document.getElementById('creatorInstagram').value = creatorLinks.instagram;
    document.getElementById('creatorWhatsAppChannel').value = creatorLinks.whatsappChannel;
    document.getElementById('creatorTelegram').value = creatorLinks.telegram;
    document.getElementById('creatorPhone').value = creatorLinks.phone;
  }
  applyLanguage();
}

// ==================== SMART CHAT (GROQ - VRAI INTELLIGENCE) ====================
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
  const systemPrompt = `Tu es un assistant intelligent et amical pour "Rhum Danou" (une marque de rhum artisanal). 
Réponds dans la langue de l'utilisateur (${detectedLang === 'ht' ? 'créole haïtien' : detectedLang === 'es' ? 'espagnol' : detectedLang === 'fr' ? 'français' : 'anglais'}).
Sois naturel, chaleureux, et réponds à TOUTES les questions (philosophie, vie, humour, etc.).
Informations sur le créateur : Instagram: ${creatorLinks.instagram}, Téléphone: ${creatorLinks.phone}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory.slice(-10)
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content;
      if (botReply) {
        chatHistory.push({ role: 'assistant', content: botReply });
      } else {
        chatHistory.push({ role: 'assistant', content: getSmartFallback(text, detectedLang) });
      }
    } else {
      chatHistory.push({ role: 'assistant', content: getSmartFallback(text, detectedLang) });
    }
  } catch(e) {
    console.log('Erreur API, fallback intelligent');
    chatHistory.push({ role: 'assistant', content: getSmartFallback(text, detectedLang) });
  }
  renderChatMessages();
}

function getSmartFallback(text, lang) {
  const lower = text.toLowerCase();
  const t = translations[lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : lang === 'ht' ? 'ht' : 'es'];
  
  if (lower.includes('philosophie') || lower.includes('philosophy') || lower.includes('filozofi') || lower.includes('filosofía')) {
    return lang === 'fr' ? '📚 La philosophie, c\'est l\'art de se poser les bonnes questions. Comme : "Pourquoi ce rhum est-il si bon ?" Ou "Quel est le sens de la vie ?" Mais sincèrement, la vie a le sens que tu lui donnes, un peu comme chaque gorgée de rhum a sa propre histoire ! 🥃' :
           lang === 'en' ? '📚 Philosophy is the art of asking good questions. Like: "Why is this rum so good?" Or "What is the meaning of life?" Honestly, life has the meaning you give it, just like every sip of rum has its own story! 🥃' :
           lang === 'ht' ? '📚 Filozofi, se atizay poze bon kesyon. Tankou: "Poukisa wonm sa a bon anpil?" Oswa "Ki sans lavi a?" Onètman, lavi a gen sans ou ba li, tankou chak gòje wonm gen istwa pa li! 🥃' :
           '📚 La filosofía es el arte de hacerse buenas preguntas. Como: "¿Por qué este ron es tan bueno?" O "¿Cuál es el sentido de la vida?" Honestamente, la vida tiene el sentido que tú le des, ¡como cada sorbo de ron tiene su propia historia! 🥃';
  }
  
  if (lower.includes('vie') || lower.includes('life') || lower.includes('lavi')) {
    return lang === 'fr' ? '🌟 La vie ? C\'est comme un bon rhum : il faut la déguster lentement, avec passion, et partager les bons moments avec ceux qu\'on aime. Profite de chaque instant ! 🥃' :
           lang === 'en' ? '🌟 Life? It\'s like a good rum: you have to enjoy it slowly, with passion, and share good moments with loved ones. Enjoy every moment! 🥃' :
           lang === 'ht' ? '🌟 Lavi a? Li tankou yon bon wonm: ou dwe degoute l dousman, ak pasyon, epu pataje bon moman ak moun ou renmen. Jwi chak moman! 🥃' :
           '🌟 ¿La vida? Es como un buen ron: hay que disfrutarlo lentamente, con pasión, y compartir los buenos momentos con los que amas. ¡Disfruta cada momento! 🥃';
  }
  
  return t?.welcomeMessage || translations.fr.welcomeMessage;
}

// ==================== FEED ====================
async function loadFeed() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    posts = data.posts || [];
    renderFeed();
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
    mediaHTML = `<div class="post-media-wrapper"><div class="media-slider">${post.media.map(m => m.type === 'video' ? `<div class="media-item"><video src="${m.url}" controls></video></div>` : `<div class="media-item"><img src="${m.url}" loading="lazy"></div>`).join('')}</div>${post.media.length > 1 ? '<div class="media-dots" style="display:flex;justify-content:center;gap:4px;position:absolute;bottom:8px;left:0;right:0;"></div>' : ''}</div>`;
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
  await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
  loadFeed();
}

async function deletePost(postId) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  loadFeed();
}

// ==================== TEXT POST ====================
async function publishTextPost() {
  const message = document.getElementById('textMessage').value.trim();
  if (!message) { showToast('Écris un message'); return; }
  const formData = new FormData();
  formData.append('caption', message);
  formData.append('priceVisible', 'false');
  const res = await fetch('/api/posts', { method: 'POST', body: formData });
  if (res.ok) { showToast('Message publié !'); document.getElementById('textMessage').value = ''; loadFeed(); }
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
  const t = translations[userLang] || translations.fr;
  if (!cart.length) { el.innerHTML = `<div class="empty-state">${t.emptyCart}</div>`; return; }
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
  let msg = '🥃 Commande Rhum Danou\n\n';
  cart.forEach(i => msg += `• ${i.productName} ×${i.quantity||3} — ${((i.price||0)*(i.quantity||3)).toFixed(2)} ${i.currency}\n`);
  msg += `\nNom: ${currentUser.name}\nEmail: ${currentUser.email}`;
  window.open(`https://wa.me/${creatorLinks.phone.replace(/[^0-9]/g, '') || '50933324695'}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ==================== CREATOR PROFILE ====================
async function loadCreatorStats() {
  totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
  totalComments = posts.reduce((s, p) => s + (p.comments?.length || 0), 0);
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    totalUsers = (data.users?.length || 0) + 1;
  } catch(e) { totalUsers = 1; }
  renderCreatorProfile();
}

function renderCreatorProfile() {
  const savedStatus = localStorage.getItem('creator_status') || '🥃 Nouvelle distillation en cours ! Découvrez nos nouvelles saveurs.';
  const el = document.getElementById('creatorProfileContent');
  let telegramLink = creatorLinks.telegram;
  if (telegramLink && !telegramLink.startsWith('http') && telegramLink.startsWith('@')) telegramLink = `https://t.me/${telegramLink.substring(1)}`;
  else if (telegramLink && !telegramLink.startsWith('http')) telegramLink = `https://t.me/${telegramLink}`;
  el.innerHTML = `<div class="profile-header"><div class="profile-avatar">${currentUser.name?.[0]?.toUpperCase()||'D'}</div><h2>${escapeHtml(currentUser.name)}</h2><p style="color:var(--gold)">👑 Créateur</p></div><div class="profile-stats"><div class="stat-item"><div class="stat-number">${totalUsers}</div><div class="stat-label">Abonnés</div></div><div class="stat-item"><div class="stat-number">${totalLikes}</div><div class="stat-label">J\'aime</div></div><div class="stat-item"><div class="stat-number">${totalComments}</div><div class="stat-label">Commentaires</div></div></div><div class="profile-links">${creatorLinks.instagram ? `<a href="${creatorLinks.instagram}" target="_blank" class="profile-link">📷 Instagram</a>` : ''}${creatorLinks.whatsappChannel ? `<a href="${creatorLinks.whatsappChannel}" target="_blank" class="profile-link">📱 WhatsApp</a>` : ''}${creatorLinks.telegram ? `<a href="${telegramLink}" target="_blank" class="profile-link">✈️ Télégram</a>` : ''}${creatorLinks.phone ? `<a href="tel:${creatorLinks.phone}" class="profile-link">📞 ${creatorLinks.phone}</a>` : ''}</div><div class="creator-status"><h3>📌 Status</h3><div class="status-text" id="creatorStatusText">${escapeHtml(savedStatus)}</div>${currentUser?.role === 'creator' ? '<button class="btn-primary" onclick="editCreatorStatus()" style="margin-top:0.5rem;">✏️ Modifier</button>' : ''}</div>`;
}

function editCreatorStatus() {
  const newStatus = prompt('Nouveau status:', document.getElementById('creatorStatusText')?.textContent || '');
  if (newStatus) { document.getElementById('creatorStatusText').textContent = newStatus; localStorage.setItem('creator_status', newStatus); showToast('Status mis à jour'); }
}

// ==================== ADMIN ====================
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('admin-' + tab).classList.add('active');
  if (tab === 'users') loadUsers();
}

async function loadUsers() {
  const res = await fetch('/api/admin/users');
  const data = await res.json();
  const users = data.users || [];
  const el = document.getElementById('usersList');
  if (!users.length) { el.innerHTML = '<div class="empty-state">Aucun utilisateur</div>'; return; }
  el.innerHTML = users.map(u => `<div class="user-row"><div class="user-info"><div class="user-avatar">${u.name?.[0]?.toUpperCase()||'?'}</div><div><div class="user-name">${escapeHtml(u.name)}</div><div class="user-email">${escapeHtml(u.email)}</div></div><span class="user-role-badge ${u.banned ? 'banned' : ''}">${u.banned ? 'Banni' : (u.role === 'admin' ? 'Admin' : 'Utilisateur')}</span></div><div class="user-actions">${currentUser?.role === 'creator' && u.role === 'user' ? `<button class="btn-xs btn-promote" onclick="promoteUser('${u.id}')">⭐ Admin</button>` : ''}${currentUser?.role === 'creator' && u.role === 'admin' ? `<button class="btn-xs btn-demote" onclick="demoteUser('${u.id}')">↓ User</button>` : ''}${!u.banned ? `<button class="btn-xs btn-ban" onclick="banUser('${u.id}')">🚫 Bannir</button>` : `<button class="btn-xs btn-promote" onclick="unbanUser('${u.id}')">✓ Débannir</button>`}</div></div>`).join('');
}

async function promoteUser(id) {
  const res = await fetch('/api/admin/promote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Promu admin'); loadUsers(); loadCreatorStats(); await syncUserToGithub({...currentUser, role: 'admin'}); }
}
async function demoteUser(id) {
  const res = await fetch('/api/admin/demote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Rétrogradé'); loadUsers(); loadCreatorStats(); await syncUserToGithub({...currentUser, role: 'user'}); }
}
async function banUser(id) {
  if (confirm('Bannir ?')) {
    const res = await fetch('/api/admin/ban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
    if (res.ok) { showToast('Banni'); loadUsers(); loadCreatorStats(); }
  }
}
async function unbanUser(id) {
  const res = await fetch('/api/admin/unban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId:id}) });
  if (res.ok) { showToast('Débanni'); loadUsers(); loadCreatorStats(); }
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
  if (res.ok) { showToast('Publié !'); loadFeed(); showPanel('feed'); document.getElementById('postCaption').value = ''; document.getElementById('postPrice').value = ''; document.getElementById('mediaPreviews').innerHTML = ''; selectedFiles = []; }
}

// ==================== CREATOR LINKS ====================
function loadCreatorLinks() {
  const saved = localStorage.getItem('creator_links');
  if (saved) { try { creatorLinks = JSON.parse(saved); } catch(e) {} }
}
function saveCreatorLinks() {
  creatorLinks = {
    instagram: document.getElementById('creatorInstagram').value,
    whatsappChannel: document.getElementById('creatorWhatsAppChannel').value,
    telegram: document.getElementById('creatorTelegram').value,
    phone: document.getElementById('creatorPhone').value
  };
  localStorage.setItem('creator_links', JSON.stringify(creatorLinks));
  showToast('Liens sauvegardés');
  if (document.getElementById('panel-creator').classList.contains('active')) loadCreatorStats();
}

// ==================== PANELS ====================
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.getElementById('nav' + name.charAt(0).toUpperCase() + name.slice(1))?.classList.add('active');
  if (name === 'cart') renderCart();
  if (name === 'creator') loadCreatorStats();
  if (name === 'chat') setTimeout(() => document.getElementById('chatWindow')?.scrollTo(0,9999), 100);
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
  loadCreatorLinks();
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
