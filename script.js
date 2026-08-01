(() => {
  const form = document.querySelector('.wizard');
  const steps = [...document.querySelectorAll('.form-step')];
  const progress = [...document.querySelectorAll('.progress span')];
  const dateInput = document.getElementById('datum');
  const timeInput = document.getElementById('uhrzeit');
  const slotsBox = document.getElementById('slots');
  const slotWrap = document.querySelector('.slot-wrap');
  const summary = document.getElementById('summary');
  let current = 0;

  const slots = ['08:30','09:30','10:30','11:30','12:30','13:30','14:30','15:30','16:30'];
  const today = new Date(); today.setHours(0,0,0,0);
  const min = new Date(today); min.setDate(min.getDate() + 1);
  dateInput.min = min.toISOString().split('T')[0];

  const showStep = (index) => {
    current = index;
    steps.forEach((s,i) => s.classList.toggle('active', i === index));
    progress.forEach((p,i) => p.classList.toggle('active', i <= index));
    if (index === 2) buildSummary();
    form.scrollIntoView({behavior:'smooth', block:'start'});
  };

  const validateStep = (step) => {
    let ok = true;
    step.querySelectorAll('[required]').forEach((field) => {
      const valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '' && field.checkValidity();
      field.classList.toggle('error', !valid);
      if (!valid) ok = false;
    });
    if (step.dataset.step === '1' && !timeInput.value) { slotWrap.classList.add('invalid'); ok = false; }
    if (!ok) step.querySelector('.error, .invalid')?.scrollIntoView({behavior:'smooth', block:'center'});
    return ok;
  };

  document.querySelectorAll('.next').forEach(btn => btn.addEventListener('click', () => {
    if (validateStep(steps[current])) showStep(current + 1);
  }));
  document.querySelectorAll('.back').forEach(btn => btn.addEventListener('click', () => showStep(current - 1)));

  function renderSlots(){
    slotsBox.innerHTML = '';
    timeInput.value = '';
    slots.forEach(time => {
      const b = document.createElement('button'); b.type='button'; b.className='slot'; b.textContent=time;
      b.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected'); timeInput.value=time; slotWrap.classList.remove('invalid');
      });
      slotsBox.appendChild(b);
    });
  }
  renderSlots();

  dateInput.addEventListener('change', () => {
    if (!dateInput.value) return;
    const d = new Date(dateInput.value + 'T12:00:00');
    if (d.getDay() === 0 || d.getDay() === 6) {
      alert('Bitte wählen Sie einen Termin von Montag bis Freitag.');
      dateInput.value = '';
    }
  });

  form.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', () => el.classList.remove('error')));
  document.querySelectorAll('input[type=file]').forEach(input => input.addEventListener('change', () => {
    const span = input.parentElement.querySelector('span');
    span.textContent = input.files[0] ? input.files[0].name : 'Datei auswählen';
  }));

  function buildSummary(){
    const data = new FormData(form);
    summary.innerHTML = `<strong>Zusammenfassung</strong><br>${data.get('datum') || '–'} um ${data.get('uhrzeit') || '–'} Uhr<br>${data.get('fahrzeugmarke') || ''} ${data.get('modell') || ''}<br>${data.get('einsatzort') || ''}`;
  }

  form.addEventListener('submit', (e) => {
    if (!validateStep(steps[2])) e.preventDefault();
  });
})();
