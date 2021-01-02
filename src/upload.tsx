import React, { Component, ReactPropTypes } from 'react'
import Dropzone from 'react-dropzone'

import './assets/index.css';
import KeiLogo from './assets/kei.png'
import StringyChanImg from './assets/stringychan.png'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'  
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab, fas)

interface uploadStateTypes {
    showChan: boolean;
    side: JSX.Element;
}

export default class upload extends Component<ReactPropTypes, uploadStateTypes> {
    constructor(props: ReactPropTypes){
        super(props)

        this.state = {
            showChan: false,
            side: <UploadPrompt SS={this.sideState}/>
        }
        this.sideState.bind(this)
    }

    sideState = async (component: JSX.Element) => {
        this.setState({side: component})
    }

    render() {
        return (
            <div>
                <div className="main_container supercenter">
                    <KeiBrand/>
                    {this.state.side}
                </div>
                {this.state.showChan ? <StringyChan/> : void(0)}
                <button className="togglechan" onClick={() => this.setState({showChan: true})}>???</button>
            </div>
        )
    }
}

function StringyChan() {
    return(
        <img className="stringychan" src={StringyChanImg} alt="Stringy Chan"></img>
    )
}

function KeiBrand(){
    return(
        <div className="side_container side_container-left">
            <img src={KeiLogo} className="kei_logo" alt="Kei"></img>
        </div>
    )
}

function Buttons(){
    return(
        <div className="buttons_container">
            <a href="https://github.com/disqTeam/kei"><button><FontAwesomeIcon icon={['fab', 'github']} />GitHub</button></a>
            <a href="https://disq.me"><button>Disq</button></a>
            {/* <a href=""></a><button>API Docs</button> */}
        </div>
    )
}


interface UploadPromptProps{
    SS: (component: JSX.Element) => void;
}

interface UploadPromptStateTypes{
    files: Array<File>;
}


class UploadPrompt extends Component<UploadPromptProps, UploadPromptStateTypes>{
    onDrop: (files: any) => void;
    constructor(props: UploadPromptProps){
        super(props);
        this.onDrop = async (files) => {
            await this.props.SS(<UploadConfirm file={files}/>)
        }
        this.state = {
            files: []
        }
    }

    render(){
        return(
            <div className="side_container side_container-right">
                <h1 className="main_text">kei</h1>
                <p className="subtitle">
                    A temporary music file uploader that supports mp3, wav and ogg files. 🎵🎶
                </p>
                <Buttons/>
                <Dropzone onDrop={this.onDrop}>
                    {({getRootProps, getInputProps}) => (
                        <div className="dropzone" {...getRootProps()}>
                            <input {...getInputProps()}/>
                            <FontAwesomeIcon className="uploadicon" icon={['fas', 'file-upload']} size="6x" />
                            <p>Drag a file here or click to upload</p>
                        </div>
                    )}
                </Dropzone>
                <p className="smoltext">30MB max size, wav, ogg and mp3 only</p>
            </div>
        )
    }
}

interface UploadConfirmProps{
    file: Array<File>;
}

interface UploadConfirmState{
    title: string;
    description: string;
    error: string;
}

class UploadConfirm extends Component<UploadConfirmProps, UploadConfirmState> {
    constructor(props: UploadConfirmProps){
        super(props)

        this.state = {
            title: "",
            description: "",
            error: "Upload"
        }
    }
    componentDidMount(){
        console.log(this.props.file)
    }

    upload = async () => {
        let stuff = new FormData()
        stuff.append("audio_file", this.props.file[0])
        stuff.append("title", this.state.title)
        stuff.append("description", this.state.description)

        this.setState({error: "Uploading.."})
        
        let res = await fetch(`https://api.kei.disq.me/audio/new`, {
            method: "POST",
            body: stuff
        })
        let audioRes = await res.json()
        if(!audioRes.success) return this.setState({error: audioRes.description})
        if(audioRes.id) return window.location.href = `/${audioRes.id}`
    }

    render() {
        return (
            <div className="side_container side_container-right">
                <h1 className="main_text">Upload</h1>

                <h4 className="meta_describe">Title</h4>
                <input type="text" className="textbox" placeholder="My cool audio" onChange={(e) => this.setState({title: e.target.value})}></input>

                <h4 className="meta_describe">Description</h4>
                <textarea className="textbox desc_box" name="w3review" placeholder="A cool audio by a cool person" onChange={(e) => this.setState({description: e.target.value})}></textarea>
                {/* <input type="text" className="textbox  desc_box" placeholder="A cool audio by a cool person"></input> */}

                <h4 className="meta_describe">File</h4>
                <div className="meta_dummyFileBox">
                    <FontAwesomeIcon className="dummyicon" icon={['fas', 'file-upload']} size="4x" />
                    <p>{this.props.file[0].name}</p>
                </div>

                <button onClick={this.upload} className="copybutton uploadbutton">
                    {this.state.error}
                </button>
            </div>
        )
    }
}
