import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  export interface CardStyle {
    card: {
      backgroundColor: string;
    };
  }
}
