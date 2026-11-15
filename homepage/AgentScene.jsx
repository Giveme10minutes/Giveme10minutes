import React from "react";

export default function AgentScene({ onOpen }) {
  return (
    <section className="project-frame agent-frame" aria-labelledby="agent-title">
      <div className="project-visual agent-screen">
        <div className="screen-heading">职业探索 Agent · 操作画面</div>
        <img src="showcase/career-agent.jpg" width="1000" height="678" alt="职业探索 Agent 的对话与个人规划界面" />
      </div>
      <div className="project-copy">
        <p className="project-context">华为 ICT 大赛创新赛参赛项目</p>
        <h2 id="agent-title">职业探索与<br />学习行动 Agent</h2>
        <p>帮助计算机相关专业的学生比较职业方向，把学习计划拆成可以试做的任务。</p>
        <p>我主导需求与交互设计，排查知识库片段正文缺失，并用实际问题检查检索结果。</p>
        <div className="project-actions">
          <button className="demo-open" type="button" onClick={onOpen}>看 29 秒演示</button>
          <noscript dangerouslySetInnerHTML={{ __html: '<a href="showcase/career-agent.mp4">看 29 秒演示</a>' }} />
          <a href="https://github.com/Giveme10minutes/HUAWEI-Competition">查看源码</a>
          <a href="study/#agent-overview">学习笔记</a>
        </div>
      </div>
    </section>
  );
}
