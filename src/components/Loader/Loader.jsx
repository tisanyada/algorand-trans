import { Spinner } from "react-bootstrap"


const Loader = ({ variant }) => {
    return (
        <Spinner
            animation='border'
            role='status'
            style={{
                width: '100px',
                height: '100px',
                margin: 'auto',
                display: 'block'
            }}
            className={variant}
        >
            {/* <span className="sr-only">Loading...</span> */}
        </Spinner>
    )
}

Loader.defaultProps = {
    variant: '0px'
}


export default Loader