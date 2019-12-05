import React from "react";
import './about.css'
/* We simply can use an array and loop and print each user */
const AboutPage = () => {
  return (
    <div>
      <div class = "big-container notification center-text">
        <h1 class = 'title is-size-2'>The SGA Mission Statement</h1>
        <hr></hr>
        <h1 class = 'subtitle is-size-4'>The mission of SGA is to improve the quality of undergraduate student life at 
          the University both academically and socially by addressing student needs and concerns, providing financial 
          structure for WPI’s student clubs and organizations, and representing the student body in a profession manner.
        </h1>
      </div>

      <div class = "center-text">
        <h1 class = "is-size-3">Want to get more out of your student life fee?</h1>
        <h1 class = "is-size-4">Join A Club</h1>
        <h1 class = "is-size-4">Go To Events</h1>
        <h1 class = "is-size-4">Start a Club</h1>
        <h1 class = "is-size-4">Attend SAO Events</h1>
        <br></br>
        <br></br>
        <h1 class = "is-size-3">Want to find out more?</h1>
        <h1 class = "is-size-4">Email sgaexecs@wpi.edu,</h1>
        <h1 class = "is-size-4">sgasuggestions@wpi.edu,</h1>
        <h1 class = "is-size-4">or sgatreasurer@wpi.edu</h1>
      </div>

      <div class = "big-container notification center-text">
      <h1 class = 'title is-size-2'>Administrators Access</h1>
      <a href="https://fp-admin-page.glitch.me/" class="is-size-3">https://fp-admin-page.glitch.me/</a>
      </div>
    </div>
  );
};

export default AboutPage;