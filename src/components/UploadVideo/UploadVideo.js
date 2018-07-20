import React, { Component } from 'react';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import {Table, Button, Modal, Icon, ProgressBar} from 'react-materialize';
import './UploadVideo.css';

import firebase from 'firebase';
import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';
import { DataSnapshot } from '@firebase/database';

let storageRef;
let uploaded_videos;
let screenIndex;
let logFilesRef;
let videosRef;
let progress=0;
let screenName2;
let initialVideos;
let videoSize=0;
let videoName3;
let initialVideos2='video1';

let arrayPerScreen = [];
let arrayVideos = [];
let arrayScreens= [];
let gralInventory;
let videoNameList=[];

class UploadVideo extends Component {
    state = {
        selectedVideo: null,
        screenName: "Screen1",
        screens: "Screen1",
        size: 0,
        showResults: false,
        percent: null ,
        videos: [],
        videoList: [],
        gralInventory: [], //nuevo
        video2: [],
        videoListPerScreen: [],
        sendVideo: null,
        screenList: []
    }

    componentDidMount() {
        gralInventory= firebaseApp.database().ref().child("General_Inventory");
        storageRef= firebase.storage().ref();
        logFilesRef= firebaseApp.database().ref().child("Inventory");
        videosRef= firebaseApp.database().ref().child("General_Inventory");
        uploaded_videos= firebaseApp.database().ref().child("Uploaded_Videos");

        screenName2 = this.state.screenName;
        screenName2= screenName2.replace(" ",""); 
        let videoName2 = "";
        let videosGralInv= [];

        firebaseApp.database().ref(`General_Inventory/`) //show all videos in General Inventory in dropdown
          .on('value', (data) => {
              let values = data.val();
              this.setState({ videos: values }, () => {
                videosGralInv= [];
                Object.keys(this.state.videos).map((key, index) => {
                    initialVideos = this.state.videos[key];
                    videoName2= initialVideos.name;
                    //arrayVideos.push({name: videoName2, key:key});
                    videosGralInv.push({name: videoName2, key:key});  
                    this.setState({gralInventory:videosGralInv });
                    }
                  );
                });
             }, (err) => {
              console.log(err);
        });
        

        firebaseApp.database().ref(`General_Inventory/`) //first value for dropdown
        .orderByKey().limitToFirst(1).once('value', function(snap) {
            let newVal= snap.val();
            Object.keys(newVal).map((key, index) => {
                initialVideos2 =newVal[key]; //first videoName in list
            })    
        }).then((dataSnapshot) => {
            this.setState({sendVideo: initialVideos2.name}); //value name form object in initialVideos2
        });

        //when is Screen1 the first option
        /*
        firebaseApp.database().ref(`Inventory/${screenName2}/`) //first value for dropdowns, screen1
        .orderByKey().limitToFirst(1).once('value', function(snap) {
            let newVal= snap.val();
            Object.keys(newVal).map((key, index) => {
               
                console.log("snap.val()",snap.val());
                initialVideos2 =newVal[key]; //first videoName in list
                
                console.log("initial2UP", initialVideos2.name);  
                //this.setState({sendVideo: initialVideos2});
                console.log("screen to update", screenName2);
               
            })    
        }).then((dataSnapshot) => {
            this.setState({sendVideo: initialVideos2.name});
        });
        */
        

          firebaseApp.database().ref(`Inventory`) //Dropdown screens from database
          .on('value', (data) => {
              let values = data.val();
             
              this.setState({ screens: values }, () => {
                arrayScreens=[];
                Object.keys(this.state.screens).map((key, index) => {
                    arrayScreens.push({name: key, key:index}); 
                    this.setState({screenList: arrayScreens }); 
                    }
                );
            });

          }, (err) => {
              console.log(err);
          });  

    }

    showVideos = () => {
        this.setState({ showResults: true});
        
        screenName2 = this.state.screenName;
        screenName2= screenName2.replace(" ",""); 

        firebaseApp.database().ref(`Videos_per_Screen/${screenName2}/`) //Dropdown videos per screen
        .on('value', (data) => {
            let values2 = data.val();
            let amountVideos= values2.Amount_of_Videos;          
            videoNameList=[];
            Object.keys(values2).forEach(function(e) {
                console.log(`key=${e}  value=${values2[e]}`);
                videoNameList.push({name: values2[e], key:e});  
                
            });

            this.setState({videos: videoNameList }) ; 

        }, (err) => {
            console.log(err);
        });

        /*
        firebaseApp.database().ref(`Inventory/${screenName2}/`)
            .on('value', (data) => {
                let values = data.val();
                this.setState({ videos: values });
                console.log("originalValues",values)

            }, (err) => {
                console.log(err);
            });
        */
    }
   

    handleScreenChange = (name, value) => {
        arrayVideos = [];
        this.setState({ screenName: value});

        screenName2 = value;
        screenName2= screenName2.replace(" ",""); 
    }

    handleVideoChange = (name, value) => {
        this.setState({ sendVideo: value});
        console.log("sendVideo",value);
    }


    filesSelectedHandler = (event) => {
       this.setState({
           selectedVideo: event.target.files[0]
       })

    }

    applyScreen = () => {  
         
        if (this.state.sendVideo === null){
            alert("Browse a video to upload")
        }

        else{
            console.log("this.state.sendVideo",this.state.sendVideo);
            screenIndex= this.state.screenName;
            screenIndex= screenIndex.replace(" ","");             
            videoName3= this.state.sendVideo;
            
            let repeated=false;
            //query for same name
            firebaseApp.database().ref(`Inventory/${screenIndex}/`)
            .orderByChild('name').equalTo(`${videoName3}`).on("child_added", function(data) {
                console.log(data.val().name);   
                repeated= true;
            });

            if(repeated === true){
                alert(`Video already uploaded to ${screenIndex}, try another video`)
            }

            else{
                 //push to inventory and update "Uploaded Video"
                logFilesRef.child(`${screenIndex}`).push({ name: videoName3})
                .on('child_added', function(snap) {
                        //videoName3= videoName3.replace(/\s/g,'');
                        videoName3 = videoName3.replace("(", "_");
                        videoName3 = videoName3.replace(")","_");
                        videoName3 = videoName3.replace(/ /g,"_");
                        uploaded_videos.child(`${screenIndex}`).update({ Trigger: 1, Video_Name: videoName3}); 
                });
                
                alert(`Send to ${screenIndex}`);
                window.location.reload();
            }
            
        }
       
        
    }

    applyAll = () => {
        //let numberOfChildren;
        if (this.state.sendVideo === null){
            alert("Browse a video to upload")
        }

        else{
            videoName3= this.state.sendVideo;
            logFilesRef.once('value', function(snapshot) {
               //numberOfChildren= snapshot.numChildren(); //get number of immediate children
               let i=0
               snapshot.forEach(function(snap){
                    i=i+1;
                    logFilesRef.child(`Screen${i}`).push({ name: videoName3})
                        .on('child_added', function(snap) {
                            videoName3= videoName3.replace(/\s/g,'');
                            uploaded_videos.child(`Screen${i}`).update({ Trigger: 1, Video_Name: videoName3 });
                    });
                                            
               });
            })
            alert('Send to all screens');
            window.location.reload();
        }
        
    }


    fileUploadHandler = () => {         
       const fd= new FormData();
       let videoName;
       let videoNameDB;
       
       if(this.state.selectedVideo == null){
           alert("enter a video to upload");
       }

       else {
        fd.append('image', this.state.selectedVideo, this.state.selectedVideo.name);
        videoName= this.state.selectedVideo.name;
        videoNameDB= this.state.selectedVideo.name;
        videoName= videoName.replace(/\s/g,'');
        videoSize= this.state.selectedVideo.size;
        videoSize= videoSize/1000000;
        videoSize= `${videoSize}MB`; 
        screenIndex= this.state.screenName;
        screenIndex= screenIndex.replace(" ",""); 
        
        let existInDatabase= false;
       
        //query de buscar archivo
        gralInventory.orderByChild('name').equalTo(`${videoNameDB}`).on("child_added", function(data) {
            console.log(data.val().name);   
            existInDatabase= true;
        });

        if (existInDatabase === false){
            let uploadTask= storageRef.child(`Videos/${videoName}`).put(this.state.selectedVideo);
            const self = this;

            uploadTask.on('state_changed',
                function(snapshot){
                    progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    self.setState({percent: progress }) ; 

                }, function(error){
                    alert("hubo un error")

                }, function(){  //success callback
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        //console.log('File available at ', downloadURL);
                        videosRef.push({ name: videoNameDB, 
                                        size: videoSize, 
                                        url: downloadURL});
                        
                        window.location.reload();
                    });
                }
                )
        }
        else{
            alert("Cannot be added, File already exists in database")
        }
            
        }
    }

    render() {
        return (
            <div className="PromoLoop" >
               
                <div>
                    <h2 className="headerScheduler"> Upload Content </h2> 

                    <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit met, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            </Modal>
                    </span>
                
                </div>
                
                <div className="row">
                    <div className="col s12">
                    </div>
                </div>

                <div className="addBorderUpload">
                    <div className="row">
                        
                            <h5> Upload new content to root directory </h5>
                            
                            <div className="row">
                                <div className= "col s6 ">
                                    <label> 
                                            <input type="file"  
                                            className="inputName" 
                                            onChange={this.filesSelectedHandler} 
                                            id={this.state.videoName}
                                            />           
                                    </label>
                                
                                </div>

                                <div className="col s6">
                                    <Button  className="uploadBtn" onClick={() => {
                                        this.fileUploadHandler();}}
                                        >Upload File </Button> 
                                    <br/>
                                </div>
                            </div>
                       
                    </div>
                    <div className="row">
                        <div className="col s12">
                                
                                <ProgressBar progress={this.state.percent}/>
                        </div>
                    </div>
                </div>
   
               <div className="row">
                    <div className="col s12">                   
                            <br/>
                            <p className="titleHead"> All available videos  </p>
                            <p> Please select a video to sync in screen(s) </p>
                            
                                <DropdownScreen 
                                    handleChange={this.handleVideoChange}
                                    name="video"
                                    items={this.state.gralInventory}
                                    
                                />  
                       
                    </div>
                </div>
                        
                <div className="row">
                    <div className="selectScreenQS">
                        <div className=" col s12">
                            <br/>   
                            <p className="titleHead"> Select a screen </p>
                            <DropdownScreen 
                                handleChange={this.handleScreenChange}
                                name="video"
                                items={this.state.screenList}
                                
                            />
                        </div>
                    </div>
                </div>
            
            
                <div className="row">
                
                    <div className="col s12">
                        <p> Upload video to selected screen </p>
                            <Button onClick={() => {
                                this.applyScreen();}}
                                > Send </Button>     
                    </div>
                     
                </div>

                <div className="row">
                  <div className="col s12">
                    <br/>
                    <p > Click on the following button to see the current videos per each screen</p> 
                        <Button onClick={() => {
                            this.showVideos();}}
                            > Show Videos </Button>     
                  </div>
                </div>      
                                
                { this.state.showResults ? (
                    <div className="row">
                            <div className="pageCenter">
                                <Table className="quickTable">
                                    <thead>
                                        <tr>
                                            <th> Video Name</th>
                                          
                                        </tr>
                                    </thead>

                                    <tbody>
                                         {
                                            Object.entries(this.state.videos).map(([key, videos]) => (
                                                <tr key={key} >
                                                    <td> {videos.name}</td>
                                                   
                                                </tr>

                                            ))
                                        }
                                    </tbody>

                                </Table>
                            </div>
                     </div>) : <br/>
                }
            
            </div>
        )
    }
}
export default UploadVideo;



