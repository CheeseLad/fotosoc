import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import logo_border from "../../images/logo/logo_border.png";
import { redirect } from "react-router-dom";

function EventSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      "https://clubsandsocs.jakefarrell.ie/dcuclubsandsocs.ie/society/fotosoc/events"
    )
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (eventTitle, eventDescription) => {
    setModalTitle(eventTitle);
    setModalContent(eventDescription);
    setIsModalOpen(true);
  };

  const displayEvents = () => {
    if (data && data.event_count > 0) {
      return (
        <div className="container mx-auto py-12 bg-white">
          <h2 className="text-3xl font-bold text-center mb-8">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(data.events).map((event, index) => (
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col" key={index}>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                  <div className="my-4">
                  <img
                    src={event.image || logo_border}
                    alt={`${event.name} event`}
                    className="w-full h-96 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Start: {event.start}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    End: {event.end}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Location: {event.location}
                  </p>
                </div>

                <div className="flex justify-between mt-4 gap-4">
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1"
      onClick={() => openModal(event.name, event.description)}
    >
      Event Description
    </button>
    <a href="https://dcuclubsandsocs.ie/society/fotosoc#events" target="_blank" rel="noopener noreferrer">
    <button
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex-1"
    >
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
    } else if (data && data.event_count === 0) {
      return (
        <div className="container mx-auto py-12">
          <h2 className="text-3xl font-bold text-center mb-4">
            No Upcoming Events
          </h2>
          <h3 className="text-1xl italic text-center">Check back later!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48"></div>
        </div>
      );
    } else {
      return (
        <div className="container mx-auto py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Loading Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48"></div>
        </div>
      );
    }
  };

  return displayEvents();
}

export default EventSection;