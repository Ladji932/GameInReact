
const Header = ({  location }) => {
  return (
    <header>
      <nav>
          <button id='redirect' onClick={location}>Choisissez votre personnage</button>
      </nav>
    </header>
  );
};

export default Header;
