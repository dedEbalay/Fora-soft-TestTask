import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
    return (
        <div className="text-white bg-danger error-card text-center">
            <div className="card-body">
                <h5 className="card-title">Что-то пошло не так</h5>
                <p className="card-text">Перезагрузите страницу, навряд-ли это поможет, но попробовать стоит</p>
                <Link to="/">Или вернитесь на главную</Link>
            </div>
        </div>
    )
}

export default Error;