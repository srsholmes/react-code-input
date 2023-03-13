// Put this in the chrome console to simulate typing in the textarea
// to record the demo
function simulateTyping(selector, text, delay) {
  // Get the input element
  const input = document.querySelector(selector);

  // Make sure the input element exists
  if (!input) {
    console.error(`Input element with selector ${selector} not found`);
    return;
  }
  const randomDelay = delay * (1 + Math.random() - 0.5);

  // Loop through each character in the text
  for (let i = 0; i < text.length; i++) {
    // Set a timeout to simulate typing delay
    setTimeout(() => {
      // Get the current value of the input element
      const currentValue = input.value;

      // Append the current character to the input element value
      input.value = currentValue + text[i];

      // Dispatch an input event to trigger any listeners
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }, randomDelay * i);
  }
}

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
  .render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
`;

simulateTyping('textarea', exampleCode, 20);
