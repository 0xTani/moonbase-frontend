import { cApp, c_SIDEBAR_BACKGROUND } from './colors';

export const NEXTPAGE_GRIDSTYLE = {
  minHeight: 'calc(100vh - 64px)',
  marginTop: '64px',
  padding: '30px 1rem 30px calc(250px + 1rem)',
};

export const sAPP_BAR = {
  backgroundColor: c_SIDEBAR_BACKGROUND,
  backgroundImage: 'none !important',
  zIndex: 5000,
  border: '2px #44447665',
  borderStyle: 'none none solid none',
};
export const sACCOUNT_BUTTON = {
  width: '160px',
  marginRight: '20px',
  cursor: 'default',
  '&:hover': { backgroundColor: 'transparent' },
  '&:active': { backgroundColor: 'transparent' },
};

export const sACCOUNT_BUTTON_WIDTH = { width: '140px' };

export const sHEART_BUTTON = {
  margin: '0 0 0 1rem ',
  height: '40px',
  width: '40px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
};

// @todo put everything in array
export function sHeartButton(isFavorite: boolean) {
  return {
    margin: '0 0 0 1rem ',
    height: '40px',
    width: '40px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: isFavorite ? '#d78' : '#ccc',
    '&:hover': { color: isFavorite ? '#945' : '#d78', backgroundColor: 'transparent' },
    '&:active': { boxShadow: 'none', color: '#a35' },
  };
}

export function LightDarkIconStyle(index: number) {
  return {
    // @todo dark mode toggle
    color: '#ccc',
    width: '40px',
    lenght: '40px',
    cursor: 'pointer',
    '&:hover': { color: index === 0 ? cApp.sidebar.lightIcon.hover : cApp.sidebar.darkIcon.hover },
    '&:active': {
      color: index === 0 ? cApp.sidebar.lightIcon.active : cApp.sidebar.darkIcon.active,
    },
  };
}

export const sApp = {
  sidebar: {
    box: {
      color: 'white',
      width: 250,
      backgroundColor: c_SIDEBAR_BACKGROUND,
      position: 'fixed',
      borderRight: `solid 1px ${cApp.sidebar.border}`,
      height: '100%',
      top: '64px',
      zIndex: 1000,
    },
    divider: { borderColor: cApp.sidebar.border },
  },
};
