import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useInView } from "react-intersection-observer";
import { useSiteContent } from "../context/SiteContentContext";

const SubscriptionCallToAction = () => {
  const { content } = useSiteContent();
  const donations = content.donations;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section className="bg-gradient-to-br from-blue-950 to-indigo-800 text-white py-16 px-6 relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto flex flex-col items-center text-center space-y-6 transition-all duration-[1400ms] ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-full">
          <FontAwesomeIcon icon={faHeart} className="text-red-400 text-5xl animate-bounce-slow" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          {donations.homeCtaTitle}
        </h2>
        <p className="text-lg md:text-xl max-w-3xl text-blue-100 leading-relaxed">
          {donations.homeCtaText}
        </p>
        <a
          href={donations.homeCtaButtonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-950 font-semibold text-lg px-8 py-3 rounded-full shadow-md hover:scale-105 hover:bg-blue-100 transition-transform duration-300"
        >
          {donations.homeCtaButtonText}
        </a>
      </div>
    </section>
  );
};

export default SubscriptionCallToAction;
