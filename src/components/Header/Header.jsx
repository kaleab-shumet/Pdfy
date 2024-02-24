import './Header.css'

const Header = () => {
  return (
    <div className="my-4">
      <div className="container d-flex flex-column align-items-center">
        <a
          className="text-center h1 main-title"
          href="/"
        >
          Pdfy
        </a>
        <h6 className="text-center text-muted">
          Convert images to pdf for free. No registration, No watermark !
        </h6>
      </div>
    </div>
  );
};

export default Header;
