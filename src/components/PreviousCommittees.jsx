import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';


const PreviousCommittees = () => {

  const [previousCommittee, setPreviousCommittee] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:3001/get-previous-committee')
        .then(response => setPreviousCommittee(response.data))
        .catch(err => console.log(err));
    }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Previous Committees</h2>
      <p className="text-lg mb-4 px-2 text-center">Meet the committees who ran DCU Fotosoc over the years!</p>
      {previousCommittee.map((committee, index) => (
        <div key={index} className="bg-white rounded-lg shadow-xl p-6 mt-10">
          <h3 className="text-xl font-bold mb-2 text-black text-center">Committee {committee.year}</h3>
          <ul className='text-black'>
            {committee.members.map((member, idx) => (
              <li key={idx}>
                <p><b>{member.role}:</b> {member.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PreviousCommittees;
