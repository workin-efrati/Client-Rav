import { useState } from 'react';
import style from './style.module.css'
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";

function SortFilter({ isDown, setIsDown, setSort }) {

    const [active, setActive] = useState('date')

    const handleClick = (e) => {
        setSort(e.target.value)
        setActive(e.target.value)
    }

    return <div className={style.sort}>
        <button onClick={() => setIsDown(!isDown)}>
            {isDown ? <FaSortAmountDownAlt /> : <FaSortAmountUp />}
        </button>
        <div className={style.buttons}>
            <button className={active == 'date' ? style.active : ''} onClick={handleClick} value={'date'}>תאריך</button>
            <button className={active === 'percent' ? style.active : ''} onClick={handleClick} value={'percent'}>אחוז</button>
            <button className={active === 'amount' ? style.active : ''} onClick={handleClick} value={'amount'}>כמות</button>
        </div>
    </div>
}

export default SortFilter