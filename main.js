// 默认配置！！后台导出新json之后，替换这里，提交github更新网站
const defaultConfig = {
    name: "你的名字",
    subtitle: "热爱技术，热爱生活",
    social: [
        {name:"GitHub", url:"https://github.com/"},
        {name:"博客", url:"#"},
        {name:"邮箱", url:"mailto:xxx@xxx.com"}
    ],
    about: "<p>这里是关于我的介绍，你可以去后台修改这段文字。</p>",
    projects: [
        {title:"示例项目", desc:"一个很酷的个人项目", url:"#"}
    ]
};

// 读取本地存储
function getConfig(){
    const str = localStorage.getItem("siteConfig");
    if(str){
        try{return JSON.parse(str);}catch(e){return defaultConfig;}
    }
    return defaultConfig;
}

// 保存本地
function saveToLocal(cfg){
    localStorage.setItem("siteConfig", JSON.stringify(cfg));
}

// 渲染主页
function renderPage(){
    const cfg = getConfig();
    const nameEl = document.getElementById("site-name");
    const subEl = document.getElementById("site-subtitle");
    const socialEl = document.getElementById("social-links");
    const aboutEl = document.getElementById("about-content");
    const projectEl = document.getElementById("project-list");
    const yearEl = document.getElementById("footer-year");
    if(!nameEl) return; // 后台页面不渲染主页

    nameEl.innerText = cfg.name;
    subEl.innerText = cfg.subtitle;
    yearEl.innerText = new Date().getFullYear();
    aboutEl.innerHTML = cfg.about;

    socialEl.innerHTML = "";
    cfg.social.forEach(item=>{
        const a = document.createElement("a");
        a.href = item.url;
        a.target="_blank";
        a.innerText = item.name;
        socialEl.appendChild(a);
    })

    projectEl.innerHTML = "";
    cfg.projects.forEach(item=>{
        const card = document.createElement("div");
        card.className="project-card";
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <a href="${item.url}" target="_blank">查看详情 →</a>
        `;
        projectEl.appendChild(card);
    })
}

// ========== 后台页面功能 ==========
function loadConfig(){
    const cfg = getConfig();
    document.getElementById("inp-name").value = cfg.name;
    document.getElementById("inp-subtitle").value = cfg.subtitle;
    document.getElementById("inp-about").value = cfg.about;

    let socialText = "";
    cfg.social.forEach(i=> socialText += `${i.name}|${i.url}\n`);
    document.getElementById("inp-social").value = socialText.trim();

    let projText = "";
    cfg.projects.forEach(i=> projText += `${i.title}|${i.desc}|${i.url}\n`);
    document.getElementById("inp-projects").value = projText.trim();
}

function saveConfig(){
    const name = document.getElementById("inp-name").value;
    const subtitle = document.getElementById("inp-subtitle").value;
    const about = document.getElementById("inp-about").value;

    const socialLines = document.getElementById("inp-social").value.split("\n").filter(s=>s.trim());
    const social = socialLines.map(line=>{
        const arr = line.split("|");
        return {name:arr[0]||"", url:arr[1]||"#"};
    })

    const projLines = document.getElementById("inp-projects").value.split("\n").filter(s=>s.trim());
    const projects = projLines.map(line=>{
        const arr = line.split("|");
        return {title:arr[0]||"", desc:arr[1]||"", url:arr[2]||"#"};
    })

    const newCfg = {name,subtitle,social,about,projects};
    saveToLocal(newCfg);
    alert("✅ 已保存到浏览器本地！记得导出JSON更新代码");
}

function exportJson(){
    const cfg = getConfig();
    document.getElementById("out-json").value = JSON.stringify(cfg,null,2);
}

function clearConfig(){
    if(confirm("确定清空本地配置吗？不会影响github上的文件")){
        localStorage.removeItem("siteConfig");
        loadConfig();
        alert("已清空");
    }
}

// 页面加载执行
window.onload = function(){
    renderPage();
    // 如果是后台页，自动加载表单
    if(document.getElementById("inp-name")){
        loadConfig();
    }
}
