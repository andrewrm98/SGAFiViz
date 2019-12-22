import React, { Component } from 'react';
import "./story.css"
import Plot from 'react-plotly.js';

class Chart extends Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {autosize: true, width: 600, height: 600, title: 'A Fancy Plot'} }
      />
    );
  }
}

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {
      budgets: [],
      fiscal_year: 2020,
      transferstotal: 273302.00,
      budgetstotal: 823527.27,
      requesttotal: 400000.00,
      SLF: 316
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const response = await fetch('/api/home');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.setState({ budgets: body.budgets });
  }

  render() {
    return (
      <div>
        <div class = "columns margin">
          <div class = "column story-container white notification is-half">
            <div>
              <h1 class = "title">What is the Student Life Fee (SLF)?</h1>
              <p>Every WPI Student pays a small fee, through their tuition, so that the clubs on campus 
                have funds to be run and mantained. 
                The Student Goverment Association (SGA), handles these funds in order to give each club a budget, 
                as well as to fulfill certain funding requests if they deem the club has an acceptable need.</p>
            </div>
            
          </div>
          <div class = "column is-half">
            Insert student life fee example image here
          </div>
        </div>

        <div class = "content divide notification">
          <h1 class = 'white title'>Where Does That Money Go?</h1>
          <h1 class = 'white subtitle is-4'>The Budget Breakdown</h1>
          <div class = "notification has-background-white no-padding">
          <h1 class = 'subtitle is-4 align-text black bold'>Fiscal Year: {this.state.fiscal_year} - Student Life Fee: ${this.state.SLF}</h1>
          </div>
        </div>

        <h1 class = 'subtitle is-4 align-text'>The overall budget is allocated among these three student services.</h1>
          

        <div class = "columns">
          <div class = "column">
            <div class = 'notification align-text is-danger'>
              <h1 class = 'subtitle is-3'>Mandatory Transfers</h1>
              <h1 class = 'subtitle is-4'>${this.state.transferstotal}</h1>
            </div>
          </div>
          <div class = "column">
            <div class = 'notification align-text is-warning'>
              <h1 class = 'subtitle is-3'>Organization Budgets</h1>
              <h1 class = 'subtitle is-4'>${this.state.budgetstotal}</h1>
            </div>
          </div>
          <div class = "column">
            <div class = 'notification align-text is-info'>
              <h1 class = 'subtitle is-3'>Sponsorship & Rollbacks</h1>
              <h1 class = 'subtitle is-4'>${this.state.requesttotal}</h1>
            </div>
          </div>
        </div>

        <div class = 'columns'>
          <div class = "column">
            <div class = "notification has-background-light">
              Covers a variety of widely-used campus services such as:
              <div class = 'list'>
                <div class = 'list-item'>SNAP</div>
                <div class = 'list-item'>Club Sports Coaches</div>
                <div class = 'list-item'>Campus Labs</div>
                <div class = 'list-item'>City Ride</div>
                <div class = 'list-item'>International and Leadership Programs</div>
                <div class = 'list-item'>SAO and Club Sport Interns</div>
                <div class = 'list-item'>Goat's Head Programming</div>
                <div class = 'list-item'>Greek Life Programming</div>
              </div>
              This funding also enables club sport participants to receive gym credit!
            </div>
          </div>
          <div class = "column">
            <div class = "notification has-background-light">
              Organizations can request an annual budget. SGA approves budgets that
              align with their bylaws, fit the purpose of the blub, and have been approved
              through a funding request. Organizations are filtered by class:
              <div class = "list">
                <div class = "list-item">
                  <h1 class = "bold">Class One:</h1>
                  <p>Special Interests (Hobbies/Community Outreach)</p>
                </div>
              </div>
              <div class = "list">
                <div class = "list-item">
                  <h1 class = "bold">Class Two:</h1>
                  <p>Club Sports</p>
                </div>
              </div>
              <div class = "list">
                <div class = "list-item">
                  <h1 class = "bold">Class Three:</h1>
                  <p>Clubs that provide programming or services to the entire campus</p>
                </div>
              </div>
            </div>
          </div>
          <div class = "column">
            <div class = "notification has-background-light">
              <p>The remaining SLF budget is allocated here, as Sponsorship, after Mandatory Transfers and Organization Budgets have
              been resolved. Rollbacks include any funds that were leftover from the previous fiscal year.</p>
              <br></br>
              <p>The combined sponsorship & rollbacks are used for Funding Requests (FR). FRs are meants to supplement club budgets, or
              provide funds for organizations that do not receive an annual budget. FRs are heard by the Financial Board, and are approved
              or denied based on the organization's need.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Page extends Component {
  render() {
    return (
      <div>
        <Story/>
        <Chart/>
      </div>
    )
  }
}

export default Page;