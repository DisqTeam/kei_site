import React, { Component, ReactPropTypes } from 'react'
import ReactAudioPlayer from 'react-audio-player';
import './assets/index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'  
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab, fas)

interface listenTypes {
    exists: boolean;
    audio: Audio;
}

interface Audio {
    id: string;
    title: string;
    description: string;
    uploaded: number;
    expires: number;
    filesize: number;
    filename: string;
}

export default class upload extends Component<ReactPropTypes, listenTypes> {
    constructor(props: ReactPropTypes){
        super(props)
        this.state = {
            exists: false,
            audio: {
                id: "PLSACSX",
                title: "Audio does not exist!",
                description: "PLSACSX",
                uploaded: 0,
                expires: 0,
                filesize: 0,
                filename: "PLSACSX"
            }
        }
    }

    async componentDidMount() {
        let audioId = window.location.pathname.split("/")[1]
        fetch(`https://api.kei.disq.me/audio/get?id=${audioId}`)
            .then(res => res.json())
            .then(async (audioResponse) => {
                if(!audioResponse.success) return this.setState({exists: false})
                this.setState({exists: true})
                await this.setState(audioResponse)
            })
    }

    render() {
        return (
            <div>
                <div className="main_container supercenter">
                    <div className="side_container listen">
                        <div className="listen_stuff">
                            {(this.state.exists) ? <h2>{this.state.audio.title}</h2> : void(0)}
                            {(this.state.exists) ? <h4>{this.state.audio.description}</h4> : void(0)}
                            {(this.state.exists) ? <p><b>Uploaded</b> - {new Date(this.state.audio.uploaded * 1000).toLocaleString()}</p> : void(0)}
                            {(this.state.exists) ? <p><b>Expires</b> - {new Date(this.state.audio.expires * 1000).toLocaleString()}</p> : void(0)}
                            {(this.state.exists) ? <p><b>Audio ID</b> - <code>{this.state.audio.id}</code></p> : void(0)}
                            {(this.state.exists) ? <p><b>File size</b> - {(this.state.audio.filesize/1024/1024).toFixed(2)}MB</p> : void(0)}
                            {(this.state.exists) ? <p><b>Audio</b> - <br/> <AudioPlayer filename={this.state.audio.filename}/></p> : void(0)}
                            {(!this.state.exists) ? <div className="listen_errortext_container"><h1>{this.state.audio.title}</h1></div> : void(0)}
                        </div>
                        {(this.state.exists) ? <ShareButtons filename={this.state.audio.filename}/> : void(0)}
                    </div>
                </div>
            </div>
        )
    }
}

interface AudioPlayerProps {
    filename: string
}

class AudioPlayer extends Component<AudioPlayerProps> {
    render() {
        return (
            <div className="audioplayer">
                <ReactAudioPlayer src={"https://api.kei.disq.me/storage/" + this.props.filename} controls></ReactAudioPlayer>
            </div>
        )
    }
}

interface ShareButtonsState {
    copyText: string;
}

interface ShareButtonsProps {
    filename: string;
}

class ShareButtons extends Component<ShareButtonsProps, ShareButtonsState> {
    constructor(props: ShareButtonsProps){
        super(props)
        this.copytoclip.bind(this)
        this.state = {
            copyText: "Copy URL",
        }
    }

    copytoclip = () => {
        console.log("clip")
        navigator.clipboard.writeText(window.location.href)
        this.setState({copyText: "Copied!"})
    }

    render() {
        return(
            <div className="share listen_stuff">
                <h1>Share</h1>
                <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(window.location.href)}>
                    <button className="twitter copybutton"><FontAwesomeIcon className="btn_icon" icon={['fab', 'twitter']}/>Tweet</button>
                </a>
                <button onClick={this.copytoclip} className="copybutton">
                    <FontAwesomeIcon className="btn_icon" icon={['fas', 'link']}/>
                    {this.state.copyText}
                </button>
                <a href={"https://api.kei.disq.me/storage/" + this.props.filename} download={"kei_" + this.props.filename}>
                    <button className="copybutton"><FontAwesomeIcon className="btn_icon" icon={['fas', 'file-download']}/>Download file</button>
                </a>

                <h1>kei</h1>
                <a href="/">
                    <button className="copybutton"><FontAwesomeIcon className="btn_icon" icon={['fas', 'file-upload']}/>Upload new file</button>
                </a>
                <a href="https://github.com/disqTeam/kei">
                    <button className="copybutton"><FontAwesomeIcon className="btn_icon" icon={['fab', 'github']}/>GitHub</button>
                </a>
            </div>
        )
    }
}

function ErrorScreen() {
    return(
        <div className="side_container listen">
            <p className="listenError">This audio does not exist</p>
        </div>
    )
}