let today = new Date();
today.setDate(today.getDate() - today.getDay());
today = today.getFullYear() + "-" + _pad(today.getMonth() + 1) + "-" + _pad(today.getDate());

let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    height: '700px',
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'timeGridWeek,timeGridDay'
    },
    
    editable: true,
    locale: "es-ES",
    scrollTime: '8:00:00',
    events: createEvents(),
    eventClick: function (eventClickInfo) { },
    dateClick: function (dateClickInfo) {

        /*ec.addEvent({ start: "2023-05-30T12:00:00", end: "2023-05-30T16:00:00", color: "#FE6B64" });*/
        //Evento Popup
        var popup = document.getElementById('calendar-popup');
        var eventForm = document.getElementById('event-form');
        var event = document.getElementById('event');
        //Le doy la posición al popUp de donde se hizo click
        var topPosition = dateClickInfo.jsEvent.clientY;
        var leftPosition = dateClickInfo.jsEvent.clientX;
        eventForm.setAttribute("style", "top:" + topPosition + "px; left:" + (leftPosition - 150) + "px;");
        //Pendiente de que el popUp no se salga del contenedor
        //Aparece el PopUp
        popup.classList.toggle("show");
        eventForm.classList.toggle("show");
        //Le doy la fecha de inicio en donde se hizo click
        var dateTimeClickStart = dateClickInfo.dateStr;
        document.getElementById("event-start").setAttribute('value', dateTimeClickStart);
    },
    views: {
        timeGridWeek: { pointer: true },
        timeGridDay: { pointer: true },
    },
    dayMaxEvents: true,
    nowIndicator: true
})
var input = document.querySelector("#submit");

input.addEventListener('click', function () {

    var eventStart = document.querySelector("#event-start").value;
    var eventEnd = document.querySelector("#event-end").value;
    if (eventEnd == ""){
        eventEnd = moment(eventStart).add(30, 'm').format("YYYY-MM-DD[T]HH:mm"); 
    };
    var eventTitle = document.querySelector("#event-title").value;
    var eventDetails = document.querySelector("#event-details").value;

    const newEvent = {
        start: eventStart,
        end: eventEnd,
        title: eventTitle,
        display: eventDetails,
        color: '#2CAFC2'
    };
    //aaaaaaaaaaaaaaaaaah
    if (eventStart != "") {
        ec.addEvent(newEvent);
    }
});
/*
function createNewEvent() {
    var eventStart = document.querySelector("#event-start").value;
    var eventEnd = document.querySelector("#event-end").value;
    var eventTitle = document.querySelector("#event-title").value;
    var eventDetails = document.querySelector("#event-details").value;

    var newEvent = {
        start: eventStart,
        end: eventEnd,
        title: eventTitle,
        display: eventDetails
    };

};*/
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
        { start: days[0] + " 10:00", end: days[0] + " 14:00", title: "Descripción", color: "#FE6B64" },
        { start: days[1] + " 16:00", end: days[2] + " 08:00", title: "Descripción", color: "#B29DD9" },
    ];
}
function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}