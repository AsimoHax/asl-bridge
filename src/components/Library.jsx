import { useState } from 'react';
import '../styles/Library.css';

// Import all 26 ASL sign images
import aSign from '../image/asign.jpg';
import bSign from '../image/bsign.jpg';
import cSign from '../image/csign.jpg';
import dSign from '../image/dsign.jpg';
import eSign from '../image/esign.jpg';
import fSign from '../image/fsign.jpg';
import gSign from '../image/gsign.jpg';
import hSign from '../image/hsign.jpg';
import iSign from '../image/isign.jpg';
import jSign from '../image/jsign.jpg';
import kSign from '../image/ksign.jpg';
import lSign from '../image/lsign.jpg';
import mSign from '../image/msign.jpg';
import nSign from '../image/nsign.jpg';
import oSign from '../image/osign.jpg';
import pSign from '../image/psign.jpg';
import qSign from '../image/qsign.jpg';
import rSign from '../image/rsign.jpg';
import sSign from '../image/ssign.jpg';
import tSign from '../image/tsign.jpg';
import uSign from '../image/usign.jpg';
import vSign from '../image/vsign.jpg';
import wSign from '../image/wsign.jpg';
import xSign from '../image/xsign.jpg';
import ySign from '../image/ysign.jpg';
import zSign from '../image/zsign.jpg';

const signs = [
  {
    letter: 'A',
    image: aSign,
    description: 'Make a fist with your thumb resting on the side of your index finger.',
    tip: 'Thumb touches the side of fingers',
  },
  {
    letter: 'B',
    image: bSign,
    description: 'Hold all four fingers straight up and close together, with your thumb tucked across your palm.',
    tip: 'Four fingers up, thumb tucked in',
  },
  {
    letter: 'C',
    image: cSign,
    description: 'Curve your hand into a "C" shape with all fingers and thumb forming a round opening.',
    tip: 'Shape like the letter C',
  },
  {
    letter: 'D',
    image: dSign,
    description: 'Point your index finger up while curling other fingers to touch your thumb, forming a circle.',
    tip: 'Index finger up, others form a circle',
  },
  {
    letter: 'E',
    image: eSign,
    description: 'Curl all four fingers down toward your palm while your thumb tucks under them.',
    tip: 'Fingers curled, thumb beneath',
  },
  {
    letter: 'F',
    image: fSign,
    description: 'Touch your index finger to your thumb forming a circle; other three fingers point up.',
    tip: 'Index-thumb circle, three fingers up',
  },
  {
    letter: 'G',
    image: gSign,
    description: 'Point your index finger sideways and extend your thumb horizontally.',
    tip: 'Index & thumb point sideways',
  },
  {
    letter: 'H',
    image: hSign,
    description: 'Point your index and middle fingers together sideways, with thumb extended.',
    tip: 'Two fingers pointing sideways',
  },
  {
    letter: 'I',
    image: iSign,
    description: 'Raise only your pinky finger with other fingers curled into a fist.',
    tip: 'Pinky finger raised, fist closed',
  },
  {
    letter: 'J',
    image: jSign,
    description: 'Raise your pinky and draw a "J" shape in the air by hooking it downward.',
    tip: 'Pinky traces a J in the air',
  },
  {
    letter: 'K',
    image: kSign,
    description: 'Point your index finger up, middle finger forward at an angle, with thumb between them.',
    tip: 'Index up, middle angled, thumb between',
  },
  {
    letter: 'L',
    image: lSign,
    description: 'Extend your index finger up and your thumb out to the side forming an "L" shape.',
    tip: 'Index up, thumb out — L shape',
  },
  {
    letter: 'M',
    image: mSign,
    description: 'Tuck your thumb under three fingers (index, middle, ring) folded over it.',
    tip: 'Three fingers over tucked thumb',
  },
  {
    letter: 'N',
    image: nSign,
    description: 'Tuck your thumb under two fingers (index, middle) folded over it.',
    tip: 'Two fingers over tucked thumb',
  },
  {
    letter: 'O',
    image: oSign,
    description: 'Curve all fingers and thumb together to form a round "O" shape.',
    tip: 'All fingers curved into a circle',
  },
  {
    letter: 'P',
    image: pSign,
    description: 'Like a "K" but rotated downward — index points down, middle finger forward.',
    tip: 'K shape rotated downward',
  },
  {
    letter: 'Q',
    image: qSign,
    description: 'Like a "G" but pointed downward — index and thumb point down.',
    tip: 'G shape rotated downward',
  },
  {
    letter: 'R',
    image: rSign,
    description: 'Cross your index and middle fingers while keeping other fingers curled.',
    tip: 'Index and middle fingers crossed',
  },
  {
    letter: 'S',
    image: sSign,
    description: 'Make a fist with your thumb resting across the front of all four fingers.',
    tip: 'Fist with thumb across fingers',
  },
  {
    letter: 'T',
    image: tSign,
    description: 'Tuck your thumb between your index and middle fingers inside your fist.',
    tip: 'Thumb between index and middle',
  },
  {
    letter: 'U',
    image: uSign,
    description: 'Hold your index and middle fingers straight up and together, with thumb extended.',
    tip: 'Two fingers straight up together',
  },
  {
    letter: 'V',
    image: vSign,
    description: 'Extend your index and middle fingers in a "V" (victory/peace) sign.',
    tip: 'Peace sign — two fingers spread',
  },
  {
    letter: 'W',
    image: wSign,
    description: 'Extend your index, middle, and ring fingers spread apart in a "W" shape.',
    tip: 'Three fingers spread open',
  },
  {
    letter: 'X',
    image: xSign,
    description: 'Bend your index finger into a hook shape while keeping other fingers in a fist.',
    tip: 'Index finger bent into a hook',
  },
  {
    letter: 'Y',
    image: ySign,
    description: 'Extend your pinky and thumb outward while curling your other three fingers.',
    tip: 'Pinky and thumb extended out',
  },
  {
    letter: 'Z',
    image: zSign,
    description: 'Use your index finger to trace a "Z" shape in the air.',
    tip: 'Index finger traces a Z in the air',
  },
];

function SignCard({ sign }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`sign-card ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      id={`sign-card-${sign.letter.toLowerCase()}`}
      role="button"
      tabIndex={0}
      aria-label={`ASL sign for letter ${sign.letter}`}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
    >
      <div className="sign-card-inner">
        {/* Front */}
        <div className="sign-card-front">
          <div className="sign-card-image-wrap">
            <img
              src={sign.image}
              alt={`ASL sign for letter ${sign.letter}`}
              className="sign-card-image"
              loading="lazy"
            />
            <div className="sign-card-badge">{sign.letter}</div>
          </div>
          <div className="sign-card-body">
            <h3 className="sign-card-letter">Letter {sign.letter}</h3>
            <p className="sign-card-desc">{sign.description}</p>
            <span className="sign-card-hint">Click to see tip →</span>
          </div>
        </div>

        {/* Back */}
        <div className="sign-card-back">
          <div className="sign-card-back-letter">{sign.letter}</div>
          <div className="sign-card-tip-label">💡 Hand Tip</div>
          <p className="sign-card-tip">{sign.tip}</p>
          <span className="sign-card-hint">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

export default function Library() {
  const [search, setSearch] = useState('');

  const filtered = signs.filter(
    (s) =>
      s.letter.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="library-page">
      {/* Header */}
      <div className="library-header">
        <div className="library-header-badge">ASL Alphabet</div>
        <h1 className="library-title">Sign Language Library</h1>
        <p className="library-subtitle">
          Explore all 26 letters of the American Sign Language alphabet.
          <br />
          Click any card to reveal hand positioning tips.
        </p>

        {/* Search */}
        <div className="library-search-wrap">
          <span className="library-search-icon">🔍</span>
          <input
            id="library-search"
            className="library-search"
            type="text"
            placeholder="Search a letter or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search signs"
          />
          {search && (
            <button
              className="library-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="library-count">
          Showing <strong>{filtered.length}</strong> of {signs.length} signs
        </div>
      </div>

      {/* Grid */}
      <div className="library-grid">
        {filtered.length > 0 ? (
          filtered.map((sign) => <SignCard key={sign.letter} sign={sign} />)
        ) : (
          <div className="library-empty">
            <p>No signs found for "<strong>{search}</strong>"</p>
            <button className="library-reset-btn" onClick={() => setSearch('')}>
              Show all signs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
