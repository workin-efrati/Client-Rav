import style from './style.module.css'

import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { ImCheckmark } from "react-icons/im";
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../helpers/api';

function AnswerBlock({ content, _id, setActive, active }) {

    const { id } = useParams()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [ansValue, setAnsValue] = useState(content)

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen)
        setIsEditMode(!isEditMode)
    }

    const handleClickApi = (method, body) => {
        api({ url: `msg/${_id}`, method, body })
            .then((res) => setAnsValue(res.message))
        setIsMenuOpen(!isMenuOpen)
    }

    return <div className={`${ansValue === '' ? style.delete : style.block} ${active === _id ? style.active : style.block}`}>
        {isEditMode ?
            <textarea value={ansValue} onChange={e => setAnsValue(e.target.value)} />
            :
            <p onClick={() => setActive(_id)}>{ansValue}</p>}
        <div className={style.side}>
            {active === _id ?
                <>
                    <button className={style.cancel} onClick={() => { setActive() }}><IoIosCloseCircle /></button>
                    <button className={style.ok} onClick={() => { setActive(); api({ url: 'msg', method: 'post', body: { qId: id, aId: _id } }).then() }}><ImCheckmark /></button>
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
                                <button onClick={() => { handleClickApi('delete'); setAnsValue(''); setIsMenuOpen(!isMenuOpen) }}>מחק תשובה</button>
                            </div>
                        </>}
                </>}
        </div>
    </div>
}

export default AnswerBlock