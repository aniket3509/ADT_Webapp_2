import React, { Component } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr'
import ReactSpeedometer from "react-d3-speedometer"
import Header from './Header';

export default class App extends Component {
    
    rendermodelid(){
        if(this.state.signalRMessage.modelId === 'dtmi:com:microsoft:iot:e2e:hospital:emergency_ward;1')
           return <h1 class="h">Emergency Ward</h1>;
        if(this.state.signalRMessage.modelId === 'dtmi:com:microsoft:iot:e2e:hospital:operation_ward;1')
           return <h1 class="h">Operation Ward</h1>;
        if(this.state.signalRMessage.modelId === 'dtmi:com:microsoft:iot:e2e:hospital:general_ward;1')
           return <h1 class="h">General Ward</h1>;
        if(this.state.signalRMessage.modelId === 'dtmi:com:microsoft:iot:e2e:hospital:labs;1')
           return <h1 class="h">Labs</h1>;
        return null;
     }

    displayName = App.name

    constructor(props) {
        super(props);

        this.state = {
            signalRMessage: '',
            hubConnection: null,
            hubState: false,
        };
    }


    componentDidMount() {
        const hubConnection = new HubConnectionBuilder()
            .withUrl('https://hospsignalrfunction.azurewebsites.net/api')
            .build();

        this.setState({ hubConnection }, () => {
            this.setState({ hubState: true });
            this.state.hubConnection.start()
                .then(() => console.log('SignalR Started'))
                .catch(err => console.log('Error connecting SignalR - ' + err));

            this.state.hubConnection.on('newMessage', (message) => {
                const signalRMessage = message;
                this.setState({ signalRMessage });
            });
        });
    }

    render() {
        let page =
            // <div style={{ marginLeft: '600px', marginTop: '200px' }}>
            <div>
                <Header/>
                { this.rendermodelid() }
            <div class="row">
            <div class="column">
                <div class="center">
                <ReactSpeedometer
                    // minValue={15}
                    maxValue={40}
                    value={this.state.signalRMessage.Temperature}
                    currentValueText={"Temperature: " + this.state.signalRMessage.Temperature}
                    needleColor="black"
                    startColor="Green"
                    segments={300}
                    maxSegmentLabels={10}
                    endColor="Red"
                    width={400}
                />
                </div>
                <div class="center">
                <ReactSpeedometer
                    maxValue={100}
                    value={this.state.signalRMessage.Humidity}
                    currentValueText={"Humidity: " + this.state.signalRMessage.Humidity}
                    needleColor="black"
                    startColor="lightblue"
                    segments={300}
                    maxSegmentLabels={10}
                    endColor="tomato"
                    width={400}
                />
                </div>
            </div>
            <div class="column">
            <div class="center">
                <ReactSpeedometer
                    maxValue={200}
                    value={this.state.signalRMessage.AQI}
                    currentValueText={"Air Quality Index: " + this.state.signalRMessage.AQI}
                    needleColor="black"
                    startColor="Green"
                    segments={300}
                    maxSegmentLabels={10}
                    endColor="Maroon"
                    width={400}
                />
            </div>
                <div class="center">
                <ReactSpeedometer
                    maxValue={1}
                    value={this.state.signalRMessage.MaskDetection}
                    currentValueText={"Mask Detection Flag: " + this.state.signalRMessage.MaskDetection}
                    needleColor="black"
                    // startColor="Green"
                    // endColor="red"
                    segmentColors={['Green', '#DF3F3F']}
                    segments={2}
                    // maxSegmentLabels={1}
                    customSegmentLabels={[{text:"Wearing mask", position: 'OUTSIDE'},{text:"Not wearing mask", position: 'OUTSIDE'}]}
                    
                    width={400}
                />
                </div>
            </div>
        </div>
        </div>
        let contents = !this.state.hubState
            ? <p><em>Loading...</em></p>
            : page

        return (
            contents
        );
    }
}
