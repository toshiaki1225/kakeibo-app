import React, { useState, useEffect } from 'react';
import ReceiptUpload from './components/ReceiptUpload';
import ExpenseList from './components/ExpenseList';
import CategoryPieChart from './components/CategoryPieChart';
import MonthlyBarChart from './components/MonthlyBarChart';
import { loadExpenses, addExpense, deleteExpense } from './utils/storage';

// アプリのルートコンポーネント
const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [notification, setNotification] = useState('');

  // 初回マウント時にlocalStorageからデータを読み込む
  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  // レシート解析完了時のコールバック
  const handleReceiptAnalyzed = (receiptData) => {
    const newExpense = addExpense(receiptData);
    setExpenses((prev) => [...prev, newExpense]);
    showNotification(`「${receiptData.storeName || '支出'}」を登録しました ¥${receiptData.total.toLocaleString()}`);
    setActiveTab('list');
  };

  // 支出削除のコールバック
  const handleDelete = (id) => {
    deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showNotification('削除しました');
  };

  // 通知を一時表示する
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // タブの定義
  const tabs = [
    { id: 'upload', label: '📷 読み込む' },
    { id: 'list', label: `📋 一覧 (${expenses.length})` },
    { id: 'chart', label: '📊 グラフ' },
  ];

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="app-header">
        <h1 className="app-title">🧾 レシート家計簿</h1>
        <p className="app-subtitle">レシートをアップロードして自動で家計管理</p>
      </header>

      {/* タブナビゲーション */}
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* メインコンテンツ */}
      <main className="app-main">
        {activeTab === 'upload' && (
          <ReceiptUpload onReceiptAnalyzed={handleReceiptAnalyzed} />
        )}

        {activeTab === 'list' && (
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        )}

        {activeTab === 'chart' && (
          <div className="charts-grid">
            <CategoryPieChart expenses={expenses} />
            <MonthlyBarChart expenses={expenses} />
          </div>
        )}
      </main>

      {/* 通知トースト */}
      {notification && (
        <div className="notification-toast">
          ✅ {notification}
        </div>
      )}

      {/* フッター */}
      <footer className="app-footer">
        <p>データはブラウザのlocalStorageに保存されます</p>
      </footer>
    </div>
  );
};

export default App;
