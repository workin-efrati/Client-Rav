import { IoMdClose } from 'react-icons/io';
import style from './style.module.css'
import { SlOptionsVertical } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdSave } from 'react-icons/md';

function QABlock({ data, type, to }) {
    const { message, _id, isQuestion, date } = data
    const { get } = useApi();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isContentOpen, setIsContentOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [content, setContent] = useState(message)

    const handleClick = () => {
        setIsEditMode(!isEditMode)
    }

    const handleDel = () => {
        put(`msg/${_id}`)
            .then((res) => setContent(res.message))
        setIsMenuOpen(!isMenuOpen)
    }
    const handleEdit = (body) => {
        put(`msg/${_id}`, { body })
            .then((res) => setContent(res.message))
        setIsMenuOpen(!isMenuOpen)
    }

    const handleGet = () => {
        get(`msg/${_id}`)
            .then((res) => setContent(res.message))
        setIsMenuOpen(!isMenuOpen)
    }

    // const handleClickApi = (method, body) => {


    //     api({ url: `msg/${_id}`, method, body })
    //         .then((res) => setContent(res.message))
    //     setIsMenuOpen(!isMenuOpen)
    // }

    return <div className={content ? style.block : style.close}>
        {content?.length ?
            <>
                {isEditMode ?
                    <textarea value={content} onChange={e => setContent(e.target.value)} />
                    : type === 'q' ?
                        <Link to={to}>{content}</Link>
                        :
                        <button className={isContentOpen ? style.content_open : style.content_close} onClick={() => setIsContentOpen(!isContentOpen)}>{content}</button>
                }
                {isEditMode ?
                    <button onClick={() => { setIsEditMode(!isEditMode); handleEdit({ message: content }) }}><MdSave /></button>
                    :
                    <>
                        <button className={style.menu_symbol} onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <IoMdClose /> : <SlOptionsVertical />}</button>
                        <div className={`${style.menu} ${isMenuOpen ? style.open : style.close}`}>
                            <button onClick={() => handleEdit({ isQuestion: !isQuestion })}>{type === 'q' ? 'הגדר כתשובה' : 'הגדר כשאלה'}</button>
                            <button onClick={handleClick}>{type === 'q' ? 'ערוך שאלה' : 'ערוך תשובה'}</button>
                            <button onClick={handleDel}>{type === 'q' ? 'מחק שאלה' : 'מחק תשובה'}</button>
                            <button onClick={() => handleEdit({ date: new Date(date).setDate(new Date(date).getDate() - 1) })}>העבר ליום הקודם</button>
                            <button onClick={() => handleEdit({ date: new Date(date).setDate(new Date(date).getDate() + 1) })}>העבר ליום הבא</button>
                        </div>
                    </>}
            </>
            : <></>}
    </div>
}

export default QABlock