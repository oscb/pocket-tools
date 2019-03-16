/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from "@emotion/css";

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Alegreya+Sans|Roboto+Slab:700');

  /* Reset Styles */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* App Specific styles */
  body {
    background: rgba(247, 247, 243, 1);
    color: rgba(39, 94, 132, 1);
    margin: 0;
    padding: 0;
    font-size: 14px;
  }

  b {
    font-weight: bold;
  }

  i {
    font-style: italic;
  }

  p {
    font-size: 1em; /* 14px */
    line-height: 1.4286em; /* 20px */
    margin: 0 0 1.4286em 0;
  }

  h1 {
    font-size: 1.8571em; /* 26px */
    line-height: 1.5385em; /* 40px */
    margin-top: 0.7692em;  margin-bottom: 0.0000em;
  }

  h2 {
    font-size: 1.7143em; /* 24px */
    line-height: 1.6667em; /* 40px */
    margin-top: 0.8333em;  margin-bottom: 0.0000em;
  }

  h3 {
    font-size: 1.5714em; /* 22px */
    line-height: 1.8182em; /* 40px */
    margin-top: 0.9091em;  margin-bottom: 0.0000em;
  }

  h4 {
    font-size: 1.4286em; /* 20px */
    line-height: 1.0000em; /* 20px */
    margin-top: 1.0000em;  margin-bottom: 0.0000em;
  }

  h5 {
    font-size: 1.2857em; /* 18px */
    line-height: 1.1111em; /* 20px */
    margin-top: 1.1111em;  margin-bottom: 0.0000em;
  }

  h6 {
    font-size: 1.1429em; /* 16px */
    line-height: 1.2500em; /* 20px */
    margin-top: 1.2500em;  margin-bottom: 0.0000em;
  }
`