import React, { useEffect, useState } from "react";
import Modal from "../Modal";

function EventSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    fetch("https://clubsandsocs.jakefarrell.ie/dcuclubsandsocs.ie/society/fotosoc/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const openModal = (eventTitle, eventDescription) => {
    setModalTitle(eventTitle);
    setModalContent(eventDescription);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Loading Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <h2 className="text-3xl font-bold text-center mb-4 text-red-600">
          Error Loading Events
        </h2>
        <p className="text-center">Please try again later!</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-4">
          No Upcoming Events
        </h2>
        <h3 className="text-1xl italic text-center">Check back later!</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <div 
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col" 
            key={index}
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{event.name}</h2>
              <div className="my-4">
                <img
                  src={event.image || "/fotosoc_logo.png"}
                  alt={`${event.name} event`}
                  className="w-full h-96 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                />
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Start: {formatDateTime(event.start)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                End: {formatDateTime(event.end)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Location: {event.location}
              </p>
              {event.cost > 0 && (
                <p className="text-gray-600 text-sm mb-2">
                  Cost: €{event.cost.toFixed(2)}
                </p>
              )}
              {event.capacity && (
                <p className="text-gray-600 text-sm mb-2">
                  Capacity: {event.capacity} people
                </p>
              )}
              <p className="text-gray-600 text-sm mb-2">
                Type: {event.type}
              </p>
            </div>
            <div className="flex justify-between mt-4 gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1"
                onClick={() => openModal(event.name, event.description)}
              >
                Event Description
              </button>
              <a 
                href="https://dcuclubsandsocs.ie/society/fotosoc#events" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  View Event
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <Modal
          title={modalTitle}
          content={modalContent}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default EventSection;