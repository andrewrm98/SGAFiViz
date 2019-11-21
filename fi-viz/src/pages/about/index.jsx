import React from "react";
/* We simply can use an array and loop and print each user */
const AboutPage = () => {
  return (
    <div>
      <ul>
        {["Julian", "Andrew", "Katherine", "Peter", "Lane"].map((user, idx) => {
          return <li key={idx}>{user}</li>;
        })}
      </ul>
    </div>
  );
};

export default AboutPage;