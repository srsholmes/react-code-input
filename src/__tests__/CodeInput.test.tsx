import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeInput } from '../CodeInput/CodeInput';

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

const defaultProps = {
  value: 'const x = 1;',
  language: 'javascript',
  onChange: vi.fn(),
};

describe('CodeInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a textarea and pre element', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    const pre = container.querySelector('pre');
    expect(textarea).toBeInTheDocument();
    expect(pre).toBeInTheDocument();
  });

  it('displays the value in the textarea', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveValue('const x = 1;');
  });

  it('sets the language class on pre element', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const pre = container.querySelector('pre');
    expect(pre).toHaveClass('language-javascript');
  });

  it('renders with default placeholder', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Type code here...');
  });

  it('renders with custom placeholder', () => {
    const { container } = render(
      <CodeInput {...defaultProps} placeholder="Enter code..." />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter code...');
  });

  it('has spellCheck disabled on textarea', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
  });

  it('calls onChange when text is input', () => {
    const onChange = vi.fn();
    const { container } = render(
      <CodeInput {...defaultProps} onChange={onChange} />
    );
    const textarea = container.querySelector('textarea')!;
    fireEvent.input(textarea, { target: { value: 'const y = 2;' } });
    expect(onChange).toHaveBeenCalledWith('const y = 2;');
  });

  it('sets pre aria-hidden to true', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const pre = container.querySelector('pre');
    expect(pre).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies resize class when resize prop is set', () => {
    const { container } = render(
      <CodeInput {...defaultProps} resize="both" />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('resize-both');
  });

  it('applies no resize class when resize prop is not set', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).not.toContain('resize-');
  });

  it('applies different resize modes', () => {
    const { container, rerender } = render(
      <CodeInput {...defaultProps} resize="horizontal" />
    );
    let textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('resize-horizontal');

    rerender(<CodeInput {...defaultProps} resize="vertical" />);
    textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('resize-vertical');

    rerender(<CodeInput {...defaultProps} resize="none" />);
    textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('resize-none');
  });

  it('renders with prismJS and highlights code', () => {
    const mockPrism = {
      languages: {
        javascript: {},
      },
      highlight: vi.fn().mockReturnValue('<span class="token">const</span> x = 1;'),
      util: {
        encode: vi.fn().mockReturnValue('encoded'),
      },
    };
    const { container } = render(
      <CodeInput {...defaultProps} prismJS={mockPrism as any} />
    );
    const highlighted = container.querySelector('.code-highlighted');
    expect(highlighted?.innerHTML).toContain('<span class="token">const</span>');
    expect(mockPrism.highlight).toHaveBeenCalledWith(
      'const x = 1;',
      {},
      'javascript'
    );
  });

  it('uses prismJS encode when language is not found', () => {
    const mockPrism = {
      languages: {},
      highlight: vi.fn(),
      util: {
        encode: vi.fn().mockReturnValue('encoded-text'),
      },
    };
    const { container } = render(
      <CodeInput {...defaultProps} prismJS={mockPrism as any} />
    );
    expect(mockPrism.util.encode).toHaveBeenCalledWith('const x = 1;');
    expect(mockPrism.highlight).not.toHaveBeenCalled();
  });

  it('renders with highlightjs and highlights code', () => {
    const mockHighlightjs = {
      highlight: vi.fn().mockReturnValue({
        value: '<span class="hljs-keyword">const</span> x = 1;',
      }),
    };
    const { container } = render(
      <CodeInput
        {...defaultProps}
        highlightjs={mockHighlightjs as any}
      />
    );
    const highlighted = container.querySelector('.code-highlighted');
    expect(highlighted?.innerHTML).toContain('hljs-keyword');
    expect(mockHighlightjs.highlight).toHaveBeenCalledWith('const x = 1;', {
      language: 'javascript',
    });
  });

  it('renders empty when no highlighting library provided', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const highlighted = container.querySelector('.code-highlighted');
    expect(highlighted?.innerHTML).toBe('');
  });

  it('re-renders when value changes', () => {
    const { container, rerender } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveValue('const x = 1;');

    rerender(<CodeInput {...defaultProps} value="const y = 2;" />);
    expect(textarea).toHaveValue('const y = 2;');
  });

  it('re-renders when language changes', () => {
    const { container, rerender } = render(<CodeInput {...defaultProps} />);
    const pre = container.querySelector('pre');
    expect(pre).toHaveClass('language-javascript');

    rerender(<CodeInput {...defaultProps} language="typescript" />);
    expect(pre).toHaveClass('language-typescript');
  });

  it('handles Tab key press', () => {
    const onChange = vi.fn();
    const { container } = render(
      <CodeInput {...defaultProps} onChange={onChange} />
    );
    const textarea = container.querySelector('textarea')!;

    // Set cursor position
    Object.defineProperty(textarea, 'selectionStart', { value: 0, writable: true });
    Object.defineProperty(textarea, 'selectionEnd', { value: 0, writable: true });

    fireEvent.keyDown(textarea, { key: 'Tab' });
    expect(onChange).toHaveBeenCalled();
  });

  it('handles Enter key press', () => {
    const onChange = vi.fn();
    const { container } = render(
      <CodeInput {...defaultProps} onChange={onChange} />
    );
    const textarea = container.querySelector('textarea')!;

    Object.defineProperty(textarea, 'selectionStart', { value: 0, writable: true });
    Object.defineProperty(textarea, 'selectionEnd', { value: 0, writable: true });

    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();
  });

  it('syncs scroll between textarea and pre', () => {
    const { container } = render(<CodeInput {...defaultProps} />);
    const textarea = container.querySelector('textarea')!;
    const pre = container.querySelector('pre')!;

    Object.defineProperty(textarea, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(textarea, 'scrollLeft', { value: 50, writable: true });

    fireEvent.scroll(textarea);

    expect(pre.scrollTop).toBe(100);
    expect(pre.scrollLeft).toBe(50);
  });
});
