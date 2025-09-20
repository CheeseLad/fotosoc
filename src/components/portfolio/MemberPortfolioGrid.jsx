import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import committeeNamesData from '../../data/committee_names.json';
import PageHeading from '../PageHeading';
import Button from "../Button";

const MemberPortfoliosGrid = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const portfoliosRef = collection(db, "memberPortfolios");
        const querySnapshot = await getDocs(portfoliosRef);
        const portfolioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        portfolioData.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        setPortfolios(portfolioData);
      } catch (error) {
        console.error("Error fetching portfolios: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1E464B] to-[#2A6268] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-white">
        <PageHeading heading="Member Portfolios" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {portfolios.map((portfolio) => (
            <Link
              to={`/portfolios/${portfolio.portfolioLink}`}
              key={portfolio.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {portfolio.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {committeeNamesData.includes(portfolio.name) ? "Committee" : "Member"}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCamera} className="mr-2" />
                    <span>
                      {portfolio.galleries?.length || 0}{" "}
                      {portfolio.galleries?.length === 1
                        ? "Gallery"
                        : "Galleries"}
                    </span>
                  </div>
                </div>
                <div className="relative w-1/3">
                  <img
                    className="h-20 w-20 object-cover rounded-full"
                    src={portfolio.profileImage || "/fotosoc_logo_circle.png"}
                    alt={portfolio.name}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center items-center mt-8">
          <Button
                href="/create-portfolio"
                text="Create Your Own!"
                color="green"
              />
        </div>
      </div>
    </div>
  );
};

export default MemberPortfoliosGrid;
