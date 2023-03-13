import highlightjs from 'highlight.js';
import Prism from 'prismjs';

import './themes/nord-highlight.css';
import './themes/nord-prism.css';
import styles from './App.module.css';
import { CodeInput } from '../../dist/esm';
import { useEffect, useState } from 'react';

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

const exampleCode = `import React from 'react';
import ReactDOM from 'react-dom/client'
import { useState } from 'react';
import Prism from 'prismjs';
import { CodeInput } from '@srsholmes/react-code-input';

function App() {
  const [input, setInput] = useState('const hello = "world";');
  return (
    <CodeInput
      placeholder="Input your code here..."
      prismJS={Prism}
      onChange={setInput}
      language={'typescript'}
      autoHeight={true}
      resize="both"
      value={input}
    />
  );
}

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(<App />)
`;

export function App() {
  // Our code input
  const [input, setInput] = useState(exampleCode);

  // Syntax Highlight libraries. It's up to you to import them.
  // CodeInput will use either library if you pass it in.
  const [loadedPrism, setLoadedPrism] = useState(false);
  const [loadedHighlight, setLoadedHighlight] = useState(true);
  const [languagePrism, setLanguagePrism] = useState('jsx');
  const [languageHighlight, setLanguageHighlight] = useState('typescript');

  useEffect(() => {
    Promise.all(libs).then(() => {
      setLoadedPrism(true);
      setLoadedHighlight(true);
    });
  }, []);

  return (
    <div className={styles.app}>
      <h1 className={styles.heading}>React Code Input Demo</h1>
      <div>
        <h2>PrismJS</h2>
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

        <LanguageSelect setLanguage={setLanguagePrism} value={languagePrism} />
      </div>
      <div>
        <h2>Highlight.js</h2>
        {loadedHighlight ? (
          <CodeInput
            autoHeight={true}
            resize="both"
            placeholder="Input your code here..."
            highlightjs={highlightjs}
            onChange={setInput}
            value={input}
            language={languageHighlight}
          />
        ) : null}
        <LanguageSelect
          setLanguage={setLanguageHighlight}
          value={languageHighlight}
        />
      </div>
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
