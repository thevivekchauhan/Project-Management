import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
  Badge,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { logout } from '../../../store/authSlice';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Messages from './Messages';
import Settings from './Settings';

const drawerWidth = {
  xs: '100%',
  sm: 280,
  md: 320,
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: `-${drawerWidth.sm}`,
      ...(open && {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: `-${drawerWidth.md}`,
      ...(open && {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    },
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${drawerWidth.sm})`,
    marginLeft: drawerWidth.sm,
    ...(open && {
      width: '100%',
      marginLeft: 0,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
  [theme.breakpoints.up('md')]: {
    width: `calc(100% - ${drawerWidth.md})`,
    marginLeft: drawerWidth.md,
    ...(open && {
      width: '100%',
      marginLeft: 0,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const EmployeeLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { text: 'Home', icon: <DashboardIcon />, path: '/employee' },
    { text: 'My Projects', icon: <AssignmentIcon />, path: '/employee/projects' },
    { text: 'Messages', icon: <MessageIcon />, path: '/employee/messages' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/employee/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Task Management
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
      </DrawerHeader>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: { xs: 40, sm: 48, md: 56 },
            height: { xs: 40, sm: 48, md: 56 },
            bgcolor: theme.palette.primary.main,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }
            }}
          >
            {user?.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {user?.role}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: { xs: 1, sm: 2 } }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              py: { xs: 1, sm: 1.5 },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: { xs: 36, sm: 40, md: 48 },
                color: location.pathname === item.path ? 'white' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBarStyled
        position="fixed"
        open={!isMobile && mobileOpen}
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ 
              mr: 2, 
              color: 'text.primary',
              display: { sm: 'none' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1, 
              color: 'text.primary',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Overview'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsMenuOpen}
                sx={{ color: 'text.primary' }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ color: 'text.primary' }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBarStyled>

      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth.sm, md: drawerWidth.md },
          flexShrink: { sm: 0 }
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: drawerWidth.xs, sm: drawerWidth.sm, md: drawerWidth.md },
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Main open={!isMobile && mobileOpen}>
        <DrawerHeader />
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100%',
          overflow: 'auto'
        }}>
          {location.pathname === '/employee' && <Dashboard />}
          {location.pathname === '/employee/projects' && <Projects />}
          {location.pathname === '/employee/messages' && <Messages />}
          {location.pathname === '/employee/settings' && <Settings />}
        </Box>
      </Main>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleNavigation('/employee/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsMenuAnchor}
        open={Boolean(notificationsMenuAnchor)}
        onClose={handleNotificationsMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: { xs: '100%', sm: 320 },
            maxWidth: '100vw',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="subtitle2">New task assigned</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2">Project deadline approaching</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2">New message from Sarah</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmployeeLayout;