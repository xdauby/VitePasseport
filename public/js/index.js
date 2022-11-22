
//client js

async function showAppointment() {
  try {
    const response = await fetch('https://passportrapide33.herokuapp.com/rdv-passport')
      .then(res => { return res.json() })
      .then(value => {

        const mainContainer = document.getElementById('appt-list');
        mainContainer.innerHTML = '';

        const appointment_sorted = value.sort((a, b) => {
          return new Date(a.date) - new Date(b.date); // ascending
        });

        //append header
        var li_header = document.createElement("li");
        li_header.classList.add('table-header');

        var div1_header = document.createElement('div');
        var div2_header = document.createElement('div');
        var div3_header = document.createElement('div');
        var div4_header = document.createElement('div');

        div1_header.classList.add("col", "col-1");
        div2_header.classList.add("col", "col-2");
        div3_header.classList.add("col", "col-3");
        div4_header.classList.add("col", "col-4");

        div1_header.innerText = 'Mairie';
        div2_header.innerText = 'Date';
        div3_header.innerText = 'Heure';
        div4_header.innerText = 'Prendre Rendez-Vous';


        li_header.appendChild(div1_header);
        li_header.appendChild(div2_header);
        li_header.appendChild(div3_header);
        li_header.appendChild(div4_header);

        mainContainer.appendChild(li_header);

        //append each appointment to DOM
        for (cur_townhall of appointment_sorted) {

          var li = document.createElement("li");
          li.classList.add("table-row");

          var div1 = document.createElement('div');
          div1.setAttribute('data-label', 'Mairie');
          div1.classList.add("col", "col-1");
          div1.innerHTML = cur_townhall.townhall;

          var div2 = document.createElement('div');
          div2.setAttribute('data-label', 'Date');
          div2.classList.add("col", "col-2");
          div2.innerHTML = cur_townhall.date;

          var div3 = document.createElement('div');
          div3.setAttribute('data-label', 'Heure');
          div3.classList.add("col", "col-3");
          div3.innerHTML = cur_townhall.hours;

          var div4 = document.createElement('div');
          div4.classList.add("col", "col-4");
          div4.innerHTML = '<a href="' + cur_townhall.appt_link + '"class="btn-appt"'+ 'target="_blank"' +'>rdv</a>';

          li.appendChild(div1);
          li.appendChild(div2);
          li.appendChild(div3);
          li.appendChild(div4);

          mainContainer.appendChild(li);

        }
      });
    return await response.json();
  } catch (err) {
    const mute = err;
  }
}


//show appointment list when button is clicked
const btn_appointment = document.getElementById('appointment-btn');
const appt_header = document.getElementById('container');

btn_appointment.addEventListener('click', event => {
  showAppointment();
  setTimeout(() => {
    window.scrollTo(0, 870);
  }, 200);
});


