import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import DashboardDrawer from '../component/dashboardDrawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { Link,useNavigate } from "react-router-dom";
import Profile from '../component/profile';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import MailIcon from '@mui/icons-material/Mail';
import { getJobAssign } from '../api/shovelDetails';
import { BASE_URL } from '../constants/apiConstants';
import AuthContext from '../context/AuthProvider';
import axios from "axios";
import { toast } from 'react-toastify';

const pages = [ 'New Jobs','Pending Jobs','Finished Jobs']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const AppBarContainer = ({selectedMenuItem,setDate}) => {
  const navigate = useNavigate();
  const { auth } = React.useContext(AuthContext)
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const { setAuth } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeDrawer = () => {
    setOpenDrawer(false)
  }

  const handleCloseNavMenu = () => {
    setOpenDrawer(true);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [selectedItem, setselectedItem] = React.useState()
  const HanldeSetting = (selecteditem) => {
    setselectedItem(selecteditem)
    if(selecteditem === "Dashboard"){
      navigate("/showRoutes")
    }
    if(selecteditem === "Logout"){
      // navigate("/Login")
      handleLogout()
    }
  }
  const handleLogout = async (event) => {
    // event.preventDefault();
    try {
      // Use async/await to wait for each request to complete
      const data = { userName: username, password: password }
      const response = await axios.post(`${BASE_URL}/api/auth/logout`, data, { withCredentials: true });
      const { accessToken, designation, empId, empTypeId } = response?.data;
      setAuth({ username, accessToken, designation, empId, empTypeId })
      navigate("/");
      console.log(response);
    } catch (error) {
      toast.error(<span>{error.response.data.message}</span>)
      console.log('Error Logging in', error);
      return;
    }
    console.log(`Logged Out username: ${username} and password: ${password}`);
  };

  const HandleBoolean = (item) => {
    setselectedItem(item)
  }

  const [JobAssigndata, setJobAssigndata] = React.useState([]);

  const showgetjobAssign  = async (key) => {
    const responsedata = await getJobAssign();
    setJobAssigndata(responsedata, key);
  };

  React.useEffect(() => {
    showgetjobAssign();
  }, []);

  const [Completejobs, setcompleteJobs] = React.useState()
  const [Pendingjobs, setPendingJobs] = React.useState()
  const [Assignedjobs, setAssignedJobs] = React.useState()

  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  React.useEffect(() => {
    const completejobs = JobAssigndata.filter((item)=> item.status === "Completed" && item.date == currentDate).map((item)=>item)
    const completedjobsLenght = completejobs?.length
    setcompleteJobs(completedjobsLenght)
    const assignedjobs = JobAssigndata.filter((item)=> item.status === "Assigned" && item.date == currentDate).map((item)=>item)
    const assignedjobsLenght = assignedjobs.length
    setAssignedJobs(assignedjobsLenght)
    const pendingjobs = JobAssigndata.filter((item)=> item.status === "In Progress" && item.date == currentDate).map((item)=>item)
    const pendingjobsLenght = pendingjobs.length
    setPendingJobs(pendingjobsLenght)
  }, [JobAssigndata, currentDate]);


  const [dateFilter, setDateFilter] = React.useState()
  React.useEffect(() => {
    // Set the initial date to today
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    setDateFilter(today);
    setDate(today);
  }, []);
  const HandleDateFilter = (e) => {
    setDateFilter(e.target.value)
    setDate(e.target.value)
  }
  console.log(dateFilter,"dateFilter")
 
  return (
    <AppBar style={{ 
            position: "fixed",
            height: "45px",
            // backgroundColor:'#fc9445'
            backgroundColor:'#ffffff'
            }}>
      <DashboardDrawer drawerOption="bottom" openDrawer={openDrawer} closeDrawer={closeDrawer} />
      <Container maxWidth="xl">
        
        <Toolbar disableGutters sx={{ display: 'flex',paddingBottom:'17px' }}>
        <Box
            style={{ display: 'flex', alignItems: 'center',justifyContent: 'center',  }} // Flexbox styles
          >
              <Link
                    to="/"
                    style={{cursor: 'pointer'}}
                  >
              <Box
                component="img"
                sx={{
                  height: 40,
                  // width: 125,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                  marginLeft:-1.5,
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                alt="logo."
                src="./Machoptic Final New Logo.png"
              />
            </Link>
          </Box> &nbsp;
          {/* <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingBottom: '0px',
            }}
          >
            MACHOPTIC
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },position:'relative',left:'1%',color:'#45ADFC' }}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            // href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              // display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              // letterSpacing: '.1rem',
              // color: '#F5831F',
              color: '#034661',
              // backgroundColor:'#1D9C9C',
              textDecoration: 'none',
              width:'80px'
            }}
          >
                 {selectedMenuItem}
          </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },position:'relative',left:'23.5%',color:'#45ADFC' }}>
              <MenuItem sx={{ color: 'white', display: 'flex',fontWeight: 700,fontSize: '1rem' }} >
              <Typography variant="body1" component="div">
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body1" component="span" className='text-dark'>
                  New Jobs
                <Badge badgeContent={Assignedjobs} color="secondary" >
                  <MailIcon color="action" />
                </Badge>
                </Typography>
              </Stack>
            </Typography>
            </MenuItem>
            <MenuItem sx={{ color: 'white', display: 'flex',fontWeight: 700,fontSize: '1rem' }}>
              <Typography variant="body1" component="div">
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body1" component="span" className='text-dark'>
                  Finished Jobs
                <Badge badgeContent={Completejobs} color="secondary" max={1000}>
                  <MailIcon color="action" />
                </Badge>
                </Typography>
              </Stack>
            </Typography>
                {/* <Typography textAlign="center" >{page}</Typography> */}
              </MenuItem>
            <MenuItem sx={{ color: 'white', display: 'flex',fontWeight: 700,fontSize: '1rem' }}>
              <Typography variant="body1" component="div">
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body1" component="span" className='text-dark'>
                    <input 
                      type="date" 
                      className="form-control" 
                      style={{ width: '', height: '30px', cursor: 'pointer' }} 
                      onChange={HandleDateFilter} 
                      value={dateFilter} 
                      disabled={
                          selectedMenuItem === "Administration" 
                          || selectedMenuItem === "Configuration" 
                          || selectedMenuItem === "Analytics - Machine Wise Report"
                          || selectedMenuItem === "Analytics - Material Data Report"
                          || selectedMenuItem === "Analytics - Job Status"
                          || selectedMenuItem === "Analytics - Material Production Report"
                          || selectedMenuItem === "Analytics - Gantt Charts"
                          || selectedMenuItem === "Analytics - DrillDown Analysis"
                          || selectedMenuItem === "Analytics - Priority Job"
                          || selectedMenuItem === "Analytics - Sensitivity Analysis"
                          || selectedMenuItem === null
                        }
                    />
                </Typography>
              </Stack>
            </Typography>
                {/* <Typography textAlign="center" >{page}</Typography> */}
              </MenuItem>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={() => HanldeSetting(setting)}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {selectedItem === "Profile" &&
        <div style={{
          width:'500px',
          height:'300px',
          background:'whitesmoke',
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999 // Adjust the z-index as needed
        }}>
          <div style={{position:'absolute',top:'0px',right:'5px',color:'red',fontSize:'xx-large'}}>&times;</div>
          <Profile onclickclose={HandleBoolean}/>
        </div>
      }
    </AppBar>
  )
}

export default AppBarContainer