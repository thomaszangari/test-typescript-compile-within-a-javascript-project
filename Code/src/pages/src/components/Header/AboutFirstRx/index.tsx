
import React, { useEffect, useState } from 'react';



/**
 * @Header
 * 
 * About First Rx page
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories 
 */


export default function AboutFirstRx() {


  // 
  
  return (
    <>
       {/**
             * refrencing version of: 1/28/2021
             * source: https://github.com/emilynorton?tab=repositories
             */}
      <main>

        {/* <article>
        {(language === 'english' || language === undefined) && <> 
          <h2>About First Rx</h2>
          <p>About information goes here...</p>
         </>}
         {(language === 'spanish') && <>{'<Spanish>'} 
          <h2>About First Rx</h2>
          <p>About information goes here...</p>
         </>}  
        </article> */}

      </main>
      {/*

             used in version 1 with wire frames
                // version 1 from wire frames
                // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
                // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
                // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 
            
            
            
              <main>
                {windowWidth > 550 ?
                <>
                    <div className={styles.main_desktop_container}>
                        <Link href={{
                            pathname:'/',
                            query:{language:language}}}><div className={styles.header_desktop_help} ><u>{'<<<'}
                          {(language === 'english' || language === undefined)   &&  'Home'}
                          {language === 'spanish' && '<Spanish>Home'}
                        </u>
                        </div></Link>
                        <div className={styles.main_desktop_help_title}><b>
                          {(language === 'english' || language === undefined)   &&  'FirstRX Help'}
                          {language === 'spanish' && '<Spanish>FirstRX Help'}
                            
                            </b>
                        </div>
                        <div className={styles.main_desktop_home_coupon_container}>
                            <div className={styles.main_desktop_help_question}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Questions? Give us a call at <b>800.555.1212</b>
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Questions? Give us a call at <b>800.555.1212</b>
                            </>
                          }   
                            
                                
                            </div>
                            <br />
                            <br />
                            <div className={styles.main_desktop_help_content_title}>
                            {language === 'english' || language === undefined   &&  <>
                            Help Topic 1
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Help Topic 1
                            </>
                          }   
                                
                            </div>
                            <br />
                            <p className={styles.main_desktop_help_content_paragraph}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Content needs to be here
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Content needs to be here
                            </>
                          }   
                                
                            </p>
                            <br />
                            <br />
                            <div className={styles.main_desktop_help_content_title}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Help Topic 2
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Help Topic 2
                            </>
                          }   
                                
                            </div>
                            <br />
                            <p className={styles.main_desktop_help_content_paragraph}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Content needs to be here
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Content needs to be here
                            </>
                          }   
                                
                            </p>
                            <br />
                            <br />
                            <div className={styles.main_desktop_help_content_title}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Help Topic 3
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Help Topic 3
                            </>
                          }   
                            
                            </div>
                            <br />
                            <p className={styles.main_desktop_help_content_paragraph}>
                            {(language === 'english' || language === undefined)   &&  <>
                            Content needs to be here                            
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Content needs to be here
                            </>
                          }   
                                
                            </p>
                        </div>
                    </div>
                    <div className={styles.main_desktop_bottom_container}>
                        <span className={styles.main_desktop_bottom_text}>
                        {(language === 'english' || language === undefined)   &&  <>
                        This is an easy and simple process to get big savings. Find the lowest price at a
                pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.                            
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            This is an easy and simple process to get big savings. Find the lowest price at a
                pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.
                            </>
                          }   
                            
                </span>
                    </div>
                </>:
                <div>
                     <Link href={{
                            pathname:'/',
                            query:{language:language}}}><div className={styles.header_desktop_help} ><u>{'<<<'}
                    {(language === 'english' || language === undefined)   &&  'Home'}
                          {language === 'spanish' && '<Spanish>Home'}
                    </u>
                    </div></Link>
                    <div className={styles.main_desktop_help_title}><b>
                    {(language === 'english' || language === undefined )  &&  <>
                    FirstRX Help
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            FirstRX Help
                            </>
                          }   
                        
                        </b>
                        </div>
                    <div className={styles.main_desktop_help_question}>
                    {(language === 'english' || language === undefined)   &&  <>
                            Questions? Give us a call at <b>800.555.1212</b>
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                            {'<Spanish>'} 
                            Questions? Give us a call at <b>800.555.1212</b>
                            </>
                          }   </div>
                    <p className={styles.main_desktop_help_content_paragraph}>
                    {(language === 'english' || language === undefined)   &&  <>
                    Content needs to be here
                            </>}
                          {language === 'spanish' && 
                          
                          <>
                          {'<Spanish>'}
                            Content needs to be here
                            </>
                          }
                        
                        </p> 
                </div>
                }
            </main> */}
    </>
  );
}