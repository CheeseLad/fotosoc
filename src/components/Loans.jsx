import React from 'react';

const Loans = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white min-h-screen">
      <h2 className="text-3xl font-bold text-center my-8">Loans</h2>
      <p className="text-lg mb-4 px-2 text-center">Borrow equipment from the photography society. Fill out the form below to request a loan.</p>
      
      <div className="w-full h-full flex-1 flex justify-center items-center">
        <div className="bg-white w-full max-w-2xl p-1 my-6 py-4 rounded-lg shadow-lg">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSf2YSut4yC0qruczjKhIqxy9020gIm5sgobH0WTXKFiydmojA/viewform?embedded=true"
            width="100%"
            height="1800"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Loan Request Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Loans;
