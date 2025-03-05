import { IoMdClose } from 'react-icons/io';
import style from './style.module.css'
import { SlOptionsVertical } from 'react-icons/sl';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../helpers/api';
import { MdSave } from 'react-icons/md';

function QABlock({ data, type, to }) {
    const { message, _id, isQuestion, date } = data

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isContentOpen, setIsContentOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [content, setContent] = useState(message)

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen)
        setIsEditMode(!isEditMode)
    }

    const handleClickApi = (method, body) => {
        // console.log('body ', body);
        
        api({ url: `msg/${_id}`, method, body })
            .then((res) => setContent(res.message))
    }

    return <div className={style.block}>
        {message?.length ?
            <>
                {isEditMode ?
                    <textarea value={content} onChange={e => setContent(e.target.value)} />
                    : type === 'q' ?
                        <Link to={to}>{content}</Link>
                        :
                        <button className={isContentOpen ? style.content_open : style.content_close} onClick={() => setIsContentOpen(!isContentOpen)}>{content}</button>
                }
                {isEditMode ?
                    <button onClick={() => { setIsEditMode(!isEditMode); handleClickApi('put', { message: content }) }}><MdSave /></button>
                    :
                    <>
                        <button className={style.menu_symbol} onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <IoMdClose /> : <SlOptionsVertical />}</button>
                        <div className={`${style.menu} ${isMenuOpen ? style.open : style.close}`}>
                            <button onClick={() => handleClickApi('put', { isQuestion: !isQuestion })}>{type === 'q' ? 'הגדר כתשובה' : 'הגדר כשאלה'}</button>
                            <button onClick={handleClick}>{type === 'q' ? 'ערוך שאלה' : 'ערוך תשובה'}</button>
                            <button onClick={() => handleClickApi('delete')}>{type === 'q' ? 'מחק שאלה' : 'מחק תשובה'}</button>
                            <button onClick={() => handleClickApi('put', { date: new Date(date).setDate(new Date(date).getDate() - 1) })}>העבר ליום הקודם</button>
                            <button onClick={() => handleClickApi('put', { date: new Date(date).setDate(new Date(date).getDate() + 1) })}>העבר ליום הבא</button>
                        </div>
                    </>}
            </>
            : <></>}
    </div>
}

export default QABlock