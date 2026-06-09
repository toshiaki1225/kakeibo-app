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
  // 警告確認中の支出データ（null の場合は警告なし）
  const [pendingExpense, setPendingExpense] = useState(null);
  const [warnings, setWarnings] = useState([]);

  // 初回マウント時にlocalStorageからデータを読み込む
  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  // バリデーションチェック：警告リストを返す
  const validate = (receiptData) => {
    const messages = [];

    // 金額が負の値かチェック
    if (receiptData.total < 0) {
      messages.push(`金額が負の値です（¥${receiptData.total.toLocaleString()}）。返金・クレジットの場合はそのまま登録できます。`);
    }

    // 同一日付・合計金額の重複チェック
    const isDuplicate = expenses.some(
      (e) => e.date === receiptData.date && e.total === receiptData.total
    );
    if (isDuplicate) {
      messages.push(`${receiptData.date} に合計 ¥${receiptData.total.toLocaleString()} のレシートが既に登録されています。`);
    }

    return messages;
  };

  // レシート解析完了時のコールバック：バリデーション後に保存または警告表示
  const handleReceiptAnalyzed = (receiptData) => {
    const warningMessages = validate(receiptData);

    if (warningMessages.length > 0) {
      // 警告があれば確認ダイアログを表示して一時保留
      setPendingExpense(receiptData);
      setWarnings(warningMessages);
      return;
    }

    commitExpense(receiptData);
  };

  // 支出をlocalStorageとstateに保存する
  const commitExpense = (receiptData) => {
    const newExpense = addExpense(receiptData);
    setExpenses((prev) => [...prev, newExpense]);
    showNotification(`「${receiptData.storeName || '支出'}」を登録しました ¥${receiptData.total.toLocaleString()}`);
    setActiveTab('list');
    setPendingExpense(null);
    setWarnings([]);
  };

  // 警告を無視して強制登録する
  const handleForceCommit = () => {
    if (pendingExpense) commitExpense(pendingExpense);
  };

  // 警告キャンセル（登録しない）
  const handleCancelPending = () => {
    setPendingExpense(null);
    setWarnings([]);
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

      {/* 警告確認ダイアログ */}
      {pendingExpense && (
        <div className="warning-overlay">
          <div className="warning-dialog">
            <div className="warning-dialog-header">
              <span className="warning-icon">⚠️</span>
              <h3>登録前の確認</h3>
            </div>
            <ul className="warning-list">
              {warnings.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <p className="warning-question">このまま登録しますか？</p>
            <div className="warning-actions">
              <button className="btn btn--secondary" onClick={handleCancelPending}>
                キャンセル
              </button>
              <button className="btn btn--warning" onClick={handleForceCommit}>
                登録する
              </button>
            </div>
          </div>
        </div>
      )}

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
