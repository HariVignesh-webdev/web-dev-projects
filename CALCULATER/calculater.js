document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.display');
  const deleteBtn = document.getElementById('delete');

  // Create a screen span since the HTML has none, insert before the delete button
  const screen = document.createElement('span');
  screen.id = 'screen';
  screen.style.color = 'whitesmoke';
  screen.style.fontSize = '2rem';
  screen.style.marginRight = '10px';
  screen.style.overflowX = 'auto';
  screen.style.whiteSpace = 'nowrap';
  screen.textContent = '0';
  display.insertBefore(screen, deleteBtn);

  let expression = '';

  function updateScreen() {
    screen.textContent = expression === '' ? '0' : expression;
  }

  function calculate() {
    if (expression.trim() === '') return;

    // Only allow safe characters before evaluating
    if (!/^[0-9+\-*/.()]*$/.test(expression)) {
      screen.textContent = 'Syntax Error';
      expression = '';
      return;
    }

    try {
      const result = Function('"use strict"; return (' + expression + ')')();

      if (result === Infinity || result === -Infinity) {
        screen.textContent = "Can't divide by 0";
        expression = '';
        return;
      }
      if (Number.isNaN(result)) {
        screen.textContent = 'Syntax Error';
        expression = '';
        return;
      }

      // Round off floating point errors
      expression = String(Math.round(result * 1e10) / 1e10);
      updateScreen();
    } catch (err) {
      screen.textContent = 'Syntax Error';
      expression = '';
    }
  }

  const buttons = document.querySelectorAll('.buttons button');

  buttons.forEach(btn => {
    const label = btn.textContent.trim();

    btn.addEventListener('click', () => {
      // Clear
      if (btn.id === 'c') {
        expression = '';
        updateScreen();
        return;
      }

      switch (label) {
        case '=':
          calculate();
          return;

        case '+/-':
          expression = expression.startsWith('-')
            ? expression.slice(1)
            : '-' + expression;
          updateScreen();
          return;

        case '%':
          if (expression === '') return;
          try {
            const val = Function('"use strict"; return (' + expression + ')')() / 100;
            expression = String(val);
          } catch {
            expression = '';
            screen.textContent = 'Syntax Error';
            return;
          }
          updateScreen();
          return;

        case '()':
          // Toggle: open paren if last char is an operator or empty, else close
          const lastChar = expression.slice(-1);
          if (expression === '' || '+-*/('.includes(lastChar)) {
            expression += '(';
          } else {
            expression += ')';
          }
          updateScreen();
          return;

        case '÷':
          expression += '/';
          updateScreen();
          return;

        case '×':
          expression += '*';
          updateScreen();
          return;

        case '+':
        case '-':
          expression += label;
          updateScreen();
          return;

        default:
          // digits and "."
          expression += label;
          updateScreen();
          return;
      }
    });
  });

  // Delete button in the display = backspace
  deleteBtn.addEventListener('click', () => {
    expression = expression.slice(0, -1);
    updateScreen();
  });
});