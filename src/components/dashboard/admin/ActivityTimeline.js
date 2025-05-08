import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './ActivityTimeline.css';

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    entityType: '',
    action: ''
  });

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/activities/recent?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          filter: filters
        }
      });

      if (page === 1) {
        setActivities(response.data.data);
      } else {
        setActivities(prev => [...prev, ...response.data.data]);
      }

      setHasMore(page < response.data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, filters]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'create':
        return '✨';
      case 'update':
        return '📝';
      case 'delete':
        return '🗑️';
      case 'login':
        return '🔑';
      case 'logout':
        return '👋';
      default:
        return '📌';
    }
  };

  return (
    <div className="activity-timeline">
      <div className="activity-header">
        <h2>Recent Activities</h2>
        <div className="activity-filters">
          <select
            name="entityType"
            value={filters.entityType}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="task">Tasks</option>
            <option value="project">Projects</option>
            <option value="user">Users</option>
            <option value="profile">Profiles</option>
          </select>
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
          >
            <option value="">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading activities...</div>}

      <div className="timeline">
        {activities.map((activity, index) => (
          <div key={activity._id} className="timeline-item">
            <div className="timeline-icon">
              {getActivityIcon(activity.action)}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="user-name">
                  {activity.user.firstName} {activity.user.lastName}
                </span>
                <span className="timestamp">
                  {moment(activity.createdAt).fromNow()}
                </span>
              </div>
              <p className="description">{activity.description}</p>
              {activity.changes && (
                <div className="changes-detail">
                  <small>
                    {activity.action === 'update' ? 'Modified fields: ' : ''}
                    {activity.changes.after && 
                      Object.keys(activity.changes.after).join(', ')}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <button className="load-more" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default ActivityTimeline;