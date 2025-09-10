'use client';

import { useState, useEffect } from 'react';
import testsData from './datos/pruebas.json' assert { type: 'json' };
import './style.css'; 

function Countdown({ testDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(testDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const isUrgent = timeLeft.days < 7;
  const isFinished = Object.keys(timeLeft).length === 0;
  
  const urgencyClass = isUrgent && !isFinished ? 'text-urgent' : 'text-calm';

  return (
    <div className={`countdown-timer ${urgencyClass}`}>
      {isFinished ? (
        <span>0 días, 00:00:00</span>
      ) : (
        <span>
          {timeLeft.days} días, {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}


export default function TestTimerPage() {
  const [tests, setTests] = useState([]);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    const upcomingTests = testsData.tests.filter(test => new Date(test.testDate) > new Date());
    const sortedTests = upcomingTests.sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    
    setTests(sortedTests);
    setPageTitle(testsData.pageTitle);
  }, []);

  return (
    <main>
      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="all-tests-block">
            <div className="test-list">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <div key={test.subjectId} className="test-card">
                    <div className="test-card-content">
                      <div className="subject-info">
                        <p className="subject-id">{test.subjectId}</p>
                        <h2 className="subject-name">{test.subjectName}</h2>
                        <p className="test-date">{new Date(test.testDate).toLocaleString('es-CL')}</p>
                      </div>
                      <div className="countdown-container">
                        <Countdown testDate={test.testDate} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tests-message">
                  <p className="no-tests-text">Todo terminó...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}