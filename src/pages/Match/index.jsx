import { Link, useParams } from 'react-router-dom';
import style from './style.module.css'

import { MdZoomIn } from "react-icons/md";
import { MdZoomOut } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from 'react';
import useApi from '../../helpers/useApi';
import MatchBlock from '../../components/MatchBlock';

function Match() {

    const { year } = useParams();
    const { month } = useParams();
    const { day } = useParams();
    const { id } = useParams();

    const [fontSize, setFontSize] = useState(18)

    const fullMsgs = useApi({ url: `msg/${id}`, method: 'get' })

    const [question, setQuestion] = useState('')
    const fuq = fullMsgs?.at(0)?.isFuq ? true : false;
    console.log('full ', fullMsgs);


    if (question == '') setQuestion(fullMsgs?.at(0)?.message)
    return <div className={style.shut}>
        <div className={style.zoom}>
            <button onClick={() => setFontSize(fontSize + 2)}><MdZoomIn /></button>
            <button onClick={() => setFontSize(fontSize - 2)}><MdZoomOut /></button>
        </div>
        {fullMsgs?.length ?
            fuq ?
                <>
                    {splitBySender(fullMsgs).map((a, i) =>
                        <MatchBlock i={i} question={a[0].message} setQuestion={setQuestion} answers={a.slice(1)} fontSize={fontSize} id={id} fuq={fuq} />)}
                    <button className={style.saveAllFuq}>שמירה</button>
                </>
                :
                <MatchBlock i={0} question={fullMsgs?.at(0)?.message} setQuestion={setQuestion} answers={fullMsgs.slice(1)} fontSize={fontSize} id={id} fuq={fuq} />
            :
            <div className={style.loading}>טוען...</div>
        }
        <div className={style.menu}>
            <Link className={style.move_button} key={'prev'} to={`/${year}/${month}/${day}/${id - 1}`}>
                <IoIosArrowForward />
                <div>שאלה קודמת</div>
            </Link>
            <Link className={style.move_button} key={'next'} to={`/${year}/${month}/${day}/${id + 1}`}>
                <div>שאלה הבאה</div>
                <IoIosArrowBack />
            </Link>
            <Link className={style.exit_button} key={'exit'} to={`/${year}/${month}/${day}`}><TbDoorExit /></Link>
        </div>
    </div>
}

export default Match

function splitBySender(arr) {
    var helpArr = [];
    var result = [];
    for (let a of arr) {
        if (a.sender === arr[0].sender) {
            helpArr = []
            helpArr.push(a);
            result.push(helpArr);
        } else {
            helpArr.push(a);
        }
    }
    return result
}