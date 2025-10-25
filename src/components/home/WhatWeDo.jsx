import PageHeading from "../PageHeading";
import whatWeDoData from "../../data/what_we_do.json";

const whatWeDo = whatWeDoData.map((item) => ({
  id: item.id,
  heading: item.heading,
  text: item.text,
  image: item.image,
}));

const WhatWeDo = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white text-black">
      <div className="container mx-auto py-12">
        <PageHeading heading="Why Join DCU Fotosoc?" />
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
            {whatWeDo.map((item) => (
              <div
                key={item.id}
                className="rounded-lg shadow-2xl p-6 bg-gradient-to-r from-[#60a4a4] to-[#4a7f7f] m-3"
              >
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={item.image}
                    alt={item.heading}
                    className="w-90 h-90 shadow-md border-8 transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
                <div className="text-center mb-3">
                  <h3 className="text-3xl font-semibold mb-4">{item.heading}</h3>
                  <p className="text-xl italic">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
