import './StorageView.css';
import React, { Component } from 'react';
import {Button, Modal, Icon, Table} from 'react-materialize';

import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let initialVideos;
let videoName;
let videoSize;
let arrayVideos = [];
let videoSize2;
let videoSizeInt;
var storageAvailable= 0;

class StorageView extends Component {
    state = {
        screenName: 'Screen 1',
        day: '1',
        month: 'January',
        video: [],
        videoList: [],
        available: 0
        
    }

    componentDidMount() {   
        videoName = "";

        firebaseApp.database().ref(`General_Inventory/`)
        .on('value', (data) => {
              let values = data.val();
              this.setState({ videos: values }, () => {
                arrayVideos = [];
                Object.keys(this.state.videos).map((key, index) => {
                    initialVideos = this.state.videos[key]
                    videoName= initialVideos.name;
                    videoSize= initialVideos.size;
                    
                    videoSize2 = videoSize.slice(0, -2);
                    videoSizeInt = parseFloat(videoSize2);
                    storageAvailable= storageAvailable+videoSizeInt;
                    
                    //console.log(storageAvailable.toFixed(3));
                    //limit to 5GB ---> 5000 MB

                    storageAvailable = (100 - (  (storageAvailable * 100) /5000 ) );
                    storageAvailable = parseInt(storageAvailable,10);

                    arrayVideos.push({name: videoName, size:videoSize, key:key});  
                    this.setState({videoList: arrayVideos }) ; 
                    this.setState({available: storageAvailable })

                    return arrayVideos;
                    
              }
            );
         
            });
           
        }, (err) => {
              console.log(err);
        });     
         
    }

    render() {
        return (
            <div className="PromoLoop" >
               
                <div>
                    <h2 className="headerScheduler"> Storage Available </h2> 

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
                   <div className="col s12">
                        <br/>
                        <h5 className="squareStyle"> The storage available in root directory is {this.state.available}%</h5>
                   </div>
                   <h6> The storage limit is 5GB </h6>
                </div>

                <div className="row">
                    <div className="pageCenter" >
                        <Table className="quickTable">
                            <thead>
                                <tr>
                                    <th> Video Name</th>
                                    <th> Video Size</th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                                Object.entries(this.state.videoList).map(([key, videoList]) => (
                                    <tr key={key} >
                                        <td> {videoList.name}</td>
                                        <td> {videoList.size} </td>
                                    </tr>

                                ))
                            }
                            </tbody>

                        </Table>
                    </div>
                </div>

                
                        
            </div>
        )
    }
}
export default StorageView;



