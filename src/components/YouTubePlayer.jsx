import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const YouTubePlayer = () => {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 560 * 1.5, height: 315 * 1.5 });

  useEffect(() => {
    // Function to handle window resize and calculate new dimensions
    const handleResize = () => {
      const aspectRatio = (560 * 1.5) / (315 * 1.5);
      const maxWidth = 560 * 1.5;
      const baseMultiplier = 0.9;
      const largeScreenMultiplier = 1.2;

      // Determine the width multiplier based on the window width
      const multiplier = window.innerWidth > 1000 ? largeScreenMultiplier : baseMultiplier;

      const width = Math.min(window.innerWidth * multiplier, maxWidth);
      const height = width / aspectRatio;
      setDimensions({ width, height });
    };

    // Initial calculation
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // After the iframe has finished loading
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%'}}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0', // Placeholder background color
            zIndex: 1,
          }}
        >
          <ClipLoader color={'#000000'} loading={loading} css={override} size={35} />
        </div>
      )}
      <iframe
        width={dimensions.width}
        height={dimensions.height}
        src="https://www.youtube.com/embed/cFhEqk7LHYM"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad} // Call handleIframeLoad when the iframe has loaded
        style={{
          border: 'none',
          display: loading ? 'none' : 'block',
        }}
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
