import React from "react";

export default function AwardScene({ onOpen }) {
  return (
    <section className="award-frame" aria-labelledby="award-title">
      <div className="robot-floor" aria-hidden="true"></div>
      <div className="robot" aria-hidden="true">
        <div className="robot-shadow"></div>
        <div className="robot-body">
          <div className="robot-leg far"></div>
          <div className="robot-head"></div>
          <div className="robot-eye"></div>
          <div className="robot-torso"></div>
          <div className="robot-leg near"></div>
        </div>
      </div>
      <div className="award-copy">
        <p className="award-date">2026 年 · 机器人竞赛</p>
        <h2 id="award-title">三等奖</h2>
        <p>第十一届四川省大学生机器人大赛</p>
        <p className="award-event">Aelos 机器人挑战赛（树莓派版本）</p>
        <button className="certificate-open" type="button" onClick={onOpen}>查看获奖证书</button>
        <noscript dangerouslySetInnerHTML={{ __html: '<a href="showcase/robot-certificate.webp">查看获奖证书</a>' }} />
      </div>
    </section>
  );
}
