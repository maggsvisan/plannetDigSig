import React, { Component } from 'react';
import './Scheduler.css';
import SchedulerContent from '../ScheduleContent/ScheduleContent'
import { Collapsible, CollapsibleItem, Modal, Button, Icon } from 'react-materialize';


const Days = [
    { name: "Monday", key: 0 },
    { name: "Tuesday", key: 1 },
    { name: "Wednesday", key: 2 },
    { name: "Thursday", key: 3 },
    { name: "Friday", key: 4 },
    { name: "Saturday", key: 5 },
    { name: "Sunday", key: 6 }
]

class Scheduler extends Component {
    render() {
        return (
            <div className="Scheduler" >
                <div className="row"> 
                    <div className="col s12">
                        <h2 className="headerScheduler"> Scheduler </h2> 
                        
                        <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit gmet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            </Modal>
                        </span>
                    </div>
                </div>

                <Collapsible>
                    
                    {Days.map(({ name, key }) => (
                        <CollapsibleItem
                            key={key}
                            header={name}
                            icon='toc'>
                            <SchedulerContent dayIndex={key}
                                updateScheduler={this.props.updateScheduler}
                                setNewTrigger={this.props.setNewTrigger}
                                handleSubmit={this.props.submitSchedules}
                                schedulerSection={this.props.schedulerSection}
                                getDayOfWeek={this.props.getDayOfWeek} />
                        </CollapsibleItem>
                    ))}

                </Collapsible>
            </div>
        )
    }
}
export default Scheduler;
