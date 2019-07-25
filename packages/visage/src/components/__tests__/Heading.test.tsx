import { render } from '@testing-library/react';
import React from 'react';
import { Heading } from '../Heading';
import { TestDesignSystem } from './DesignSystem';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <Heading>H1</Heading>
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0[data-level="1"] {
        font-size: 105px;
        line-height: 120px;
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="2"] {
        font-size: 66px;
        line-height: 72px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="3"] {
        font-size: 41px;
        line-height: 48px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="4"] {
        font-size: 26px;
        line-height: 48px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="5"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .emotion-0[data-level="6"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        font-style: italic;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .emotion-0[data-level="default"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        font-style: italic;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      <h1
          class="emotion-0"
          data-level="1"
        >
          H1
        </h1>
      </DocumentFragment>
    `);
  });

  it('determines host component based on level', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <Heading level={3}>H3</Heading>
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0[data-level="1"] {
        font-size: 105px;
        line-height: 120px;
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="2"] {
        font-size: 66px;
        line-height: 72px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="3"] {
        font-size: 41px;
        line-height: 48px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="4"] {
        font-size: 26px;
        line-height: 48px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .emotion-0[data-level="5"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .emotion-0[data-level="6"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        font-style: italic;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .emotion-0[data-level="default"] {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        font-style: italic;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      <h3
          class="emotion-0"
          data-level="3"
        >
          H3
        </h3>
      </DocumentFragment>
    `);
  });
});
