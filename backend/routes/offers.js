const express = require('express');
const router = express.Router();

// Mock database for date offers
let offers = [];
let nextId = 1;

// Get all offers
router.get('/', (req, res) => {
  try {
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'オファー情報の取得中にエラーが発生しました' });
  }
});

// Get offers by male member ID
router.get('/member/:memberId', (req, res) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const memberOffers = offers.filter(o => o.maleMemberId === memberId);
    res.json(memberOffers);
  } catch (error) {
    console.error('Error fetching member offers:', error);
    res.status(500).json({ message: 'オファー情報の取得中にエラーが発生しました' });
  }
});

// Create new offer
router.post('/', (req, res) => {
  try {
    const {
      maleMemberId,
      maleMemberName,
      femaleMemberId,
      femaleMemberName,
      preferredDates,
      meetingPlace
    } = req.body;

    if (!maleMemberId || !femaleMemberId || !preferredDates || preferredDates.length === 0 || !meetingPlace) {
      return res.status(400).json({ message: '必須項目を入力してください' });
    }

    const newOffer = {
      id: nextId++,
      maleMemberId,
      maleMemberName,
      femaleMemberId,
      femaleMemberName,
      preferredDates,
      meetingPlace,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    };

    offers.push(newOffer);
    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'オファーの作成中にエラーが発生しました' });
  }
});

// Update offer status
router.patch('/:id', (req, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const { status } = req.body;

    const index = offers.findIndex(o => o.id === offerId);

    if (index === -1) {
      return res.status(404).json({ message: 'オファーが見つかりません' });
    }

    offers[index].status = status;
    res.json(offers[index]);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'オファーの更新中にエラーが発生しました' });
  }
});

// Delete offer
router.delete('/:id', (req, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const index = offers.findIndex(o => o.id === offerId);

    if (index === -1) {
      return res.status(404).json({ message: 'オファーが見つかりません' });
    }

    offers.splice(index, 1);
    res.json({ message: 'オファーを削除しました' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'オファーの削除中にエラーが発生しました' });
  }
});

module.exports = router;
