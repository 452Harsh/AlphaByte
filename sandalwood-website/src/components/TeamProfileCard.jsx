import Image from "next/image";
import React from "react";

// TeamMemberCard component
const TeamMemberCard = ({ name, title, description, image }) => (
  <div className="bg-gray-700 dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition duration-500 hover:shadow-2xl hover:-translate-y-3">
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 mx-auto mb-4 shadow-lg rounded-full overflow-hidden">
        <Image
          className="object-cover"
          src={image}
          alt="profile picture"
          layout="fill"
        />
      </div>
      <h3 className="text-xl font-semibold text-white dark:text-gray-200 text-center">{name}</h3>
      <p className="text-gray-200 dark:text-gray-400 text-lg text-center mb-2">{title}</p>
      <p className="text-md text-gray-300 dark:text-gray-500 text-center">{description}</p>
    </div>
  </div>
);

// TeamSection component
const TeamSection = () => {
  const teamMembers = [
    {
      name: "Jeet",
      title: "Full stack Developer",
      description:
        "I love writing code, designing scalable solutions and gaming in my free time.",
      image: "/Jeet.jpeg",
    },
    {
      name: "Harsh",
      title: "AI Expert",
      description:
        "Love coding, enthusiastic about the Artificial intelligence and Web3 space, learning more...",
      image: "/Harsh.jpeg",
    },
    {
      name: "Devyaansh",
      title: "Web Developer",
      description:
        "Developer with extensive experience in the MERN stack. Capable of researching cutting-edge  solutions.",
      image: "/Dev.jpeg",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 dark:bg-gray-800 flex items-center justify-center min-h-screen">
      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="container mx-auto text-center"
      >
        <h2 className="text-5xl text-white dark:text-gray-200 font-semibold mb-16">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
