let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    events: [
        // your list of events
    ]
});
ec.setOption('slotDuration', '01:00');
/*import EventCalendar from '@event-calendar/core';
let ec = new EventCalendar({
    target: document.getElementById('ec'),
    props: {
        plugins: [TimeGrid],
        options: {
            view: 'timeGridWeek',
            events: [
                "Evento1",
                "Evento2"
            ]
        }
    }
});*/
console.log(ec);