import './ProofPlaying.css';
import React, { Component } from 'react';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import {Button, Modal, Icon} from 'react-materialize';

import firebase from 'firebase';
import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let storageRef;
let arrayScreens= [];

const month = [
    { name: 'January', key: 1 },
    { name: 'February', key: 2 },
    { name: 'March', key: 3 },
    { name: 'April', key:4 },
    { name: 'May', key:5 },
    { name: 'June', key:6 },
    { name: 'July', key:7  },
    { name: 'August', key:8 },
    { name: 'September', key:9},
    { name: 'October', key:10 },
    { name: 'November', key:11},
    { name: 'December', key:12},
]


const days = [];

for(let i = 1 ; i <= 31 ; i++ ) {
    days.push({name: `${i}`, key: i})
}

class ProofPlaying extends Component {
    state = {
        screenName: 'Screen1',
        day: '1',
        month: 'January',
        screenList: [],
        screens: []
    }

    componentDidMount() {
        storageRef= firebase.storage().ref();
        
        firebaseApp.database().ref(`Inventory`) //screens
        .on('value', (data) => {
            let values = data.val();
            arrayScreens=[];
            this.setState({ screens: values }, () => {
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

    handleScreenChange = (name, value) => {
        this.setState({ screenName: value});
    }

    handleDayChange = (name, value) => {
        this.setState({ day: value});
    }

    handleMonthChange = (name, value) => {

        this.setState({ month: value});
    }

    dowloadLogFile(screen2download, file2download){
        console.log("Click!");
        let layer1= 'LogFiles';
        let layer2= screen2download;
        let layer3= file2download;
    
        storageRef.child(layer1+ '/'+ layer2 +'/'+ layer3).getDownloadURL().then(function(url){    
            
            window.open(url, '_blank');
            
        }).catch(function(error) {
                // Handle any errors
                console.log(error);
                alert("Error 404, File not found");
            });
        
    }
    
    sendToDb = () => {
        this.setState(prevState => {  
            
            function isMonth(monthSel){
                return monthSel.name === months;
            }
            
            let d = new Date();
            let currentYear = d.getFullYear();
            let logFileName= "";

            let day= this.state.day;
            let months = this.state.month ;
            let screen= this.state.screenName;


            if( day === "" || months  === "" || screen  === ""){
                alert("Not valid entry!, fill all the inputs")
            }

            if( day !== "" && months  !== "" && screen  !== ""){
                screen= screen.replace(" ","");
                let foundMonth= month.find(isMonth);
                months= foundMonth.key;

                logFileName= `${screen}_LogFile_[${currentYear}-${months}-${day}].txt`;
                
                this.dowloadLogFile(screen, logFileName);   
            }
        });

        
    }

 
    render() {
        return (
            <div className="PromoLoop" >
               
                <div>
                    <h2 className="headerScheduler"> Proof of Playing </h2> 

                    <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit agffgfgfgdgfgfgfgfgmet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            </Modal>
                    </span>
                
                </div>


                <div className="row">
                    <div className="col s12">
                        <div className="fixTop">
                            <div className="col s4">
                                <div >
                                <p className="titleHead "> Select a screen </p>
                                <DropdownScreen 
                                    handleChange={this.handleScreenChange}
                                    name="video"
                                    items={this.state.screenList}
                                />
                                </div>
                            </div>

                            <div className="col s4">
                                <div >
                                <p className="titleHead "> Select a day</p>
                                <DropdownScreen 
                                    handleChange={this.handleDayChange}
                                    name="days"
                                    items={days}
                                />
                                </div>
                            </div>

                            <div className="col s4">
                                <div >
                                <p className="titleHead "> Select a month </p>
                                <DropdownScreen 
                                    handleChange={this.handleMonthChange}
                                    name="month"
                                    items={month}
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
               

                <div className="row">
                    <div className="col12">
                        <Button 
                           onClick={() => {
                                this.sendToDb();
                                
                            }}
                        type="submit" value="Download LogFile!"> Download LogFile! </Button>
                      
                    </div>
                </div>
                
                
             
            </div>
        )
    }
}
export default ProofPlaying;



