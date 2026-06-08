// localStorageへのデータ保存・読み込みを管理するユーティリティ
const STORAGE_KEY = 'kakeibo_expenses';

// 支出データを全件取得する
export const loadExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 支出データを保存する（既存データを上書き）
export const saveExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

// 新しい支出を追加する
export const addExpense = (expense) => {
  const expenses = loadExpenses();
  const newExpense = {
    ...expense,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
};

// IDで支出を削除する
export const deleteExpense = (id) => {
  const expenses = loadExpenses().filter((e) => e.id !== id);
  saveExpenses(expenses);
};

// 月別に支出を集計する
export const aggregateByMonth = (expenses) => {
  const result = {};
  expenses.forEach(({ date, total }) => {
    const month = date.substring(0, 7); // YYYY-MM
    result[month] = (result[month] || 0) + total;
  });
  return result;
};

// カテゴリ別に支出を集計する
export const aggregateByCategory = (expenses) => {
  const result = {};
  expenses.forEach(({ category, total }) => {
    result[category] = (result[category] || 0) + total;
  });
  return result;
};
