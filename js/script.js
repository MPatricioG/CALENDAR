let today = new Date();
var popup = document.getElementById('calendar-popup');
var eventForm = document.getElementById('event-form');
var input = document.querySelector("#submit");
today.setDate(today.getDate() - today.getDay());
today = today.getFullYear() + "-" + _pad(today.getMonth() + 1) + "-" + _pad(today.getDate());
var newEventCustom={};
let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    height: '700px',
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'timeGridWeek,timeGridDay,dayGridMonth '
    },
    editable: true,
    locale: "es-ES",
    scrollTime: '8:00:00',
    events: createEvents(),
    dateClick: function (dateClickInfo) {
        //Evento Popup
        //Le doy la posición al popUp de donde se hizo click
        var topPosition = dateClickInfo.jsEvent.clientY;
        var leftPosition = dateClickInfo.jsEvent.clientX;
        eventForm.setAttribute("style", "top:" + topPosition + "px; left:" + (leftPosition - 150) + "px;");
        //Pendiente de que el popUp no se salga del contenedor
        //Aparece el PopUp
        eventForm.classList.toggle("show");
        popup.classList.toggle("show");
        //Le doy la fecha de inicio en donde se hizo click
        var dateTimeClickStart = dateClickInfo.dateStr;
        console.log(document.getElementById("event-start"));
        document.getElementById("event-start").setAttribute('value', dateTimeClickStart);
        //Añado 30 min al evento por defecto y prevengo que se haga click en una fecha pasada
        var dateTimeClickEnd=moment(dateTimeClickStart).add(30, 'm').format("YYYY-MM-DD[T]HH:mm");
        document.getElementById("event-end").setAttribute('min', dateTimeClickEnd);
        document.getElementById("event-end").setAttribute('value', dateTimeClickEnd);
    },
    views: {
        timeGridWeek: { pointer: true },
        timeGridDay: { pointer: true },
    },
    dayMaxEvents: true,
    nowIndicator: true
})
//Se añade el evento al hacer click en el formulario
input.addEventListener('click', function () {
    var popup = document.getElementById('calendar-popup');
    var eventForm = document.getElementById('event-form');
    var eventStart = document.querySelector("#event-start").value;
    var eventEnd = document.querySelector("#event-end").value;
    if (eventEnd == ""){
        eventEnd = moment(eventStart).add(30, 'm').format("YYYY-MM-DD[T]HH:mm"); 
    };
    var eventTitle = document.querySelector("#event-title").value;

    newEventCustom = {
        start: eventStart,
        end: eventEnd,
        title: eventTitle,
        color: '#2CAFC2'
    };
    //aaaaaaaaaaaaaaaaaahporquenova
    if (eventStart != "") {
        //Oculta el popUp
        popup.classList.remove('show');
        eventForm.classList.remove('show');
        //Añado el nuevo evento
        return ec.addEvent(newEventCustom);
    }
});
//Función para crear eventos al iniciar el calendario.
function createEvents() {
    let days = [];
    for (let i = 0; i < 7; ++i) {
        let day = new Date();
        let diff = i - day.getDay();
        day.setDate(day.getDate() + diff);
        days[i] = day.getFullYear() + "-" + _pad(day.getMonth() + 1) + "-" + _pad(day.getDate());
    }
    return [
        { start: days[0] + " 00:00", end: days[0] + " 09:00", display: "background" },
        { start: days[1] + " 12:00", end: days[1] + " 14:00", display: "background" },
        { start: days[0] + " 10:00", end: days[0] + " 14:00", titleHTML: "Título", color: "#FE6B64" },
        { start: days[1] + " 16:00", end: days[2] + " 08:00", title: "Título", color: "#B29DD9" },
    ];
}
function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}
