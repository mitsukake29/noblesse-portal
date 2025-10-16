const express = require('express');
const router = express.Router();

// Password audit log
let passwordAuditLog = [];

// Mock database for male members
let maleMembers = [
  {
    id: 1,
    name: '田中 太郎',
    age: 45,
    memberId: 'NM-001',
    email: 'member@noblesse.com',
    password: 'noblesse123',
    phone: '090-1234-5678',
    address: '東京都港区',
    createdAt: new Date().toISOString(),
    passwordUpdatedAt: null,
    passwordUpdatedBy: null
  },
  {
    id: 2,
    name: '佐藤 健',
    age: 38,
    memberId: 'NM-002',
    email: 'sato@noblesse.com',
    password: 'password123',
    phone: '080-2345-6789',
    address: '東京都渋谷区',
    createdAt: new Date().toISOString(),
    passwordUpdatedAt: null,
    passwordUpdatedBy: null
  },
  {
    id: 3,
    name: '鈴木 隆',
    age: 42,
    memberId: 'NM-003',
    email: 'suzuki@noblesse.com',
    password: 'secure456',
    phone: '070-3456-7890',
    address: '東京都千代田区',
    createdAt: new Date().toISOString(),
    passwordUpdatedAt: null,
    passwordUpdatedBy: null
  }
];

let nextId = 4;

// Password validation function
function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を1文字以上含める必要があります');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('小文字を1文字以上含める必要があります');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('数字を1文字以上含める必要があります');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

// Calculate password strength
function calculatePasswordStrength(password) {
  if (!password) return 'weak';

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength >= 5) return 'strong';
  if (strength >= 3) return 'medium';
  return 'weak';
}

// Add audit log entry
function addAuditLog(action, targetMemberId, targetMemberName, adminUser, details = {}) {
  const logEntry = {
    id: passwordAuditLog.length + 1,
    timestamp: new Date().toISOString(),
    action,
    targetMemberId,
    targetMemberName,
    adminUser,
    details
  };

  passwordAuditLog.push(logEntry);
  console.log(`[AUDIT] ${action} by ${adminUser} for member ${targetMemberName} (ID: ${targetMemberId})`);
}

// Get all male members (パスワードは返さない)
router.get('/', (req, res) => {
  try {
    const safeMaleMembers = maleMembers.map(({ password, ...member }) => member);
    res.json(safeMaleMembers);
  } catch (error) {
    console.error('Error fetching male members:', error);
    res.status(500).json({ message: '男性会員情報の取得中にエラーが発生しました' });
  }
});

// Get single male member by ID
router.get('/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const member = maleMembers.find(m => m.id === memberId);

    if (!member) {
      return res.status(404).json({ message: '男性会員が見つかりません' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching male member:', error);
    res.status(500).json({ message: '男性会員情報の取得中にエラーが発生しました' });
  }
});

// Create new male member
router.post('/', (req, res) => {
  try {
    const { name, age, memberId, email, password, phone, address } = req.body;

    if (!name || !age || !memberId) {
      return res.status(400).json({ message: '必須項目を入力してください' });
    }

    const newMember = {
      id: nextId++,
      name,
      age: parseInt(age),
      memberId,
      email: email || '',
      password: password || '',
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString()
    };

    maleMembers.push(newMember);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating male member:', error);
    res.status(500).json({ message: '男性会員の作成中にエラーが発生しました' });
  }
});

// Update male member
router.put('/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const { name, age, memberId: memberIdStr, email, password, phone, address } = req.body;

    const index = maleMembers.findIndex(m => m.id === memberId);

    if (index === -1) {
      return res.status(404).json({ message: '男性会員が見つかりません' });
    }

    if (!name || !age || !memberIdStr) {
      return res.status(400).json({ message: '名前、年齢、会員IDは必須です' });
    }

    maleMembers[index] = {
      ...maleMembers[index],
      name,
      age: parseInt(age),
      memberId: memberIdStr,
      email: email || '',
      password: password !== undefined ? password : maleMembers[index].password,
      phone: phone !== undefined ? phone : maleMembers[index].phone,
      address: address !== undefined ? address : maleMembers[index].address,
      updatedAt: new Date().toISOString()
    };

    res.json(maleMembers[index]);
  } catch (error) {
    console.error('Error updating male member:', error);
    res.status(500).json({ message: '男性会員の更新中にエラーが発生しました' });
  }
});

// Delete male member
router.delete('/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const index = maleMembers.findIndex(m => m.id === memberId);

    if (index === -1) {
      return res.status(404).json({ message: '男性会員が見つかりません' });
    }

    const member = maleMembers[index];
    addAuditLog('DELETE_MEMBER', member.id, member.name, 'admin', {});

    maleMembers.splice(index, 1);
    res.json({ message: '男性会員を削除しました' });
  } catch (error) {
    console.error('Error deleting male member:', error);
    res.status(500).json({ message: '男性会員の削除中にエラーが発生しました' });
  }
});

// Change password (専用エンドポイント)
router.post('/:id/change-password', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const { newPassword, adminUser = 'admin' } = req.body;

    const index = maleMembers.findIndex(m => m.id === memberId);

    if (index === -1) {
      return res.status(404).json({ message: '男性会員が見つかりません' });
    }

    // Validate password
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'パスワードが要件を満たしていません',
        errors: validation.errors,
        strength: validation.strength
      });
    }

    const member = maleMembers[index];
    const oldPasswordUpdatedAt = member.passwordUpdatedAt;

    // Update password
    maleMembers[index].password = newPassword;
    maleMembers[index].passwordUpdatedAt = new Date().toISOString();
    maleMembers[index].passwordUpdatedBy = adminUser;

    // Add audit log
    addAuditLog('PASSWORD_CHANGE', member.id, member.name, adminUser, {
      strength: validation.strength,
      previousUpdateAt: oldPasswordUpdatedAt
    });

    // Return safe member data (without password)
    const { password, ...safeMember } = maleMembers[index];

    res.json({
      message: 'パスワードを変更しました',
      member: safeMember,
      passwordStrength: validation.strength
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'パスワード変更中にエラーが発生しました' });
  }
});

// Get audit logs
router.get('/audit/logs', (req, res) => {
  try {
    const { limit = 100, memberId } = req.query;

    let logs = passwordAuditLog;

    if (memberId) {
      logs = logs.filter(log => log.targetMemberId === parseInt(memberId));
    }

    // Return most recent logs first
    logs = logs.slice().reverse().slice(0, parseInt(limit));

    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: '監査ログの取得中にエラーが発生しました' });
  }
});

// Validate password endpoint (for real-time validation)
router.post('/validate-password', (req, res) => {
  try {
    const { password } = req.body;
    const validation = validatePassword(password);

    res.json(validation);
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ message: 'パスワード検証中にエラーが発生しました' });
  }
});

module.exports = router;
module.exports.maleMembers = maleMembers;
