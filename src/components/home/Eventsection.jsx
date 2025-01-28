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
      hour12: true
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
      <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-lg shadow-lg flex flex-col" 
            key={index}
          >
            <div className="flex-1 bg-white rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-2 text-center">{event.name}</h2>
              <div className="my-4">
                <img
                  src={event.image || "/fotosoc_logo.png"}
                  alt={`${event.name} event`}
                  className="w-90 h-90 shadow-md border-8 transition-transform duration-300 transform hover:scale-105 border-blue-500 rounded-lg"
                />
              </div>
              <p className="text-gray-600 text-sm mb-2">
              <b>Starts:</b> {formatDateTime(event.start)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
              <b>Ends:</b> {formatDateTime(event.end)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <b>Location:</b> {event.location}
              </p>
              {event.cost > 0 && (
                <p className="text-gray-600 text-sm mb-2">
                <b>Cost:</b> €{event.cost.toFixed(2)}
                </p>
              )}
              {event.capacity && (
                <p className="text-gray-600 text-sm mb-2">
                <b>Capacity:</b> {event.capacity} people
                </p>
              )}
              <p className="text-gray-600 text-sm mb-2">
                <b>Type:</b> {event.type}
              </p>
            </div>
            <div className="flex justify-between mt-4 gap-4">
              <button
                className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/50 hvr-grow flex-1"
                onClick={() => openModal(event.name, event.description)}
              >
                View Description
              </button>
              <a 
                href="https://dcuclubsandsocs.ie/society/fotosoc#events" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-600/50 hvr-grow">
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