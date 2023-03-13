import highlightjs from 'highlight.js';
import Prism from 'prismjs';

import './themes/nord-highlight.css';
import './themes/nord-prism.css';
import styles from './App.module.css';
import './App.css';
import { CodeInput } from '../../dist/esm';

import { useEffect, useState } from 'react';
// import { CodeInput } from '@srsholmes/react-code-input';

// Syntax Highlight libraries to generate the tokens.
//  It's up to you to import them.
const libs = [
  import('prismjs/components/prism-markup'),
  import('prismjs/components/prism-typescript'),
  import('prismjs/components/prism-javascript'),
  import('prismjs/components/prism-jsx'),
  import('prismjs/components/prism-markup'),
  import('prismjs/components/prism-css'),
  import('highlight.js/lib/languages/typescript'),
  import('highlight.js/lib/languages/javascript'),
  import('highlight.js/lib/languages/css'),
];

const BEST_THEMES = [
  'atom-dark',
  'xonokai',
  'nord',
  'vsc-dark-plus',
  'synthwave84',
  'one-dark',
  'one-light',
  'material-dark',
  'material-light',
  'material-oceanic',
  'prism-one-dark',
  'darcula',
  'dracula',
  'duotone-dark',
  'duotone-earth',
  'duotone-forest',
  'duotone-light',
  'duotone-sea',
  'duotone-space',
];

const exampleCode = ``;

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

export function App() {
  const forceUpdate = useForceUpdate();

  // Our code input
  const [input, setInput] = useState(exampleCode);

  // Syntax Highlight libraries. It's up to you to import them.
  // CodeInput will use either library if you pass it in.
  const [loadedPrism, setLoadedPrism] = useState(false);
  const [loadedHighlight, setLoadedHighlight] = useState(true);
  const [languagePrism, setLanguagePrism] = useState('jsx');

  useEffect(() => {
    Promise.all(libs).then(() => {
      setLoadedPrism(true);
      setLoadedHighlight(true);
    });
  }, []);

  useEffect(() => {
    if (!loadedPrism) return;
    // return;
    // sleep 5 seconds to load
    return;
    new Promise((resolve) => setTimeout(resolve, 5000)).then(async () => {
      setInterval(async () => {
        const oldStyle = document.getElementById('theme');
        if (oldStyle) {
          document.head.removeChild(oldStyle);
        }
        const theme =
          BEST_THEMES[Math.floor(Math.random() * BEST_THEMES.length)];
        const res = await import(`./prism-themes/${theme}.css?raw`);
        const style = document.createElement('style');
        style.textContent = res.default;
        style.id = `theme`;
        document.head.appendChild(style);
        document.body.dataset.theme = theme;
        forceUpdate();
      }, 500);
    });
  }, [loadedPrism, loadedHighlight]);

  return (
    <div className={styles.app}>
      {loadedPrism ? (
        <CodeInput
          autoHeight={true}
          resize="both"
          placeholder="Input your code here..."
          prismJS={Prism}
          onChange={setInput}
          value={input}
          language={languagePrism}
        />
      ) : null}
    </div>
  );

  function LanguageSelect(props: {
    setLanguage: (language: string) => void;
    value: string;
  }) {
    return (
      <select
        className={styles.select}
        value={props.value}
        onInput={(e) => {
          props.setLanguage(e.currentTarget.value);
        }}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="jsx">JSX</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="json">JSON</option>
      </select>
    );
  }
}

export default App;
