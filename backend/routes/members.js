const express = require('express');
const router = express.Router();
const path = require('path');

// Mock database for female members
let femaleMembers = [
  {
    id: 1,
    name: '山田 花子',
    age: 28,
    introduction: '都内在住のモデル兼女優です。趣味は読書とヨガ。洗練された会話を楽しめる方との出会いを求めています。',
    bustCup: 'D',
    occupation: 'モデル・女優',
    hobbies: '読書、ヨガ、美術館巡り',
    favoriteFoods: 'イタリアン、和食',
    dislikedFoods: '辛すぎる食べ物',
    preferredLocations: '六本木、銀座、表参道',
    datingType: 'B2',
    image: '1760514547662-13065519.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: '鈴木 美咲',
    age: 26,
    introduction: '外資系企業勤務。ワインとアートが大好きです。知的で紳士的な方とのご縁をお待ちしております。',
    bustCup: 'C',
    occupation: '外資系企業',
    hobbies: 'ワイン、アート鑑賞',
    favoriteFoods: 'フレンチ、チーズ',
    dislikedFoods: 'パクチー',
    preferredLocations: '銀座、丸の内、恵比寿',
    datingType: 'A',
    image: '1760515934839-849812160.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: '佐々木 麗',
    age: 30,
    introduction: '元CAで現在はフリーランスコンサルタント。旅行と美食が趣味です。上質な時間を共有できる方を探しています。',
    bustCup: 'E',
    occupation: 'コンサルタント',
    hobbies: '旅行、グルメ、スパ',
    favoriteFoods: '寿司、ステーキ',
    dislikedFoods: '生魚以外の生もの',
    preferredLocations: '渋谷、六本木、青山',
    datingType: 'C',
    image: '1760515946083-763348167.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: '田中 優香',
    age: 25,
    introduction: '大手広告代理店でクリエイティブディレクターをしています。アート鑑賞と美食巡りが好きです。',
    bustCup: 'C',
    occupation: 'クリエイティブディレクター',
    hobbies: 'アート鑑賞、美食巡り',
    favoriteFoods: 'イタリアン、スイーツ',
    dislikedFoods: 'セロリ',
    preferredLocations: '表参道、代官山、中目黒',
    datingType: 'B1',
    image: '1760516743684-636684742.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: '伊藤 愛美',
    age: 29,
    introduction: '医師として都内の病院に勤務。休日は料理とピアノを楽しんでいます。知的な会話ができる方を探しています。',
    bustCup: 'D',
    occupation: '医師',
    hobbies: '料理、ピアノ、読書',
    favoriteFoods: 'フレンチ、和食',
    dislikedFoods: 'ジャンクフード',
    preferredLocations: '銀座、日本橋、表参道',
    datingType: 'A',
    image: '1760516750504-572496885.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: '高橋 菜々子',
    age: 27,
    introduction: 'フリーランスのファッションデザイナー。世界各地を旅することが趣味です。',
    bustCup: 'B',
    occupation: 'ファッションデザイナー',
    hobbies: '旅行、ファッション、写真',
    favoriteFoods: 'エスニック料理、カフェ飯',
    dislikedFoods: '特になし',
    preferredLocations: '原宿、代官山、自由が丘',
    datingType: 'C',
    image: '1760516764710-273707207.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: '渡辺 真理子',
    age: 31,
    introduction: '弁護士として活躍中。読書とワイン、そして美術館巡りが趣味です。',
    bustCup: 'D',
    occupation: '弁護士',
    hobbies: '読書、ワイン、美術館',
    favoriteFoods: 'フレンチ、ワイン',
    dislikedFoods: 'ファストフード',
    preferredLocations: '銀座、丸の内、六本木',
    datingType: 'A',
    image: '1760516779740-690155791.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: '中村 彩香',
    age: 24,
    introduction: 'モデルとして雑誌やファッションショーで活動。ダンスとフィットネスが大好きです。',
    bustCup: 'E',
    occupation: 'モデル',
    hobbies: 'ダンス、フィットネス、ファッション',
    favoriteFoods: 'ヘルシーフード、スムージー',
    dislikedFoods: '油っぽい料理',
    preferredLocations: '渋谷、表参道、恵比寿',
    datingType: 'D',
    image: '1760516986261-500445660.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    name: '小林 舞',
    age: 28,
    introduction: '外資系金融機関勤務。休日はゴルフとテニスを楽しんでいます。',
    bustCup: 'C',
    occupation: '金融機関',
    hobbies: 'ゴルフ、テニス、旅行',
    favoriteFoods: 'ステーキ、ワイン',
    dislikedFoods: '納豆',
    preferredLocations: '丸の内、六本木、赤坂',
    datingType: 'B2',
    image: '1760516993574-833764302.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: '加藤 理沙',
    age: 26,
    introduction: 'IT企業のエンジニア。テクノロジーと芸術の融合に興味があります。',
    bustCup: 'B',
    occupation: 'エンジニア',
    hobbies: 'プログラミング、アート、カフェ巡り',
    favoriteFoods: 'カフェ飯、スイーツ',
    dislikedFoods: '生ガキ',
    preferredLocations: '渋谷、恵比寿、目黒',
    datingType: 'B1',
    image: '1760517113715-89619310.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    name: '山本 梨花',
    age: 30,
    introduction: '建築デザイナーとして活躍。モダンアートと建築巡りが趣味です。',
    bustCup: 'C',
    occupation: '建築デザイナー',
    hobbies: 'アート、建築巡り、写真',
    favoriteFoods: 'イタリアン、和食',
    dislikedFoods: 'スパイスが強い料理',
    preferredLocations: '六本木、表参道、代官山',
    datingType: 'C',
    image: '1760517338548-368778660.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    name: '佐藤 絵里',
    age: 27,
    introduction: '外交官として日本の文化を世界に発信。語学と異文化交流が得意です。',
    bustCup: 'D',
    occupation: '外交官',
    hobbies: '語学学習、異文化交流、旅行',
    favoriteFoods: '各国料理、和食',
    dislikedFoods: '特になし',
    preferredLocations: '赤坂、麻布、六本木',
    datingType: 'A',
    image: '1760517361384-486135507.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 13,
    name: '松本 千春',
    age: 29,
    introduction: 'ホテルのマーケティングディレクター。ホスピタリティと美食を追求しています。',
    bustCup: 'D',
    occupation: 'ホテル業',
    hobbies: '美食、旅行、スパ',
    favoriteFoods: 'フレンチ、和食',
    dislikedFoods: '辛い料理',
    preferredLocations: '銀座、丸の内、日比谷',
    datingType: 'B2',
    image: '1760517419624-42148371.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 14,
    name: '井上 美穂',
    age: 25,
    introduction: 'ピアニストとして国内外で演奏活動。クラシック音楽と読書が好きです。',
    bustCup: 'B',
    occupation: 'ピアニスト',
    hobbies: 'ピアノ、読書、音楽鑑賞',
    favoriteFoods: 'フレンチ、イタリアン',
    dislikedFoods: 'ジャンクフード',
    preferredLocations: '銀座、表参道、恵比寿',
    datingType: 'A',
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 15,
    name: '木村 沙織',
    age: 28,
    introduction: 'ファッション雑誌の編集長。トレンドとスタイルを追求し続けています。',
    bustCup: 'C',
    occupation: '雑誌編集長',
    hobbies: 'ファッション、ショッピング、カフェ巡り',
    favoriteFoods: 'イタリアン、カフェ飯',
    dislikedFoods: 'パクチー',
    preferredLocations: '表参道、青山、代官山',
    datingType: 'D',
    image: null,
    createdAt: new Date().toISOString()
  }
];

// Get all female members (with blurred images)
router.get('/', (req, res) => {
  try {
    // Get query parameters for search
    const { ageMin, ageMax, datingTypes, bustCups, freeword } = req.query;

    let filteredMembers = [...femaleMembers];

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

    // Return members with blurred image paths
    const membersWithBlurredImages = filteredMembers.map(member => ({
      ...member,
      image: member.image ? `/uploads/blurred/${member.image}` : null
    }));

    res.json(membersWithBlurredImages);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'メンバー情報の取得中にエラーが発生しました' });
  }
});

// Get single female member by ID
router.get('/:id', (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const member = femaleMembers.find(m => m.id === memberId);

    if (!member) {
      return res.status(404).json({ message: 'メンバーが見つかりません' });
    }

    const memberWithBlurredImage = {
      ...member,
      image: member.image ? `/uploads/blurred/${member.image}` : null
    };

    res.json(memberWithBlurredImage);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'メンバー情報の取得中にエラーが発生しました' });
  }
});

module.exports = router;
module.exports.femaleMembers = femaleMembers;
