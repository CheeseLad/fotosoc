import { useEffect, useState } from "react";
import Modal from "./Modal";
import hero_1 from "../images/hero/hero_1.png";

function EventSection() {
  const [data, setData] = useState([]);

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
            <div className="bg-white p-6 rounded-lg shadow-lg flex">
              <div className="flex-1">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {data.events.event_0.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Start Time: {data.events.event_0.start}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    End Time: {data.events.event_0.end}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Location: {data.events.event_0.location}
                  </p>
                </div>

                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-7 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    openModal(
                      data.events.event_0.name,
                      data.events.event_0.description
                    )
                  }
                >
                  More Info
                </button>
              </div>

              <div className="flex-shrink-0 ml-6">
                <img
                  src={data.events.event_0.image}
                  alt="Event 1"
                  className="w-48 h-48 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg flex">
              <div className="flex-1">
                <div>
                  <h2 className="text-xl font-bold mb-2">Event 1</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Start Time: 10:00 AM
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    End Time: 12:00 PM
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Location: XYZ Hall
                  </p>
                </div>

                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-7 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    openModal("Event 1", "Lorem ipsum dolor sit amet.")
                  }
                >
                  More Info
                </button>
              </div>

              <div className="flex-shrink-0 ml-6">
                <img
                  src={hero_1}
                  alt="Event 1"
                  className="w-48 h-48 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg flex">
              <div className="flex-1">
                <div>
                  <h2 className="text-xl font-bold mb-2">Event 1</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Start Time: 10:00 AM
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    End Time: 12:00 PM
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Location: XYZ Hall
                  </p>
                </div>

                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-7 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    openModal("Event 1", "Lorem ipsum dolor sit amet.")
                  }
                >
                  More Info
                </button>
              </div>

              <div className="flex-shrink-0 ml-6">
                <img
                  src={hero_1}
                  alt="Event 1"
                  className="w-48 h-48 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                />
              </div>
            </div>
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
