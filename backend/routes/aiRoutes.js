const express = require('express');
const router = express.Router();
const { chat, chatStream } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// RESTful endpoint design:
//   POST /api/ai/chat — send a message, receive AI reply
//
// Middleware chain: protect → chat
//   protect   → validates JWT, sets req.user (authMiddleware)
//   chat      → calls Gemini LLM and returns structured output
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat', protect, chat);
router.post('/stream', protect, chatStream);

module.exports = router;
