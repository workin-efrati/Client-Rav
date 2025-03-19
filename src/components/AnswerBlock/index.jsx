import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose, IoIosCloseCircle } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import { api } from '../../helpers/api';
import style from './style.module.css';

function AnswerBlock({ content, _id, setActive, active }) {
    const { id } = useParams();
    const { year,month,day } = useParams();
    const nav = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ansValue, setAnsValue] = useState(content);

    const toggleEditMode = () => setIsEditMode(prev => !prev);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const handleSave = async () => {
        if (isEditMode) {
                const res = await api({ url: `msg/${_id}`, method: 'put', body: { message: ansValue } });
                setAnsValue(res.message);
        }
        toggleEditMode();
        toggleMenu()
    };

    const handleSaveQA = async () => {
        api({ url: `msg`, method:'post', body : { qId: id, aId: _id } })
        .then(_=>nav(`/${year}/${month}/${day}`))
    }

    const handleDelete = async (method, body = {}) => {
        try {
            const res = await api({ url: `msg/${_id}`, method, body });
            if (method === 'delete') setAnsValue('');
            else setAnsValue(res.message);
        } catch (error) {
            console.error("API request failed:", error);
        }
        toggleMenu();
    };

    return (
        <div className={`${!ansValue ? style.delete : style.block} ${active === _id ? style.active : ''}`}>
            {isEditMode ? (
                <textarea value={ansValue} onChange={e => setAnsValue(e.target.value)} />
            ) : (
                <p onClick={() => setActive(_id)}>{ansValue}</p>
            )}

            <div className={style.side}>
                {active === _id ? (
                    <>
                        <button className={style.cancel} onClick={() => setActive(null)}>
                            <IoIosCloseCircle />
                        </button>
                        <button className={style.ok} onClick={handleSaveQA}>
                            <ImCheckmark />
                        </button>
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
                                    <button onClick={() => handleApiCall('delete')}>מחק תשובה</button>
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
