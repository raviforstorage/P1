import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <div className="container navwrap">
        <div className="brand">
          Campus<span>Connect</span>
        </div>
        <div className="navlinks">
          <a href="#how">How it works</a>
          <a href="#about">About</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
          <Link className="btn btn-outline navcta" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
