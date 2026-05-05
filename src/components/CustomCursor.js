import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef      = useRef(null);
  const followerRef = useRef(null);
  const pos         = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafRef      = useRef(null);

  useEffect(() => {
    const dot      = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    const onMove = e => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    const animate = () => {
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.10;
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.10;
      follower.style.left = followerPos.current.x + 'px';
      follower.style.top  = followerPos.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };

    const addHover = () => { dot.classList.add('hover'); follower.classList.add('hover'); };
    const rmHover  = () => { dot.classList.remove('hover'); follower.classList.remove('hover'); };

    const attachHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .node').forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', rmHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', rmHover);
      });
    };

    document.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);
    attachHover();

    const obs = new MutationObserver(attachHover);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}      className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
