import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Enhanced filtering and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('subscription_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    subscription_name: '',
    price: '',
    renewal_date: '',
    category: '',
    notes: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

  const categories = [
    'Entertainment', 'Music', 'Productivity', 'Design', 
    'Cloud', 'Gaming', 'News', 'Health', 'Education', 'Other'
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/subscriptions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data || []);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Network error while fetching subscriptions');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.subscription_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (sortBy === 'renewal_date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else {
      aValue = aValue?.toString().toLowerCase() || '';
      bValue = bValue?.toString().toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscriptions = sortedSubscriptions.slice(startIndex, startIndex + itemsPerPage);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:5000/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        setShowAddForm(false);
        resetForm();
        fetchSubscriptions();
        setSuccess('Subscription added successfully!');
      } else {
        setError('Failed to add subscription');
      }
    } catch (err) {
      setError('Network error while adding subscription');
    }
  };

  const handleEditSubscription = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:5000/subscriptions/${editingSubscription._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        setEditingSubscription(null);
        setShowAddForm(false);
        resetForm();
        fetchSubscriptions();
        setSuccess('Subscription updated successfully!');
      } else {
        setError('Failed to update subscription');
      }
    } catch (err) {
      setError('Network error while updating subscription');
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:5000/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchSubscriptions();
        setSuccess('Subscription deleted successfully!');
      } else {
        setError('Failed to delete subscription');
      }
    } catch (err) {
      setError('Network error while deleting subscription');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscriptions.length === 0) {
      setError('Please select subscriptions to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedSubscriptions.length} subscription(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const deletePromises = selectedSubscriptions.map(id =>
        fetch(`http://127.0.0.1:5000/subscriptions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      setSelectedSubscriptions([]);
      fetchSubscriptions();
      setSuccess(`${selectedSubscriptions.length} subscription(s) deleted successfully!`);
    } catch (err) {
      setError('Error during bulk delete');
    }
  };

  const startEdit = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      subscription_name: subscription.subscription_name,
      price: subscription.price.toString(),
      renewal_date: subscription.renewal_date.split('T')[0],
      category: subscription.category || '',
      notes: subscription.notes || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      subscription_name: '',
      price: '',
      renewal_date: '',
      category: '',
      notes: ''
    });
    setEditingSubscription(null);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSubscriptions(paginatedSubscriptions.map(sub => sub._id));
    } else {
      setSelectedSubscriptions([]);
    }
  };

  const handleSelectSubscription = (subscriptionId, checked) => {
    if (checked) {
      setSelectedSubscriptions([...selectedSubscriptions, subscriptionId]);
    } else {
      setSelectedSubscriptions(selectedSubscriptions.filter(id => id !== subscriptionId));
    }
  };

  const calculateStats = () => {
    const total = filteredSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const avgPrice = filteredSubscriptions.length > 0 ? total / filteredSubscriptions.length : 0;
    return { total: total.toFixed(2), average: avgPrice.toFixed(2) };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Subscriptions</h1>
          <p className="text-gray-600">Complete overview and management of all your subscriptions</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Subscriptions</div>
            <div className="text-2xl font-bold text-indigo-600">{filteredSubscriptions.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Monthly Total</div>
            <div className="text-2xl font-bold text-green-600">${stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Average Price</div>
            <div className="text-2xl font-bold text-blue-600">${stats.average}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Selected</div>
            <div className="text-2xl font-bold text-purple-600">{selectedSubscriptions.length}</div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="subscription_name-asc">Name A-Z</option>
                <option value="subscription_name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="renewal_date-asc">Renewal Earliest</option>
                <option value="renewal_date-desc">Renewal Latest</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  resetForm();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                + Add New
              </button>

              {selectedSubscriptions.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Delete Selected ({selectedSubscriptions.length})
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
              </h2>
              <form onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subscription Name *
                    </label>
                    <input
                      type="text"
                      name="subscription_name"
                      value={formData.subscription_name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Netflix, Spotify, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="15.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Date *
                    </label>
                    <input
                      type="date"
                      name="renewal_date"
                      value={formData.renewal_date}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Any additional notes..."
                  ></textarea>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold"
                  >
                    {editingSubscription ? 'Update' : 'Add'} Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subscriptions List */}
        <div className="bg-white rounded-lg shadow">
          {viewMode === 'table' ? (
            <>
              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedSubscriptions.length === paginatedSubscriptions.length && paginatedSubscriptions.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Renewal Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSubscriptions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No subscriptions found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : 'Add your first subscription!'}
                        </td>
                      </tr>
                    ) : (
                      paginatedSubscriptions.map((subscription) => (
                        <tr key={subscription._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedSubscriptions.includes(subscription._id)}
                              onChange={(e) => handleSelectSubscription(subscription._id, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {subscription.subscription_name}
                              </div>
                              {subscription.notes && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {subscription.notes}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${subscription.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {subscription.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(subscription.renewal_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => startEdit(subscription)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubscription(subscription._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {/* Grid View */}
              <div className="p-6">
                {paginatedSubscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      No subscriptions found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : 'Add your first subscription!'}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedSubscriptions.map((subscription) => (
                      <div key={subscription._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <input
                            type="checkbox"
                            checked={selectedSubscriptions.includes(subscription._id)}
                            onChange={(e) => handleSelectSubscription(subscription._id, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(subscription)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubscription(subscription._id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{subscription.subscription_name}</h3>
                          <p className="text-2xl font-bold text-green-600">${subscription.price}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Category:</span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {subscription.category || 'Uncategorized'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Renewal:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(subscription.renewal_date).toLocaleDateString()}
                            </span>
                          </div>
                          {subscription.notes && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600">{subscription.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedSubscriptions.length)} of {sortedSubscriptions.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${page === currentPage ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;
