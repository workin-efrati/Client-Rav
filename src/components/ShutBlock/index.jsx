import style from './style.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { MdSave } from 'react-icons/md'
import { SlPencil } from 'react-icons/sl'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { FaUnlink } from 'react-icons/fa'
import { TbReplace } from 'react-icons/tb'

function ShutBlock({ to }) {

    const [isEditModeQ, setIsEditModeQ] = useState(false)
    const [isEditModeA, setIsEditModeA] = useState(false)

    const handleClick = (type) => {
        if (type === 'q') setIsEditModeQ(!isEditModeQ)
        else setIsEditModeA(!isEditModeA)
    }

    const [question, setQuestion] = useState('שלום הרב האם עלי ללבוש סוודר בחורף?')
    const [answer, setAnswer] = useState(' אשכנזים נהגו לעלות כמנהג המובא ברמ"א. ספרדים חלקם נהגו וחלקם לא נהגו. אפשר לבחור, משום שאין איסור. ובלבד שזה לא יהיה טיול, אלא עליה של כובד ראש. ')

    return <div className={style.shut_block}>
        <div className={style.block}>
            <div className={style.header}>
                <h4>שאלה</h4>
                <button onClick={() => handleClick('q')}>{isEditModeQ ? <MdSave /> : <SlPencil />}</button>
            </div>
            {isEditModeQ ?
                <textarea value={question} onChange={e => setQuestion(e.target.value)} />
                // <textarea value={question} onChange={e =>
                //     api({ url: `message/${id}`, method: 'put', params: { message: e.target.value } })
                //         .then((res) => setQuestion(res))}/>
                :
                <p className={style.q_content} >{question}</p>}
        </div>
        <div className={style.buttons}>
            <Link to={to}><TbReplace /></Link>
            <button onClick={() => 'hi'}><FaUnlink /></button>
            <button onClick={() => 'hi'}><RiDeleteBin6Fill /></button>
        </div>
        <div className={`${style.block} ${style.question}`}>
            <div className={style.header}>
                <h4>תשובה</h4>
                <button onClick={handleClick}>{isEditModeA ? <MdSave /> : <SlPencil />}</button>
            </div>
            {isEditModeA ?
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} />
                // <textarea value={answer} onChange={e =>
                //     api({ url: `message/${id}`, method: 'put', params: { message: e.target.value } })
                //         .then((res) => setAnswer(res))} />
                :
                <p className={style.q_content} >{answer}</p>}
        </div>
    </div>
}

export default ShutBlock