// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://127.0.0.1:5000/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const { monthlySpending, categoryBreakdown } = await res.json();
      setMonthlyData(monthlySpending);
      setCategoryData(categoryBreakdown);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Loading analytics…</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded">
        {error}
      </div>
    );
  }
  
  // Prepare chart data
  const lineData = {
    labels: monthlyData.map(m => m.month),
    datasets: [
      {
        label: 'Monthly Spend',
        data: monthlyData.map(m => m.total),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  const pieData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c.total),
        backgroundColor: [
          '#6366F1','#A78BFA','#F472B6','#FBBF24','#34D399','#60A5FA'
        ]
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Spend</h2>
            <Line data={lineData} options={chartOptions} />
          </div>
          
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        
        {/* Optional Data Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Spend Details</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">Total Spend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map(m => (
                <tr key={m.month}>
                  <td className="px-4 py-2 text-sm text-gray-700">{m.month}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-right">${m.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
