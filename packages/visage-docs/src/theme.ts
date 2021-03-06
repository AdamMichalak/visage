import { ColorPalette } from '@byteclaw/visage';
import { createContext } from 'react';

export const ThemeTogglerContext = createContext<{
  colorPalette: ColorPalette;
  isDark: boolean;
  useDark(use: boolean): void;
  setColorPalette(colors: ColorPalette): void;
}>({} as any);

ThemeTogglerContext.displayName = 'ThemeToggler';

export function toggleColorPaletteMode(palette: ColorPalette): ColorPalette {
  return {
    ...palette,
    darkShades: palette.shades,
    darkShadesText: palette.shadesText,
    shades: palette.darkShades,
    shadesText: palette.darkShadesText,
  };
}
