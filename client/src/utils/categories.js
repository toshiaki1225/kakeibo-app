// カテゴリ定義と色設定
export const CATEGORIES = [
  { name: '食費', color: '#FF6384', emoji: '🛒' },
  { name: '外食', color: '#FF9F40', emoji: '🍽️' },
  { name: '日用品', color: '#FFCD56', emoji: '🧴' },
  { name: '交通費', color: '#4BC0C0', emoji: '🚃' },
  { name: '娯楽', color: '#9966FF', emoji: '🎮' },
  { name: '医療費', color: '#FF6B6B', emoji: '💊' },
  { name: '衣服', color: '#36A2EB', emoji: '👕' },
  { name: 'その他', color: '#C9CBCF', emoji: '📦' },
];

// カテゴリ名から色を取得するヘルパー
export const getCategoryColor = (categoryName) => {
  const category = CATEGORIES.find((c) => c.name === categoryName);
  return category ? category.color : '#C9CBCF';
};

// カテゴリ名から絵文字を取得するヘルパー
export const getCategoryEmoji = (categoryName) => {
  const category = CATEGORIES.find((c) => c.name === categoryName);
  return category ? category.emoji : '📦';
};
