const EXAMPLE = {
  capacity: 10,
  items: [
    { name: 'Huerta comunitaria', weight: 4, value: 7 },
    { name: 'Biblioteca móvil', weight: 3, value: 5 },
    { name: 'Taller de tecnología', weight: 5, value: 9 },
    { name: 'Jornada deportiva', weight: 2, value: 4 },
  ],
};

const elements = {
  capacity: document.querySelector('#capacity'),
  items: document.querySelector('#items-list'),
  add: document.querySelector('#add-item'),
  example: document.querySelector('#load-example'),
  solve: document.querySelector('#solve'),
  empty: document.querySelector('#result-empty'),
  content: document.querySelector('#result-content'),
  error: document.querySelector('#error-message'),
  maxValue: document.querySelector('#max-value'),
  summary: document.querySelector('#capacity-summary'),
  bar: document.querySelector('#capacity-bar'),
  chosen: document.querySelector('#chosen-items'),
  count: document.querySelector('#chosen-count'),
  noProjects: document.querySelector('#no-projects'),
  table: document.querySelector('#table-container'),
  caption: document.querySelector('#table-caption'),
};

function addItem(item = { name: '', weight: 1, value: 0 }) {
  const row = document.createElement('div');
  row.className = 'item-row';

  const name = document.createElement('input');
  name.type = 'text';
  name.maxLength = 60;
  name.placeholder = 'Nombre';
  name.setAttribute('aria-label', 'Nombre del proyecto');
  name.value = item.name;
  name.required = true;

  const weight = document.createElement('input');
  weight.type = 'number';
  weight.min = '1';
  weight.max = '2000';
  weight.step = '1';
  weight.placeholder = 'Inversión';
  weight.title = 'Inversión (entero positivo)';
  weight.setAttribute('aria-label', 'Inversión del proyecto');
  weight.value = item.weight;
  weight.required = true;

  const value = document.createElement('input');
  value.type = 'number';
  value.min = '0';
  value.max = '1000000';
  value.step = '1';
  value.placeholder = 'Beneficio';
  value.title = 'Beneficio (entero no negativo)';
  value.setAttribute('aria-label', 'Beneficio del proyecto');
  value.value = item.value;
  value.required = true;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-button';
  remove.textContent = '×';
  remove.setAttribute('aria-label', 'Eliminar proyecto');
  remove.addEventListener('click', () => row.remove());

  row.append(name, weight, value, remove);
  elements.items.append(row);
}

function readForm() {
  const capacity = Number(elements.capacity.value);
  const items = [...elements.items.querySelectorAll('.item-row')].map((row) => {
    const fields = row.querySelectorAll('input');
    return {
      name: fields[0].value.trim(),
      weight: Number(fields[1].value),
      value: Number(fields[2].value),
    };
  });

  if (!Number.isInteger(capacity) || capacity < 0 || capacity > 2000) {
    throw new Error('El presupuesto debe ser un número entero entre 0 y 2.000.');
  }
  if (items.length > 30) {
    throw new Error('Se permiten como máximo 30 proyectos.');
  }
  if (items.some((item) => !item.name || !Number.isInteger(item.weight) || item.weight <= 0
      || !Number.isInteger(item.value) || item.value < 0)) {
    throw new Error('Revisa los proyectos: cada uno necesita nombre, inversión entera positiva y beneficio entero no negativo.');
  }
  return { capacity, items };
}

function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
}

function renderResult(result) {
  elements.empty.classList.add('hidden');
  elements.content.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.maxValue.textContent = result.maxValue.toLocaleString('es-CO');
  elements.summary.textContent = `${result.usedCapacity} / ${result.capacity}`;
  const percent = result.capacity === 0 ? 0 : (result.usedCapacity / result.capacity) * 100;
  elements.bar.style.width = `${percent}%`;
  elements.count.textContent = `${result.selectedItems.length} seleccionado${result.selectedItems.length === 1 ? '' : 's'}`;
  elements.chosen.replaceChildren();
  elements.noProjects.classList.toggle('hidden', result.selectedItems.length > 0);

  for (const item of result.selectedItems) {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = item.name;
    const details = document.createElement('small');
    details.textContent = `Inversión ${item.weight} · beneficio ${item.value}`;
    row.append(name, details);
    elements.chosen.append(row);
  }
  renderTable(result);
}

function renderTable(result) {
  const table = document.createElement('table');
  table.className = 'dp-table';
  const caption = document.createElement('caption');
  caption.className = 'hidden';
  caption.textContent = 'Resultados de la programación dinámica por cantidad de proyectos y presupuesto.';
  table.append(caption);

  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const corner = document.createElement('th');
  corner.scope = 'col';
  corner.textContent = 'Proyecto / c';
  headerRow.append(corner);
  for (let capacity = 0; capacity <= result.capacity; capacity += 1) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = capacity;
    headerRow.append(cell);
  }
  head.append(headerRow);
  table.append(head);

  const body = document.createElement('tbody');
  result.table.forEach((values, rowIndex) => {
    const row = document.createElement('tr');
    const label = document.createElement('th');
    label.scope = 'row';
    label.textContent = rowIndex === 0 ? 'Ninguno' : `${rowIndex}. ${result.items[rowIndex - 1].name}`;
    row.append(label);
    values.forEach((value, capacity) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (rowIndex === result.items.length && capacity === result.capacity) {
        cell.className = 'optimum';
        cell.setAttribute('aria-label', `Óptimo: ${value}`);
      }
      row.append(cell);
    });
    body.append(row);
  });
  table.append(body);
  elements.table.replaceChildren(table);
  elements.caption.textContent = `${result.items.length + 1} filas · ${result.capacity + 1} presupuestos · óptimo resaltado`;
}

elements.add.addEventListener('click', () => {
  if (elements.items.children.length >= 30) {
    showError('Ya alcanzaste el máximo de 30 proyectos.');
    return;
  }
  addItem();
  elements.error.classList.add('hidden');
});

elements.example.addEventListener('click', () => {
  elements.capacity.value = EXAMPLE.capacity;
  elements.items.replaceChildren();
  EXAMPLE.items.forEach(addItem);
  elements.error.classList.add('hidden');
});

elements.solve.addEventListener('click', async () => {
  elements.error.classList.add('hidden');
  let payload;
  try {
    payload = readForm();
  } catch (error) {
    showError(error.message);
    return;
  }

  elements.solve.disabled = true;
  elements.solve.textContent = 'Calculando…';
  try {
    const response = await fetch('/api/optimizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'El servidor no pudo resolver la solicitud.');
    }
    renderResult(result);
  } catch (error) {
    showError(error instanceof TypeError
      ? 'No se pudo conectar con el backend. Asegúrate de iniciar backend/app.py.'
      : error.message);
  } finally {
    elements.solve.disabled = false;
    elements.solve.innerHTML = 'Encontrar la mejor combinación <span aria-hidden="true">→</span>';
  }
});

EXAMPLE.items.forEach(addItem);
