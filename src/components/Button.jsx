import React from 'react';

function Button({ 
  href, 
  text, 
  color = 'blue', 
  target, 
  rel, 
  className = '', 
  onClick 
}) {
  // Color mapping for different button styles
  const colorClasses = {
    green: 'shadow-[#32b069]/50',
    purple: 'shadow-[#3774aa]/50',
    orange: 'shadow-[#cfbf3c]/50',
    red: 'shadow-[#60a4a4]/50',
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-600/50',
    gray: 'bg-gray-500 hover:bg-gray-600 shadow-gray-600/50',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-600/50',
    pink: 'bg-pink-500 hover:bg-pink-600 shadow-pink-600/50',
    teal: 'bg-teal-500 hover:bg-teal-600 shadow-teal-600/50',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-600/50'
  };

  const baseClasses = 'text-white px-4 py-2 mt-4 mr-4 rounded-lg transition-colors shadow-lg hvr-grow';
  const colorClass = colorClasses[color] || colorClasses.blue;
  const buttonClasses = `${baseClasses} ${colorClass} ${className}`.trim();

  const getCustomColor = (color) => {
    switch (color) {
      case 'green':
        return { normal: '#32b069', hover: '#2a9658' };
      case 'purple':
        return { normal: '#3774aa', hover: '#2e5f8f' };
      case 'orange':
        return { normal: '#cfbf3c', hover: '#b8a833' };
      case 'red':
        return { normal: '#60a4a4', hover: '#528b8b' };
      default:
        return null;
    }
  };

  const customColor = getCustomColor(color);

  const buttonElement = (
    <button 
      className={buttonClasses}
      style={customColor ? { backgroundColor: customColor.normal } : {}}
      onMouseEnter={(e) => {
        if (customColor) {
          e.target.style.backgroundColor = customColor.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (customColor) {
          e.target.style.backgroundColor = customColor.normal;
        }
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );

  // If href is provided, wrap in anchor tag
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="no-underline"
      >
        {buttonElement}
      </a>
    );
  }

  // If no href, return just the button
  return buttonElement;
}

export default Button;
