import React, { useState } from 'react';
import { CATEGORIES, getCategoryEmoji } from '../utils/categories';

// 支出の一覧を表示・編集・削除するコンポーネント
const ExpenseList = ({ expenses, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // 表示する支出をフィルタリング
  const filteredExpenses = expenses.filter((expense) => {
    const matchCategory = !filterCategory || expense.category === filterCategory;
    const matchMonth = !filterMonth || expense.date.startsWith(filterMonth);
    return matchCategory && matchMonth;
  });

  // 月リストを生成（重複なし・降順）
  const months = [...new Set(expenses.map((e) => e.date.substring(0, 7)))].sort().reverse();

  // 合計金額を計算
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.total, 0);

  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h2 className="section-title">支出一覧</h2>
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>まだ支出が登録されていません</p>
          <p className="empty-sub">レシートをアップロードして始めましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2 className="section-title">支出一覧</h2>

      {/* フィルターコントロール */}
      <div className="filter-controls">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="filter-select"
        >
          <option value="">全ての月</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month.replace('-', '年')}月
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">全てのカテゴリ</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 合計金額表示 */}
      <div className="total-display">
        <span>合計：</span>
        <span className="total-amount">¥{totalAmount.toLocaleString()}</span>
        <span className="total-count">（{filteredExpenses.length}件）</span>
      </div>

      {/* 支出カード一覧 */}
      <div className="expense-cards">
        {filteredExpenses
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((expense) => (
            <div key={expense.id} className="expense-card">
              <div className="expense-card-header">
                <span className="expense-category-badge">
                  {getCategoryEmoji(expense.category)} {expense.category}
                </span>
                <span className="expense-date">
                  {new Date(expense.date).toLocaleDateString('ja-JP')}
                </span>
              </div>

              <div className="expense-card-body">
                <div className="expense-store">{expense.storeName || '店舗不明'}</div>
                <div className="expense-amount">¥{expense.total.toLocaleString()}</div>
              </div>

              {/* 商品明細（あれば表示） */}
              {expense.items && expense.items.length > 0 && (
                <details className="expense-items">
                  <summary>明細 ({expense.items.length}点)</summary>
                  <ul className="item-list">
                    {expense.items.map((item, i) => (
                      <li key={i} className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">¥{item.price.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* 削除ボタン */}
              <button
                className="delete-btn"
                onClick={() => onDelete(expense.id)}
                aria-label="削除"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExpenseList;
