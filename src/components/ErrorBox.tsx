import React from "react";

interface ErrorBoxProps {
    message: string;
    style?: React.CSSProperties;
}

function ErrorBox({ message, style }: ErrorBoxProps) {
    return (
        <div className="alert alert-danger m-0" role="alert" style={style}>
            {message}
        </div>
    );
}

export default ErrorBox;



