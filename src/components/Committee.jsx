import { useEffect, useState } from 'react';
import images from '../scripts/importCommitteeImages';
import logo from '../images/logo/logo.png';
//import axios from 'axios';
import committeeData from '../data/committee.json';

function Committee() {

  const [committee, setCommittee] = useState([]);

    useEffect(() => {
    //  axios.get('http://localhost:3001/get-committee')
    //    .then(response => setCommittee(response.data))
    //    .catch(err => console.log(err));
      setCommittee(committeeData);
    }, []);
  
  
  return (
  <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white">
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Meet the Committee</h2>
    <div className="text-center">
      <a href='/previous-committees'><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">View Previous Committees</button></a>
    </div>
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {committee.map(member => (
        <div key={member.id} className="rounded-lg shadow-2xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 m-3">
          <div className="flex items-center justify-center mb-4">
            <img src={images[member.image] || logo} alt={member.name} className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105" />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-3xl font-semibold">{member.name}</h3>
            <p className="text-xl italic">{member.position}</p>
          </div>
          <div className="flex justify-center mb-4">
            <a href={member.social1} target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
              <i className="fab fa-instagram text-4xl"></i>
            </a>
            <a href={member.social2} target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
              <i className="fab fa-linkedin text-4xl"></i>
            </a>
            <a href={`mailto:${member.email}`} className="mx-4 hvr-bob">
            <i className="fa fa-envelope text-4xl"></i>
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
