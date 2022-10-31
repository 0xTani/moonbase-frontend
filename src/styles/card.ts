import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  export interface CardStyle {
    card: {
      backgroundColor: string;
    };
  }
}

export const s_TABLE_CARD = { textAlign: 'left' };
