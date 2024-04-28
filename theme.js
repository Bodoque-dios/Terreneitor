'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

/*
    * This is the theme file for the app. It contains the color palette and typography for the app.
*/

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const islight = false;

const theme = createTheme({
    palette: islight ?{
        mode: 'light',
        primary: {
          main: '#F8BC18',
        },
        secondary: {
          main: '#769A70',
        },
        warning: {
          main: '#ff9800',
        },
        error: {
          main: '#EA453C',
        },
        background: {
          default: '#F8FFEA',
          paper: '#FFFFFF',
        },
      } : {
        mode: 'dark',
        primary: {
          main: '#F8BC18',
        },
        secondary: {
          main: '#769A70',
        },
        warning: {
          main: '#ff9800',
        },
        error: {
          main: '#EA453C',
        },
        background: {
          default: '#17130B',
          paper: '#353027',
        },
      } ,
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});


export default theme;

// maybe dark primary: F8A818