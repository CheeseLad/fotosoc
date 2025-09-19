import committeeData from '../data/committee.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook, faYoutube, faTiktok, faWhatsapp, faLinkedin, faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink } from "@fortawesome/free-solid-svg-icons";

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
  <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white">
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Meet the Committee</h2>
    <div className="text-center">
      <a href='/previous-committees'><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">View Previous Committees</button></a>
    </div>
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {committeeData.map(member => (
        <div key={member.id} className="rounded-lg shadow-2xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 m-3">
          <div className="flex items-center justify-center mb-4">
            <img src={[member.image] || "/fotosoc_logo_circle.png"} alt={member.name} className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105" />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-3xl font-semibold">{member.name}</h3>
            <p className="text-xl italic">{member.position}</p>
          </div>
          <div className="flex justify-center mb-4">
            <a href={member.social1} target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
              <FontAwesomeIcon icon={iconMap[member.social1_type]} className="text-4xl" />
            </a>
            <a href={member.social2} target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
            <FontAwesomeIcon icon={iconMap[member.social2_type]} className="text-4xl" />
            </a>
            <a href={`mailto:${member.email}`} className="mx-4 hvr-bob">
              <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
            </a>
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
