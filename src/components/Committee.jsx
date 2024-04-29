import logo from '../assets/logo/logo.png';

const committeeMembers = [
  {
    id: 1,
    name: 'John Doe',
    position: 'Chairperson',
    image : 'image.jpg',
    social1: 'https://www.instagram.com/example/',
    social2: 'https://www.linkedin.com/in/example/',
    email: 'john@example.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    position: 'Vice Chair',
    image : 'image.jpg',
    social1: 'https://www.instagram.com/example/',
    social2: 'https://www.linkedin.com/in/example/',
    email: 'jane@example.com'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    position: 'Secretary',
    image : 'image.jpg',
    social1: 'https://www.instagram.com/example/',
    social2: 'https://www.linkedin.com/in/example/',
    email: 'alice@example.com'
  },
  {
    id: 4,
    name: 'Bob Brown',
    position: 'Treasurer',
    image : 'image.jpg',
    social1: 'https://www.instagram.com/example/',
    social2: 'https://www.linkedin.com/in/example/',
    email: 'bob@example.com'
  },
  // Add more committee members as needed
];

function Committee() {

  return (
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Meet the Committee</h2>
    <div className="grid grid-cols-1 mx-10 md:grid-cols-3 gap-10 mx-60">
      {committeeMembers.map(member => (
        <div key={member.id} className="rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt={member.name} className="w-64 h-64 rounded-full" />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-3xl font-semibold">{member.name}</h3>
            <p className="text-xl italic">{member.position}</p>
          </div>
          <div className="flex justify-center mb-4">
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="mx-4">
              <i className="fab fa-instagram text-4xl"></i>
            </a>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mx-4">
              <i className="fab fa-linkedin text-4xl"></i>
            </a>
            <a href={`mailto:${member.email}`} className="mx-4">
            <i className="fa fa-envelope text-4xl"></i>
            </a>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Committee;
