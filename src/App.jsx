import React, { useEffect, useState } from 'react';
import './App.css';
import { FaJava } from 'react-icons/fa'; // For Java icon

// --- Import Your New Components ---
import AnimatedList from './components/AnimatedList.jsx'; 
import LetterGlitch from './components/LetterGlitch.jsx';
import FaultyTerminal from './components/FaultyTerminal.jsx'; 
import LogoLoop from './components/LogoLoop.jsx';
import DecryptedText from './components/DecryptedText.jsx'; 

// --- Import icons for the LogoLoop demo ---
import {
  SiReact,
  SiPython,
  SiMysql,
  SiGit,
  SiGnubash 
} from 'react-icons/si';

// --- Setup for DecryptedText defaults ---
const DECRYPT_PROPS = {
  animateOn: "view",
  speed: 10,
  maxIterations: 5,
  sequential: true,
  revealDirection: "center"
};

// --- Setup for LogoLoop ---
const techLogos = [
  { node: <SiPython />, title: 'Python' },
  { node: <FaJava />, title: 'Java' }, 
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>Kafka</span>, title: 'Kafka' }, 
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>GameDev</span>, title: 'Game Development' }, 
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C++</span>, title: 'C++' },
  { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C#</span>, title: 'C#' },
  { node: <SiMysql />, title: 'MySQL' },
  { node: <SiReact />, title: 'React' },
  { node: <SiGnubash />, title: 'Terminal' }, 
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
].map(text => ({ 
    node: <DecryptedText text={text} {...DECRYPT_PROPS} />,
    originalText: text
}));


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
      <div id="full-screen-glitch" style={{ opacity: 0.10 }}>
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
        <div id="terminal-wrapper" style={{ position: 'absolute', width: '100%', height: '100vh', top: 0, left: 0, zIndex: 1, opacity: 1 }}>
          <FaultyTerminal 
            pageLoadAnimation={true} 
            noiseAmp={0.5} 
            curvature={0.1}
          />
        </div>
        {/* --- END FAULTY TERMINAL --- */}
        
        <div className="overlay" style={{ position: 'relative', zIndex: 2 }}>
          <h1><DecryptedText text="Jan-Paul van den Berg" {...DECRYPT_PROPS} /></h1>
          <p><DecryptedText text="3rd Year BSc IT Student | Aspiring Programmer" {...DECRYPT_PROPS} /></p>
        </div>
      </header>

      <nav>
        <a href="#profile"><DecryptedText text="Profile" {...DECRYPT_PROPS} /></a>
        <a href="#cv"><DecryptedText text="CV" {...DECRYPT_PROPS} /></a>
        <a href="#education"><DecryptedText text="Education" {...DECRYPT_PROPS} /></a>
        <a href="#skills"><DecryptedText text="Skills" {...DECRYPT_PROPS} /></a>
        <a href="#experience"><DecryptedText text="Experience" {...DECRYPT_PROPS} /></a>
        <a href="#achievements"><DecryptedText text="Achievements" {...DECRYPT_PROPS} /></a>
        <a href="#projects"><DecryptedText text="Projects" {...DECRYPT_PROPS} /></a>
        <a href="#hobbies"><DecryptedText text="Hobbies" {...DECRYPT_PROPS} /></a>
        <a href="#contact"><DecryptedText text="Contact" {...DECRYPT_PROPS} /></a>
      </nav>

      <section id="profile" className="fade-in-section">
        <h2><DecryptedText text="Profile" {...DECRYPT_PROPS} /></h2>
        <p>
          <DecryptedText text="I am a passionate and hardworking third-year BSc Information Technology student with a strong interest in programming and problem-solving. I strive to continuously improve my skills and contribute meaningfully to every project I take on." {...DECRYPT_PROPS} />
        </p>
      </section>

      <section id="cv" className="fade-in-section">
        <h2><DecryptedText text="My CV" {...DECRYPT_PROPS} /></h2>
        <p>
          <DecryptedText text="For a detailed and professionally formatted version of my resume," {...DECRYPT_PROPS} />
          <a
            href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DecryptedText text="View My CV (Google Drive)" {...DECRYPT_PROPS} />
          </a>
        </p>
      </section>

      <section id="education" className="fade-in-section">
        <h2><DecryptedText text="Education" {...DECRYPT_PROPS} /></h2>
        <div className="education">
          <h3><DecryptedText text="BSc in Information Technology" {...DECRYPT_PROPS} /></h3>
          <p>
            <DecryptedText text="North-West University (2023 - Present)" {...DECRYPT_PROPS} /> <br />
            <br />
            <strong>
              <DecryptedText text="Notable Modules" {...DECRYPT_PROPS} />
            </strong>
            <br />
            <ul style={{ paddingLeft: '2rem' }}>
              <li><DecryptedText text="Object Oriented Programming - 86%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Apps And Advanced User Interface Programming – 75%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Databases – 71%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Artificial Intelligence – 72%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Networks – 76%" {...DECRYPT_PROPS} /></li>
            </ul>
          </p>
          <br />
          <h3><DecryptedText text="Monument High School, Krugersdorp (Graduated 2022)" {...DECRYPT_PROPS} /></h3>
          <p>
            <ul style={{ paddingLeft: '2rem' }}>
              <li><DecryptedText text="Information Technology - 90%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Accounting – 81%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="CAT – 89%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Mathematics – 78%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="English – 79%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Afrikaans – 94%" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Life Orientation – 87%" {...DECRYPT_PROPS} /></li>
            </ul>
          </p>
        </div>
      </section>

      <section id="skills" className="fade-in-section">
        <h2><DecryptedText text="Skills" {...DECRYPT_PROPS} /></h2>
        
        {/* --- LOGO LOOP HERE (Enabled) --- */}
        <div
          style={{
            height: '100px',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '2rem',
            marginBottom: '1rem',
            backgroundColor: '#000000', 
          }}
        >
          {/* Note: LogoLoop component is still external, but its function is presumed */}
          {/* <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={32}
            gap={40}
            pauseOnHover
            fadeOut
            fadeOutColor="#000000" 
          /> */}
        </div>

        <div className="skills">
          <ul style={{ paddingLeft: '2rem' }}>
            <li>
              <strong><DecryptedText text="Programming Languages:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Python, Java, C++, C#, MySQL, HTML, Kafka" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Data Handling:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Data Cleaning, SQL Server, MySQL, SQLite" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Development Focus:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Game Development, Song Making, Algorithmic Analysis" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Networking:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Cisco Packet Tracer, strong understanding of the OSI model" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Systems Design:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="UML, Enhanced ERD (EERD), Crow’s Foot notation" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Software Tools:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Visual Studio, Oracle SQL Developer, Git" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Algorithms & Problem Solving:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Strong grasp of algorithm design and analysis including sorting, searching, and recursion" {...DECRYPT_PROPS} />
            </li>
            <li>
              <strong><DecryptedText text="Languages:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Fluent in English and Afrikaans" {...DECRYPT_PROPS} />
            </li>
          </ul>
        </div>
      </section>

      <section id="experience" className="fade-in-section">
        <h2><DecryptedText text="Experience" {...DECRYPT_PROPS} /></h2>

        <div className="job">
          <h3><DecryptedText text="Feb 2025 – July 2025" {...DECRYPT_PROPS} /></h3>
          <p>
            <strong><DecryptedText text="Tutor / Exam Preparation Support" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| North-West University | Potchefstroom" {...DECRYPT_PROPS} />
          </p>
          <ul>
            <li><DecryptedText text="Tutored peers and students in Python, SQL, and database concepts" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Built interactive exam prep tools covering string manipulation, list operations, and SQLite handling" {...DECRYPT_PROPS} /></li>
          </ul>
        </div>

        <div className="job">
          <h3><DecryptedText text="Feb 2025 – Mar 2025" {...DECRYPT_PROPS} /></h3>
          <p>
            <strong><DecryptedText text="Computer Literacy Class Teacher" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| North-West University | Potchefstroom" {...DECRYPT_PROPS} />
          </p>
          <ul>
            <li><DecryptedText text="Assisted in teaching basic computer skills to adult learners and beginners" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Guided learners on using Microsoft Word, Excel, Internet browsers, and email" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Helped improve digital literacy in the community through patient, hands-on support" {...DECRYPT_PROPS} /></li>
          </ul>
        </div>

        <div className="job">
          <h3><DecryptedText text="July 2025" {...DECRYPT_PROPS} /></h3>
          <p>
            <strong><DecryptedText text="House Sitter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Hennie Pieters | Krugersdorp" {...DECRYPT_PROPS} />
          </p>
          <ul>
            <li><DecryptedText text="Entrusted with overseeing and maintaining the household for the full month" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Ensured the property’s safety, upkeep, and cleanliness during the owner's absence" {...DECRYPT_PROPS} /></li>
          </ul>
        </div>

        <div className="job">
          <h3><DecryptedText text="Jan 2024" {...DECRYPT_PROPS} /></h3>
          <p>
            <strong><DecryptedText text="Waiter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Ana Paula’s Coffee Shop | Krugersdorp" {...DECRYPT_PROPS} />
          </p>
          <ul>
            <li><DecryptedText text="Provided friendly and efficient table service to customers" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Assisted with daily operations to ensure a smooth-running coffee shop environment" {...DECRYPT_PROPS} /></li>
          </ul>
        </div>

        <div className="job">
          <h3><DecryptedText text="Dec 2023" {...DECRYPT_PROPS} /></h3>
          <p>
            <strong><DecryptedText text="House Sitter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Wandi Koen | Krugersdorp" {...DECRYPT_PROPS} />
          </p>
          <ul>
            <li><DecryptedText text="Responsible for the household’s upkeep and security during a month-long absence" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Maintained trust and reliability through responsible caretaking" {...DECRYPT_PROPS} /></li>
          </ul>
        </div>
      </section>

      <section id="achievements" className="fade-in-section">
        <h2><DecryptedText text="Achievements" {...DECRYPT_PROPS} /></h2>
        
        {/* --- ANIMATED LIST MOVED HERE (Enabled) --- */}
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <AnimatedList 
            items={achievementList.map(item => item.node)} 
            displayScrollbar={false}
            className='animated-list-container' 
          />
        </div>
        {/* --- END ANIMATED LIST --- */}
        
        <div className="achievement">
          <p style={{marginTop: '2rem'}}>
            <a href="https://www.linkedin.com/feed/update/urn:li:activity:7350874250775277570/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DecryptedText text="View Arcademia Game Jam Announcement" {...DECRYPT_PROPS} />
            </a>
          </p>
        </div>
      </section>

      <section id="projects" className="fade-in-section">
        <h2><DecryptedText text="Projects" {...DECRYPT_PROPS} /></h2>
        <div className="projects">
          <ul style={{ paddingLeft: '2rem' }}>
            <li>
                <a
                    href="https://github.com/Pantoffel24/Nova-Analytix-Repository-cmpg324-"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DecryptedText text="ClearVue BI System (RFP 02/2025)" {...DECRYPT_PROPS} />
                </a>{' '}
                – <DecryptedText text="Design and prototype of a scalable NoSQL Business Intelligence (BI) system for ClearVue Ltd. The solution used MongoDB and Apache Kafka for real-time sales data reporting, tailored to a custom financial year structure. Demonstrated the agility of NoSQL over traditional relational systems for evolving supplier analytics needs." {...DECRYPT_PROPS} />
            </li>
            <li>
                <a
                    href="https://github.com/HumaidEbrahim/Arcademia"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DecryptedText text="Godot Game: Arcademia" {...DECRYPT_PROPS} />
                </a>{' '}
                – <DecryptedText text="A 2D game developed using the Godot engine and GDScript, specifically designed as an interactive tool to teach young children fundamental concepts of programming logic, sequencing, and conditional branching through puzzle-solving." {...DECRYPT_PROPS} />
            </li>
            <li>
              <a
                href="https://github.com/JPvdBerg/Minesweeper"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DecryptedText text="Minesweeper Game" {...DECRYPT_PROPS} />
              </a>{' '}
              – <DecryptedText text="A classic tile-based Minesweeper game developed in Java with a clean GUI and recursive reveal logic." {...DECRYPT_PROPS} />
            </li>
            <li>
              <a
                href="https://github.com/JPvdBerg/Snake-Game"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DecryptedText text="Snake Game" {...DECRYPT_PROPS} />
              </a>{' '}
              – <DecryptedText text="A simple and responsive version of Snake built in Java using key event handling and grid movement." {...DECRYPT_PROPS} />
            </li>
            <li>
              <a
                href="https://github.com/JPvdBerg/Instant-Messaging-App"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DecryptedText text="Instant Messaging App" {...DECRYPT_PROPS} />
              </a>{' '}
              – <DecryptedText text="A Python-based chat application that supports real-time communication over the internet using sockets." {...DECRYPT_PROPS} />
            </li>
          </ul>
        </div>
      </section>

      <section id="hobbies" className="fade-in-section">
        <h2><DecryptedText text="Hobbies" {...DECRYPT_PROPS} /></h2>
        <ul style={{ paddingLeft: '2rem' }}>
          <li><DecryptedText text="Guitar" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Chess" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Video Games" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Coding" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Reading" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Rock Climbing" {...DECRYPT_PROPS} /></li>
          <li><DecryptedText text="Serenade (A capella group wherein we came top 5 in our local competition at the NWU)" {...DECRYPT_PROPS} /></li>
        </ul>
      </section>

      <section id="contact" className="fade-in-section">
        <h2><DecryptedText text="Contact" {...DECRYPT_PROPS} /></h2>
        <p> <DecryptedText text="065-918-0206" {...DECRYPT_PROPS} /></p>
        <p>
          <a
            href="mailto:janpaulvdberg@gmail.com"
          >
            <DecryptedText text="janpaulvdberg@gmail.com" {...DECRYPT_PROPS} />
          </a>
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/jan-paul-van-den-berg-a46686270/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DecryptedText text="LinkedIn Profile" {...DECRYPT_PROPS} />
          </a>
        </p>
        <p>
          <a
            href="https://github.com/JPvdBerg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DecryptedText text="My GitHub Profile" {...DECRYPT_PROPS} />
          </a>
        </p>
        <p>
          <a
            href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DecryptedText text="View My CV" {...DECRYPT_PROPS} />
          </a>
        </p>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <a
          href="#top"
        >
          <DecryptedText text="↑ Back to Top" {...DECRYPT_PROPS} />
        </a>
      </div>

      <footer>
        {/* --- INTERACTIVE CONSOLE FOOTER --- */}
        <div className='footer-console'>
            {/* The static prompt part */}
            <span style={{color: 'var(--hacker-green-light)'}}>[jpvdberg@virtualcv ~]$ </span>
            
            {/* FIX: Use a command that is stable and short */}
            <span className='typing-line' style={{
                 animation: 'typing 4s steps(35, end) infinite, blink-caret 0.75s step-end infinite'
            }}><DecryptedText text="run systems_check --verbose . . ." {...DECRYPT_PROPS} /></span>
        </div>
        {/* --- END CONSOLE --- */}
        <div className='footer-copyright'>
            <p><DecryptedText text="© 2025 Jan-Paul van den Berg. All rights reserved." {...DECRYPT_PROPS} /></p>
        </div>
      </footer>
    </>
  );
}

export default App;