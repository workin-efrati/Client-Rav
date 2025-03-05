import style from './style.module.css'

import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { ImCheckmark } from "react-icons/im";
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function AnswerBlock({ content, setActive, active, choosen }) {

    // const { year } = useParams();
    // const { month } = useParams();
    // const { day } = useParams();

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [ansValue, setAnsValue] = useState(content)

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen)
        setIsEditMode(!isEditMode)
    }

    return <div className={`${ansValue === '' ? style.delete : style.block} ${active === percent ? style.active : style.block} ${choosen ? style.choosen : style.block}`}>
        {isEditMode ?
            <textarea value={ansValue} onChange={e => setAnsValue(e.target.value)} />
            :
            <p onClick={() => setActive(percent)}>{ansValue}</p>}
        <div className={style.side}>
            {active === percent ?
                <>
                    <button className={style.cancel} onClick={() => { setActive() }}><IoIosCloseCircle /></button>
                    <button className={style.ok} onClick={() => setActive()}><ImCheckmark /></button>
                </>
                :
                <>
                    {isEditMode ?
                        <button onClick={() => setIsEditMode(!isEditMode)}><MdSave /></button>
                        :
                        <>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <IoMdClose /> : <SlOptionsVertical />}</button>
                            <div className={`${style.menu} ${isMenuOpen ? style.open : style.close}`}>
                                <button onClick={handleClick}>ערוך תשובה</button>
                                <button onClick={() => { setAnsValue(''); setIsMenuOpen(!isMenuOpen) }}>מחק תשובה</button>
                                {/* <Link key={'prevDay'} to={`/${year}/${month}/${day - 1}`}>העבר ליום הקודם</Link>
                                <Link key={'nextDay'} to={`/${year}/${month}/${Number(day) + 1}`}>העבר ליום הבא</Link> */}
                            </div>
                        </>}
                </>}
        </div>
    </div>
}

export default AnswerBlock