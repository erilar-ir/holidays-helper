import React, {Component} from 'react'
import './error-boundary.css'
import ErrorView from "../error-view/error-view";

export default class ErrorBoundary extends Component{

    state = {
        hasError: false
    }

    componentDidCatch() {
        this.setState({
            hasError: true
        })
    }

    render() {
        const {hasError} = this.state
        if (hasError) {
            return <ErrorView />
        }
        return this.props.children
    }

}
