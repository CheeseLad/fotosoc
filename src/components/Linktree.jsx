import React from 'react'

const links = [
  {
    "link_name": "Website",
    "link_url": "https://www.dcufotosoc.jakefarrell.ie"
  },
  {
    "link_name": "Connection Issue IV - Order Form",
    "link_url": "https://forms.gle/xNccfJhHxE75jhfL9"
  },
  {
    "link_name": "Foto of the Week !!!",
    "link_url": "https://docs.google.com/forms/d/e/1FAIpQLSemQ563zyeKue16muFehxpITFUCX6XZcgQFQzkaTQApTgmNEQ/viewform?vc=0&c=0&w=1&flr=0"
  },
  {
    "link_name": "Photographers wanted form",
    "link_url": "https://forms.gle/d7VuoPLfprW7J6JR7"
  },
  {
    "link_name": "Equipment Loans Request Form",
    "link_url": "https://forms.gle/6L4w45j6qYNaGE56A"
  },
  {
    "link_name": "CONNECTION: Poetry Submissions",
    "link_url": "https://forms.gle/Z4sHp5J9xNbwQCxs8"
  },
  {
    "link_name": "CONNECTION: Photography Submissions",
    "link_url": "https://forms.gle/pnNmJ24LziTAv9Kp6"
  },
  {
    "link_name": "YouTube Channel",
    "link_url": "https://www.youtube.com/channel/UC37E0zQ0DYssPj7UlkPi-MQ/videos"
  },
  {
    "link_name": "TikTok",
    "link_url": "https://vm.tiktok.com/ZSChkFYm/"
  }
]

const Linktree = () => {
  return (
<div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
  <h2 className="text-3xl font-bold text-center mb-8">DCU Fotosoc Links</h2>
    <div className="bg-white rounded-lg shadow-xl p-6 mx-10 md:min-w-[500px] sm:min-w-[400px]">
      {links.map((link, index) => (
        <div key={index} className="flex justify-center">
                <a href={link.link_url}><button className="bg-purple-500 text-white px-4 py-2 my-2 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">{link.link_name}</button></a>
        </div>
      ))}
    </div>

</div>
  )
}

export default Linktree