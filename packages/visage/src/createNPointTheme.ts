import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import { getResponsiveValue, ScaleValue } from '@byteclaw/visage-utils';
import ModularScale, { ratios } from 'modular-scale';
import React from 'react';
import { colorCssProperties } from './shared';

export { ratios };

export interface StyleProps extends React.CSSProperties {
  /**
   * Calculates fontSize and lineHeight to be the same (based on modular scale = lineHeight)
   * This is needed if wan't bigger icon than fontSize for given lineHeight (sets them to same value)
   */
  iconSize?: number | string;
  /**
   * Use same value as for line height to set a height of an element
   */
  linedHeight?: number | string;
  /**
   * Use same value as for line height to set a width of an element
   */
  linedWidth?: number | string;
  m?: string | number;
  my?: string | number;
  mx?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  p?: string | number;
  py?: string | number;
  px?: string | number;
  pb?: string | number;
  pl?: string | number;
  plOffset?: string | number;
  prOffset?: string | number;
  pr?: string | number;
  pt?: string | number;
}

interface NPointThemeSettings extends ThemeSettings {
  baseFontSize: number | ScaleValue<number>;
  baseLineHeightRatio: number;
  baselineGridSize: number;
  fontScaleRatio: number;
  colors: {
    bodyText: string | ScaleValue<string>;
    dangerBodyText: string | ScaleValue<string>;
    danger: ScaleValue<string>;
    dangerText: string | ScaleValue<string>;
    neutral: string | ScaleValue<string>;
    neutralText: string | ScaleValue<string>;
    primary: string | ScaleValue<string>;
    primaryText: string | ScaleValue<string>;
    success: ScaleValue<string>;
    successText: string | ScaleValue<string>;
    warning: ScaleValue<string>;
    warningText: string | ScaleValue<string>;
  };
  fontFamilies: {
    body: string;
    heading: string;
    [name: string]: string;
  };
}

export function createNPointTheme(settings: NPointThemeSettings) {
  const modularScaleSettings = (typeof settings.baseFontSize === 'number'
    ? [settings.baseFontSize]
    : settings.baseFontSize.values
  ).map(baseFontSize => {
    const modularScale = ModularScale({
      base: baseFontSize,
      ratio: settings.fontScaleRatio,
    });
    const baseLineHeight = baseFontSize * settings.baseLineHeightRatio;
    const alignedBaseLineHeight =
      Math.round(baseLineHeight / settings.baselineGridSize) *
      settings.baselineGridSize;

    return {
      modularScale,
      baseLineHeight,
      alignedBaseLineHeight,
    };
  });

  return createTheme<any, 'gridSize' | 'modularSize' | 'modularLineHeight'>({
    resolvers: {
      // this is pseudostyler used to compute sizes based on grid size (basically multipliers)
      gridSize(value) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          return settings.baselineGridSize * numericValue;
        }
        return value;
      },
      modularSize(value, _, breakpoint) {
        const numericValue = Number(value);
        const { modularScale } = getResponsiveValue(
          breakpoint,
          modularScaleSettings as any,
        );

        if (!Number.isNaN(numericValue)) {
          return modularScale(numericValue);
        }

        return value;
      },
      modularLineHeight(value, { resolve }, breakpoint) {
        const numericValue = Number(value);
        const { alignedBaseLineHeight } = getResponsiveValue(
          breakpoint,
          modularScaleSettings as any,
        );

        if (!Number.isNaN(numericValue)) {
          const modularSize = resolve('modularSize', value, breakpoint);

          const lineHeightCoefficient = Math.ceil(
            modularSize / alignedBaseLineHeight,
          );
          const alignedLineHeight =
            lineHeightCoefficient * alignedBaseLineHeight;

          return alignedLineHeight;
        }

        return value;
      },
    },
    stylers: {
      ...colorCssProperties.reduce(
        (acc, cssProp) => ({
          ...acc,
          [cssProp]: {
            themeKey: 'colors',
          },
        }),
        {},
      ),
      fontFamily: {
        themeKey: 'fontFamilies',
      },
      fontSize: {
        format: 'px',
        resolver: 'modularSize',
      },
      /**
       * Calculates fontSize and lineHeight for svg icons
       */
      iconSize: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['fontSize', 'lineHeight'],
      },
      lineHeight: {
        format: 'px',
        resolver: 'modularLineHeight',
      },
      /**
       * Calculates a height based similarly to lineHeight
       */
      linedHeight: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['height'],
      },
      linedWidth: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['width'],
      },
      m: { format: 'px', resolver: 'gridSize', outputProps: ['margin'] },
      margin: { format: 'px', resolver: 'gridSize' },
      my: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginTop', 'marginBottom'],
      },
      mx: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginLeft', 'marginRight'],
      },
      mb: { format: 'px', resolver: 'gridSize', outputProps: ['marginBottom'] },
      marginBottom: { format: 'px', resolver: 'gridSize' },
      marginLeft: { format: 'px', resolver: 'gridSize' },
      marginRight: { format: 'px', resolver: 'gridSize' },
      marginTop: { format: 'px', resolver: 'gridSize' },
      ml: { format: 'px', resolver: 'gridSize', outputProps: ['marginLeft'] },
      mr: { format: 'px', resolver: 'gridSize', outputProps: ['marginRight'] },
      mt: { format: 'px', resolver: 'gridSize', outputProps: ['marginTop'] },
      p: { format: 'px', resolver: 'gridSize', outputProps: ['padding'] },
      padding: { format: 'px', resolver: 'gridSize' },
      py: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingTop', 'paddingBottom'],
      },
      px: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingLeft', 'paddingRight'],
      },
      paddingBottom: { format: 'px', resolver: 'gridSize' },
      paddingLeft: { format: 'px', resolver: 'gridSize' },
      paddingRight: { format: 'px', resolver: 'gridSize' },
      paddingTop: { format: 'px', resolver: 'gridSize' },
      pb: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingBottom'],
      },
      pl: { format: 'px', resolver: 'gridSize', outputProps: ['paddingLeft'] },
      pr: { format: 'px', resolver: 'gridSize', outputProps: ['paddingRight'] },
      pt: { format: 'px', resolver: 'gridSize', outputProps: ['paddingTop'] },
      plOffset: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['paddingLeft'],
      },
      prOffset: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['paddingRight'],
      },
    },
    theme: settings,
  });
}
