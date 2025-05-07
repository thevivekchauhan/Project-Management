import { useState, useEffect, useRef } from 'react';
import { Bell, X, Clock, 
  // Calendar,
   UserPlus, MessageSquare } from 'react-feather';
import { Badge, IconButton, ClickAwayListener } from '@mui/material';
import './NotificationsPanel.css';

const NotificationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    // Mock notifications data - in a real app, this would come from an API
    const mockNotifications = [
      {
        id: 1,
        type: 'overdue',
        title: 'Task "Update user authentication" is overdue',
        time: '2 days ago',
        read: false,
      },
      {
        id: 2,
        type: 'deadline',
        title: 'Project "Website Redesign" deadline in 3 days',
        time: '5 hours ago',
        read: false,
      },
      {
        id: 3,
        type: 'member',
        title: 'Sarah Vivekson joined Website Redesign team',
        time: '1 day ago',
        read: true,
      },
      {
        id: 4,
        type: 'comment',
        title: 'New comment on "Fix navigation menu bug"',
        time: 'Just now',
        read: false,
      },
      {
        id: 5,
        type: 'deadline',
        title: 'Project "Mobile App Development" milestone due tomorrow',
        time: '2 hours ago',
        read: false,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    const notificationToRemove = notifications.find(n => n.id === id);
    if (notificationToRemove && !notificationToRemove.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <Clock className="notification-icon overdue" />;
      case 'deadline':
        // return <Calendar className="notification-icon deadline" />;
      case 'member':
        return <UserPlus className="notification-icon member" />;
      case 'comment':
        return <MessageSquare className="notification-icon comment" />;
      default:
        return <Bell className="notification-icon" />;
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="notifications-container" ref={panelRef}>
        <IconButton 
          className="bell-icon-container" 
          onClick={toggleNotifications}
          size="medium"
          color="inherit"
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            overlap="circular"
            className="mui-badge"
          >
            <Bell className="bell-icon" size={22} />
          </Badge>
        </IconButton>

        {isOpen && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      {getNotificationIcon(notification.type)}
                      <div className="notification-details">
                        <p className="notification-title">{notification.title}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <button 
                      className="remove-notification" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-notifications">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default NotificationsPanel; 