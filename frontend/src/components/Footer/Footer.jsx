import './Footer.css';

function Footer() {
    const handleClick = () => {
        window.open('https://github.com/kimchicecream/API-Project', '_blank');
    };

    return (
        <div className='footer-container'>
            <img src='../../../github.png' />
            <button onClick={handleClick}>See on Github</button>
        </div>
    )
}

export default Footer;
