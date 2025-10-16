const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processImageWithFaceBlur } = require('../utils/faceDetection');

// Import members data
const membersModule = require('./members');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/original');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('画像ファイル（JPEG、PNG）のみアップロード可能です'));
    }
  }
});

// Get all members (admin view - includes original images)
router.get('/members', (req, res) => {
  try {
    // Get query parameters for search
    const { ageMin, ageMax, datingTypes, bustCups, freeword } = req.query;

    let filteredMembers = [...membersModule.femaleMembers];

    // Filter by age range
    if (ageMin) {
      filteredMembers = filteredMembers.filter(m => m.age >= parseInt(ageMin));
    }
    if (ageMax) {
      filteredMembers = filteredMembers.filter(m => m.age <= parseInt(ageMax));
    }

    // Filter by dating types (multiple selection)
    if (datingTypes) {
      const typesArray = Array.isArray(datingTypes) ? datingTypes : [datingTypes];
      filteredMembers = filteredMembers.filter(m => typesArray.includes(m.datingType));
    }

    // Filter by bust cups (multiple selection)
    if (bustCups) {
      const cupsArray = Array.isArray(bustCups) ? bustCups : [bustCups];
      filteredMembers = filteredMembers.filter(m => cupsArray.includes(m.bustCup));
    }

    // Filter by freeword (partial match in name, occupation, hobbies, introduction)
    if (freeword) {
      const keyword = freeword.toLowerCase();
      filteredMembers = filteredMembers.filter(m =>
        (m.name && m.name.toLowerCase().includes(keyword)) ||
        (m.occupation && m.occupation.toLowerCase().includes(keyword)) ||
        (m.hobbies && m.hobbies.toLowerCase().includes(keyword)) ||
        (m.introduction && m.introduction.toLowerCase().includes(keyword)) ||
        (m.favoriteFoods && m.favoriteFoods.toLowerCase().includes(keyword)) ||
        (m.preferredLocations && m.preferredLocations.toLowerCase().includes(keyword))
      );
    }

    const members = filteredMembers.map(member => ({
      ...member,
      originalImage: member.image ? `/uploads/original/${member.image}` : null,
      blurredImage: member.image ? `/uploads/blurred/${member.image}` : null
    }));

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'メンバー情報の取得中にエラーが発生しました' });
  }
});

// Get single member (admin view)
router.get('/members/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const member = membersModule.femaleMembers.find(m => m.id === memberId);

    if (!member) {
      return res.status(404).json({ message: 'メンバーが見つかりません' });
    }

    const memberWithImages = {
      ...member,
      originalImage: member.image ? `/uploads/original/${member.image}` : null,
      blurredImage: member.image ? `/uploads/blurred/${member.image}` : null
    };

    res.json(memberWithImages);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'メンバー情報の取得中にエラーが発生しました' });
  }
});

// Create new member
router.post('/members', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      age,
      introduction,
      bustCup,
      occupation,
      hobbies,
      favoriteFoods,
      dislikedFoods,
      preferredLocations,
      datingType
    } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: '名前と年齢は必須です' });
    }

    let imageName = null;

    // If photo uploaded, process it
    if (req.file) {
      imageName = req.file.filename;
      const originalPath = req.file.path;
      const blurredPath = path.join(__dirname, '../uploads/blurred', imageName);

      // Apply face blur to the image
      await processImageWithFaceBlur(originalPath, blurredPath);
      console.log(`✅ Image saved with blur: ${imageName}`);
    }

    const newMember = {
      id: membersModule.femaleMembers.length + 1,
      name,
      age: parseInt(age),
      introduction: introduction || '',
      bustCup: bustCup || '',
      occupation: occupation || '',
      hobbies: hobbies || '',
      favoriteFoods: favoriteFoods || '',
      dislikedFoods: dislikedFoods || '',
      preferredLocations: preferredLocations || '',
      datingType: datingType || 'A',
      image: imageName,
      createdAt: new Date().toISOString()
    };

    membersModule.femaleMembers.push(newMember);

    res.status(201).json({
      ...newMember,
      originalImage: imageName ? `/uploads/original/${imageName}` : null,
      blurredImage: imageName ? `/uploads/blurred/${imageName}` : null
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ message: 'メンバー作成中にエラーが発生しました' });
  }
});

// Update member
router.put('/members/:id', upload.single('photo'), async (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const memberIndex = membersModule.femaleMembers.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ message: 'メンバーが見つかりません' });
    }

    const {
      name,
      age,
      introduction,
      bustCup,
      occupation,
      hobbies,
      favoriteFoods,
      dislikedFoods,
      preferredLocations,
      datingType
    } = req.body;
    const member = membersModule.femaleMembers[memberIndex];

    // Update basic info
    if (name) member.name = name;
    if (age) member.age = parseInt(age);
    if (introduction !== undefined) member.introduction = introduction;
    if (bustCup !== undefined) member.bustCup = bustCup;
    if (occupation !== undefined) member.occupation = occupation;
    if (hobbies !== undefined) member.hobbies = hobbies;
    if (favoriteFoods !== undefined) member.favoriteFoods = favoriteFoods;
    if (dislikedFoods !== undefined) member.dislikedFoods = dislikedFoods;
    if (preferredLocations !== undefined) member.preferredLocations = preferredLocations;
    if (datingType !== undefined) member.datingType = datingType;

    // If new photo uploaded
    if (req.file) {
      // Delete old images if they exist
      if (member.image) {
        const oldOriginal = path.join(__dirname, '../uploads/original', member.image);
        const oldBlurred = path.join(__dirname, '../uploads/blurred', member.image);
        if (fs.existsSync(oldOriginal)) fs.unlinkSync(oldOriginal);
        if (fs.existsSync(oldBlurred)) fs.unlinkSync(oldBlurred);
      }

      const imageName = req.file.filename;
      const originalPath = req.file.path;
      const blurredPath = path.join(__dirname, '../uploads/blurred', imageName);

      // Apply face blur to the image
      await processImageWithFaceBlur(originalPath, blurredPath);
      console.log(`✅ Image updated with blur: ${imageName}`);

      member.image = imageName;
    }

    member.updatedAt = new Date().toISOString();

    res.json({
      ...member,
      originalImage: member.image ? `/uploads/original/${member.image}` : null,
      blurredImage: member.image ? `/uploads/blurred/${member.image}` : null
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'メンバー更新中にエラーが発生しました' });
  }
});

// Delete member
router.delete('/members/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const memberIndex = membersModule.femaleMembers.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ message: 'メンバーが見つかりません' });
    }

    const member = membersModule.femaleMembers[memberIndex];

    // Delete images if they exist
    if (member.image) {
      const originalPath = path.join(__dirname, '../uploads/original', member.image);
      const blurredPath = path.join(__dirname, '../uploads/blurred', member.image);
      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(blurredPath)) fs.unlinkSync(blurredPath);
    }

    membersModule.femaleMembers.splice(memberIndex, 1);

    res.json({ message: 'メンバーを削除しました' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'メンバー削除中にエラーが発生しました' });
  }
});

module.exports = router;
