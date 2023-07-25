import './Header.css'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'

export const Header = () => {

    const SubHeader = (props) => {
        return (
            <div id="subheader" className={props.className}>
                <div className="info flag"/>
                <div className="column code">
                    <p>Code</p>
                </div>
                <div className="column name">
                    <p>Country</p>
                </div>
                <div className="column rate">
                    <p>Rate</p>
                </div>
                <div className="column change ">
                    <p>Change</p>
                </div>
                <div className="column arrow">
                    <AiOutlineArrowUp/>
                </div>
            </div>
        )
    }


    return (
        <div id="header">
            <SubHeader className="left"/>
            <SubHeader className="right"/>
        </div>
    )
}