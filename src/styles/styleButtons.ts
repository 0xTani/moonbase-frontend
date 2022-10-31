import { colorsButtons } from './colors';
import { sHelpers } from './HelperStyles';

// TAB BUTTON AND TRANSITION
const TAB_BUTTON_TRANSITION = 'background-color 0.5s ease';
export const sTAB_BUTTON = { width: '120px', transition: TAB_BUTTON_TRANSITION };

// expand button icon
export const sEXPAND_ICON_BUTTON = { cursor: 'pointer', '&:hover': { color: '#ccc' } };

// plus minus button (number field)
export const s_PLUS_MINUS_BUTTON = {
  height: '35px',
  minWidth: '35px',
  padding: '0 0 0 0',
  backgroundColor: '#111',
  borderRadius: '100px',
};

export const styleButtons = {
  notification: {
    width: '38px',
    height: '38px',
    position: 'absolute',
    transform: 'translateY(-30px)',
    backgroundColor: colorsButtons.notification.background,
    '&:hover': { backgroundColor: colorsButtons.notification.hover },
    ...sHelpers.fontWeight[600],
    color: colorsButtons.notification.color,
  },
  plusMinus: {
    height: '35px',
    minWidth: '35px',
    padding: '0 0 0 0',
    backgroundColor: '#111',
    borderRadius: '100px',
  },
};
