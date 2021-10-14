import React, {Component} from 'react';
import Error from '../Error/Error';

export default class ErrorBoundry extends Component {
    state = {
        error: false
    };

    componentDidCatch() {
        this.setState({error:true})
    };
    
    render() {
        if (this.state.error) {
            return (
                <div>
                    <Error />
                </div>
            )
        };

        return this.props.children;
    }
}