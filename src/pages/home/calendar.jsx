import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import React, { useEffect, useState } from "react";

export default function Calendar() {
  const [events, setEvents] = useState([
    {
      title: "Event",
      date: new Date().toISOString().split("T")[0],
    },
  ]);
  const [view, setView] = useState("calendar"); // 'calendar' or 'table'
  const [editingEvent, setEditingEvent] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    image: "",
    color: "#3788d8",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleDateClick = (arg) => {
    setNewEventData((prev) => ({
      ...prev,
      startDate: arg.dateStr,
      endDate: arg.dateStr,
    }));
    setShowAddModal(true);
  };

  const handleAddEvent = () => {
    const { title, image, color, startDate, startTime, endDate, endTime } =
      newEventData;
    if (title && startDate && startTime && endDate && endTime) {
      const start = new Date(`${startDate}T${startTime}`).toISOString();
      const end = new Date(`${endDate}T${endTime}`).toISOString();

      const newEvent = {
        id: String(Date.now()),
        title,
        image,
        color,
        start,
        end,
      };

      setEvents([...events, newEvent]);
      setShowAddModal(false);
      setNewEventData({
        title: "",
        image: "",
        color: "#3788d8",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      });
    }
  };

  // console.log(events, "events");

  const LOCAL_STORAGE_KEY = "calendarEvents";

  useEffect(() => {
    const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);


  const handleEventClick = (info) => {
    const event = info.event;
    const updatedEvent = {
      id: event.id.toString(),
      title: event.title,
      image: event.extendedProps.image,
      color: event.backgroundColor,
      start: event.startStr,
      end: event.endStr,
    };
    setEditingEvent(updatedEvent);
  };
  const handleSaveEvent = () => {
    if (editingEvent && editingEvent.id) {
      try {
        const updatedEvent = {
          ...editingEvent,
          start: new Date(editingEvent.start).toISOString(),
          end: new Date(editingEvent.end).toISOString(),
        };
  
        const updatedEvents = events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        );
  
        setEvents(updatedEvents);
        setEditingEvent(null);
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Please enter valid date and time values.");
      }
    }
  };
  

  const handleDeleteEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.filter(
        (event) => event.title !== editingEvent.title
      );
      setEvents(updatedEvents);
      setEditingEvent(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  const handleToggleView = () => {
    setView(view === "calendar" ? "table" : "calendar");
  };

  const renderTableView = () => (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Image</th>
            <th>Start</th>
            <th>End</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.title}</td>
              <td>
                <img src={event.image} alt={event.title} width="50" />
              </td>
              <td>{event.start}</td>
              <td>{event.end}</td>
              <td>
                <span
                  className="badge"
                  style={{ backgroundColor: event.color }}
                >
                  {event.color}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() =>setEditingEvent(event)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    const updatedEvents = events.filter((e) => e !== event);
                    setEvents(updatedEvents);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCalendarView = () => (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      }}
      // events={events}
      events={events.map((event) => ({
        ...event,
        backgroundColor: event.color,
        borderColor: event.color,
      }))}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      editable={true}
      selectable={true}
    />
  );

  return (
    <>
      {/* <div className="container mt-4">
        <h2 className="mb-4">Google Calendar Clone</h2>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          // dateClick={handleDateClick}
          editable={true}
          selectable={true}
        />
      </div> */}
      <div className="container mt-4">
        <h2>Google Calendar Clone</h2>
        <button className="btn btn-primary mb-3" onClick={handleToggleView}>
          Toggle to {view === "calendar" ? "Table" : "Calendar"} View
        </button>
        {view === "calendar" ? renderCalendarView() : renderTableView()}
        {editingEvent && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Event</h5>
                  <button
                    className="btn-close"
                    onClick={handleCancelEdit}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label>Title</label>
                    <input
                      className="form-control"
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Image URL</label>
                    <input
                      className="form-control"
                      value={editingEvent.image || ""}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          image: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editingEvent.start? editingEvent.start.slice(0, 16):""}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          start: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editingEvent.end?.slice(0, 16)}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          end: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={editingEvent.color || "#3788d8"}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleSaveEvent}>
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteEvent}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Event</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {["title", "image"].map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="form-label text-capitalize">
                      {field}
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={newEventData[field]}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
                <div className="mb-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newEventData.startDate}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEventData.startTime}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newEventData.endDate}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEventData.endTime}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={newEventData.color}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        color: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleAddEvent}>
                  Add
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
