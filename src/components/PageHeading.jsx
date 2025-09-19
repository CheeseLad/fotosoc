import React from 'react';

const PageHeading = ({ heading, subheading, className = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl font-bold mb-4">{heading}</h2>
      {subheading && (
        <p className="text-lg mb-8">{subheading}</p>
      )}
      {!subheading && <div className="mb-8"></div>}
    </div>
  );
};

export default PageHeading;
