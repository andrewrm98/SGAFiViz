import React from "react";
import './about.css'
/* We simply can use an array and loop and print each user */
const AboutPage = () => {
  return (
    <div>
      <br></br>
      <div class = "about-container notification center-text">
        <h1 class = 'title is-size-3 white'>The SGA Mission Statement</h1>
        <hr></hr>
        <h1 class = 'subtitle is-size-5 white'>The mission of SGA is to improve the quality of undergraduate student life at 
          the University both academically and socially by addressing student needs and concerns, providing financial 
          structure for WPI’s student clubs and organizations, and representing the student body in a profession manner.
        </h1>
      </div>
      <br></br>
      <div class = "columns">
        <div class = "column"></div>
        <div class = "column">
          <div class = "center-text notification has-background-light">
            <h1 class = "is-size-3">Want to get involved?</h1>
            <h1 class = "is-size-5">Join a club, or start your own!</h1>
            <h1 class = "is-size-5">Attend campus events</h1>
            <h1 class = "is-size-5">Attend SAO events</h1>
          </div>
          
        </div>
        <div class = "column">
          <div class = "center-text notification has-background-light">
            <h1 class = "is-size-3">Want to find out more?</h1>
            <h1 class = "is-size-5">Email sgaexecs@wpi.edu,</h1>
            <h1 class = "is-size-5">sgasuggestions@wpi.edu,</h1>
            <h1 class = "is-size-5">or sgatreasurer@wpi.edu</h1>
          </div>
        </div>
        <div class = "column"></div>
      </div>
      <br></br>
    
      <div class = "about-container notification center-text">
      <h1 class = 'title is-size-3 white'>Administrator Access</h1>
      <a href="https://fp-admin-page.glitch.me/" class="is-size-4 white">https://fp-admin-page.glitch.me/</a>
      </div>
      <br></br>
    </div>
  );
};

export default AboutPage;