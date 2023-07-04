let today = new Date();
//Formulario
var newEventPopup = document.getElementById('newEvent-popup');
var newEventForm = document.getElementById('newEvent-form');
//Evento
var eventPopup = document.getElementById('event-popup');
var eventDisplay = document.getElementById('event-display');

var input = document.getElementById("submit");
var editEventInput = document.getElementById("edit-event");
var closeBtn = document.getElementById('btn-close');
var isEvent = new Boolean(false);
let color = {
    "orange": "var(--color-orange)",
    "blue": "var(--color-blue)",
    "green": "var(--color-green)",
};
var colorEvent;
today.setDate(today.getDate() - today.getDay());
today = today.getFullYear() + "-" + _pad(today.getMonth() + 1) + "-" + _pad(today.getDate());

var newEventCustom = {};

let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    firstDay: 1,
    height: '800px',
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'timeGridWeek,timeGridDay,dayGridMonth '
    },
    dayMaxEvents:true,
    editable: true,
    unselectAuto: false,
    locale: "es-ES",
    scrollTime: '8:00:00',
    events: createEvents(),
    selectable: true,
    eventDrop: function (info) {//actualizo localstorage cambiando las horas del evento
        updateLocalStorage(info);
    },
    eventResize: function (info) {//actualizo localstorage cambiando las horas del evento
        updateLocalStorage(info);
    },
    eventContent: function (info) {//cambia el contenido del evento para añadir el botón para eliminar
        //Añado botón para borrar
        closeBtn = document.getElementById("btn-delete");
        var title= reSanitize(info.event.title);
        var deleteBtn = {
            html: '<div class="ec-event-time">' + info.timeText + '<button type="button" id="btn-delete" class="btn-close" aria-label="Delete"></button>' +
                '<div class="ec-event-title">' + title + '</div>'
        };
        if (info.event.display == 'pointer') {
            return '';
        } else {
            return deleteBtn;
        }
    },
    eventClick: function (info) {//click en evento ya creado
        //borrar evento por ID
        var deleteBtn = document.getElementById("btn-delete");
        if (info.jsEvent.target.id == deleteBtn.id) {
            var readEvents = JSON.parse(localStorage.getItem('events')) || [];
            localStorage.removeItem(readEvents[info.event.id]);
            //Crea un nuevo array sin el evento y lo actualiza en localStorage
            const newData = readEvents.filter(x => x.id != info.event.id);
            ec.removeEventById(info.event.id);
            localStorage.setItem("events", JSON.stringify(newData));
        }
        else {
            //Aparece PopUp para actualizar.
            isEvent = true;
            removePopups();
            popUpShow(info, isEvent);
            ec.removeEventById(0);
        }
    },
    select: function (info) { //drag and drop en celda vacía
        colorEvent = color.green;
        newEventForm.reset();
        ec.removeEventById(0);
        ec.addEvent({
            id: 0,
            start: info.startStr,
            end: info.endStr,
            backgroundColor: colorEvent
        })
        ec.unselect();
        isEvent = false;
        removePopups();
        popUpShow(info, isEvent);
        ec.selectable = true;
    },
    dateClick: function (info) { //click en una celda vacia
        colorEvent = color.green;
        newEventForm.reset();
        if ((newEventPopup.classList.contains('show') != true) && (eventPopup.classList.contains('show') != true)) {
            var dateTimeClickEnd = moment(info.dateStr).add(30, 'm').format("YYYY-MM-DD[T]HH:mm");
            //Añadimos previsualización
            ec.removeEventById(0);
            ec.addEvent({
                id: 0,
                start: info.date,
                end: dateTimeClickEnd,
                backgroundColor: colorEvent
            })
            isEvent = false;
            popUpShow(info, isEvent);
        } else {

            ec.removeEventById(0);
            removePopups();
        }
        ec.selectable = true;
    },
    views: {
        timeGridWeek: { pointer: true },
        timeGridDay: { pointer: true },
    },
    dayMaxEvents: true,
    nowIndicator: true
})
document.getElementById('task-btn').addEventListener('click', function () {
    updatePrev(color.orange);
    colorEvent = color.orange;
});
document.getElementById('event-btn').addEventListener('click', function () {
    updatePrev(color.blue);
    colorEvent = color.blue;
});
//Oculta todos los popups activos
function removePopups() {
    newEventPopup.classList.remove('show');
    newEventForm.classList.remove('show');
    eventPopup.classList.remove('show');
    eventDisplay.classList.remove('show');
}
//Actualizar previsualización
function updatePrev(color) {
    info = ec.getEventById(0);
    ec.updateEvent({
        id: 0,
        start: info.start,
        end: info.end,
        backgroundColor: color
    });
}
//Codificar strings
function sanitize (string){
    const encodedComponent = encodeURIComponent(string);
    return encodedComponent;
}
//Decodificar strings
function reSanitize (string){
    const decodedURL = decodeURIComponent(string);
    return decodedURL;
}
//Se añade el evento al hacer click en el formulario
input.addEventListener('click', function () {
    var eventStart = document.querySelector("#event-start").value;
    var eventEnd = document.querySelector("#event-end").value;
    // Array con los eventos almacenados en LocalStorage
    var eventsList = [];
    var newID;
    eventsList = JSON.parse(localStorage.getItem('events')) || [];
    if (eventEnd == "") {
        eventEnd = moment(eventStart).add(30, 'm').format("YYYY-MM-DD[T]HH:mm");
    };
    var eventTitle = document.querySelector("#event-title").value;
    eventTitle = sanitize(eventTitle);
    if (eventsList.length == 0) { newID = 1; } else {
        newID = parseInt(eventsList[eventsList.length - 1].id) + 1;
    }
    newEventCustom = {
        id: newID,
        start: eventStart,
        end: eventEnd,
        title: eventTitle,
        color: colorEvent
    };
    ec.removeEventById(0);
    eventsList.push(newEventCustom);
    if (eventStart != "") {
        //Oculta el popUp
        removePopups();
        //Añado el nuevo evento
        localStorage.setItem("events", JSON.stringify(eventsList));
        ec.unselect();
        return ec.addEvent(newEventCustom);
    }
});
//Editar Evento
editEventInput.addEventListener('click', function () {
    console.log('Editar evento');
});
//Aparece el PopUp
function popUpShow(dateClickInfo, isEvent) {
    ec.selectable = false;
    //Le doy la posición al popUp de donde se hizo click
    var topPosition = dateClickInfo.jsEvent.clientY;
    var leftPosition = dateClickInfo.jsEvent.clientX;
    //Mostrar el form dentro del calendario (LEFT)
    if (!((leftPosition + newEventPopup.clientWidth) > window.innerWidth)) {
        if (leftPosition <= 0) {
            leftPosition = 10;
        }
        newEventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;");
        eventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;");
    } else {
        leftPosition = leftPosition - (newEventPopup.clientWidth);
        if (leftPosition <= 0) {
            leftPosition = 10;
        }
        newEventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;" + "top:" + (topPosition + 10) + "px;");
        eventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;" + "top:" + (topPosition + 10) + "px;");

    }
    
    //Mostrar el form dentro del calendario (TOP)
    if (!((topPosition + newEventPopup.clientHeight) > window.innerHeight)) {
        /*popup.style.top = (jsEvent.originalEvent.pageY + 15);*/
        newEventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px; top:" + (topPosition + 10) + "px;");
        eventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px; top:" + (topPosition + 10) + "px;");
    }
    else {
        topPosition = topPosition - (newEventPopup.clientHeight + 10);
        var topPositionEvent = dateClickInfo.jsEvent.clientY - (eventPopup.clientHeight);
        newEventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;" + "top:" + (topPosition - 10) + "px;");
        eventPopup.setAttribute("style", "left:" + (leftPosition + 10) + "px;" + "top:" + (topPositionEvent - 20) + "px;");

    }
    if (isEvent == false) {
        newEventForm.classList.toggle("show");
        newEventPopup.classList.toggle("show");

        //Le doy la fecha de inicio en donde se hizo click
        if (dateClickInfo.hasOwnProperty('startStr') == true) {
            document.getElementById("event-start").setAttribute('value', dateClickInfo.startStr);
            document.getElementById("event-end").setAttribute('value', dateClickInfo.endStr);
        } else {
            document.getElementById("event-start").setAttribute('value', moment(dateClickInfo.dateStr).format("YYYY-MM-DD[T]HH:mm"));
            //Añado 30 min al evento por defecto y prevengo que se haga click en una fecha pasada
            var dateTimeClickEnd = moment(dateClickInfo.dateStr).add(30, 'm').format("YYYY-MM-DD[T]HH:mm");
            document.getElementById("event-end").setAttribute('min', dateTimeClickEnd);
            document.getElementById("event-end").setAttribute('value', dateTimeClickEnd);
        }
    } else {
        eventPopup.classList.toggle("show");
        eventDisplay.classList.toggle("show");
        var locale = window.navigator.userLanguage || window.navigator.language;
        "style", "left:" + leftPosition + "px;"
        document.getElementById("square-color-event").setAttribute("style", "color:" + dateClickInfo.event.backgroundColor);
        document.getElementById("event-time-display").innerHTML = moment(dateClickInfo.event.start).locale(locale).format('ddd') + ' ' + moment(dateClickInfo.event.start).format("DD") + ' ' + moment(dateClickInfo.event.start).format("HH:mm") + ' - ' + moment(dateClickInfo.event.end).format("HH:mm");
        if(dateClickInfo.event.title!="" ){
            eventTitle = reSanitize(dateClickInfo.event.title);
            document.getElementById("event-title-display").innerHTML =eventTitle.toString();
        }else{
            document.getElementById("event-title-display").innerHTML = "(Sin Título)";
        }
    }
    ec.unselect();
}
//Función para crear eventos al iniciar el calendario.
function createEvents() {
    //Lee los eventos del locaStorage y los pinta
    let days = [];
    var readEvents = JSON.parse(localStorage.getItem('events')) || [];
    return readEvents;
}
//Función para sacar el día actual
function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}
//funcion para actualizar la base de datos cambiando un solo item
function updateLocalStorage (info){
    var eventsList = [];
        var id;
        eventsList = JSON.parse(localStorage.getItem('events')) || [];
        const eventUpdate = eventsList.findIndex(x => x.id == info.event.id);
        var index = -1
        for (var i = 0; i < eventsList.length; i++) {
            if (eventsList[i].id == info.event.id) {
                index = i;
                break;
            }
        }
        if ((info.event.start!=undefined)&&(info.event.end!=undefined)){
            eventsList[index].start = moment(info.event.start).format("YYYY-MM-DD[T]HH:mm");
            eventsList[index].end = moment(info.event.end).format("YYYY-MM-DD[T]HH:mm");
            localStorage.setItem('events', JSON.stringify(eventsList));
            
        }
        removePopups();
}
