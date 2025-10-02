import committeeData from "../data/committee.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faYoutube,
  faTiktok,
  faWhatsapp,
  faLinkedin,
  faBluesky,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink } from "@fortawesome/free-solid-svg-icons";
import PageHeading from "./PageHeading";
import Button from "./Button";

function Committee() {
  const iconMap = {
    faInstagram,
    faFacebook,
    faYoutube,
    faTiktok,
    faWhatsapp,
    faLinkedin,
    faLink,
    faBluesky,
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white">
      <div className="container mx-auto py-12 text-white">
        <PageHeading heading="Meet the Committee" />
        <div className="pb-4 text-center">
          <Button
            href="/previous-committees"
            text="View Previous Committees"
            color="purple"
          />
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {committeeData.map((member) => (
              <div
                key={member.id}
                className="rounded-lg shadow-2xl p-4 bg-gradient-to-r from-[#60a4a4] to-[#4a7f7f] m-3"
              >
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={[member.image] || "/fotosoc_logo_circle.png"}
                    alt={member.name}
                    className="w-64 h-64 rounded-full object-cover shadow-md transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
                <div className="text-center mb-3">
                  <h3 className="text-3xl font-semibold">{member.name}</h3>
                  <p className="text-xl italic">{member.position}</p>
                </div>
                <div className="flex justify-center space-x-6 mb-4">
                  {member.social1 && (
                    <a
                      href={member.social1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hvr-bob"
                    >
                      <FontAwesomeIcon
                        icon={iconMap[member.social1_type]}
                        className="text-4xl"
                      />
                    </a>
                  )}

                  {member.social2 && (
                    <a
                      href={member.social2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hvr-bob"
                    >
                      <FontAwesomeIcon
                        icon={iconMap[member.social2_type]}
                        className="text-4xl"
                      />
                    </a>
                  )}

                  {member.social3 && (
                    <a
                      href={member.social3}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hvr-bob"
                    >
                      <FontAwesomeIcon
                        icon={iconMap[member.social3_type]}
                        className="text-4xl"
                      />
                    </a>
                  )}

                  {member.email && (
                    <a href={`mailto:${member.email}`} className="hvr-bob">
                      <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Committee;
