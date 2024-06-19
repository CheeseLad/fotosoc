import React, { useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const YouTubePlayer = () => {
  const [loading, setLoading] = useState(true);

  // After the iframe has finished loading
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', width: 560 * 1.5, height: 315 * 1.5 }}>
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
          }}
        >
          <ClipLoader color={'#000000'} loading={loading} css={override} size={35} />
        </div>
      )}
      <iframe
        width={560 * 1.5}
        height={315 * 1.5}
        src="https://www.youtube.com/embed/cFhEqk7LHYM"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad} // Call handleIframeLoad when the iframe has loaded
        style={{ display: loading ? 'none' : 'block' }}
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
