import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { aggregateByCategory } from '../utils/storage';
import { getCategoryColor } from '../utils/categories';

// Chart.jsに必要なコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend);

// カテゴリ別支出の円グラフコンポーネント
const CategoryPieChart = ({ expenses }) => {
  // カテゴリ別に集計
  const aggregated = aggregateByCategory(expenses);
  const labels = Object.keys(aggregated);
  const data = Object.values(aggregated);

  if (labels.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="section-title">カテゴリ別支出</h2>
        <div className="empty-state">
          <span className="empty-icon">🥧</span>
          <p>データがありません</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map(getCategoryColor),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          // 金額と割合を表示
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ¥${ctx.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const total = data.reduce((a, b) => a + b, 0);

  return (
    <div className="chart-container">
      <h2 className="section-title">カテゴリ別支出</h2>
      <div className="chart-total">合計 ¥{total.toLocaleString()}</div>
      <div className="pie-chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
