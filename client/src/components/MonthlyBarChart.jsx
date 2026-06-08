import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { aggregateByMonth } from '../utils/storage';

// Chart.jsに必要なコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 月別支出の棒グラフコンポーネント
const MonthlyBarChart = ({ expenses }) => {
  // 月別に集計して古い順に並べる
  const aggregated = aggregateByMonth(expenses);
  const sortedMonths = Object.keys(aggregated).sort();
  const data = sortedMonths.map((m) => aggregated[m]);

  if (sortedMonths.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="section-title">月別支出</h2>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>データがありません</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: sortedMonths.map((m) => {
      const [year, month] = m.split('-');
      return `${year}年${parseInt(month)}月`;
    }),
    datasets: [
      {
        label: '支出額（円）',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ¥${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `¥${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="section-title">月別支出</h2>
      <div className="bar-chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyBarChart;
