import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const routes = [
    { key: 'membercard1', label: 'Member Card', route: '/membercard' },
    { key: 'organizations1', label: 'Organizations', route: '/organizations' },
    { key: 'settings1', label: 'User Settings', route: '/settings' },
    { key: 'rules1', label: 'Rules', route: '/rules' },
    { key: 'events1', label: 'Events', route: '/events' },
    { key: 'pop1', label: 'Buy Pop', route: '/pop' },
    // { key: '', label: '', route: '/' },
  ];

  return (
    <Box
      sx={{
        color: 'white',
        width: 250,
        backgroundColor: '#001e3c',
        position: 'fixed',
        borderRight: 'solid 1px rgba(145,165,180,.3)',
        height: '100%',
        top: '56px',
      }}
    >
      <List>
        {routes.map((route, i) => {
          return (
            <div key={route.key + i}>
              <ListItem
                button
                onClick={() => {
                  console.log(route.key + ' clicked');
                }}
              >
                {/* <ListItemIcon>
                  <img style={{ width: '25px', height: '25px' }} src={account.imageUrl}></img>
                  </ListItemIcon> */}
                <ListItemText primary={route.label} />
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(145,165,180,.3)' }} />
            </div>
          );
        })}
      </List>
    </Box>
  );
}
