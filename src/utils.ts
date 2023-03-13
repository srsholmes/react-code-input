/* Original Code written by Oliver Geer (WebCoder49) */
// https://github.com/WebCoder49/code-input/blob/main/plugins/indent.js

import React from 'react';

export function handleTabKey(
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  input_element: HTMLTextAreaElement,
  code: string
) {
  event.preventDefault(); // stop normal

  if (
    !event.shiftKey &&
    input_element.selectionStart == input_element.selectionEnd
  ) {
    // Shift always means dedent - this places a tab here.
    let before_selection = code.slice(0, input_element.selectionStart); // text before tab
    let after_selection = code.slice(
      input_element.selectionEnd,
      input_element.value.length
    ); // text after tab

    let cursor_pos = input_element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    input_element.value = before_selection + '\t' + after_selection; // add tab char

    // move cursor
    input_element.selectionStart = cursor_pos;
    input_element.selectionEnd = cursor_pos;
  } else {
    let lines = input_element.value.split('\n');
    let letter_i = 0;

    let selection_start = input_element.selectionStart; // where cursor moves after tab - moving forward by 1 indent
    let selection_end = input_element.selectionEnd; // where cursor moves after tab - moving forward by 1 indent

    let number_indents = 0;
    let first_line_indents = 0;

    for (let i = 0; i < lines.length; i++) {
      letter_i += lines[i].length + 1; // newline counted
      if (
        input_element.selectionStart <= letter_i &&
        input_element.selectionEnd >= letter_i - lines[i].length
      ) {
        // Starts before or at last char and ends after or at first char
        if (event.shiftKey) {
          if (lines[i][0] == '\t') {
            // Remove first tab
            lines[i] = lines[i].slice(1);
            if (number_indents == 0) first_line_indents--;
            number_indents--;
          }
        } else {
          lines[i] = '\t' + lines[i];
          if (number_indents == 0) first_line_indents++;
          number_indents++;
        }
      }
    }
    input_element.value = lines.join('\n');

    // move cursor
    input_element.selectionStart = selection_start + first_line_indents;
    input_element.selectionEnd = selection_end + number_indents;
  }
}

export function handleEnterKey(
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  input_element: HTMLTextAreaElement
) {
  event.preventDefault();
  let lines = input_element.value.split('\n');
  let letter_i = 0;
  let current_line = lines.length - 1;
  let new_line = '';
  let number_indents = 0;

  // find the index of the line our cursor is currently on
  for (let i = 0; i < lines.length; i++) {
    letter_i += lines[i].length + 1; // newline counted
    if (input_element.selectionStart <= letter_i) {
      current_line = i;
      break;
    }
  }

  // count the number of indents the current line starts with (up to our cursor position in the line)
  let cursor_pos_in_line =
    lines[current_line].length - (letter_i - input_element.selectionEnd) + 1;
  for (let i = 0; i < cursor_pos_in_line; i++) {
    if (lines[current_line][i] == '\t') {
      number_indents++;
    } else {
      break;
    }
  }

  // determine the text before and after the cursor and chop the current line at the new line break
  let text_after_cursor = '';
  if (cursor_pos_in_line != lines[current_line].length) {
    text_after_cursor = lines[current_line].substring(cursor_pos_in_line);
    lines[current_line] = lines[current_line].substring(0, cursor_pos_in_line);
  }

  // insert our indents and any text from the previous line that might have been after the line break
  for (let i = 0; i < number_indents; i++) {
    new_line += '\t';
  }
  new_line += text_after_cursor;

  // save the current cursor position
  let selection_start = input_element.selectionStart;
  let selection_end = input_element.selectionEnd;

  // splice our new line into the list of existing lines and join them all back up
  lines.splice(current_line + 1, 0, new_line);
  input_element.value = lines.join('\n');

  // move cursor to new position
  input_element.selectionStart = selection_start + number_indents + 1; // count the indent level and the newline character
  input_element.selectionEnd = selection_end + number_indents + 1;
}
