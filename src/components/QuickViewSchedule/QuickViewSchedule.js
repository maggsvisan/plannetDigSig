import React, { Component } from 'react';
import { Table, Button, Modal, Icon } from 'react-materialize';
import DropdownScreen from '../DropdownScreen/DropdownScreen';

import './QuickViewSchedule.css';
import firebaseApp from '../../firebase/firebaseApp';

const daysName = [
    { name: 'Monday', key: 0 },
    { name: 'Tuesday', key: 1 },
    { name: 'Wednesday', key: 2 },
    { name: 'Thursday', key: 3 },
    { name: 'Friday', key: 4 },
    { name: 'Saturday', key: 5 },
    { name: 'Sunday', key: 6 },
];

let arrayScreens= [];

class PromoLoop extends Component {

    state = {
        screenName: 'Screen 1',
        daySelected: 'Monday',
        schedules: [],
        showResults: false,
        screenList: [],
        screens: []
    }

    componentDidMount() {

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

    showSchedules = () => {
        this.setState({ showResults: true});
        const daySelected= this.state.daySelected;
        let screenName2 = this.state.screenName;

        const dayIndex = daysName.find(day => day.name === daySelected).key;
        screenName2= screenName2.replace(" ",""); 
       
        firebaseApp.database().ref(`Scheduler/${screenName2}/${dayIndex}`)
            .on('value', (data) => {
                let values = data.val();
                this.setState({ schedules: values });

            }, (err) => {
                console.log(err);
            });
    }

    handleDayChange = (name, value) => {
        this.setState({ daySelected: value });
    }

    handleScreenChange = (name, value) => {
        this.setState({ screenName: value });

    }

    handleChangeToAll = () => {
        this.setState({ screenName: "all" });
    }

    renderObject = (values) => {
        return Object.entries(values).map(([key, value], i) => {
            return (
                <div key={key}>
                    videoname is: {value.VideoName};
					startTime is: {value.startTime};
				</div>
            )
        })
    }

    render() {
        return (
            <div className="QuickViewSchedule" >

                <div>
                    <h2 className="headerScheduler"> Quick View Schedule </h2>
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
                    <div className="col s6">
                        <div className="selectScreenQS">
                            <p className="titleHead"> Select the screen  </p>
                            <DropdownScreen
                                handleChange={this.handleScreenChange}
                                name="video"
                                items={this.state.screenList}
                            />
                        </div>
                    </div>

                    <div className="col s6">
                        <div className="selectScreenQS">
                            <p className="titleHead"> Select day  </p>
                            <DropdownScreen
                                handleChange={this.handleDayChange}
                                name="video"
                                items={daysName}
                            />
                        </div>
                    </div>
                </div>
                
                { this.state.showResults ? (
                    <div className="row">
                            <div className="pageCenter">
                                <Table className="quickTable">
                                    <thead>
                                        <tr>
                                            <th> Schedule Name</th>
                                            <th>Video Name</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            Object.entries(this.state.schedules).map(([key, schedule]) => (
                                                <tr key={key}>
                                                    <td> {key} </td>
                                                    <td> {schedule.VideoName} </td>
                                                    <td> {schedule.startTime} </td>
                                                    <td> {schedule.endTime} </td>
                                                </tr>

                                            ))
                                        }
                                    </tbody>

                                </Table>
                            </div>
                     </div>) : <br/>
                }


                <div className="row">
                    <div className="col12">
                        <Button
                            onClick={() => this.showSchedules()}
                            type="submit"
                            value="Submit"
                        >
                            Show
                        </Button>

                    </div>
                </div>
            </div>

        )
    }
}
export default PromoLoop;



