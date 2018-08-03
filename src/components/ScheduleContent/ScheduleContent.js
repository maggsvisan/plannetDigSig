import React, { Component, Fragment } from 'react';
import './ScheduleContent.css';
import { Row, Button } from 'react-materialize';
import Dropdown from '../Dropdown/Dropdown';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import TimerMixin from 'react-timer-mixin';

//import firebase from 'firebase';
import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

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
let screen2Push;
let arrayVideos= [];
let arrayScreens= [];
let screenName2;
let videoName2;
let initialVideos;
let schedulerRef;
let inventoryRef;
let numberOfChildren;
let videoNameDB;
let commonVideos= [];
let arrayVideos2;
let initialVideos2;
const timeNumber = [];

const selectSchedule = [
    { name: 'Schedule 1', key: 1 },
    { name: 'Schedule 2', key: 2 },
    { name: 'Schedule 3', key: 3 },
    { name: 'Schedule 4', key: 4 },
];


for (let i = 0; i <= 23; i++) {

    for (let j = 0; j <= 59; j = j + 15) {

        if (i < 10 && j < 10) {
            timeNumber.push({ key: `0${i}:0${j}`, name: `0${i}:0${j}` });
        }

        if (i < 10 && j >= 10) {
            timeNumber.push({ key: `0${i}:${j}`, name: `0${i}:${j}` });
        }

        if (i >= 10 && j >= 10) {
            timeNumber.push({ key: `${i}:${j}`, name: `${i}:${j}` })
        }

    }

}

class SchedulerContent extends Component {

    state = {
        dayOfWeek: '',
        videos: '',
        value: '',
        screenName: 'Screen1',
        screens: [],
        screenList: [],
        videoList: [],
        commonDropDown: [],
        scheduleSelected:'Schedule 1',
        showCommonDrop: false,
        schedules: [
            {
                video: 'video1',
                start: '00:00',
                end: '00:00',
            },
        ]
    }
    

    componentDidMount() {
        schedulerRef= firebaseApp.database().ref().child("Scheduler");
        inventoryRef= firebaseApp.database().ref().child("Inventory");
        screenName2 = this.state.screenName;
        videoName2 = "";

        /*
        TimerMixin.setTimeout(
            () => { console.log('I do not leak!'); },
            5000
        );
        */

        //get common dropdown
        inventoryRef.once("value").then(function(snapshot) {
            numberOfChildren=snapshot.numChildren();
            arrayVideos2 = [];

            snapshot.forEach(function(childSnapshot) {
                let newState= childSnapshot.val();

                Object.keys(newState).forEach((key, index) => {
                    initialVideos2 = newState[key] 
                    arrayVideos2.push(initialVideos2.name);
                   
                    }
                );
            });

            let k=0;
            var count = {};
            commonVideos= [];
        
            arrayVideos2.forEach(function(i) { 
                k=k+1;
                count[i] = (count[i]||0) + 1;
                if(count[i] >= numberOfChildren){
                    commonVideos.push({name: i, key:k});
                    //console.log(`the count is ${k}`,commonVideos);
                }
               
            });
        },(err) => {
            console.log(err);
        });


        firebaseApp.database().ref(`Inventory/${screenName2}/`) // videos per screen
        .on('value', (data) => {
              let values = data.val();
            
                arrayVideos = [];
                arrayScreens = [];
                
                Object.keys(values).forEach((key, index) => {
                    initialVideos =values[key];
                    videoName2= initialVideos.name;
                    arrayVideos.push({name: videoName2, key:index});
                    this.setState({videoList: arrayVideos }) ; 
                 
                }
            );
            
          }, (err) => {
              console.log(err);
          });


          //when is Screen1 the first option
            firebaseApp.database().ref(`Inventory/${screenName2}/`) //first value for dropdowns, screen1
            .orderByKey().limitToFirst(1).once('value', function(snap) {
                let newVal= snap.val();
                Object.keys(newVal).forEach((key, index) => {
                    initialVideos =newVal[key]; //first videoName in list
                     
                })    
            }).then((dataSnapshot) => {
                this.setState({sendVideo: initialVideos.name});
            });
        

          firebaseApp.database().ref(`Inventory`) //screen dropdown
          .on('value', (data) => {
              let values = data.val();
              this.setState({ screens: values }, () => {
                arrayScreens=[];
                Object.keys(this.state.screens).forEach((key, index) => {
                    arrayScreens.push({name: key, key:index}); 
                    this.setState({screenList: arrayScreens }); 
               }
            );
            });
  
          }, (err) => {
              console.log(err);
          });
    }

    selectAll = () => { //Select all screens!
        alert("Selected all screens")
        this.setState({screenName: "all"});
        //console.log("the commong list is", this.state.commonDropDown)
        this.setState({showCommonDrop:true}); 
    }


    addSchedule = () => {
        const schedules = this.state.schedules;
        if (schedules.length > 3) return;

        this.setState(prevState => ({
            schedules: [...schedules, {
                video: 'video1',
                start: 0,
                end: 0,
            }]
        }));
    }

    handleScheduleChange = (index, name, value) => {
        const schedules = this.state.schedules;
        const scheduleToModify = schedules[index];

        scheduleToModify[name] = value;
        schedules[index] = scheduleToModify;
    }

    pickSchedule = (name, value) => {
        console.log("the value is", value);

        this.setState({ scheduleSelected: value }, () => { 
            console.log("updated!");
            console.log("scheduleSelected", this.state.scheduleSelected);
        });
    }
   
    handleScreenChange = (name, value) => {
        
        this.setState({ screenName: value }, () => { //change videos to show in dropdown
            firebaseApp.database().ref(`Inventory/${value}/`) // videos per screen
            .on('value', (data) => {
                arrayVideos = [];
                arrayScreens = [];
                
                let values = data.val();
                this.setState({ videos: values }, () => {
                    Object.keys(this.state.videos).forEach((key, index) => {
                        initialVideos = this.state.videos[key]
                        videoName2= initialVideos.name;
                        arrayVideos.push({name: videoName2, key:key});  
                        this.setState({videoList: arrayVideos }) ; 
                        }
                    );
                });
                
            }, (err) => {
                console.log(err);
            });

            this.setState({showCommonDrop:false});
        });
    
    }

    handleVideoChange = (name, value) => {
        this.setState({ screenName: value });
    }

    removeSchedule = (index) => {
        if (this.state.schedules.length === 1) return;

        let schedules = [...this.state.schedules];
        schedules.splice(index, 1);

        this.setState({
            schedules: [...schedules],
        });

    }

    handleSubmit = () => {
        this.props.handleSubmit(this.state.schedules, this.props.dayIndex);
    }
    
    sendToDb = () => {   
        console.log(this.state.scheduleSelected);
        let sendSelectedSchedule;
        
        sendSelectedSchedule= this.state.scheduleSelected;
        sendSelectedSchedule= sendSelectedSchedule.slice(-1); //modify schedule number input 
     
        this.setState(prevState => {
            let daySelected= this.props.dayIndex;

             for (let i=0; i < this.state.schedules.length; i++ ){
                 
                if (this.state.schedules[0].start === "" ||
                    this.state.schedules[0].end === "" ||
                    this.state.screenName === "" ||
                    this.state.schedules[0].video === "") {
                    alert("Not valid entry!, fill all the inputs")
                }

                if (this.state.schedules[0].start !== "" && this.state.schedules[0].end !== "" &&
                    this.state.screenName !== "" && this.state.schedules[0].video !== "") {

                    startTime = this.state.schedules[0].start;
                    endTime = this.state.schedules[0].end;
                    
                    startHr = startTime.slice(0, -3);
                    startMin = startTime.slice(-2);

                    IntStartHr = parseInt(startHr,10);
                    IntStartMin = parseInt(startMin,10);

                    endHr = endTime.slice(0, -3);
                    endMin = endTime.slice(-2);

                    IntEndtHr = parseInt(endHr,10);
                    IntEndMin = parseInt(endMin,10);
                    
                   
                    
                    if ((IntStartHr > IntEndtHr) || (IntStartHr === IntEndtHr && IntStartMin > IntEndMin) ||
                        (IntStartHr === IntEndtHr && IntStartMin === IntEndMin))
                    {
                        alert('Invalid Schedule');
                    }

                    else {
                        
                        screen2Push= this.state.screenName;
                        const self = this;
                        videoNameDB="";
                       
                        if (screen2Push === 'all' ){
                           
                            if(self.state.schedules[i].video === "video1"){
                                if(commonVideos.length > 0){
                                    videoNameDB= commonVideos[0].name; 
                                    schedulerRef.once('value', function(snapshot){
                                        numberOfChildren=snapshot.numChildren();
                                        let j=0;
                                        videoNameDB= videoNameDB.replace(/\s/g,'');
                                        snapshot.forEach(function(snap){
                                            j=j+1;
                                            schedulerRef.child(`Screen${j}/${daySelected}/schedule${sendSelectedSchedule}`).update({
                                                "VideoName": videoNameDB,
                                                "startTime": self.state.schedules[i].start,
                                                "endTime":  self.state.schedules[i].end, 
                                            });            
                                        });
                
                                        alert('Send to all screens');
                                        window.location.reload();
                                    })
                                }
                                else{
                                   alert("No videos in common")
                                  
                                }
                            }

                            else{
                                videoNameDB=self.state.schedules[i].video;

                                schedulerRef.once('value', function(snapshot){
                                    numberOfChildren=snapshot.numChildren();
                                    let j=0;
                                    videoNameDB= videoNameDB.replace(/\s/g,'');
                                    snapshot.forEach(function(snap){
                                        j=j+1;
                                       
                                        console.log(`Screen${j}/${daySelected}/schedule${sendSelectedSchedule}`);
                                        
                                        schedulerRef.child(`Screen${j}/${daySelected}/schedule${sendSelectedSchedule}`).update({
                                            "VideoName": videoNameDB,
                                            "startTime": self.state.schedules[i].start,
                                            "endTime":  self.state.schedules[i].end, 
                                        });            
                                    });
            
                                    alert('Send to all screens');
                                   window.location.reload();
        
                                })
                            }
 
                        }   

                        

                        else{
                            console.log(`ESTE ES EL HORARIO A MODIFICAR schedule${sendSelectedSchedule}`);

                            if(self.state.schedules[i].video === "video1"){
                                
                                firebaseApp.database().ref(`Inventory/${self.state.screenName}/`) //first value for dropdowns, screen1
                                .orderByKey().limitToFirst(1).once('value', function(snap) {
                                    let newVal= snap.val();
                                   
                                    Object.keys(newVal).forEach((key, index) => {
                                        initialVideos =newVal[key]; //first videoName in list
                                        videoNameDB=initialVideos.name;
                                    })    
                                })
                            }

                            else{
                                videoNameDB=self.state.schedules[i].video;
                            }
                            
                            videoNameDB= videoNameDB.replace(/\s/g,'');
                            console.log("self.state.schedules[i].start",self.state.schedules[i].start);
                            console.log("end",self.state.schedules[i].end);
                            console.log("video", videoNameDB);
                               
                            schedulerRef.child(`${self.state.screenName}/${daySelected}/schedule${sendSelectedSchedule}`).update({
                                "VideoName": videoNameDB,
                                "startTime": self.state.schedules[i].start,
                                "endTime":  self.state.schedules[i].end,
                            }).then(()=>{
                                window.location.reload();
                            });            

                            alert(`Send to ${self.state.screenName}`);
                          
                        }
                        
                    }
                }
             }
        });
    }

    render() {
        return (
            <div className="ScheduleContent" >
                <div className="row">
                    <div className="col s12">
                        <h6 className="headerSContent"> Four schedules per day can be added </h6>
                    </div>
                    <br />
                    <br />
                    <div className="row ">
                        <div className="col s12">
                            <div className="col s6">
                                <p className="subtitlesHeadSchedule "> Select a screen  </p>
                                <DropdownScreen
                                    handleChange={this.handleScreenChange}
                                    name="video"
                                    items={this.state.screenList}
                                />
                            </div>
                            <div className="col s6">
                                <div className="btnMargin">
                                    <Button  
                                        onClick={() => {
                                            this.selectAll();
                                            
                                        }}
                                        type="submit" value="Apply"> All Screen 
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                     <div className="row">
                        <div className="col s12">
                             <p className="subtitlesHeadSchedule "> Select a schedule to modify  </p>
                                <DropdownScreen
                                    handleChange={this.pickSchedule}
                                    name="video"
                                    items={selectSchedule}
                                />
                        </div>
                    </div>
                
                    {
                        this.state.schedules.map((value, index) => (
                            <Fragment key={index}>
                                <div className="row" >
                                    { this.state.showCommonDrop ? (
                                        <div className="row">
                                        <div className="col s12">
                                            <p className="subtitlesHeadSchedule "> Common videos, schedule in all screens  </p>
                                                <Dropdown
                                                    handleChange={this.handleScheduleChange}
                                                    name="video"
                                                    index={index}
                                                    items= {commonVideos}
                                                />            
                                        </div>
                                        </div>): ( 
                                            <div className="col s12">
                                          
                                                <p className="subtitlesHeadSchedule"> Select a video  </p>
                                                <Dropdown
                                                    handleChange={this.handleScheduleChange}
                                                    name="video"
                                                    index={index}
                                                    items={this.state.videoList} 
                                                    />    
                                        </div>

                                        )
                                    }
                                </div>
                                <div className="row">
                                    <div className="col s6">
                                        <Row >
                                            <p className="subtitlesHead2" > Start time </p>
                                            <Dropdown handleChange={this.handleScheduleChange} name="start" index={index} items={timeNumber} />
                                        </Row >
                                    </div>

                                    <div className="col s6">
                                        <Row >
                                            <p className="subtitlesHead2"> End time </p>
                                            <Dropdown handleChange={this.handleScheduleChange} name="end" index={index} items={timeNumber} />
                                        </Row >
                                    </div>
                                </div>                                
                            </Fragment>
                        ))
                    }
                   
                </div>

                <div className="row">
                    <div className="col12">
                        <Button 
                            onClick={() => {
                                this.sendToDb();
                            }}
                            > Apply </Button>
                    </div>
                </div>

            </div >
        )
    }
}
export default SchedulerContent;