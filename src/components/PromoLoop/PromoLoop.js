import React, { Component, Fragment } from 'react';
import { Button, Modal, Icon} from 'react-materialize';
import Dropdown from '../Dropdown/Dropdown';
import DropdownScreen from '../DropdownScreen/DropdownScreen';

import './PromoLoop.css';

import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let screen2Push;
let video2Push;
let startTime;
let endTime;
let startMin;
let startHr;
let endMin;
let endHr;
let IntStartHr;
let IntStartMin;
let IntEndtHr;
let IntEndMin;

let arrayScreens= [];
let arrayVideos= [];
let initialVideos;
let videoName2;
let screenName2;
let videoNameList= [];

let promoLoopRef;
let startDB;
let endDB;


const timeNumberMin = [];

const timeNumberHour = [];

const timeNumber = [];

for(let i = 0 ; i <= 59 ; i++ ) {
    timeNumberMin.push({name: `${i}`, key: i})
}

for(let i = 0 ; i <= 23 ; i++ ) {
    timeNumberHour.push({name: `${i}`, key: i})
}

for (let i=0; i <= 23 ; i++){

    for (let j=0 ; j<= 59 ; j=j+15){
        
        if (i<10 && j < 10)
        {
            timeNumber.push({key: `0${i}:0${j}`, name: `0${i}:0${j}`});
        }

        if (i<10 && j >= 10)
        {
            timeNumber.push({key: `0${i}:${j}`, name: `0${i}:${j}`});
        }

        if (i>=10 && j >= 10)
        {
            timeNumber.push({key: `${i}:${j}`, name: `${i}:${j}`})
        }
        
    }

}


class PromoLoop extends Component {

    state = {
        screenName: 'Screen1',
        selectedVideo: 'test',
        screenList: [],
        videoList: [],
        screens: [],
        videos: [],
        schedules: [
            {
                video: 'promo',
                start: '00:00',
                end: '00:00',
            },
        ]
    }
    componentDidMount() {
        let initialVideos2;
        promoLoopRef= firebaseApp.database().ref().child("LoopPromo");

        firebaseApp.database().ref(`Inventory`) //screens
        .on('value', (data) => {
            let values = data.val();
            arrayScreens=[];
           this.setState({ screens: values }, () => {
              Object.keys(this.state.screens).map((key, index) => {
                  arrayScreens.push({name: key, key:index}); 
                  this.setState({screenList: arrayScreens }); 

                  //return arrayScreens;
             }
          );
         });

        }, (err) => {
            console.log(err);
        });
        
        screenName2 = this.state.screenName;

         // set SET DEFAULT VALUES for first screen //
         firebaseApp.database().ref(`Inventory/${screenName2}/`) //first value for dropdowns, screen1
         .orderByKey().limitToFirst(1).once('value', function(snap) {
             let newVal= snap.val();
             Object.keys(newVal).map((key, index) => {
                 initialVideos2 =newVal[key]; //first videoName in list       
             })    
         }).then((dataSnapshot) => {
             this.setState({selectedVideo: initialVideos2.name});
         });
         // set SET DEFAULT VALUES for first screen //


        
        firebaseApp.database().ref(`Inventory/${screenName2}/`) // videos per screen
        .on('value', (data) => {
              let values = data.val();
              this.setState({ videos: values }, () => {
                arrayVideos = [];
                arrayScreens = [];
                Object.keys(this.state.videos).map((key, index) => {
                    initialVideos = this.state.videos[key]
                    videoName2= initialVideos.name;
                    arrayVideos.push({name: videoName2, key:key});  
                    //this.setState({videoList: arrayVideos }) ; 

                    return arrayVideos;
              }
            );
            });
          }, (err) => {
              console.log(err);
          });
         
          /*
          firebaseApp.database().ref(`Videos_per_Screen/${screenName2}/`) //Dropdown videos per screen
         .on('value', (data) => {
            let values2 = data.val();
            let amountVideos= values2.Amount_of_Videos;          
            arrayVideos=[];
            
            Object.keys(values2).forEach(function(e) {
                console.log(`key=${e}  value=${values2[e]}`);
                arrayVideos.push({name: values2[e], key:e});  
                
            });
    
        }, (err) => {
            console.log(err);
        });
        */


    }

    handleVideoChange = (name, value) => {
        this.setState({ selectedVideo: value});
     
        console.log("entraaa video change", value);
        
    }

    handleScheduleChange = (index, name, value) => {
        const schedules = this.state.schedules;
        const scheduleToModify = schedules[index];

        scheduleToModify[name] = value;
        schedules[index] = scheduleToModify;

        this.setState({schedules}, () => {
            console.log(this.state.schedules[index]);
        });
    }


    handleScreenChange = (name, value) => {
        this.setState({ screenName: value}, () => {
        screenName2= this.state.screenName;
            
            firebaseApp.database().ref(`Inventory/${screenName2}/`) // videos per screen
            .on('value', (data) => {
                  let values = data.val();
                  this.setState({ videos: values }, () => {
                    arrayVideos = [];
                    arrayScreens = [];
                    Object.keys(this.state.videos).map((key, index) => {
                        initialVideos = this.state.videos[key]
                        videoName2= initialVideos.name;
                        arrayVideos.push({name: videoName2, key:key});  
                        this.setState({videoList: arrayVideos }) ; 

                        //return arrayVideos;
                  }
                );
                });
              }, (err) => {
                  console.log(err);
              });

        });
    }


    sendToDbAll = () => {
        this.setState(prevState => {  
            //pull states
            startTime= this.state.schedules[0].start;
            endTime= this.state.schedules[0].end;

            //negative indexes
            startHr = startTime.slice(0,-3);
            startMin = startTime.slice(-2);

            IntStartHr = parseInt(startHr,10);
            IntStartMin = parseInt(startMin,10);

            endHr = endTime.slice(0,-3);
            endMin = endTime.slice(-2);

            IntEndtHr = parseInt(endHr,10);
            IntEndMin = parseInt(endMin,10);
            
            if (IntStartHr > IntEndtHr){
                alert('Invalid Schedule');
            }

            if (IntStartHr === IntEndtHr && IntStartMin > IntEndMin){
                alert('Invalid Schedule');
            }

            if (IntStartHr === IntEndtHr && IntStartMin === IntEndMin){
                alert('Invalid Schedule');
            }

    
            else{
                //let numberOfChildren;
                let i=0;
                
                startDB= this.state.schedules[0].start;
                endDB= this.state.schedules[0].end;
                video2Push= this.state.selectedVideo;

                console.log(startDB);
                console.log(endDB);

                promoLoopRef.once('value', function(snapshot) {
                    //numberOfChildren= snapshot.numChildren(); //get number of immediate children
                    snapshot.forEach(function(snap){
                        i=i+1;
                        promoLoopRef.child(`Screen${i}`).update({
                            "videoName": video2Push,
                            "startTime": startDB,
                            "endTime": endDB,
                            "Trigger": 1
                        });                
                    });

                    alert('Send to all screens');
                    window.location.reload();
                })
             }   
            

       });      
    }

    sendToDb = () => {
        this.setState(prevState => {
            //pull states
            startTime= this.state.schedules[0].start;
            endTime= this.state.schedules[0].end;

            //negative indexes
            startHr = startTime.slice(0,-3);
            startMin = startTime.slice(-2);

            IntStartHr = parseInt(startHr,10);
            IntStartMin = parseInt(startMin,10);

            endHr = endTime.slice(0,-3);
            endMin = endTime.slice(-2);

            IntEndtHr = parseInt(endHr,10);
            IntEndMin = parseInt(endMin,10);
            
            if (IntStartHr > IntEndtHr){
                alert('Invalid Schedule');
            }

            if (IntStartHr === IntEndtHr && IntStartMin > IntEndMin){
                alert('Invalid Schedule');
            }

            if (IntStartHr === IntEndtHr && IntStartMin === IntEndMin){
                alert('Invalid Schedule');
            }

            
            else{  
                video2Push= this.state.selectedVideo;
                screen2Push= this.state.screenName;

                startDB= this.state.schedules[0].start;
                endDB= this.state.schedules[0].end;

                screen2Push= screen2Push.replace(" ",""); 
                //video2Push= video2Push.replace(/\s/g,'');
                video2Push = video2Push.replace("(", "_");
                video2Push = video2Push.replace(")","_");
                video2Push = video2Push.replace(/ /g,"_");
                
                promoLoopRef.once('value', function(snapshot) {
                    promoLoopRef.child(`${screen2Push}`).update({
                        "videoName": video2Push,
                        "startTime": startDB,
                        "endTime": endDB,
                        "Trigger": 1
                        });                

                    alert(`Send to ${screen2Push}`);
                    window.location.reload();
                })
            } 
        });
    }

 
    render() {
        return (
            <div className="PromoLoop" >

                <div>
                     <h2 className="headerScheduler"> Loop Promo </h2> 
                         <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit agmet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            </Modal>
                        </span>
                </div>

              
                    <div className="row">
                        <div className= "selectScreenLP">
                            <div className="addBorder1">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="col s6">
                                            <br/>
                                            <p className="titleHead"> Select a screen </p>
                                            <DropdownScreen 
                                                handleChange={this.handleScreenChange}
                                                name="video"
                                                items={this.state.screenList}
                                            />
                                            <br/>
                                        </div>

                                        <div className="col s6">
                                        <div  className="thBtn">
                                            <Button 
                                                onClick={() => {
                                                    this.sendToDbAll();
                                                }}
                                            type="submit" value="Submit" > Apply All! </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="row">
                    <div className="col s12">
                        <p className="titleHead" > Set time for video promo looping </p>
                        <br/>
                    {
                        this.state.schedules.map((value, index, key) => (
                            <Fragment key={index}>
                                <div className="row">
                                    <div className="col s12">
                                        <div className="col s12">
                                            <p className="titleHead"> Select video  </p>
                                            <div className="fixSelectMargin">
                                            <DropdownScreen 
                                                    handleChange={this.handleVideoChange}
                                                    name="video"
                                                    items={arrayVideos}
                                                /> 
                                            </div> 
                                        </div>
                                    </div>
                                   
                                    <div className="col s12"> 
                                        <br/>
                                        <p className="titleHead"> Set time</p>
                                        <div className="col s6">
                                            <p> Start Time </p>
                                            <Dropdown handleChange={this.handleScheduleChange} 
                                                    name="start" index={index} 
                                                    items={timeNumber} />                                       
                                        </div>

                                        <div className="col s6">
                                            <p> End Time </p>
                                            <Dropdown handleChange={this.handleScheduleChange} 
                                                    name="end" index={index} 
                                                    items={timeNumber} />
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ))
                    }
                    </div>
                    

                <div className="row">
                    <div className="col s12">
                        <Button 
                            onClick={() => {
                                this.sendToDb();
                            }}
                        type="submit" value="Submit" > Apply! </Button>
                      
                    </div>
                </div>
            </div>
           </div>
        )
    }
}
export default PromoLoop;



