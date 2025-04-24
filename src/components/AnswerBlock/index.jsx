import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlOptionsVertical } from 'react-icons/sl';
import { IoMdClose, IoIosCloseCircle } from 'react-icons/io';
import { ImCheckmark } from 'react-icons/im';
import style from './style.module.css';
import useApi from '../../hooks/useApi';
import dates from '../../helpers/dates';
import ActionMenu from '../ActionMenu';
import EditableTextarea from '../EditableTextarea';

function AnswerBlock({ content, date, _id, setActive, active, handleNav, setAnswers, isFuq, handleMoveAnswer }) {
    const { id } = useParams();
    const { post, put, del } = useApi();
    const [isEditMode, setIsEditMode] = useState(false);
    const [ansValue, setAnsValue] = useState(content);
    const divRef = useRef();

    const toggleEditMode = () => setIsEditMode(prev => !prev);

    const handleSave = async () => {
        const res = await put(`msg/${_id}`, { body: { message: ansValue } });
        setAnsValue(res.message);
        setIsEditMode(false);
    };

    const handleSaveQA = () => {
        post(`msg`, { body: { qId: id, aId: _id } })
            .then(() => handleNav(1));
    };

    const handleDelete = () => {
        del(`msg`, { body: { ids: [_id] } }, { enableLogging: true })
            .then(() => setAnswers(prev => prev.filter(p => p._id !== _id)));
        setIsEditMode(false);
    };
    const height = divRef.current?.offsetHeight;

    const isActive = active.s === 1 && active.id === _id;
    const blockStyle = `${!ansValue ? style.delete : style.block} ${isActive ? style.active : ''}`;

    const handleClickMain = (e) => {
        const isFromAction = e.target.closest('button') || e.target.closest('textarea') || e.target.closest('svg');
        if (!isEditMode && !isFromAction) {
            setActive({ id: _id, s: 1 });
        }
    };

    return (
        <div className={blockStyle} onClick={handleClickMain}>
            <div style={{ width: '100%' }}>
                {isEditMode ? (
                    <EditableTextarea
                        value={ansValue}
                        onChange={setAnsValue}
                        onSave={handleSave}
                        onCancel={toggleEditMode}
                        height={height}
                    />
                ) : (
                    <>
                        <p ref={divRef}>{ansValue}</p>
                        <div className={style.date}>{dates.formatDate(date, true)}</div>
                    </>
                )}
            </div>

            <div className={style.side} tabIndex={0}>
                {isActive ? (
                    <>
                        <button className={style.cancel} onClick={() => setActive({ id: _id, s: 0 })}>
                            <IoIosCloseCircle />
                        </button>
                        {!isFuq && (
                            <button className={style.ok} onClick={handleSaveQA}>
                                <ImCheckmark />
                            </button>
                        )}
                    </>
                ) : !isEditMode ? (
                    <ActionMenu
                        icon={<SlOptionsVertical />}
                        openIcon={<IoMdClose />}
                        direction="bottom-left"
                        options={[
                            { label: 'ערוך תשובה', onClick: toggleEditMode },
                            { label: 'מחק תשובה', onClick: handleDelete, condition: !!ansValue },
                            { label: 'העבר לתשובה הקודמת', onClick: () => handleMoveAnswer(_id, 1) },
                            { label: 'העבר לתשובה הבאה', onClick: () => handleMoveAnswer(_id, 0) },
                        ]}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default AnswerBlock;
