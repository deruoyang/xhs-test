# CLAUDE.md — xhs-test-project

## 自定义 Slash Commands

以下命令在用户输入时直接执行，不调用 Skill 工具，读取对应文件的完整逻辑来运行。

### /xhs-research
读取并执行 `/Users/sd/.claude/skills/xhs-research.md` 的完整逻辑。
小红书账号调研与定位，从用户提供的数据文件/截图/文案中提炼调研报告。

### /xhs-note
读取并执行 `/Users/sd/.claude/skills/xhs-note.md` 的完整逻辑。
基于调研报告，为指定选题产出完整笔记素材（标题3版本、封面文字、正文、评论区引导语、置顶评论）。
需要先有调研报告，没有则提示先运行 /xhs-research。

### /new-test
读取并执行 `/Users/sd/.claude/skills/new-test.md` 的完整逻辑。
为测试类笔记制作配套测试页面（HTML + config.json）并部署到 GitHub Pages。
需要选题名称和结果类型列表，通常由 /xhs-note 产出后触发。
