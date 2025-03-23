import { useEffect, useState } from 'react'
import style from './style.module.css'
import { api } from '../../helpers/api'
import { MdSave } from 'react-icons/md'
import { SlPencil } from 'react-icons/sl'
import AnswerBlock from '../AnswerBlock';
import useApi from '../../helpers/useApi'
import dates from '../../helpers/dates'

function MatchBlock({ i, data, fontSize, id, isFuq, handleNav, isLast, resultObj, setResultObj }) {


    const [isEditMode, setIsEditMode] = useState(false)
    const [active, setActive] = useState({id:"",s:0})
    const [content, setContent] = useState(data[0].message)
    const [time, setTime] = useState(1)
    const [answersLocal, setAnswersLocal] = useState(data.slice(1))

    const { get, put } = useApi();

    const handleClick = () => {
        if (isEditMode) {
            put(`msg/${id}`, { body: { message: content }, enableLogging: true })
                .then((res) => setContent(res.message))
        }
        setIsEditMode(!isEditMode)
    }

    const handleShowMore = () => {
        get(`msg/${id}`, { params: { time: time + 1 }, enableLogging: true })
            .then((res) => {
                setAnswersLocal(res.slice(1))
                setTime(time + 1)
            })
    }

    useEffect(() => {
        if (active.id && resultObj) {
            const obj = { ...resultObj }
            if (i == 0) obj.aId = active.s==1 ? active.id :  undefined 
            else {
                let f = obj.fuq.find(o => o.qId == data[0]._id)
                f.aId = active.s==1 ?  active.id : undefined
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
                <textarea value={content} onChange={e => setContent(e.target.value)} style={{ fontSize: fontSize }} />
                :
                <p className={style.q_content} style={{ fontSize: fontSize }}>{content}</p>}

            <button className={style.edit} onClick={handleClick}>{isEditMode ? <MdSave /> : <SlPencil />}</button>
            <div>{i == 0 && dates.formatDate(data[0].date)}</div>
        </div>

        {!isFuq || (isFuq && i == 0) ? <div className={style.line}></div> : ''}

        <div className={style.answers}>
            {answersLocal.map(a =>
                <AnswerBlock key={a._id} content={a.message} _id={a._id} setActive={setActive} active={active} handleNav={handleNav} setAnswers={setAnswersLocal} isFuq={isFuq} />
            )}
        </div>
        <div className={style.load}>
            <div className={style.line} />
            {isLast ? <button onClick={handleShowMore}>טען עוד</button> : ''}
        </div>
    </div>
}

export default MatchBlock