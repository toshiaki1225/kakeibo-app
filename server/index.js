// バックエンドサーバー：Claude APIを呼び出してレシートを解析する
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .envを読み込む（プロジェクトルートの.envを参照）
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = 3001;

// Anthropic クライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORSとJSONパーサーの設定
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

// レシート解析エンドポイント
app.post('/api/analyze-receipt', async (req, res) => {
  const { imageBase64, mediaType } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: '画像データが必要です' });
  }

  try {
    // Claude APIへ画像を送信してレシートを解析
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `このレシート画像を解析して、以下のJSON形式で情報を抽出してください。
日付が読み取れない場合は今日の日付を使用してください。
カテゴリは「食費」「外食」「日用品」「交通費」「娯楽」「医療費」「衣服」「その他」から最も適切なものを選んでください。
店名からカテゴリを推測してください（例：スーパー→食費、コンビニ→食費、レストラン→外食、薬局→医療費など）。

必ず以下のJSON形式のみで返答してください（説明文は不要）：
{
  "date": "YYYY-MM-DD",
  "storeName": "店舗名",
  "category": "カテゴリ名",
  "items": [
    { "name": "商品名", "price": 金額（数値） }
  ],
  "total": 合計金額（数値）
}`,
            },
          ],
        },
      ],
    });

    // レスポンスからJSONを抽出
    const text = response.content[0].text;

    // JSONブロックを抽出（マークダウンのコードブロックにも対応）
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    const jsonText = jsonMatch ? jsonMatch[1].trim() : text.trim();

    const receiptData = JSON.parse(jsonText);
    res.json({ success: true, data: receiptData });
  } catch (error) {
    console.error('レシート解析エラー:', error);

    // JSONパースエラーの場合
    if (error instanceof SyntaxError) {
      return res.status(422).json({ error: 'レシートの解析に失敗しました。画像を確認してください。' });
    }

    // APIエラーの場合
    res.status(500).json({ error: `APIエラー: ${error.message}` });
  }
});

// サーバー起動確認用エンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'claude-haiku-4-5' });
});

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
