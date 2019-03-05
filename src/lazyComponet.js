import React from "react";

export default (props) => {
    return(
        <div>
{/* Album */}
        <div className={props.albumIndex === 0 ? "album" : "hide"} onClick={props.handleClick} id={props.data.id}>
            <h2 id={props.data.id}>Album: {props.data.albumId}</h2>
            <img src={props.data.thumbnailUrl} className="App-logo" alt="props.data.title" />
        </div>
{/* Photo */}
        <div className={props.albumIndex && props.photoIndex === -1 ? "photo" : "hide"} onClick={props.handleClick} id={props.data.id}>
            <h2 id={props.data.id}>Album: {props.data.albumId}</h2>
            <img src={props.data.thumbnailUrl} className="App-logo" alt="props.data.title" />
            <p id={props.data.id}>{props.data.url}</p>
        </div>

        
        </div>
    )
}