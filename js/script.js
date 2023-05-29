let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    height: '700px',
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'timeGridWeek,timeGridDay'
    },
    events: [
        {
            title: 'Evento 1',
            start: '2023-05-26T10:30:00',
            end: '2023-05-26T12:00:00'
        }
    ],
    editable: true,
    scrollTime: '10:00:00',
    events: createEvents(),
    dateClick: function (dateClickInfo) {
        
        ec.addEvent({ start: dateClickInfo.dateStr.split('T')[0] + " 07:30", end: dateClickInfo.dateStr.split('T')[0] + " 17:30", color: "#FE6B64" })
    },
    views: {
        timeGridWeek: { pointer: true },
        timeGridDay: { pointer: true },
    },
    dayMaxEvents: true,
    nowIndicator: true,
    selectable: true
});
//Función para abrir ventana emergente para añadir un evento nuevo.
function createNewEvent() {
    /*var dateStr = prompt('Introduce una fecha (YYYY-MM-DD)');
    var date = new Date(dateStr + 'T00:00:00'); // will be in local time

    if (!isNaN(date.valueOf())) { // valid?
        ec.addEvent(events[{ // this object will be "parsed" into an Event Object
            title: 'Evento 1', // a property!
            start: '2023-05-26T10:30:00', // a property!
            end: '2023-05-26T12:00:00' // a property! ** see important note below about 'end' **
        }])
        /*{start: days[0] + " 00:00", end: days[0] + " 09:00", resourceId: 1, display: "background"}*/
    //alert('Great. Now, update your database...');
    /*} else {
        alert('Invalid date.');
    }*/
}
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
        { start: days[0] + " 00:00", end: days[0] + " 09:00", resourceId: 1, display: "background" }
    ];
}
function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}