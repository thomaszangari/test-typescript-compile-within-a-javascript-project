

import React from 'react';
import { Link } from 'react-router-dom';
// import styles from './../../../../../styles/SlidingHamburgerMenu.module.scss';
const SlidingHamburgerMenu = ({language, menuOpen,setOpenMenu }:any) => {

    return (
        <></>
        // <div className={`${styles.sliding_hamburger_menu_container_start} ` + (menuOpen && styles.sliding_hamburger_menu_container)}>
        //     {menuOpen && <div className={styles.sliding_hamburger_menu_content_container}>
        //         <br />
        //         <br />
        //         <div className={styles.sliding_hamburger_menu_title}>
        //             {(language === 'english' ||  language === undefined) && 'Menu'}
        //             {language === 'spanish' &&  '<Spanish>Menu'}                    
        //         </div>
        //         <br />
        //         <br />
        //         <div>
        //             <ul onClick={ setOpenMenu}>
        //                 <li><u>
        //                 {(language === 'english' ||  language === undefined) && 'About FirstRx'}
        //                 {language === 'spanish' &&  '<Spanish>About FirstRx'}
                            
        //                 </u></li>
        //                 <Link to={{
        //                     pathname:'/src/components/Header/Help',
        //                     query:{language:language}}}><li>
        //                     <u>
        //                     {(language === 'english' ||  language === undefined) && 'Help'}
        //                     {language === 'spanish' &&  '<Spanish> Help'}
                                
        //                         </u>
        //                     </li></Link>
        //                 <li>
        //                     <u>
        //                     {(language === 'english' ||  language === undefined) && 'Home / Start Search'}
        //                     {language === 'spanish' &&  '<Spanish> Home / Start Search'}
                                
        //                         </u>
        //                         </li>
        //             </ul>
        //         </div>
        //     </div>}
        // </div>
    )
}

export default SlidingHamburgerMenu;