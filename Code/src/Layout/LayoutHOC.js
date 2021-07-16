import React from "react";
import Header from "../Header/header";
import './LayoutHoc.css';
import {inject} from "mobx-react";


const LayoutHOC = (WrappedComponent) => {

    @inject('authStore')
    class HOC extends React.Component {

        render() {

            return (
                <div className='my-app'>
                    <Header />
                    <div className='my-app-center-panel'>
                        <WrappedComponent {...this.props}/>
                    </div>

                </div>
            );
        }
    }

    return HOC;

};

export default LayoutHOC;