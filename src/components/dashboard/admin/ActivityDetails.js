import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './ActivityDetails.css';

const ActivityDetails = ({ activityId, onClose }) => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/activities/${activityId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivity(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching activity details');
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activityId]);

  const renderChanges = (changes) => {
    if (!changes) return null;

    return (
      <div className="changes-section">
        {changes.before && (
          <div className="changes-before">
            <h4>Previous Values:</h4>
            <pre>{JSON.stringify(changes.before, null, 2)}</pre>
          </div>
        )}
        {changes.after && (
          <div className="changes-after">
            <h4>New Values:</h4>
            <pre>{JSON.stringify(changes.after, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="activity-details-loading">Loading...</div>;
  if (error) return <div className="activity-details-error">{error}</div>;
  if (!activity) return null;

  return (
    <div className="activity-details-modal">
      <div className="activity-details-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="activity-header">
          <h2>{activity.description}</h2>
          <div className="activity-meta">
            <span className="activity-user">
              By: {activity.user.firstName} {activity.user.lastName}
            </span>
            <span className="activity-time">
              {moment(activity.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
          </div>
        </div>

        <div className="activity-info">
          <div className="info-item">
            <label>Action Type:</label>
            <span className={`action-type ${activity.action}`}>
              {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
            </span>
          </div>
          
          <div className="info-item">
            <label>Entity Type:</label>
            <span className="entity-type">
              {activity.entityType.charAt(0).toUpperCase() + activity.entityType.slice(1)}
            </span>
          </div>
        </div>

        {activity.changes && (
          <div className="activity-changes">
            <h3>Changes Made</h3>
            {renderChanges(activity.changes)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetails;