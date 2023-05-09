import React, { Component } from 'react';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Rank from './components/rank/Rank';
import ParticlesBg from 'particles-bg';
import './App.css';



class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        joined: ""
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        joined: data.joined

      }
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({
        isSignedIn: false,
        user: {
          id: '',
          name: '',
          email: '',
          joined: '',
        },
      });
      
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };


  setUpAI = (imageURL) => {

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '36d67a7983a947fe988b85807dcf60a0';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'patografx';
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = imageURL;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result) {
          fetch('http://localhost:3000/image', {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(result))
      })
      // .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count }))
      })
      // .then(test =>  console.log(test))
      .catch(error => console.log('error', error));
  }

  calculateFaceLocation = (data) => {
    const faceDetect = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: faceDetect.left_col * width,
      topRow: faceDetect.top_row * height,
      rightCol: width - faceDetect.right_col * width,
      bottomRow: height - faceDetect.bottom_row * height
    };
  }

  displayFaceBox = (coordinates) => {
    this.setState({ box: coordinates });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = () => {
    this.setState({ imageURL: this.state.input });
    this.setUpAI(this.state.input);
  }

  changeRoute = (route) => {

    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {

    const { isSignedIn, imageURL, route, box } = this.state;

    return (
      <div className="App" >
        <div className='particle'>
          <ParticlesBg
            color="#ffffff"
            num={30}
            type="cobweb"
            bg={true}
          />
        </div>

        <Navigation
          changeRoute={this.changeRoute}
          isSignedIn={isSignedIn}
        />

        {route === 'signin' || route === 'signout'
          ? <div>
            <Signin
              changeRoute={this.changeRoute}
              loadUser={this.loadUser}
            />
          </div>
          : (
            route === 'register'
              ? <Register
                changeRoute={this.changeRoute}
                loadUser={this.loadUser}
              />
              : <div>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}
                />
                <FaceRecognition
                  imageURL={imageURL}
                  box={box}
                />
              </div>
          )
        }

      </div>
    );
  }
}

export default App;