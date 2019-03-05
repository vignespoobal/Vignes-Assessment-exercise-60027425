import React, { Component, lazy, Suspense } from 'react';
import logo from './logo.svg';

//Lasy
const LazyPhotoComponet = lazy(() => import("./lazyComponet"));



class lazyContainer extends Component {
    constructor(){
        super();
        this.state = {
            albumDB: [],
            photoDB: [],
            isConected: false,
            albumLevel: false,
            albumIndex: 0,
            photoIndex: -1,
            isMore: true
        };
    };

    componentDidMount(){
        // fetch('https://jsonplaceholder.typicode.com/photos/1')
        fetch('https://jsonplaceholder.typicode.com/photos/')
        .then(response => response.json())
        .then(data => {

            let count = Object.keys(data).length;
            let db=[], x = 0, num = 0;

            for(let i=0; i<count; i++){
                if(data[i].albumId !== num){
                    num = data[i].albumId;
                    db[x] = {"albumId": num, "id": data[i].id, "thumbnailUrl": data[i].thumbnailUrl, "title": data[i].title};
                    x++;
                }
            }
            this.setState({
                albumDB: db,
                photoDB: db,
                isConected: true,
                albumLevel: true
            });
        });
    };

    handleClick = (event) => {/*No bind needed */
        let id = event.target.id, album = 0, urlIndex = 0;

        if(this.state.albumLevel){//Get the clicked album id
            let x = 0, y = parseInt(id);
            for (x in this.state.photoDB){
                if(this.state.photoDB[x].id === y){
                    album = this.state.photoDB[x].albumId;
                }
            }

        let s = parseInt(id) - 1, end = s+5; //s = 0; end = 5;
        fetch('https://jsonplaceholder.typicode.com/photos?_start='+ s + '&_end=' + end)
        .then(response => response.json())
        .then(data => {
            this.setState({
                albumIndex: album,
                albumLevel: false,
                photoIndex: -1,
                photoDB: data,
                isConected: true,
            });
        });
        }
        else {//Inside selected Album
            if(id === "backToAlbum"){//If back to Album is clicked
                this.setState({
                    photoDB: this.state.albumDB,
                    albumIndex: 0,
                    albumLevel: true,
                    photoIndex: -1
                })
            }
            else if(id === "loadMore"){
                let count = Object.keys(this.state.photoDB).length,
                s = parseInt(this.state.photoDB[count-1].id), end = s+5;;

                fetch('https://jsonplaceholder.typicode.com/photos?_start='+ s + '&_end=' + end)
                .then(response => response.json())
                .then(data => {
                    let db = this.state.photoDB.concat(data)
                    this.setState({
                        photoDB: db
                    });
                });
            }
            else {//If Photo is clicked
                if(this.state.albumIndex) {//If Album id is not 0
                    if(id === "photo_"){//If selected Photo is in full view then close it
                        this.setState({
                            photoIndex: -1
                        })
                    } else {//Display the selected photo in full view
                        let x = 0;
                        for (x in this.state.photoDB){
                            if(this.state.photoDB[x].id === parseInt(id)){
                                urlIndex = x;
                            }
            
                        }
                        this.setState({
                            photoIndex: urlIndex
                        })
                    }
                }
            }

        }

    }

    render() {
        
        const clickedUrl = this.state.photoIndex === -1? null : this.state.photoDB[this.state.photoIndex].url;

        const imageStyle={
            backgroundColor: "#fff",
            backgroundImage: 'url('+ clickedUrl +')'
        }
            const photoComponets = this.state.photoDB.map(
            item => 
            <LazyPhotoComponet key={item.id} data={item}            
            albumIndex={this.state.albumIndex}
            photoIndex={this.state.photoIndex}
            handleClick={this.handleClick}
            />
            )
      return (
        <div id="Parent">
            <Suspense fallback={<div>Loading ....<img src={logo} className="App-logo" alt="logo" /></div>}>
            <h1 style={{fontSize:"24px"}}>Vignes Assessment exercise 60027425</h1>
            <div className={this.state.albumIndex ? "back" : "hide"} id="backToAlbum" onClick={this.handleClick} >BackToAlbum</div>

            {photoComponets}

            <h3 className={this.state.albumIndex ? "back" : "hide"} id="loadMore" onClick={this.handleClick} >Load more</h3>

            <div className={this.state.photoIndex === -1 ? "hide" : null} id="photo_" onClick={this.handleClick} style={imageStyle}></div>

            </Suspense>
        </div>
      );
    }
  }
  
  export default lazyContainer;