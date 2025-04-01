import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose, IoIosCloseCircle } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import style from './style.module.css';
import useApi from '../../helpers/useApi';
import dates from '../../helpers/dates';

function AnswerBlock({ content, date, _id, setActive, active, handleNav, setAnswers, isFuq }) {
    const { id } = useParams();
    const { post, put, del } = useApi();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ansValue, setAnsValue] = useState(content);
    const menuRef = useRef(null);
    const textRef = useRef(null);

    const toggleEditMode = () => setIsEditMode(prev => !prev);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    useEffect(() => {
        if (isEditMode && textRef.current) {
            textRef.current.focus();
        }
    }, [isEditMode]);

    const handleSave = () => {
        debugger
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
        del(`msg/${_id}`, { body: {ids: [_id]} }, { enableLogging: true })
            .then(_ => setAnswers(prev => prev.filter(p => p._id != _id)))
        toggleEditMode();
    };

    const handleFocus = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    const handleBlur = (event) => {
        if (menuRef.current && menuRef.current.contains(event.relatedTarget)) {
            return;
        }
        setIsMenuOpen(false);

        if (false && isEditMode) toggleEditMode()
    };
    return (
        <div className={`${!ansValue ? style.delete : style.block} ${active.s == 1 && active.id == _id ? style.active : ''}`}
            onBlur={handleBlur}>
            <div style={{ width: '100%' }}>
                {isEditMode ? (
                    <textarea
                        ref={textRef} value={ansValue} onChange={e => setAnsValue(e.target.value)}
                        onFocus={handleFocus} />
                ) : (
                    <>
                        <p onClick={() => setActive({ id: _id, s: 1 })}>{ansValue}</p>
                        <div className={style.date}>{dates.formatDate(date, true)}</div>
                    </>

                )}
            </div>

            <div className={style.side} tabIndex={0}>
                {active.s == 1 && active.id == _id ? (
                    <>
                        <button className={style.cancel} onClick={() => {
                            console.log(_id);
                            setActive({ id: _id, s: 0 })
                        }}>
                            <IoIosCloseCircle />
                        </button>
                        {!isFuq ? <button className={style.ok} onClick={handleSaveQA}>
                            <ImCheckmark />
                        </button> : ''}
                    </>
                ) : (
                    isEditMode ? (
                        <button tabIndex={1} onMouseDown={(e) => e.preventDefault()} onClick={handleSave}><MdSave /></button>
                    ) : (
                        // <div tabIndex={0}>
                        <>
                            <button onClick={toggleMenu}>{isMenuOpen ? <IoMdClose /> : <SlOptionsVertical />}</button>
                            {isMenuOpen && (
                                <div ref={menuRef} className={style.menu}>
                                    <button onClick={toggleEditMode}>ערוך תשובה</button>
                                    <button onClick={handleDelete}>מחק תשובה</button>
                                </div>
                            )}
                        </>

                        // </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AnswerBlock;
