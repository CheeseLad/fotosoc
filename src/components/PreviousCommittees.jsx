import React from 'react';
import previousCommitteeData from '../data/previous_committees.json';
import PageHeading from './PageHeading';


const PreviousCommittees = () => {

  return (
<div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8">
  <PageHeading 
    heading="Previous Committees" 
    subheading={
      <>
        Meet the committees who ran DCU Fotosoc over the years! If you were previously on the committee and are not on this list, please contact{' '}
        <a 
          href="mailto:committee@dcufotosoc.ie" 
          className="underline hover:no-underline"
        >
          committee@dcufotosoc.ie
        </a>
      </>
    }
  />
  {previousCommitteeData.map((committee, index) => (
    <div key={index} className="bg-white rounded-lg shadow-xl p-6 mt-10 mx-10 md:min-w-[500px] sm:min-w-[400px]">
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
