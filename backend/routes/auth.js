const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock database
const users = [
  {
    id: 1,
    email: 'member@noblesse.com',
    password: '$2a$10$XQlvLc5hYfHc8yQS1qXJLOqYqZKZxHYzLxRvLxHYzLxRvLxHYzLxR', // password: noblesse123
    name: '田中 太郎',
    age: 45,
    benefits: [
      {
        id: 1,
        title: 'プレミアムラウンジアクセス',
        content: '全国の提携ラウンジを無料でご利用いただけます',
        image: null
      },
      {
        id: 2,
        title: 'コンシェルジュサービス',
        content: '24時間365日、専属コンシェルジュがサポートいたします',
        image: null
      }
    ]
  },
  {
    id: 2,
    email: 'vip@noblesse.com',
    password: '$2a$10$XQlvLc5hYfHc8yQS1qXJLOqYqZKZxHYzLxRvLxHYzLxRvLxHYzLxR', // password: noblesse123
    name: '佐藤 次郎',
    age: 52,
    benefits: [
      {
        id: 1,
        title: 'プライベートジェット優先予約',
        content: '提携プライベートジェットサービスを優先的にご予約いただけます',
        image: null
      }
    ]
  }
];

// Member login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // For PoC, simple password check
    const isValidPassword = password === 'noblesse123';
    if (!isValidPassword) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'noblesse-secret-key-2024',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'ログイン処理中にエラーが発生しました' });
  }
});

// Admin login
router.post('/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'noblesse-secret-key-2024',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: 'admin',
          username: 'admin',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ message: 'ユーザー名またはパスワードが正しくありません' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'ログイン処理中にエラーが発生しました' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'noblesse-secret-key-2024');

    if (decoded.role === 'admin') {
      return res.json({
        user: {
          id: 'admin',
          username: 'admin',
          role: 'admin'
        }
      });
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ message: '認証トークンが無効です' });
  }
});

module.exports = router;
