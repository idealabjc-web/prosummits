import { useRef, useEffect, useState } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { client } from "../lib/sanity";
import { SPEAKERS } from "../data/constants";
import AnimatedSpeakersGallery from "./AnimatedSpeakersGallery";

/**
 * Speakers (Guest Speakers & Faculty)
 * Displays the speaker grid on the home page.
 */
export default function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await client.fetch(`*[_type == "speaker" && (personType == "speaker" || !defined(personType))]`);
        setSpeakers(data && data.length > 0 ? data : SPEAKERS.filter(s => s.personType !== 'ambassador'));
      } catch (err) {
        console.error("Error fetching speakers:", err);
        setSpeakers(SPEAKERS);
      }
    };
    fetchSpeakers();
  }, []);

  return (
    <section id="speakers" ref={ref}>
      <div className="wrap" style={{ paddingTop: "20px" }}>
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#7B2FBE" }}>
            Global Thought Leaders
          </span>
          <h2 className="section-title">
            Meet Our<br />
            <em style={{ color: "#7B2FBE" }}>World-Class Speakers</em>
          </h2>
          <p className="section-desc">
            Our speakers are world-renowned experts, researchers, and changemakers who represent
            the ProSummits mission across the globe — sharing insights and driving innovation.
          </p>
        </div>

        <AnimatedSpeakersGallery speakers={speakers} />
      </div>
    </section>
  );
}