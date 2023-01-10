import React from "react";
import MemeMaker from "./MemeMaker";

class Meme extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            templates: []
        }

        this.getTemplates = this.getTemplates.bind(this);
//        this.getRandomMeme = this.getRandomMeme.bind(this);
    }

    // getRandomMeme() {
    //     const index = Math.floor(Math.random()*templates.length);
    //     const randomMeme = templates[index];
    //     console.log(randomMeme);
    //     setTemplate(randomMeme)
    // }

    render() {
        return (
            <div>
                Hello
                hh{this.state.templates.length}
            </div>
        );
    }
}

export default Meme;