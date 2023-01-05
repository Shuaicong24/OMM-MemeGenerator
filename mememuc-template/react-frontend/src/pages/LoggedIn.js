import React from "react";

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }

  componentDidMount() {
    fetch("http://localhost:3002/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        this.setState({ userData: data.data });
      });
  }

  render() {
    return (
      <div>
        <h1>TODO: Need to show personal posts</h1>
      </div>
    );
  }
}

export default LoggedIn;
