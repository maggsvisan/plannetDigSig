import React, { Component } from 'react';
import { Button, Modal } from 'react-materialize';
import Icon from 'react-materialize/lib/Icon';
import './PowerSettings.css';
import DropdownScreen from '../DropdownScreen/DropdownScreen';

import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let screen2Push;
let arrayScreens= [];
let powerSetingsRef;

class PowerSettings extends Component {

    state = {
        status: '',
        screens:'Screen1',
        screenList: [],
        screenName:'Screen1'
    }

    componentDidMount(){

        powerSetingsRef= firebaseApp.database().ref().child("PowerSettings");

        firebaseApp.database().ref(`Inventory`) //screens
        .on('value', (data) => {
            let values = data.val();
            arrayScreens=[];
            this.setState({ screens: values }, () => {
              Object.keys(this.state.screens).map((key, index) => {
                  arrayScreens.push({name: key, key:index}); 
                  this.setState({screenList: arrayScreens }); 
                  return arrayScreens;
             }
          );
          });

        }, (err) => {
            console.log(err);
        });

    }


    handleScreenChange = (name, value) => {
        this.setState({ screenName : value });
    }
    
    powerON = () => {
        this.setState({ status : 1 });
    }

    powerOFF = () => {
        this.setState({ status : 0 });
    }

    sendToDb = () => {
            this.setState(prevState => {    
            screen2Push= this.state.screenName;
            
            if(this.state.status === ''){
                alert("Select a status for " + screen2Push);
            }
            
            else{
                if(this.state.status === 0){
                    alert(`Turning ${this.state.screenName}: OFF` );
                }

                if(this.state.status === 1){
                    alert(`Turning ${this.state.screenName}: ON` );
                }                

                let screenStatus;
                screenStatus= this.state.status;
                
                powerSetingsRef.once('value', function(snapshot) {
                    powerSetingsRef.child(`${screen2Push}`).update({ "Trigger": 1,
                                                                  "value": screenStatus}
                    );
                    alert(`Send to ${screen2Push}`);
                    window.location.reload();
                })               
            }
        });
    }

    sendToDbAll = () => {
        
        this.setState(prevState => {  
            screen2Push= this.state.screenName;

            if(this.state.status === ''){
                alert("Select a status for ALL SCREENS ");
            }
            else{
                let screenStatus;
                screenStatus= this.state.status;

                if(screenStatus === 0){
                    alert(`ALL SCREENS OFF` );
                }
                if(screenStatus === 1){
                    alert(`ALL SCREENS ON` );
                }
                
                let i=0;

                powerSetingsRef.once('value', function(snapshot) {
                    snapshot.forEach(function(snap){
                        i=i+1;
                        powerSetingsRef.child(`Screen${i}`).update({ "Trigger": 1,
                                                                      "value": screenStatus})
                                   
                    });
                    alert('Send to all screens');
                    window.location.reload();
                 })
                
            }
        });      
    }


  
    render() {
        return (
            <div className="PowerSettings" >
                <div>
                    <h2 className="headerScheduler"> Power Settings </h2> 
                    <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit gmet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            </Modal>
                    </span>
                </div>    

                <div className="row">
                    <div className= "selectScreenQS">
                        <div className="col s6">
                            <p className="titleHead"> Select a screen</p>
                            <DropdownScreen 
                                handleChange={this.handleScreenChange}
                                name="video"
                                items={this.state.screenList}
                            />
                        </div>

                        <div className="col s6">
                            <div className="thBtn2">
                                <Button waves='light'
                                    onClick = {() => {
                                        this.sendToDbAll();
                                    }}
                                > Apply All
                                </Button>  
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col s12">
                        <br/>
                        <p className="titleHead"> Select a status for screen(s)</p>
                        <br/>
                        <Button 
                            
                            waves='light'
                            onClick = {() => {
                                this.powerON();
                                
                            }}
                        >ON <Icon left>brightness_low</Icon>
                        </Button>
                        {` `}

                        <Button  waves='light'
                            onClick ={() => {
                                this.powerOFF();
                            }}
                        >OFF<Icon left>brightness_2</Icon>
                        </Button>
                    </div>
                </div>

                <div className="row fix-row-padding">
                    <div className="col s12">
                        <Button waves='light'
                            onClick = {() => {
                                this.sendToDb();
                            }}
                        > Apply
                        </Button>  
                    </div>                    
                </div>

            </div>
        )
    }
}

export default PowerSettings;
