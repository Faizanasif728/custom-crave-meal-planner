import React, { useEffect, useState } from "react";
import axios from "../../api";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-orange-500 hover:text-orange-600"
    onClick={onClick}
  >
    <FaArrowRight size={22} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-orange-500 hover:text-orange-600"
    onClick={onClick}
  >
    <FaArrowLeft size={22} />
  </div>
);

const ReviewsPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("/feedback/all");
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const FeedbackCard = ({ feedback }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-xl border border-orange-200 text-center flex flex-col justify-between min-h-[320px] h-full">
      <div>
        <img
          src={feedback.profileImage || "/assets/default-profile.jpg"}
          alt={feedback.username}
          className="w-20 h-20 rounded-full border-1 border-orange-300 mx-auto mb-4 object-cover shadow-md"
        />
        <h3 className="text-xl font-bold text-orange-500">
          {feedback.username}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{feedback.email}</p>
        <p className="text-gray-700 italic mt-3 leading-relaxed line-clamp-3">
          “{feedback.message}”
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {new Date(feedback.submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-6 py-20 text-[#333]">
      <div className="max-w-7xl mx-auto space-y-16">
        <h1 className="text-5xl font-extrabold text-center text-orange-500">
          💬 What Our Users Say
        </h1>
        <p className="text-center text-lg max-w-2xl mx-auto text-gray-600">
          These heartfelt stories from our community showcase the real results
          and satisfaction from using{" "}
          <span className="font-semibold text-orange-500">Custom Crave</span>.
        </p>

        {feedbacks.length === 0 && (
          <p className="text-center text-gray-400">
            No feedbacks yet. Be the first to leave your success story!
          </p>
        )}

        {feedbacks.length === 1 && (
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <FeedbackCard feedback={feedbacks[0]} />
            </div>
          </div>
        )}

        {feedbacks.length === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feedbacks.map((fb, idx) => (
              <FeedbackCard key={idx} feedback={fb} />
            ))}
          </div>
        )}

        {feedbacks.length >= 3 && (
          <div className="relative px-10">
            <Slider {...carouselSettings}>
              {feedbacks.map((feedback, index) => (
                <div key={index} className="px-4 h-full">
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
