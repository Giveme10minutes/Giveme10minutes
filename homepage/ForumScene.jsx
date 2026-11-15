import React from "react";

export default function ForumScene() {
  return (
    <section className="project-frame forum-frame" aria-labelledby="forum-title">
      <div className="project-visual forum-visual">
        <h3>帖子浏览量如何记录</h3>
        <ol className="view-flow">
          <li><strong>浏览帖子</strong><span>打开帖子详情时记录一次浏览</span></li>
          <li><strong>Redis 累加</strong><span>按帖子累加浏览次数</span></li>
          <li><strong>定时写入 MySQL</strong><span>定时任务将累积的次数写入数据库</span></li>
        </ol>
      </div>
      <div className="project-copy">
        <p className="project-context">Java 后端练习项目</p>
        <h2 id="forum-title">Java 社区论坛</h2>
        <p>论坛支持登录、发帖、分类筛选和评论。浏览量先在 Redis 中累加，再由定时任务写入 MySQL。</p>
        <div className="project-actions">
          <a href="https://github.com/Giveme10minutes/community-forum">查看源码</a>
          <a href="study/#forum-overview">学习笔记</a>
        </div>
      </div>
    </section>
  );
}
