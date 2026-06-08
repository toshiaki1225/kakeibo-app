import React, { useState, useRef } from 'react';

// レシート画像をアップロードしてClaude APIで解析するコンポーネント
const ReceiptUpload = ({ onReceiptAnalyzed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // ファイルを選択したときの処理
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target.result);
    reader.readAsDataURL(file);

    await analyzeReceipt(file);
  };

  // ドラッグ&ドロップの処理
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target.result);
    reader.readAsDataURL(file);

    await analyzeReceipt(file);
  };

  // Claude APIでレシートを解析する
  const analyzeReceipt = async (file) => {
    setLoading(true);
    setError('');

    try {
      // 画像をbase64に変換
      const base64 = await fileToBase64(file);
      const mediaType = file.type;

      // バックエンドAPIを呼び出す
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '解析に失敗しました');
      }

      const result = await response.json();
      onReceiptAnalyzed(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      // ファイル入力をリセットして再アップロードを可能にする
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // FileオブジェクトをBase64文字列に変換するヘルパー
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // data:image/jpeg;base64,... の base64部分のみ抽出
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="upload-section">
      <h2 className="section-title">レシートを読み込む</h2>

      {/* ドロップゾーン */}
      <div
        className={`drop-zone ${loading ? 'drop-zone--loading' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          disabled={loading}
        />

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Claude AIが解析中...</p>
          </div>
        ) : previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="レシートプレビュー" className="receipt-preview" />
            <p className="preview-hint">クリックして別の画像を選択</p>
          </div>
        ) : (
          <div className="drop-zone-hint">
            <span className="drop-zone-icon">🧾</span>
            <p>レシート画像をドロップ<br />またはクリックして選択</p>
            <p className="drop-zone-sub">JPG・PNG・GIF・WEBP対応</p>
          </div>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
