import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose, IoIosCloseCircle } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import style from './style.module.css';
import useApi from '../../helpers/useApi';

function AnswerBlock({ content, _id, setActive, active, handleNav, setAnswers, isFuq }) {
    const { id } = useParams();
    const { post, put, del } = useApi();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ansValue, setAnsValue] = useState(content);

    const toggleEditMode = () => setIsEditMode(prev => !prev);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const handleSave = () => {
        if (isEditMode) {
            put(`msg/${_id}`, { body: { message: ansValue } })
                .then(res => setAnsValue(res.message));
        }
        toggleEditMode();
        toggleMenu()
    };

    const handleSaveQA = () => {
        post(`msg`, { body: { qId: id, aId: _id } })
            .then(_ => handleNav(1))
    }

    const handleDelete = () => {
        del(`msg/${_id}`, { enableLogging: true })
            .then(_ => setAnswers(prev => prev.filter(p=>p._id != _id)))
        toggleEditMode();
    };
    return (
        <div className={`${!ansValue ? style.delete : style.block} ${active.s ==1 && active.id == _id? style.active : ''}`}>
            {isEditMode ? (
                <textarea value={ansValue} onChange={e => setAnsValue(e.target.value)} />
            ) : (
                <p onClick={() => setActive({id:_id,s:1})}>{ansValue}</p>
            )}

            <div className={style.side}>
                {active.s ==1 && active.id == _id ? (
                    <>
                        <button className={style.cancel} onClick={() => {console.log(_id);
                         setActive({id:_id,s:0})}}>
                            <IoIosCloseCircle />
                        </button>
                        {!isFuq ? <button className={style.ok} onClick={handleSaveQA}>
                            <ImCheckmark />
                        </button> : ''}
                    </>
                ) : (
                    isEditMode ? (
                        <button onClick={handleSave}><MdSave /></button>
                    ) : (
                        <>
                            <button onClick={toggleMenu}>{isMenuOpen ? <IoMdClose /> : <SlOptionsVertical />}</button>
                            {isMenuOpen && (
                                <div className={style.menu}>
                                    <button onClick={toggleEditMode}>ערוך תשובה</button>
                                    <button onClick={handleDelete}>מחק תשובה</button>
                                </div>
                            )}
                        </>
                    )
                )}
            </div>
        </div>
    );
}

export default AnswerBlock;
