import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
    sizes: {
      h1: { fontSize: '1.25rem', lineHeight: '2', fontWeight: "700" },    // 20px
      h2: { fontSize: '1.125rem', lineHeight: '1.5', fontWeight: "500" }, // 18px
      h3: { fontSize: '1rem', lineHeight: '1.5', fontWeight: "500" },     // 16px
      h4: { fontSize: '0.875rem', lineHeight: '1.25', fontWeight: "500" }, // 14px
      h5: { fontSize: '0.75rem', lineHeight: '1.25', fontWeight: "500" },  // 12px
      h6: { fontSize: '0.65rem', lineHeight: '1.25', fontWeight: "500" },  // 10.4px
    },
  },
  fontSizes: {
    xxs: '0.65rem',    // 10.4px
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    md: '1rem',        // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
  },
});
