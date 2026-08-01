const dateInput = document.querySelector('#datum');
const timeSelect = document.querySelector('#uhrzeit');

function isoDate(date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().split('T')[0];
}

function buildTimes() {
  const times = [];
  for (let hour = 8; hour <= 16; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 8 && minute === 0) continue;
      times.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  times.push('17:00');
  for (const time of times) {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = `${time} Uhr`;
    timeSelect.appendChild(option);
  }
}

const today = new Date();
dateInput.min = isoDate(today);
buildTimes();

dateInput.addEventListener('change', () => {
  const [year, month, day] = dateInput.value.split('-').map(Number);
  const selected = new Date(year, month - 1, day);
  const weekday = selected.getDay();
  if (weekday === 0 || weekday === 6) {
    alert('Bitte wählen Sie einen Termin von Montag bis Freitag.');
    dateInput.value = '';
  }
});
