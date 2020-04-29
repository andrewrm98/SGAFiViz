import React from "react";
import './about.css'
/* We simply can use an array and loop and print each user */
const AboutPage = () => {
  return (
    <div>
      <br></br>
      <div className = "about-container box border center-text">
        <h1 className = 'title is-size-3'>The <span className = "red">SGA Mission</span> Statement</h1>
        <hr></hr>
        <h1 className = 'subtitle is-size-5'>The mission of SGA is to improve the quality of undergraduate student life at 
          the University both academically and socially by addressing student needs and concerns, providing financial 
          structure for WPI’s student clubs and organizations, and representing the student body in a profession manner.
        </h1>
      </div>
      <br></br>
      <div className = "columns">
        <div className = "column"></div>
        <div className = "column">
          <div className = "about-columns center-text box border has-background-light">
            <h1 className = "is-size-3">Want to get involved?</h1>
            <br></br>
            <h1 className = "is-size-5">Join a club, or start your own!</h1>
            <h1 className = "is-size-5">Attend campus events</h1>
            <h1 className = "is-size-5">Attend SAO events</h1>
          </div>
          
        </div>
        <div className = "column">
          <div className = "about-columns center-text box border has-background-light">
            <h1 className = "is-size-3">Want to find out more? Email:</h1>
            <br></br>
            <h1 className = "is-size-5">sgaexecs@wpi.edu,</h1>
            <h1 className = "is-size-5">sgasuggestions@wpi.edu,</h1>
            <h1 className = "is-size-5">or sgatreasurer@wpi.edu</h1>
          </div>
        </div>
        <div className = "column"></div>
      </div>
      <br></br>
    </div>
  );
};

export default AboutPage;