import { describe, it, expect, vi } from 'vitest';
import { handleTabKey, handleEnterKey } from '../utils';
import type { KeyboardEvent } from 'react';

function makeTextarea(value: string, selStart: number, selEnd: number) {
  const el = document.createElement('textarea');
  el.value = value;
  el.selectionStart = selStart;
  el.selectionEnd = selEnd;
  return el;
}

function fakeKeyEvent(key: string, shiftKey = false) {
  return {
    key,
    shiftKey,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent<HTMLTextAreaElement>;
}

describe('handleTabKey', () => {
  it('inserts a tab at cursor position', () => {
    const el = makeTextarea('hello', 5, 5);
    const event = fakeKeyEvent('Tab');
    handleTabKey(event, el, el.value);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(el.value).toBe('hello\t');
    expect(el.selectionStart).toBe(6);
    expect(el.selectionEnd).toBe(6);
  });

  it('inserts a tab at the beginning', () => {
    const el = makeTextarea('hello', 0, 0);
    const event = fakeKeyEvent('Tab');
    handleTabKey(event, el, el.value);
    expect(el.value).toBe('\thello');
    expect(el.selectionStart).toBe(1);
  });

  it('inserts a tab in the middle of text', () => {
    const el = makeTextarea('hello world', 5, 5);
    const event = fakeKeyEvent('Tab');
    handleTabKey(event, el, el.value);
    expect(el.value).toBe('hello\t world');
    expect(el.selectionStart).toBe(6);
  });

  it('indents selected lines with tab', () => {
    const el = makeTextarea('line1\nline2\nline3', 0, 17);
    const event = fakeKeyEvent('Tab');
    handleTabKey(event, el, el.value);
    expect(el.value).toBe('\tline1\n\tline2\n\tline3');
  });

  it('dedents selected lines with shift+tab', () => {
    const el = makeTextarea('\tline1\n\tline2\n\tline3', 0, 20);
    const event = fakeKeyEvent('Tab', true);
    handleTabKey(event, el, el.value);
    expect(el.value).toBe('line1\nline2\nline3');
  });

  it('does nothing on shift+tab when no leading tabs', () => {
    const el = makeTextarea('line1\nline2', 0, 11);
    const event = fakeKeyEvent('Tab', true);
    handleTabKey(event, el, el.value);
    expect(el.value).toBe('line1\nline2');
  });
});

describe('handleEnterKey', () => {
  it('inserts a newline at the end', () => {
    const el = makeTextarea('hello', 5, 5);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(el.value).toBe('hello\n');
  });

  it('preserves indentation on new line', () => {
    const el = makeTextarea('\thello', 6, 6);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(el.value).toBe('\thello\n\t');
  });

  it('preserves multiple levels of indentation', () => {
    const el = makeTextarea('\t\thello', 7, 7);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(el.value).toBe('\t\thello\n\t\t');
  });

  it('inserts newline in the middle of text', () => {
    const el = makeTextarea('hello world', 5, 5);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(el.value).toBe('hello\n world');
  });

  it('handles indented line with cursor mid-line', () => {
    const el = makeTextarea('\thello world', 6, 6);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(el.value).toBe('\thello\n\t world');
  });

  it('handles multiline content', () => {
    const el = makeTextarea('line1\nline2\nline3', 11, 11);
    const event = fakeKeyEvent('Enter');
    handleEnterKey(event, el);
    expect(el.value).toBe('line1\nline2\n\nline3');
  });
});
