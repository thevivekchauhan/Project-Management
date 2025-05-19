import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activities/recent`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page,
          limit: 10
        }
      });

      if (response.data.success) {
        if (page === 1) {
          setActivities(response.data.data);
        } else {
          setActivities(prev => [...prev, ...response.data.data]);
        }
        setHasMore(page < response.data.pagination.pages);
        setError(null);
      } else {
        setError('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.response?.data?.message || 'Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
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

  const getActivityColor = (action) => {
    switch (action) {
      case 'create':
        return '#4CAF50';
      case 'update':
        return '#2196F3';
      case 'delete':
        return '#F44336';
      case 'login':
        return '#9C27B0';
      case 'logout':
        return '#FF9800';
      default:
        return '#607D8B';
    }
  };

  if (error) {
    return (
      <div className="activities-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchActivities()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>Activities</h1>
        <p>Track all system activities and changes</p>
      </div>

      {loading && page === 1 ? (
        <div className="loading-spinner">Loading activities...</div>
      ) : activities.length === 0 ? (
        <div className="no-activities">
          <p>No activities found</p>
        </div>
      ) : (
        <div className="activities-list">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="activity-card"
              onClick={() => setSelectedActivity(activity)}
              style={{ borderLeftColor: getActivityColor(activity.action) }}
            >
              <div className="activity-icon">
                {getActivityIcon(activity.action)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">
                    {activity.user?.firstName} {activity.user?.lastName}
                  </span>
                  <span className="activity-time">
                    {moment(activity.createdAt).fromNow()}
                  </span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="activity-type">{activity.entityType}</span>
                  <span className="activity-action">{activity.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          Load More Activities
        </button>
      )}

      {selectedActivity && (
        <div className="activity-modal" onClick={() => setSelectedActivity(null)}>
          <div className="activity-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedActivity(null)}>×</button>
            <div className="modal-header">
              <h2>Activity Details</h2>
              <span className="modal-time">
                {moment(selectedActivity.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </span>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>User</h3>
                <p>{selectedActivity.user?.firstName} {selectedActivity.user?.lastName}</p>
              </div>
              <div className="modal-section">
                <h3>Action</h3>
                <p className={`action-badge ${selectedActivity.action}`}>
                  {selectedActivity.action}
                </p>
              </div>
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedActivity.description}</p>
              </div>
              {selectedActivity.changes && (
                <div className="modal-section">
                  <h3>Changes</h3>
                  <div className="changes-container">
                    {selectedActivity.changes.before && (
                      <div className="changes-before">
                        <h4>Previous Values</h4>
                        <pre>{JSON.stringify(selectedActivity.changes.before, null, 2)}</pre>
                      </div>
                    )}
                    {selectedActivity.changes.after && (
                      <div className="changes-after">
                        <h4>New Values</h4>
                        <pre>{JSON.stringify(selectedActivity.changes.after, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities; 