import React, { useState } from 'react';
import '../Hero.css';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/travel-06.png'; // import your logo from assets
import { useInView } from 'react-intersection-observer';

const Hero = ({ imageSrc }) => {
  return (
    <div className="hero">
      <img src={imageSrc} alt="Travel" className="hero__image" />
    </div>
  );
};

const Navbar = ({ navbarLinks }) => {
  // Determines if the "menu icon" was clicked or not. Note that this icon is only visible when the window width is small.
  const [menuClicked, setMenuClicked] = useState(false);

  const toggleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  return (
    <nav className="navbar">
      <span className="navbar__logo">
        <img src={logo} alt="TravelGuard Logo" />
      </span>
      {menuClicked ? (
        <FiX size={25} className={'navbar__menu'} onClick={toggleMenuClick} />
      ) : (
        <FiMenu
          size={25}
          className={'navbar__menu'}
          onClick={toggleMenuClick}
        />
      )}
      <ul
        className={
          menuClicked ? 'navbar__list navbar__list--active' : 'navbar__list'
        }
      >
        {navbarLinks.map((item, index) => {
          return (
            <li className="navbar__item" key={index}>
              <a className="navbar__link" href={item.url}>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const Slider = ({ imageSrc, title, subtitle, flipped }) => {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.4,
  });

  const renderContent = () => {
    if (!flipped) {
      return (
        <>
          <img src={imageSrc} alt="Travel" className="slider__image" />
          <div className="slider__content">
            <h1 className="slider__title">{title}</h1>
            <p>{subtitle}</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="slider__content">
            <h1 className="slider__title">{title}</h1>
            <p>{subtitle}</p>
          </div>
          <img src={imageSrc} alt="Travel" className="slider__image" />
        </>
      );
    }
  };

  return (
    <div className={inView ? 'slider slider--zoom' : 'slider'} ref={ref}>
      {renderContent()}
    </div>
  );
};

export { Hero, Navbar, Slider };
