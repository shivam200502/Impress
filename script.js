let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  prevMouseTouchX = 0;
  prevMouseTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Apply initial random rotation transform immediately
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

    const handleMove = (e) => {
      if (!this.holdingPaper) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!this.rotating) {
        this.mouseTouchX = clientX;
        this.mouseTouchY = clientY;

        this.velX = this.mouseTouchX - this.prevMouseTouchX;
        this.velY = this.mouseTouchY - this.prevMouseTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevMouseTouchX = this.mouseTouchX;
        this.prevMouseTouchY = this.mouseTouchY;
      }

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const handleStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.prevMouseTouchX = clientX;
      this.prevMouseTouchY = clientY;

      // Handle right-click or two-finger gesture for rotation flag
      if (e.button === 2) {
        this.rotating = true;
      }
    };

    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    /* --- Touch Events --- */
    paper.addEventListener('touchstart', (e) => handleStart(e));
    
    // FIXED: Added { passive: false } to enable e.preventDefault() on mobile touch
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e);
    }, { passive: false });
    
    paper.addEventListener('touchend', handleEnd);

    /* --- Mouse Events (Added for Desktop Support) --- */
    paper.addEventListener('mousedown', (e) => handleStart(e));
    window.addEventListener('mousemove', (e) => handleMove(e));
    window.addEventListener('mouseup', handleEnd);

    // Disable right-click context menu on papers to allow right-click rotation
    paper.addEventListener('contextmenu', (e) => e.preventDefault());

    /* --- Gesture Events (iOS Safari) --- */
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Initialize all paper elements on load
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});