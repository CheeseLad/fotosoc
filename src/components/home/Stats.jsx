import React, { useState, useEffect } from "react";
import {
  Users,
  Image,
  Award,
  ChartColumnIncreasing,
} from "lucide-react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const StatBox = ({ icon: Icon, label, endValue }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const animateCount = () => {
      const duration = 2000;
      const framesPerSecond = 60;
      const totalFrames = (duration / 1000) * framesPerSecond;
      const increment = endValue / totalFrames;

      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        setCount(Math.min(Math.round(increment * currentFrame), endValue));
        if (currentFrame === totalFrames) clearInterval(timer);
      }, 1000 / framesPerSecond);

      return () => clearInterval(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(document.getElementById(`stat-box-${label}`));

    return () => observer.disconnect();
  }, [endValue, label]);

  return (
    <div className="hover:transition duration-600 hvr-grow">
      <div
        id={`stat-box-${label}`}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"
      >
        <Icon className="text-[#3774aa] mb-2" size={64} />
        <h3 className="text-3xl font-bold mb-1 text-[#235359]">{count}</h3>
        <p className="text-xl text-[#3774aa] text-center">{label}</p>
      </div>
    </div>
  );
};

const Stats = () => {
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    const fetchImageCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galleries"));
        const galleryData = querySnapshot.docs.map((doc) => doc.data());

        const portfolioQuerySnapshot = await getDocs(
          collection(db, "memberPortfolios")
        );
        const portfolioData = portfolioQuerySnapshot.docs.map((doc) =>
          doc.data()
        );

        const totalImages = galleryData.reduce((total, gallery) => {
          const galleryImages = gallery.galleries?.[0]?.images || [];
          return total + galleryImages.length;
        }, 0);

        const totalPortfolioImages = portfolioData.reduce(
          (total, portfolio) => {
            const portfolioImagesCount = (portfolio.galleries || []).reduce(
              (galleryTotal, gallery) => {
                const galleryImages = gallery.images || [];
                return galleryTotal + galleryImages.length;
              },
              0
            );

            return total + portfolioImagesCount;
          },
          0
        );

        setImageCount(totalImages + totalPortfolioImages);
      } catch (error) {
        console.error("Error fetching galleries: ", error);
      }
    };

    fetchImageCount();
  }, []);

  const [portfolioCount, setPortfolioCount] = useState(0);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const portfoliosRef = collection(db, "memberPortfolios");
        const querySnapshot = await getDocs(portfoliosRef);
        const portfolioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPortfolioCount(portfolioData.length);
      } catch (error) {
        console.error("Error fetching portfolios: ", error);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Fotostats</h2>
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          icon={ChartColumnIncreasing}
          label="Years Running"
          endValue={23}
        />
        <StatBox icon={Users} label="Active Members" endValue={157} />
        <StatBox icon={Image} label="Fotos Uploaded" endValue={imageCount} />
        <StatBox
          icon={Award}
          label="Member Portfolios"
          endValue={portfolioCount}
        />
      </div>
    </div>
  );
};

export default Stats;
