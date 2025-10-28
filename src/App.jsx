import React, { useEffect, useState } from 'react';
import './App.css';
import { FaJava } from 'react-icons/fa'; // For Java icon

// --- Import Your New Components ---
import AnimatedList from './components/AnimatedList.jsx'; 
import LetterGlitch from './components/LetterGlitch.jsx';
import FaultyTerminal from './components/FaultyTerminal.jsx'; 
import LogoLoop from './components/LogoLoop.jsx';

// --- Import icons for the LogoLoop demo (Only working icons remain) ---
import {
  SiReact,
  SiPython,
  SiMysql,
  SiGit
} from 'react-icons/si';

// --- Setup for LogoLoop ---
const techLogos = [
  { node: <SiPython />, title: 'Python' },
  { node: <FaJava />, title: 'Java' }, 
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C++</span>, title: 'C++' },
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C#</span>, title: 'C#' },
  { node: <SiMysql />, title: 'MySQL' },
  { node: <SiReact />, title: 'React' },
  { node: <SiGit />, title: 'Git' },
];

// --- Achievements data for the AnimatedList ---
const achievementList = [
    'Top 10 academic ranking in high school (85% average).',
    'Top in Grade for Information Technology in High School.',
    'Top in Grade for Afrikaans FAL.',
    'Achieved 5 distinctions.',
    'Selected for tutoring and teaching assistance roles.',
    'Part of the group that won the 48-hour Arcademia Game Jam.',
    'Attended the World Choir Games in 2018.',
    'Bronze medal at the World Choir Games in 2018.',
    'Received a 100% Academic Bursary for my first year at NWU.',
];


function App() {
  // This useEffect hook replaces your <script> for the fade-in effect
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    faders.forEach((section) => {
      observer.observe(section);
    });

    // Cleanup function
    return () => {
      faders.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []); 

  // This useEffect hook replaces your <script> for scrolling to top
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };

    // Cleanup function
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <>
      {/* --- GLITCH MOVED TO TOP LEVEL TO COVER ENTIRE BACKGROUND --- */}
      <div id="full-screen-glitch" style={{ opacity: 0.05 }}> {/* <-- Changed opacity to 0.05 */}
  <LetterGlitch
     glitchSpeed={80} 
     centerVignette={false} 
     outerVignette={false} 
     smooth={true} 
  />
</div>
      {/* --- END FULL SCREEN GLITCH WRAPPER --- */}
      
      <header id="top">
        
        {/* --- FAULTY TERMINAL ENABLED HERE (Alone in the header) --- */}
        <div style={{ position: 'absolute', width: '100%', height: '100vh', top: 0, left: 0, zIndex: 1, opacity: 1 }}>
          <FaultyTerminal 
            pageLoadAnimation={true} 
            noiseAmp={0.5} 
            curvature={0.1}
          />
        </div>
        {/* --- END FAULTY TERMINAL --- */}
        
        <div className="overlay" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Jan-Paul van den Berg</h1>
          <p>3rd Year BSc IT Student | Aspiring Programmer</p>
        </div>
      </header>

      <nav>
        <a href="#profile">Profile</a>
        <a href="#cv">CV</a>
        <a href="#education">Education</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#achievements">Achievements</a>
        <a href="#projects">Projects</a>
        <a href="#hobbies">Hobbies</a>
        <a href="#contact">Contact</a>
      </nav>

      <section id="profile" className="fade-in-section">
        <h2>Profile</h2>
        <p>
          I am a passionate and hardworking third-year BSc Information
          Technology student with a strong interest in programming and
          problem-solving. I strive to continuously improve my skills and
          contribute meaningfully to every project I take on.
        </p>
      </section>

      <section id="cv" className="fade-in-section">
        <h2>My CV</h2>
        <p>
          For a detailed and professionally formatted version of my resume,
          <a
            href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
            target="_blank"
            rel="noopener noreferrer"
            // No inline style: color handled by App.css
          >
            View My CV (Google Drive)
          </a>
        </p>
      </section>

      <section id="education" className="fade-in-section">
        <h2>Education</h2>
        <div className="education">
          <h3>BSc in Information Technology</h3>
          <p>
            North-West University (2023 - Present) <br />
            <br />
            <strong>
              <u>Notable Modules</u>
            </strong>
            <br />
            <ul style={{ paddingLeft: '2rem' }}>
              <li>Object Oriented Programming - 86%</li>
              <li>Apps And Advanced User Interface Programming – 75%</li>
              <li>Databases – 71%</li>
              <li>Artificial Intelligence – 72%</li>
              <li>Networks – 76%</li>
            </ul>
          </p>
          <br />
          <h3>Monument High School, Krugersdorp (Graduated 2022)</h3>
          <p>
            <ul style={{ paddingLeft: '2rem' }}>
              <li>Information Technology - 90%</li>
              <li>Accounting – 81%</li>
              <li>CAT – 89%</li>
              <li>Mathematics – 78%</li>
              <li>English – 79%</li>
              <li>Afrikaans – 94%</li>
              <li>Life Orientation – 87%</li>
            </ul>
          </p>
        </div>
      </section>

      <section id="skills" className="fade-in-section">
        <h2>Skills</h2>
        
        {/* --- LOGO LOOP HERE (Enabled) --- */}
        <div
          style={{
            height: '100px',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '2rem',
            marginBottom: '1rem',
			backgroundColor: '#000000', /* <-- ADD THIS LINE */
          }}
        >
          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={32}
            gap={40}
            pauseOnHover
            fadeOut
            fadeOutColor="#000000" /* <-- ENSURE THIS IS PURE BLACK */
          />
        </div>

        <div className="skills">
          <ul style={{ paddingLeft: '2rem' }}>
            <li>
              <strong>Programming Languages:</strong> Python, Java, C++, C#,
              MySQL, HTML
            </li>
            <li>
              <strong>Database Systems:</strong> SQLite, MySQL, SQL Server
            </li>
            <li>
              <strong>Networking:</strong> Cisco Packet Tracer, strong
              understanding of the OSI model
            </li>
            <li>
              <strong>Systems Design:</strong> UML, Enhanced ERD (EERD), Crow’s
              Foot notation
            </li>
            <li>
              <strong>Software Tools:</strong> Visual Studio, Oracle SQL
              Developer, Git
            </li>
            <li>
              <strong>Algorithms & Problem Solving:</strong> Strong grasp of
              algorithm design and analysis including sorting, searching, and
              recursion
            </li>
            <li>
              <strong>Languages:</strong> Fluent in English and Afrikaans
            </li>
          </ul>
        </div>
      </section>

      <section id="experience" className="fade-in-section">
        <h2>Experience</h2>

        <div className="job">
          <h3>Feb 2025 – July 2025</h3>
          <p>
            <strong>Tutor / Exam Preparation Support</strong> | North-West
            University | Potchefstroom
          </p>
          <ul>
            <li>
              Tutored peers and students in Python, SQL, and database concepts
            </li>
            <li>
              Built interactive exam prep tools covering string manipulation,
              list operations, and SQLite handling
            </li>
          </ul>
        </div>

        <div className="job">
          <h3>Feb 2025 – Mar 2025</h3>
          <p>
            <strong>Computer Literacy Class Teacher</strong> | North-West
            University | Potchefstroom
          </p>
          <ul>
            <li>
              Assisted in teaching basic computer skills to adult learners and
              beginners
            </li>
            <li>
              Guided learners on using Microsoft Word, Excel, Internet
              browsers, and email
            </li>
            <li>
              Helped improve digital literacy in the community through patient,
              hands-on support
            </li>
          </ul>
        </div>

        <div className="job">
          <h3>July 2025</h3>
          <p>
            <strong>House Sitter</strong> | Hennie Pieters | Krugersdorp
          </p>
          <ul>
            <li>
              Entrusted with overseeing and maintaining the household for the
              full month
            </li>
            <li>
              Ensured the property’s safety, upkeep, and cleanliness during the
              owner's absence
            </li>
          </ul>
        </div>

        <div className="job">
          <h3>Jan 2024</h3>
          <p>
            <strong>Waiter</strong> | Ana Paula’s Coffee Shop | Krugersdorp
          </p>
          <ul>
            <li>
              Provided friendly and efficient table service to customers
            </li>
            <li>
              Assisted with daily operations to ensure a smooth-running coffee
              shop environment
            </li>
          </ul>
        </div>

        <div className="job">
          <h3>Dec 2023</h3>
          <p>
            <strong>House Sitter</strong> | Wandi Koen | Krugersdorp
          </p>
          <ul>
            <li>
              Responsible for the household’s upkeep and security during a
              month-long absence
            </li>
            <li>
              Maintained trust and reliability through responsible caretaking
            </li>
          </ul>
        </div>
      </section>

      <section id="achievements" className="fade-in-section">
        <h2>Achievements</h2>
        
        {/* --- ANIMATED LIST MOVED HERE (Enabled) --- */}
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <AnimatedList 
            items={achievementList} // Using the dedicated achievement list array
            displayScrollbar={false}
            className='animated-list-container' // Added class for App.css overrides
          />
        </div>
        {/* --- END ANIMATED LIST --- */}
        
        <div className="achievement">
          <p style={{marginTop: '2rem'}}>
            <a href="https://www.linkedin.com/feed/update/urn:li:activity:7350874250775277570/"
              target="_blank"
              rel="noopener noreferrer"
              // No inline style: color handled by App.css
            >
              View Arcademia Game Jam Announcement
            </a>
          </p>
        </div>
      </section>

      <section id="projects" className="fade-in-section">
        <h2>Projects</h2>
        <div className="projects">
          <ul style={{ paddingLeft: '2rem' }}>
            <li>
              <a
                href="https://github.com/JPvdBerg/Minesweeper"
                target="_blank"
                rel="noopener noreferrer"
                // No inline style: color handled by App.css
              >
                Minesweeper Game
              </a>{' '}
              – A classic tile-based Minesweeper game developed in Java with a
              clean GUI and recursive reveal logic.
            </li>
            <li>
              <a
                href="https://github.com/JPvdBerg/Snake-Game"
                target="_blank"
                rel="noopener noreferrer"
                // No inline style: color handled by App.css
              >
                Snake Game
              </a>{' '}
              – A simple and responsive version of Snake built in Java using
              key event handling and grid movement.
            </li>
            <li>
              <a
                href="https://github.com/JPvdBerg/Instant-Messaging-App"
                target="_blank"
                rel="noopener noreferrer"
                // No inline style: color handled by App.css
              >
                Instant Messaging App
              </a>{' '}
              – A Python-based chat application that supports real-time
              communication over the internet using sockets.
            </li>
          </ul>
        </div>
      </section>

      <section id="hobbies" className="fade-in-section">
        <h2>Hobbies</h2>
        <ul style={{ paddingLeft: '2rem' }}>
          <li>Guitar</li>
          <li>Chess</li>
          <li>Video Games</li>
          <li>Coding</li>
          <li>Reading</li>
          <li>Rock Climbing</li>
          <li>
            Serenade (A capella group wherein we came top 5 in our local
            competition at the NWU)
          </li>
        </ul>
      </section>

      <section id="contact" className="fade-in-section">
        <h2>Contact</h2>
        <p> 065-918-0206</p>
        <p>
          <a
            href="mailto:janpaulvdberg@gmail.com"
            // No inline style: color handled by App.css
          >
            janpaulvdberg@gmail.com
          </a>
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/jan-paul-van-den-berg-a46686270/"
            // No inline style: color handled by App.css
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        </p>
        <p>
          <a
            href="https://github.com/JPvdBerg"
            // No inline style: color handled by App.css
            target="_blank"
            rel="noopener noreferrer"
          >
            My GitHub Profile
          </a>
        </p>
        <p>
          <a
            href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
            // No inline style: color handled by App.css
            target="_blank"
            rel="noopener noreferrer"
          >
            View My CV
          </a>
        </p>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <a
          href="#top"
          // No inline style: color handled by App.css
        >
          ↑ Back to Top
        </a>
      </div>

      <footer>
        <p>&copy; 2025 Jan-Paul van den Berg. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;