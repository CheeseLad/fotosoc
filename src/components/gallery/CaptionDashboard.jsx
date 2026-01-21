import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import PageHeading from "../PageHeading";

const ALLOWED_USER_ID = process.env.REACT_APP_ADMIN_USER_ID;

const CaptionDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [galleries, setGalleries] = useState([]);
  const [galleriesLoading, setGalleriesLoading] = useState(true);
  const [galleriesError, setGalleriesError] = useState(null);

  const [openGalleryLink, setOpenGalleryLink] = useState(null);
  const [captionsByGalleryLink, setCaptionsByGalleryLink] = useState({});
  const [captionsLoadingByGalleryLink, setCaptionsLoadingByGalleryLink] = useState(
    {}
  );
  const [captionsErrorByGalleryLink, setCaptionsErrorByGalleryLink] = useState(
    {}
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(Boolean(user && user.uid === ALLOWED_USER_ID));
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      setGalleriesLoading(true);
      setGalleriesError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "galleries"));
        const galleryData = querySnapshot.docs.map((d) => d.data());
        setGalleries(galleryData);
      } catch (error) {
        setGalleriesError(error);
      } finally {
        setGalleriesLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const sortedGalleries = useMemo(() => {
    const withCaptionsInUrl = galleries.filter((g) => {
      const link = (g?.link || "").toLowerCase();
      return link.includes("caption"); // only galleries whose URL contains 'caption'
    });

    return withCaptionsInUrl.sort((a, b) =>
      (a?.title || "").localeCompare(b?.title || "")
    );
  }, [galleries]);

  const toggleGallery = async (galleryLink) => {
    if (!galleryLink) return;

    if (openGalleryLink === galleryLink) {
      setOpenGalleryLink(null);
      return;
    }

    setOpenGalleryLink(galleryLink);

    // Lazy-load captions for this gallery the first time it’s opened.
    if (captionsByGalleryLink[galleryLink] !== undefined) return;

    setCaptionsLoadingByGalleryLink((prev) => ({ ...prev, [galleryLink]: true }));
    setCaptionsErrorByGalleryLink((prev) => ({ ...prev, [galleryLink]: null }));

    try {
      const captionRef = doc(db, "captions", galleryLink);
      const snap = await getDoc(captionRef);
      const data = snap.exists() ? snap.data() : null;
      setCaptionsByGalleryLink((prev) => ({ ...prev, [galleryLink]: data }));
    } catch (error) {
      setCaptionsErrorByGalleryLink((prev) => ({ ...prev, [galleryLink]: error }));
      setCaptionsByGalleryLink((prev) => ({ ...prev, [galleryLink]: null }));
    } finally {
      setCaptionsLoadingByGalleryLink((prev) => ({ ...prev, [galleryLink]: false }));
    }
  };

  const renderCaptions = (galleryLink) => {
    const loading = captionsLoadingByGalleryLink[galleryLink];
    const error = captionsErrorByGalleryLink[galleryLink];
    const data = captionsByGalleryLink[galleryLink];

    if (loading) {
      return <div className="text-white/90">Loading captions…</div>;
    }
    if (error) {
      return (
        <div className="text-red-200">
          Failed to load captions: {String(error?.message || error)}
        </div>
      );
    }
    if (!data) {
      return <div className="text-white/80">No captions doc found for this gallery.</div>;
    }

    const captionsObj = data.captions || {};
    const imageNumbers = Object.keys(captionsObj).sort(
      (a, b) => Number(a) - Number(b)
    );

    if (imageNumbers.length === 0) {
      return <div className="text-white/80">No captions saved yet.</div>;
    }

    return (
      <div className="space-y-4">
        {imageNumbers.map((num) => {
          const entries = Array.isArray(captionsObj[num]) ? captionsObj[num] : [];
          return (
            <div key={num} className="bg-white rounded-lg p-4">
              <div className="text-black font-semibold text-lg">Photo {num}</div>
              {entries.length === 0 ? (
                <div className="text-black/70">No captions for this photo.</div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {entries.map((c, idx) => (
                    <li key={`${num}-${idx}`} className="border border-gray-200 rounded p-3">
                      <div className="text-black font-medium">
                        {c?.name || "Anonymous"}
                      </div>
                      <div className="text-black/90">{c?.caption || ""}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen">
        <div>Loading…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen">
        <div className="w-full px-4 md:px-8">
          <PageHeading heading="Caption Dashboard" />
          <div className="bg-white rounded-lg p-6 text-black max-w-2xl">
            You don’t have access to this page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen">
      <div className="w-full px-4 md:px-8">
        <PageHeading heading="Caption Dashboard" />

        {galleriesLoading ? (
          <div>Loading galleries…</div>
        ) : galleriesError ? (
          <div className="text-red-200">Failed to load galleries: {String(galleriesError?.message || galleriesError)}</div>
        ) : (
          <div className="space-y-4">
            {sortedGalleries.map((g) => {
              const title = g?.title || "(Untitled)";
              const link = g?.link;
              const open = openGalleryLink === link;
              return (
                <div key={link || title} className="bg-white/10 rounded-lg border border-white/10 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/10 transition"
                    onClick={() => toggleGallery(link)}
                  >
                    <div>
                      <div className="text-white font-semibold">{title}</div>
                      <div className="text-white/70 text-sm">/gallery/{link}</div>
                    </div>
                    <div className="text-white/80">{open ? "▲" : "▼"}</div>
                  </button>

                  {open && (
                    <div className="p-4">
                      {renderCaptions(link)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionDashboard;

