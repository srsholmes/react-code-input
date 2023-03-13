import highlightjs from 'highlight.js';
import Prism from 'prismjs';

export type CodeInputProps = {
  prismJS?: typeof Prism;
  highlightjs?: typeof highlightjs;
  value: string;
  language: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoHeight?: boolean;
};
