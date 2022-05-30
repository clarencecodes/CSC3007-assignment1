async function loadData(url, table) {
  const tableHead = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');
  const response = await fetch(url);
  const { region_metadata, items } = await response.json();

  // Remove existing contents from table
  tableHead.innerHTML = '<tr></tr>';
  tableBody.innerHTML = '';

  // Populate headers
  const headerElement = document.createElement('th');
  headerElement.textContent = 'Metric';
  tableHead.querySelector('tr').appendChild(headerElement);

  for (const region of region_metadata) {
    const headerElement = document.createElement('th');

    headerElement.textContent = region.name.replace(/^\w/, c =>
      c.toUpperCase()
    );
    tableHead.querySelector('tr').appendChild(headerElement);
  }

  // Populate metrics into body
  const metric_names = Object.keys(items[0].readings);
  const metric_values = Object.values(items[0].readings);
  for (let i = 0; i < metric_names.length; i++) {
    metric_name = metric_names[i];
    metric_value = Object.values(metric_values[i]);
    const rowElement = document.createElement('tr');
    rowElement.textContent = metric_name;
    tableBody.appendChild(rowElement);

    for (const val of metric_value) {
      const cellElement = document.createElement('td');
      cellElement.textContent = val;
      rowElement.appendChild(cellElement);
    }
  }

  // Update timestamp
  const timestamp = Date.parse(items[0].timestamp);
  const date = new Date(timestamp);
  document.getElementById('timestamp').textContent =
    'PSI readings updated on: ' + date.toLocaleString();
}

loadData(
  'https://api.data.gov.sg/v1/environment/psi',
  document.querySelector('table')
);
