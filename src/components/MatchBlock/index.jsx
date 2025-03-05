import { useState } from 'react'
import style from './style.module.css'
import { api } from '../../helpers/api'
import { MdSave } from 'react-icons/md'
import { SlPencil } from 'react-icons/sl'
import AnswerBlock from '../AnswerBlock';

function MatchBlock({ i, question, setQuestion, answers, fontSize, id, fuq }) {

    const [isEditMode, setIsEditMode] = useState(false)
    const [active, setActive] = useState()
    const [content, setContent] = useState(question)

    const handleClick = () => {
        if (isEditMode) {
            api({ url: `msg/${id}`, method: 'put', body: { message: content } })
            .then((res) => setQuestion(res.message))
        }
        setIsEditMode(!isEditMode)
    }

    return <div className={style.one}>
        <div className={style.title}>
            {fuq ?
                i == 0 ? <h3>שאלה ראשית</h3> : <h3>{`שאלת המשך (${i})`}</h3>
                : <h3>שאלה</h3>}
            {isEditMode ?
                <textarea value={content} onChange={e => setContent(e.target.value)} style={{ fontSize: fontSize }} />
                :
                <p className={style.q_content} style={{ fontSize: fontSize }}>{content}</p>}
            <button className={style.edit} onClick={handleClick}>{isEditMode ? <MdSave /> : <SlPencil />}</button>
        </div>
        {!fuq || (fuq && i == 0) ? <div className={style.line}></div> : ''}
        <div className={style.answers}>
            {answers.map(a =>
                <AnswerBlock key={a._id} content={a.message} _id={a._id} setActive={setActive} active={active} />
            )}
            <button className={style.load} onClick={api({ url: `msg/${id}`, method: 'get', params: { time: 1 } })}>טען עוד</button>
        </div>
        <div className={style.line} />
    </div>
}

export default MatchBlock