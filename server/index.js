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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// --- In-memory DB (replace with real DB in production) ---
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
  comments: [],
  cartItems: [],
  messages: [],
  bannedEmails: []
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  }
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'rhumdanou-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadsDir));

// --- Auth Middleware ---
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Non connecté' });
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user || user.banned) return res.status(403).json({ error: 'Accès refusé' });
  req.user = user;
  next();
};
const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (!['creator', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Droits insuffisants' });
    next();
  });
};
const requireCreator = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'creator') return res.status(403).json({ error: 'Réservé au créateur' });
    next();
  });
};

// Track online status
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
    id: uuidv4(),
    email: email.toLowerCase(),
    password: hashed,
    name,
    role: 'user',
    avatar: null,
    banned: false,
    createdAt: new Date().toISOString(),
    online: true
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

app.post('/api/auth/logout', requireAuth, (req, res) => {
  updateOnline(req.user.id, false);
  req.session.destroy();
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user || user.banned) return res.json({ user: null });
  res.json({ user: sanitizeUser(user) });
});

// ==================== ADMIN MANAGEMENT (Creator only) ====================

app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.users.filter(u => u.role !== 'creator').map(sanitizeUser) });
});

app.post('/api/admin/promote', requireCreator, (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Utilisateur introuvable' });
  user.role = 'admin';
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/admin/demote', requireCreator, (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Utilisateur introuvable' });
  user.role = 'user';
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/admin/ban', requireAdmin, (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user || user.role === 'creator') return res.status(404).json({ error: 'Utilisateur introuvable' });
  user.banned = true;
  db.bannedEmails.push(user.email);
  res.json({ ok: true });
});

app.post('/api/admin/unban', requireAdmin, (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Introuvable' });
  user.banned = false;
  db.bannedEmails = db.bannedEmails.filter(e => e !== user.email);
  res.json({ ok: true });
});

// ==================== POSTS ====================

app.post('/api/posts', requireAdmin, upload.array('media', 10), (req, res) => {
  const { caption, price, currency, priceVisible } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'Média requis' });

  const media = req.files.map(f => ({
    url: '/uploads/' + f.filename,
    type: f.mimetype.startsWith('video') ? 'video' : 'image'
  }));

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
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.posts.unshift(post);
  res.json({ post });
});

app.get('/api/posts', requireAuth, (req, res) => {
  const isAdmin = ['creator', 'admin'].includes(req.user.role);
  const posts = db.posts.map(p => {
    // Increment view count
    if (!p.viewers) p.viewers = new Set();
    if (!p.viewers.has(req.user.id)) {
      p.viewers.add(req.user.id);
      p.views++;
    }
    return {
      ...p,
      viewers: undefined,
      views: isAdmin ? p.views : undefined
    };
  });
  res.json({ posts });
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
    const newMedia = req.files.map(f => ({
      url: '/uploads/' + f.filename,
      type: f.mimetype.startsWith('video') ? 'video' : 'image'
    }));
    post.media = [...post.media, ...newMedia];
  }
  post.updatedAt = new Date().toISOString();
  res.json({ post });
});

app.delete('/api/posts/:id', requireAdmin, (req, res) => {
  const idx = db.posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post introuvable' });
  db.posts.splice(idx, 1);
  res.json({ ok: true });
});

app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });
  const idx = post.likes.indexOf(req.user.id);
  if (idx === -1) post.likes.push(req.user.id);
  else post.likes.splice(idx, 1);
  res.json({ likes: post.likes.length, liked: idx === -1 });
});

// ==================== COMMENTS ====================

app.post('/api/posts/:id/comments', requireAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });
  const comment = {
    id: uuidv4(),
    postId: req.params.id,
    userId: req.user.id,
    userName: req.user.name,
    text: req.body.text,
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

// ==================== CART ====================

app.get('/api/cart', requireAuth, (req, res) => {
  const cart = db.cartItems.filter(c => c.userId === req.user.id);
  res.json({ cart });
});

app.post('/api/cart/add', requireAuth, (req, res) => {
  const { postId } = req.body;
  const post = db.posts.find(p => p.id === postId);
  if (!post || !post.price) return res.status(400).json({ error: 'Produit invalide' });

  const existing = db.cartItems.find(c => c.userId === req.user.id && c.postId === postId);
  if (existing) {
    existing.quantity += 3;
  } else {
    db.cartItems.push({
      id: uuidv4(),
      userId: req.user.id,
      postId,
      productName: post.caption || 'Rhum Danou',
      price: post.price,
      currency: post.currency,
      image: post.media[0]?.url || null,
      quantity: 3
    });
  }
  const cart = db.cartItems.filter(c => c.userId === req.user.id);
  res.json({ cart });
});

app.delete('/api/cart/:itemId', requireAuth, (req, res) => {
  db.cartItems = db.cartItems.filter(c => !(c.id === req.params.itemId && c.userId === req.user.id));
  const cart = db.cartItems.filter(c => c.userId === req.user.id);
  res.json({ cart });
});

app.delete('/api/cart', requireAuth, (req, res) => {
  db.cartItems = db.cartItems.filter(c => c.userId !== req.user.id);
  res.json({ cart: [] });
});

// ==================== MESSAGES / BOT ====================

app.get('/api/messages', requireAuth, (req, res) => {
  const msgs = db.messages.filter(m => m.userId === req.user.id);
  res.json({ messages: msgs });
});

app.post('/api/messages', requireAuth, (req, res) => {
  const { text } = req.body;
  const userMsg = {
    id: uuidv4(),
    userId: req.user.id,
    from: 'user',
    text,
    createdAt: new Date().toISOString()
  };
  db.messages.push(userMsg);

  // Bot logic
  const lowerText = text.toLowerCase();
  let botResponse = '';
  let offerHuman = false;

  if (lowerText.includes('prix') || lowerText.includes('combien') || lowerText.includes('coût')) {
    botResponse = '💰 Les prix sont affichés directement sur chaque publication. Cliquez sur un produit pour voir le prix et l\'ajouter à votre panier !';
  } else if (lowerText.includes('livraison') || lowerText.includes('délai')) {
    botResponse = '🚚 La livraison se fait généralement sous 24-48h après confirmation de commande via WhatsApp.';
  } else if (lowerText.includes('commande') || lowerText.includes('acheter') || lowerText.includes('panier')) {
    botResponse = '🛒 Pour commander : ajoutez vos produits au panier, puis cliquez sur "Commander via WhatsApp". Un message sera automatiquement rédigé pour vous !';
  } else if (lowerText.includes('produit') || lowerText.includes('rhum') || lowerText.includes('saveur')) {
    botResponse = '🥃 Rhum Danou propose plusieurs saveurs : Grenadia, Gingembre, Lanni et plus encore ! Parcourez notre catalogue pour découvrir tous nos produits.';
  } else if (lowerText.includes('humain') || lowerText.includes('administrateur') || lowerText.includes('aide') || lowerText.includes('problème') || offerHuman) {
    const adminOnline = db.users.some(u => ['creator', 'admin'].includes(u.role) && u.online);
    if (adminOnline) {
      botResponse = '👤 Un administrateur est disponible ! Je transfère votre demande. Veuillez patienter quelques instants...';
    } else {
      botResponse = '⏰ Aucun administrateur disponible pour le moment. Revenez dans 30 minutes ou laissez votre question, nous vous répondrons dès que possible.';
    }
  } else {
    botResponse = `Bonjour ! Je suis le bot de Rhum Danou 🥃\n\nJe peux vous aider avec :\n• Les prix et produits\n• Les commandes et le panier\n• Les délais de livraison\n\nSouhaitez-vous contacter un administrateur ? Tapez "aide humain".`;
    offerHuman = true;
  }

  const botMsg = {
    id: uuidv4(),
    userId: req.user.id,
    from: 'bot',
    text: botResponse,
    createdAt: new Date(Date.now() + 500).toISOString()
  };
  db.messages.push(botMsg);
  res.json({ messages: [userMsg, botMsg] });
});

// ==================== UTILS ====================

function sanitizeUser(u) {
  const { password, ...safe } = u;
  return safe;
}

// Catch-all → serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`🥃 Rhum Danou server running on port ${PORT}`));
