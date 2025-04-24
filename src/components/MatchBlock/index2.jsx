import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'
import { MdDelete, MdSave } from 'react-icons/md'
import { SlPencil, SlSettings, SlClose, SlOptionsVertical } from 'react-icons/sl'
import AnswerBlock from '../AnswerBlock';
import useApi from '../../hooks/useApi'
import dates from '../../helpers/dates'
import { IoMdClose } from 'react-icons/io';

function MatchBlock({ i, data, fontSize, id, isFuq, handleNav, isLast, resultObj, setResultObj }) {


    const [isEditMode, setIsEditMode] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [active, setActive] = useState({ id: "", s: 0 })
    const [content, setContent] = useState(data[0].message)
    const [time, setTime] = useState(1)
    const [answersLocal, setAnswersLocal] = useState(data.slice(1))
    const textRef = useRef(null);
    const menuRef = useRef(null);

    const toggleEditMode = () => setIsEditMode(prev => !prev);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const { get, put, del } = useApi();

    const handleCancelFuq = () => {
        debugger
        let sender = data[0].sender + "_" + new Date().getHours() + new Date().getMinutes()
        put(`msg/${data[0]._id}`, { body: { sender, isFuq: false }, enableLogging: true })
            .then(_ => window.location.reload())
    }

    useEffect(() => {
        if (isEditMode && textRef.current) {
            textRef.current.focus();
        }
    }, [isEditMode]);

    const handleSave = () => {
        if (isEditMode) {
            put(`msg/${id}`, { body: { message: content }, enableLogging: true })
                .then((res) => setContent(res.message))
        }
        toggleEditMode();
        toggleMenu()
    }

    const handleShowMore = () => {
        get(`msg/${id}`, { params: { time: time + 1 }, enableLogging: true })
            .then((res) => {
                setAnswersLocal(res.slice(1))
                setTime(time + 1)
            })
    }
    const handleFocus = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    const handleDelete = () => {
        let ids = active.id ? [id, active.id] : [id];
        del(`msg`, { body: { ids } }, { enableLogging: true })
            .then(_ => i == 0 ? handleNav(1) : window.location.reload())
    };
    const handleBlur = (event) => {
        if (menuRef.current && menuRef.current.contains(event.relatedTarget)) {
            return;
        }
        setIsMenuOpen(false);

        if(false && isEditMode) toggleEditMode()
    };

    useEffect(() => {
        if (active.id && resultObj) {
            const obj = { ...resultObj }
            if (i == 0) obj.aId = active.s == 1 ? active.id : undefined
            else {
                let f = obj.fuq.find(o => o.qId == data[0]._id)
                f.aId = active.s == 1 ? active.id : undefined
            }
            setResultObj(obj)
        }

    }, [active]);

    console.log(data);

    return <div className={style.one}>
        <div className={style.title}>
            {isFuq ?
                i == 0 ? <h3>שאלה ראשית</h3> : <h3>{`שאלת המשך (${i})`}</h3>
                : <h3>שאלה</h3>}
            {isEditMode ?
                <textarea value={content} onChange={e => setContent(e.target.value)} style={{ fontSize: fontSize }}
                    onFocus={handleFocus}  ref={textRef}/>
                :
                <p className={style.q_content} style={{ fontSize: fontSize }}>{content}</p>}

            {/* <button className={style.edit} onClick={handleClick}>{isEditMode ? <> שמור  <MdSave /> </>: <>עריכה <SlPencil /></>}</button>
            {!isEditMode && <button className={style.edit} onClick={handleCancelFuq}> ביטול שאלת המשך <SlSettings /></button>}
            {isEditMode && <button className={style.edit} onClick={()=> setIsEditMode(!isEditMode)}> סגור <SlClose /></button>} */}

                <div className={style.menu_wrapper } onBlur={handleBlur}> 
            <button className={style.menu_dots} onClick={() => setIsMenuOpen(!isMenuOpen)}>{!isEditMode ? isMenuOpen ? <IoMdClose /> : <SlOptionsVertical /> : ''}</button>
            {isMenuOpen &&
                <div className={style.menu}   tabIndex={1}>
                    {isEditMode ?
                        <>
                            <button className={style.edit} onClick={handleSave}>שמור  <MdSave /></button>
                            <button className={style.edit} onClick={() => setIsEditMode(!isEditMode)}> סגור <SlClose /></button>
                        </>
                        :
                        <>
                            <button className={style.edit} onClick={handleSave}>עריכה <SlPencil /></button>
                            <button className={style.edit} onClick={handleCancelFuq}> ביטול שאלת המשך <SlSettings /></button>
                            <button className={style.edit} onClick={handleDelete}> מחק שאלה <MdDelete /></button>
                            {active.id && <button className={style.edit} onClick={handleDelete}> מחק שאלה ותשובה <MdDelete /></button>}
                        </>
                    }
                </div>}
                </div>
            <div>{dates.formatDate(data[0]?.date)}</div>
        </div>

        {!isFuq || (isFuq && i == 0) ? <div className={style.line}></div> : ''}

        <div className={style.answers}>
            {answersLocal.map(a =>
                <AnswerBlock key={a._id} content={a.message} date={a.date} _id={a._id} setActive={setActive} active={active} handleNav={handleNav} setAnswers={setAnswersLocal} isFuq={isFuq} />
            )}
        </div>
        <div className={style.load}>
            <div className={style.line} />
            {isLast ? <button onClick={handleShowMore}>טען עוד</button> : ''}
        </div>
    </div>
}

export default MatchBlock