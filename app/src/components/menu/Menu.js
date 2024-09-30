import './Menu.css'

export const Menu = (props) => {
    return (
        <div id="menu">
            <div className="data toggle">
                <button onClick={props.toggle}>
                    Toggle Rate Format
                </button>
            </div>

            <div className="data select">
                <select onChange={props.select}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                </select>
            </div>
        </div>
    )
}