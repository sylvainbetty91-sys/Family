require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ==================== IN-MEMORY DB ====================
const db = {
  users: [
    {
      id: 'creator-danou',
      email: 'TeamDanouofficiel@gmail.com',
      password: bcrypt.hashSync('Danou_Family&509', 10),
      name: 'Danou',
      role: 'creator',
      avatar: null,
      banned: false,
      createdAt: new Date().toISOString(),
      online: false
    }
  ],
  posts: [],
  cartItems: [],
  messages: [],
  bannedEmails: [],
  // Compteur de visiteurs uniques (par session ID)
  visitors: new Set()
};

// ==================== MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()) || allowed.test(file.mimetype));
  }
});

// ==================== MIDDLEWARE ====================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'produits-danou-secret-2024',
  resave: false,
  saveUninitialized: true, // true = génère un ID de session pour les visiteurs aussi
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadsDir));

// ==================== MIDDLEWARES AUTH ====================

// Enregistre chaque visiteur (connecté ou non) pour le compteur
app.use((req, res, next) => {
  if (req.session.id) db.visitors.add(req.session.id);
  next();
});

// Middleware : identifie l'utilisateur si connecté (non bloquant)
const optionalAuth = (req, res, next) => {
  if (req.session.userId) {
    const user = db.users.find(u => u.id === req.session.userId);
    if (user && !user.banned) req.user = user;
  }
  // Visiteur anonyme = identifié par session.id
  if (!req.user) {
    req.visitorId = req.session.id;
  }
  next();
};

// Middleware : connexion obligatoire
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Connexion requise' });
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user || user.banned) return res.status(403).json({ error: 'Accès refusé' });
  req.user = user;
  next();
};

// Middleware : admin ou créateur requis
const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (!['creator', 'admin'].includes(req.user.role))
      return res.status(403).json({ error: 'Droits insuffisants' });
    next();
  });
};

// Middleware : créateur seulement
const requireCreator = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'creator') return res.status(403).json({ error: 'Réservé au créateur' });
    next();
  });
};

const updateOnline = (userId, status) => {
  const u = db.users.find(u => u.id === userId);
  if (u) u.online = status;
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Champs requis manquants' });
  if (db.bannedEmails.includes(email.toLowerCase())) return res.status(403).json({ error: 'Compte banni' });
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(400).json({ error: 'Email déjà utilisé' });

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(), email: email.toLowerCase(), password: hashed,
    name, role: 'user', avatar: null, banned: false,
    createdAt: new Date().toISOString(), online: true
  };
  db.users.push(user);
  req.session.userId = user.id;
  updateOnline(user.id, true);
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  if (user.banned) return res.status(403).json({ error: 'Compte banni' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  req.session.userId = user.id;
  updateOnline(user.id, true);
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  if (req.session.userId) updateOnline(req.session.userId, false);
  req.session.userId = null;
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user || user.banned) return res.json({ user: null });
  res.json({ user: sanitizeUser(user) });
});

// ==================== ADMIN MANAGEMENT ====================

app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.users.map(sanitizeUser) });
});

// Stats visiteurs pour l'admin
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  res.json({
    totalVisitors: db.visitors.size,
    totalUsers: db.users.filter(u => u.role !== 'creator').length,
    totalPosts: db.posts.length
  });
});

app.post('/api/admin/promote', requireCreator, (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Introuvable' });
  user.role = 'admin';
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/admin/demote', requireCreator, (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Introuvable' });
  user.role = 'user';
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/admin/ban', requireAdmin, (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Introuvable' });
  user.banned = true;
  db.bannedEmails.push(user.email);
  res.json({ ok: true });
});

app.post('/api/admin/unban', requireAdmin, (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if (!user) return res.status(404).json({ error: 'Introuvable' });
  user.banned = false;
  db.bannedEmails = db.bannedEmails.filter(e => e !== user.email);
  res.json({ ok: true });
});

// ==================== POSTS ====================

// GET posts : public, pas besoin d'être connecté
app.get('/api/posts', optionalAuth, (req, res) => {
  const viewerId = req.user ? req.user.id : req.visitorId;
  const isAdmin = req.user && ['creator', 'admin'].includes(req.user.role);

  const posts = db.posts.map(p => {
    if (!p.viewers) p.viewers = new Set();
    if (viewerId && !p.viewers.has(viewerId)) {
      p.viewers.add(viewerId);
      p.views++;
    }
    return {
      ...p,
      viewers: undefined,
      views: p.views
    };
  });
  res.json({ posts });
});

// POST un post avec médias (image/vidéo)
app.post('/api/posts', requireAdmin, upload.array('media', 10), (req, res) => {
  const { caption, price, currency, priceVisible } = req.body;

  const media = (req.files || []).map(f => ({
    url: '/uploads/' + f.filename,
    type: f.mimetype.startsWith('video') ? 'video' : 'image'
  }));

  // Autoriser un post texte seul (sans média)
  const post = {
    id: uuidv4(),
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.role,
    caption: caption || '',
    media,
    price: price ? parseFloat(price) : null,
    currency: currency || 'HTG',
    priceVisible: priceVisible !== 'false',
    views: 0,
    viewers: new Set(),
    likes: [],    // stocke les IDs (user ou visiteur)
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.posts.unshift(post);
  res.json({ post: { ...post, viewers: undefined } });
});

app.put('/api/posts/:id', requireAdmin, upload.array('media', 10), (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });
  const { caption, price, currency, priceVisible } = req.body;
  if (caption !== undefined) post.caption = caption;
  if (price !== undefined) post.price = price ? parseFloat(price) : null;
  if (currency !== undefined) post.currency = currency;
  if (priceVisible !== undefined) post.priceVisible = priceVisible !== 'false';
  if (req.files && req.files.length > 0) {
    post.media = [...post.media, ...req.files.map(f => ({
      url: '/uploads/' + f.filename,
      type: f.mimetype.startsWith('video') ? 'video' : 'image'
    }))];
  }
  post.updatedAt = new Date().toISOString();
  res.json({ post: { ...post, viewers: undefined } });
});

app.delete('/api/posts/:id', requireAdmin, (req, res) => {
  const idx = db.posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post introuvable' });
  db.posts.splice(idx, 1);
  res.json({ ok: true });
});

// ==================== LIKES — public (visiteur ou connecté) ====================

app.post('/api/posts/:id/like', optionalAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });

  const likerId = req.user ? req.user.id : req.visitorId;
  if (!likerId) return res.status(400).json({ error: 'Session invalide' });

  const idx = post.likes.indexOf(likerId);
  if (idx === -1) post.likes.push(likerId);
  else post.likes.splice(idx, 1);

  res.json({ likes: post.likes.length, liked: idx === -1 });
});

// ==================== COMMENTS — public (visiteur ou connecté) ====================

app.post('/api/posts/:id/comments', optionalAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });

  const text = req.body.text;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Commentaire vide' });

  // Nom affiché : celui de l'utilisateur connecté, ou "Visiteur" pour anonyme
  const userName = req.user ? req.user.name : (req.body.visitorName || 'Visiteur');
  const userId = req.user ? req.user.id : req.visitorId;

  const comment = {
    id: uuidv4(),
    postId: req.params.id,
    userId,
    userName,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  post.comments.push(comment);
  res.json({ comment });
});

app.delete('/api/posts/:postId/comments/:commentId', requireAdmin, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });
  post.comments = post.comments.filter(c => c.id !== req.params.commentId);
  res.json({ ok: true });
});

// ==================== CART — connexion requise pour commander ====================

app.get('/api/cart', requireAuth, (req, res) => {
  res.json({ cart: db.cartItems.filter(c => c.userId === req.user.id) });
});

app.post('/api/cart/add', requireAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.body.postId);
  if (!post || !post.price) return res.status(400).json({ error: 'Produit invalide' });

  const existing = db.cartItems.find(c => c.userId === req.user.id && c.postId === req.body.postId);
  if (existing) {
    existing.quantity += 3;
  } else {
    db.cartItems.push({
      id: uuidv4(), userId: req.user.id, postId: req.body.postId,
      productName: post.caption || 'Produit Danou',
      price: post.price, currency: post.currency,
      image: post.media[0]?.url || null, quantity: 3
    });
  }
  res.json({ cart: db.cartItems.filter(c => c.userId === req.user.id) });
});

app.delete('/api/cart/:itemId', requireAuth, (req, res) => {
  db.cartItems = db.cartItems.filter(c => !(c.id === req.params.itemId && c.userId === req.user.id));
  res.json({ cart: db.cartItems.filter(c => c.userId === req.user.id) });
});

app.delete('/api/cart', requireAuth, (req, res) => {
  db.cartItems = db.cartItems.filter(c => c.userId !== req.user.id);
  res.json({ cart: [] });
});

// ==================== MESSAGES / CHAT ====================

app.get('/api/messages', requireAuth, (req, res) => {
  res.json({ messages: db.messages.filter(m => m.userId === req.user.id) });
});

app.post('/api/messages', requireAuth, (req, res) => {
  const { text } = req.body;
  const userMsg = { id: uuidv4(), userId: req.user.id, from: 'user', text, createdAt: new Date().toISOString() };
  db.messages.push(userMsg);

  const lowerText = text.toLowerCase();
  let botResponse = '';
  if (lowerText.includes('prix') || lowerText.includes('combien')) {
    botResponse = '💰 Les prix sont affichés directement sur chaque publication !';
  } else if (lowerText.includes('livraison') || lowerText.includes('délai')) {
    botResponse = '🚚 Livraison sous 24-48h après confirmation via WhatsApp.';
  } else if (lowerText.includes('commande') || lowerText.includes('acheter')) {
    botResponse = '🛒 Ajoutez vos produits au panier et commandez via WhatsApp !';
  } else {
    botResponse = `Bonjour ! Je suis Danou Assistant 🥃\nJe peux vous aider avec les prix, commandes et livraisons.\nTapez "aide humain" pour contacter un admin.`;
  }

  const botMsg = { id: uuidv4(), userId: req.user.id, from: 'bot', text: botResponse, createdAt: new Date(Date.now() + 500).toISOString() };
  db.messages.push(botMsg);
  res.json({ messages: [userMsg, botMsg] });
});

// ==================== IA GROQ ====================

app.post('/api/chat', express.json(), async (req, res) => {
  const { messages } = req.body;
  const systemPrompt = {
    role: "system",
    content: `Tu es Danou Assistant, l'IA officielle des Produits de Danou.
Ton créateur s'appelle Danou. Tu représentes sa communauté et sa marque.
Caractère : chaleureux, jovial, touche antillaise, tu tutoies.
Tu réponds à TOUTES les questions. Tu détectes la langue et réponds dans la même langue.
Sur les produits : livraison 24-48h via WhatsApp, prix visibles sur le site.`
  };

  if (!process.env.GROQ_API_KEY) {
    return res.json({ choices: [{ message: { content: "Danou Assistant est en mode démo. Configure GROQ_API_KEY sur Render pour l'activer !" } }] });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [systemPrompt, ...messages], temperature: 0.8, max_tokens: 800 })
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== UTILS ====================

function sanitizeUser(u) {
  const { password, ...safe } = u;
  return safe;
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`🥃 Les Produits de Danou — serveur sur port ${PORT}`));
