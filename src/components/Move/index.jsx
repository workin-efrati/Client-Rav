import { Link, useLocation, useParams } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import style from './style.module.css'

function Move({ date }) {

    const { year } = useParams()
    const { month } = useParams()
    const { day } = useParams()
    let prevPath = ''
    let nextPath = ''
    let back = '/'

    if (day) {
        prevPath = `/${year}/${month}/${day - 1}`
        nextPath = `/${year}/${month}/${Number(day) + 1}`
        back = `/${year}/${month}`
    }
    else if (month) {
        prevPath = `/${year}/${month - 1}`
        nextPath = `/${year}/${Number(month) + 1}`
        back = `/${year}`
    }
    else {
        prevPath = `/${year - 1}`
        nextPath = `/${Number(year) + 1}`
        back = '/'
    }

    return <div className={style.move}>
        {(month || year != 2025) && (day || month != 12) && day != 31 ? <Link key={'next'} to={nextPath}><IoIosArrowForward /></Link> : <div className={style.remove}></div>}
        <Link className={style.back} key={date} to={back}>{date}</Link>
        {(month || year != 2020) && (day || month != 1) && day != 1 ? <Link key={'prev'} to={prevPath}><IoIosArrowBack /></Link> : <div className={style.remove}></div>}
    </div>

}

export default Move