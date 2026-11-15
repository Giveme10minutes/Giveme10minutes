import React, { useEffect, useRef } from "react";
import PortraitScene from "./PortraitScene.jsx";
import AwardScene from "./AwardScene.jsx";
import AgentScene from "./AgentScene.jsx";
import ForumScene from "./ForumScene.jsx";
import Footer from "./Footer.jsx";
import { attachScrollScenes } from "./scrollScenes.js";

function MediaDialog({ dialogRef, className, titleId, title, onClose, children }) {
  return (
    <dialog ref={dialogRef} className={`media-dialog ${className}`} aria-labelledby={titleId} onClose={onClose}>
      <div className="media-dialog-header">
        <h2 id={titleId}>{title}</h2>
        <form method="dialog"><button type="submit" autoFocus>关闭</button></form>
      </div>
      {children}
    </dialog>
  );
}

export default function Homepage() {
  const scene = useRef(null);
  const certificate = useRef(null);
  const demo = useRef(null);
  const video = useRef(null);

  useEffect(() => attachScrollScenes(scene.current), []);

  function openDemo() {
    demo.current.showModal();
    // Keep the native play button available if autoplay is unavailable.
    video.current.play().catch(() => {});
  }

  return (
    <>
      <main ref={scene} className="scene" aria-label="陈煜的个人主页">
        <div className="stage">
          <PortraitScene />
          <AwardScene onOpen={() => certificate.current.showModal()} />
          <AgentScene onOpen={openDemo} />
          <ForumScene />
          <a className="scroll-cue" href="#portrait-revealed">
            <span>向下滚动</span>
            <span className="scroll-arrow" aria-hidden="true" />
          </a>
        </div>
        <div id="portrait-revealed" />
      </main>
      <Footer />
      <MediaDialog dialogRef={certificate} className="certificate" titleId="certificate-title" title="机器人竞赛获奖证书">
        <img src="showcase/robot-certificate.webp" loading="lazy" alt="陈煜在 2026 年第十一届四川省大学生机器人大赛 Aelos 机器人挑战赛获得三等奖的证书" />
      </MediaDialog>
      <MediaDialog dialogRef={demo} className="demo-dialog" titleId="demo-title" title="职业探索 Agent · 操作演示" onClose={() => video.current.pause()}>
        <video ref={video} controls playsInline preload="none" poster="showcase/career-agent.jpg" width="1000" height="678">
          <source src="showcase/career-agent.mp4" type="video/mp4" />
          <a href="showcase/career-agent.mp4">打开操作录屏</a>
        </video>
      </MediaDialog>
    </>
  );
}
